import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../docs/trade-route-engine.js',import.meta.url),'utf8');
const context={};vm.runInNewContext(source,context);
const {shortestGateRoute,scanArbitrage}=context.WarpTradeEngine;

const systems={
 alpha:{name:'Alpha',links:{north:'beta',east:'gamma'}},
 beta:{name:'Beta',links:{south:'alpha',east:'delta'}},
 gamma:{name:'Gamma',links:{west:'alpha',north:'delta'}},
 delta:{name:'Delta',links:{west:'beta',south:'gamma'}},
 homestead:{name:'Private home',links:{north:'alpha'}}
};
test('trade route engine loads without network or browser dependencies',()=>{
 assert.equal(typeof shortestGateRoute,'function');
 assert.equal(typeof scanArbitrage,'function');
});
test('finds a shortest eligible gate path and avoids locked destinations',()=>{
 let path=shortestGateRoute(systems,'alpha','beta');
 assert.equal(path.length,1);
 assert.equal(path[0].gate,'north');
 path=shortestGateRoute(systems,'alpha','delta',id=>id!=='beta');
 assert.equal(path.length,2);
 assert.equal(path[0].gate,'east');
 assert.equal(path[1].to,'delta');
 assert.equal(shortestGateRoute(systems,'alpha','delta',id=>id!=='beta'&&id!=='gamma').length,0);
});
test('missing systems and same-system routes are rejected',()=>{
 assert.equal(shortestGateRoute(systems,'alpha','alpha').length,0);
 assert.equal(shortestGateRoute(systems,'bad','beta').length,0);
});
test('scanner uses real positive spreads and caps by credits, stock and cargo',()=>{
 const quotes={
  alpha:{moon:{ask:10,bid:5,stock:4},neon:{ask:14,bid:7,stock:2}},
  beta:{moon:{ask:25,bid:15,stock:10},neon:{ask:20,bid:13,stock:10}},
  gamma:{moon:{ask:17,bid:8,stock:10},neon:{ask:22,bid:10,stock:10}},
  delta:{moon:{ask:17,bid:9,stock:10},neon:{ask:22,bid:11,stock:10}}
 };
 const rows=scanArbitrage({systems,origin:'alpha',commodities:['moon','neon'],
  priceFor:(s,k)=>quotes[s]?.[k],freeCargo:8,credits:31});
 assert.equal(rows.length,1);
 assert.equal(rows[0].destination,'beta');
 assert.equal(rows[0].kind,'moon');
 assert.equal(rows[0].margin,5);
 assert.equal(rows[0].units,3);
 assert.equal(rows[0].grossProfit,15);
 assert.equal(rows[0].firstGate,'north');
});
test('scanner reports zero affordable units instead of producing fictional credits',()=>{
 const rows=scanArbitrage({systems,origin:'alpha',commodities:['moon'],
  priceFor:(s)=>s==='alpha'?{ask:10,bid:7,stock:8}:{ask:40,bid:16,stock:10},
  freeCargo:0,credits:0});
 assert.ok(rows.length>=1);
 assert.equal(rows[0].units,0);
 assert.equal(rows[0].grossProfit,0);
});
test('scanner excludes private homestead, rejects negative spreads and locked routes',()=>{
 const rows=scanArbitrage({systems,origin:'alpha',commodities:['moon'],
  priceFor:(s)=>s==='alpha'?{ask:40,bid:10,stock:10}:{ask:40,bid:20,stock:10},
  freeCargo:20,credits:500});
 assert.equal(rows.length,0);
 const locked=scanArbitrage({systems,origin:'alpha',commodities:['moon'],
  priceFor:(s)=>s==='alpha'?{ask:5,bid:3,stock:10}:{ask:20,bid:25,stock:10},
  freeCargo:20,credits:500,canEnter:()=>false});
 assert.equal(locked.length,0);
});
test('browser game inline script remains valid JavaScript',()=>{
 const html=fs.readFileSync(new URL('../docs/index.html',import.meta.url),'utf8');
 assert.match(html,/<script src="\.\/trade-route-engine\.js"><\/script>/);
 const match=html.match(/<script>\s*([\s\S]*?)<\/script>/);
 assert.ok(match,'main inline game script must exist');
 assert.doesNotThrow(()=>new vm.Script(match[1]));
 assert.match(html,/function warp17Init\(\)/);
 assert.match(html,/S\.saveVersion=17/);
});
