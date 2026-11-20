# Warp Coin v0.17 — Trade Route Intelligence

**Development branch:** feature/warp-coin-v017-trade-intelligence  
**Existing playable release:** https://i-am-christian.github.io/tokenverse/

## What changed

- **Trade Route Scanner** added to the Economy drawer. It reads the game's existing simulated regional warehouse stocks, asks and bids across all five public star systems to find positive-margin ore transport opportunities.
- **Capacity-limited estimates:** the suggested quantity is limited by cargo room, available Scrap Credits, source warehouse stock, and a five-unit planning cap. Gross opportunity is not guaranteed profit: quotes may move during transit.
- **Practical navigation:** use **Plot** to save a cargo destination and aim autopilot toward the first *unlocked* gate. After a jump, open Economy and use **Next gate**. On arrival, **Find dock** routes toward the closest non-faction public station.
- **Persistent local freight plan:** saved in the existing browser save object under \`tradePlan\`. A validated v0.17 save-version marker preserves all previous v0.16 saves without resetting ships, factions, minerals, stations, or custom solar systems.
- The old 96k map caption and v0.15 startup log were updated to match the existing 192,000 × 115,200 universe.
- Added pure, offline trade-path engine and Node regression checks for gate locks, capacity, costs, stock limits, and inline browser-script parsing.

## How to try it

1. Run the branch locally (or open its GitHub Pages preview once published).
2. Dock at a station in a public system and open **Economy**.
3. Scroll to **Trade Route Scanner**. Compare the spreads, buy some ore, then choose **Plot**.
4. Travel through the gateway, open **Economy** again, and use **Next gate** until the destination.
5. Dock and sell ore using the existing regional exchange.

## Online infrastructure policy

**No Supabase project has been connected, queried or modified for this feature.** Tokenverse / Warp Coin will use a *new, independent Supabase project*, not the existing Hello Earth / Atlas AI database. All current trade data, freight plans and balances remain single-player, locally saved simulations. No real token prices, shared exchanges, crypto funds, NFT minting or online multiplayer were enabled.

## Review / verification

- \`node --test tests/*.test.js\` (Node.js 22+)
- Verify the old save retains all contents and the new freight plan survives reload.
- Verify mobile trade cards, gateway autopilot, and destination docking in all five public systems.
- The new script is served as a local static file, with no CDN or backend connection.
