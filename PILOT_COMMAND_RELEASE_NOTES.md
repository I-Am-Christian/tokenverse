# Tokenverse — Pilot Command UI (v0.9)

A cockpit-style interface for the GitHub Pages browser game.

- Fullscreen galaxy with compact cockpit telemetry; no always-visible combat controls.
- Holographic right-hand instrument rail: asset ledger, cargo manifest, navigation database, comms, audio.
- Animated holographic button states, angular surfaces, console status lights, radar-inspired icons, neon cyan accents, responsive scaling.
- Destination click beacon from the previous v0.8 build retained.
- Dock-only command console with Trade Hub, Ship Systems, Fabricator, and Customise panels, including craftable weapons and equipment.
- Improved station menu stability: telemetry refreshes separately so interactive panel contents are not recreated every quarter-second.
- Browser-save migration from the earlier GitHub Pages version (`tokenverse-pages-v1`) and 0.6/0.7/0.8 local demo saves. Updated v0.8 save key is retained for ongoing progress.
- Mobile displays a compact telemetry strip, right instrument buttons and icon-only bottom toolbar so more space remains for gameplay.

**Scope:** This build is a single-player/static GitHub Pages sandbox, using localStorage and simulated currencies. The existing Node.js multiplayer game server remains in the repository but is not connected to this UI or deployed. No live PvP, synced station economy, blockchain token, or withdrawals are active.

## Test results

- JavaScript syntax checked with Node 22.
- Chromium smoke tests at 1920×1080, 1366×768, and 390×844 completed with no uncaught page errors.
- Verified ledger/cargo drawer switching, dock console tabs, crafting the Scatter Cannon, equipping it, upgrading thrusters, and refining Moonstone.
- Verified prior browser save migration kept the original example's credits and resources.