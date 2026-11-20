/* Warp Coin v0.17 — pure local trade intelligence. No accounts or network access. */
(function attachWarpTradeEngine(root) {
  'use strict';

  function shortestGateRoute(systems, from, to, canEnter) {
    if (!systems || !systems[from] || !systems[to] || from === to) return [];
    const visited = new Set([from]);
    const queue = [{ id: from, path: [] }];
    for (let index = 0; index < queue.length; index++) {
      const current = queue[index];
      for (const [gate, next] of Object.entries(systems[current.id].links || {})) {
        if (!systems[next] || visited.has(next) || (canEnter && !canEnter(next))) continue;
        const path = [...current.path, { from: current.id, gate, to: next }];
        if (next === to) return path;
        visited.add(next);
        queue.push({ id: next, path });
      }
    }
    return [];
  }

  function scanArbitrage(options) {
    const { systems, origin, commodities, priceFor, canEnter, freeCargo = 0, credits = 0, limit = 8 } = options || {};
    if (!systems || !systems[origin] || !Array.isArray(commodities) || typeof priceFor !== 'function') return [];
    const offers = [];
    const cargoUnits = Math.max(0, Math.floor(Number(freeCargo) || 0));
    const availableCredits = Math.max(0, Math.floor(Number(credits) || 0));

    for (const destination of Object.keys(systems)) {
      if (destination === origin || destination === 'homestead') continue;
      const path = shortestGateRoute(systems, origin, destination, canEnter);
      if (!path.length) continue;
      for (const kind of commodities) {
        const source = priceFor(origin, kind), target = priceFor(destination, kind);
        if (!source || !target) continue;
        const ask = Number(source.ask), bid = Number(target.bid);
        const stock = Math.max(0, Math.floor(Number(source.stock) || 0));
        if (!Number.isFinite(ask) || !Number.isFinite(bid) || ask <= 0 || bid <= ask) continue;
        const units = Math.max(0, Math.min(5, cargoUnits, stock, Math.floor(availableCredits / ask)));
        offers.push({
          origin, destination, kind, ask, bid, stock,
          margin: bid - ask, units, grossProfit: units * (bid - ask),
          hops: path.length, firstGate: path[0].gate, path
        });
      }
    }
    return offers.sort((a, b) =>
      b.grossProfit - a.grossProfit || b.margin - a.margin || a.hops - b.hops ||
      a.destination.localeCompare(b.destination) || a.kind.localeCompare(b.kind)
    ).slice(0, Math.max(0, Math.floor(limit)));
  }

  root.WarpTradeEngine = Object.freeze({ shortestGateRoute, scanArbitrage });
})(typeof globalThis !== 'undefined' ? globalThis : this);
