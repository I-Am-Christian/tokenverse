import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const from = html.indexOf('/* Radar layout avoids');
const to = html.indexOf('function draw(){', from);
assert.ok(from >= 0 && to > from, 'radar layout functions are present');
const implementation = html.slice(from, to);
const state = {rail: 1740, hud: 226, open: false, painted: 0, factionOverlayPainted: false};
const ctx = {
  save(){}, restore(){}, fillRect(){}, strokeRect(){}, beginPath(){},
  moveTo(){}, lineTo(){}, stroke(){}, arc(){}, fill(){},
  clearRect(){state.painted++;}
};
const $ = id => {
  if (id === 'drawerArea') return {getBoundingClientRect: () => ({left: state.rail})};
  if (id === 'leftMini') return {getBoundingClientRect: () => ({right: state.hud})};
  if (id === 'mapDrawer') return {classList: {contains: () => state.open}};
  if (id === 'navigationChart') return {width: 320, height: 192, getContext: () => ctx};
  throw new Error('Unknown element ' + id);
};
const drawFactionRadar = () => { state.factionOverlayPainted = true; };
const helpers = new Function('$','S','STATIONS','ZONES','GATES','WORLD','performance','drawFactionRadar',
  implementation + '\nreturn {hudRadarBounds, drawNavigationChart};'
)(
  $, {x:900,y:900,system:'orion',outposts:[]},
  [{x:900,y:900,kind:'port'}],
  [{x1:0,y1:0,x2:48000,y2:28800,color:'#6fe8ff'}],
  [{x:24000,y:180,color:'#9fdfff'}],
  {w:48000,h:28800}, {now: () => 2000}, drawFactionRadar
);

test('HUD minimap stays entirely left of the right control rail', () => {
  for (const [width, rail] of [[1920,1740],[1920,1555],[1366,1198],[1366,1000],[1024,660],[940,590]]) {
    state.rail=rail;
    const bounds=helpers.hudRadarBounds(width,1080);
    assert.ok(bounds, 'radar should be present at desktop width '+width);
    assert.ok(bounds.x+bounds.w<=rail-16, 'radar overlaps the right controls at '+width);
    assert.ok(bounds.x>state.hud+16, 'radar overlaps left pilot panel at '+width);
  }
});

test('narrow screens get a full chart in the Navigation drawer instead', () => {
  assert.equal(helpers.hudRadarBounds(768,900), null);
  assert.equal(helpers.hudRadarBounds(390,844), null);
  assert.match(html, /id="navigationChart"/);
  state.open = true;
  helpers.drawNavigationChart();
  assert.ok(state.painted>0, 'navigation drawer chart is drawn');
  assert.ok(state.factionOverlayPainted, 'faction territory layer was requested');
});
