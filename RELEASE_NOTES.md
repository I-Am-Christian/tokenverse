# Tokenverse v0.5 — Galactic Expansion

Play the browser game at https://i-am-christian.github.io/tokenverse/ . This is a static solo test sector; a real multiplayer backend has not been deployed.

## Changes

- New synthesized sound effects for thrusters, blasters, mining, repairs/upgrades, warnings and destruction. Audio defaults to OFF and requires pressing the sound button; no external audio files or autoplay.
- Fixed a significant ore trading/refining bug in the previous version (`action` referenced an undefined `k`). Also fixed frequent DOM replacement that made upgrades and other buttons difficult to click at high refresh rates.
- Improved docking instructions: when within port or outpost range, brake below 52 units/second to use upgrades and trade. Displays specific token and credit requirements; outposts can now be fortified to tier 3 with resources/tokens flowing back into reward vaults.
- Expanded map from 2,600×1,800 to **7,200×4,800** (roughly 7.4 times the original area). Prior browser saves migrate player and station positions once, keeping the existing localStorage save key.
- **Starter frontier:** normal ore and introductory PvE.
- **Ember Expanse:** dense Neonite and Stardust, tier-2 drones, requires Laser Mk-2.
- **Abyssal Rift:** rich Void and Stardust, tier-3 drones, requires Laser Mk-3.
- **Diamond Exclusion:** dense diamonds with tier-4 drones, requires Laser Mk-3 and Engine Mk-3. Marked *contested/future PvP*; this static browser build **does not have real player-versus-player multiplayer**.
- Introduced simulated limited-supply **$DIAM** for diamond ore; laser Mk-5 uses $DIAM. The token is fictional, not blockchain-connected or cash-redeemable.
- New map region outlines, minimap sector boundaries, nearby hostile counter, zone navigation controls, and automated gate warnings.
- On Full HD desktop screens (e.g. 1920×1080), the main mission-control UI fills the viewport while the left, center and right columns scroll internally. Smaller desktops/tablets and phones reflow responsively.

## Browser controls

Mouse aims; click background to autopilot to a point, click asteroids to fly and mine, WASD/arrow keys maneuver, Space brakes, Shift boosts, F or right-click fires. Use zone navigation buttons to target other sectors. Sound is optional and muted until enabled by a user click.

## Live multiplayer and token caveats

GitHub Pages cannot host the authoritative WebSocket game server, synchronize other players, or securely hold crypto balances. The Node.js multiplayer prototype remains in `server.js` / `public/`, but the new map and physics are currently in the browser solo sandbox only. Connect and reconcile these code paths on a real backend before advertising live PvP or shared trading. Game tokens are simulated with local browser saves and must not be mistaken for real cryptocurrencies.