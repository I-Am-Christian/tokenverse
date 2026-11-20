# Warp Coin v0.20 — Hyperdrive & Living Galaxy

## Root deployment fix

The prior repository root \`index.html\` remained v0.16 even after v0.19 gameplay shipped to \`docs/index.html\`. The root now mirrors the current full game and includes proper \`./docs/*.js\` references; \`docs/index.html\` continues to use \`./*.js\`. Tests assert that both pages run the exact same inline gameplay script and every module path exists.

## Reliable travel and controls

- **Warp Drive (primary button):** no need to locate a distant object first. Click Warp Drive to plot a safe autopilot course to the nearest non-faction public station beyond 2,500 units. If a route is already active, clicking Warp Drive attempts a safe warp hop.
- **Navigation chart:** click/tap any destination on the chart to plot an obstacle-aware autopilot course. The Warp Drive button is positioned first on the mobile toolbar.
- **H:** Warp Drive control. **J:** Pulse Jump; same safe hop implementation.
- **Continuous cruise:** threshold for safe long-route segments reduced from 2,600 to 950 units; forward checks use a smaller, collision-tested corridor. Cruise still downshifts near stations, NPCs, mining targets, hazards and docking.
- **Pulse jumps:** traverse successive safe autopilot waypoints up to 8,500 units rather than requiring one straight, very long path segment. Every subsegment is checked for asteroid obstructions, drone threats and station safety areas. Existing 28-energy cost and nine-second cooldown remain, and a blocked jump does not consume energy.
- World dimensions are unchanged at **192,000 × 115,200** units per system.

## Visual overhaul

The optional new \`space-visuals.js\` renderer adds different nebula palettes per star system, layered parallax stars, distant ringed planets, atmospheric glows, sparkling rare minerals, faceted asteroid shading and luminous engine/warp exhaust. Procedural generation does not download external images. The existing low/medium/high quality and reduced-motion controls remain available; the base canvas renderer is used when the optional visual module is unavailable.

## Sound

\`space-audio.js\` synthesizes an original ambient soundtrack and short audio cues for warp, pulse jumps, scanners, battle, distress signals and rewards using the browser's Web Audio API, without licensing external tracks or adding downloads. Sound **starts muted** and must be enabled with a user gesture via **Sound OFF**. Its volume is adjustable under The Twelve Bells > Graphics & access. Browser restrictions may require a second tap to resume audio.

## Compatibility and deployment

- No reset of local game saves, inventories, factions, ship builds, private systems or trading data. The game uses the existing local save key \`tokenverse-deep-space-v10\` and marks \`saveVersion=20\`.
- Test with Node.js 22+: \`npm test\`. The suite checks both entry files, old saves, multi-waypoint hop geometry, blocked hops, cruise engagement and audio/visual module initialization, plus all existing game tests.
- Verify GitHub Pages actually deploys main after merge and test with a hard refresh if an old cached build persists.

**No Supabase project connected or changed.** No real-money assets, wallets, NFTs, shared multiplayer market or third-party sounds have been added.
