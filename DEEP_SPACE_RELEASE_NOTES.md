# Tokenverse v0.10 — Deep Space expansion

**Website:** https://i-am-christian.github.io/tokenverse/

## What changed

- **Manual flight overrides auto-navigation:** any WASD, arrow, Space/brake, or Shift/boost movement key immediately cancels the active mouse waypoint and automatic mining target. Clicking a new destination still creates a waypoint beacon.
- **Exactly 10× the previous map area:** 24,000 × 14,400 game units (previously 7,200 × 4,800). World edges seamlessly wrap, rather than behaving like invisible walls. Coordinates, zone chart, and minimap use the new dimensions.
- **All regions open from the start:** removed invisible upgrade-dependent region barriers and bounce-back. No minimum mining rig/engine level is required to enter high-tier regions. Only enemies and the existing protected starter port affect safety.
- **More PvE, denser advanced materials:** Frontier (T1–2), Ember Expanse (T2–4), Abyssal Rift (T4–6), Diamond Exclusion (T6–8), and Outer Reaches (T3–6). High-risk zones include many more stardust, void and diamond asteroids than basic space.
- **Weapon enhancement:** current weapon can be upgraded from Mk-1 to Mk-8. Each upgrade adds 20% of its base damage. The HUD and workshop show base damage, weapon bonus %, ship bonus %, combined bonus %, actual damage per hit, and estimated DPS. Shots show floating damage numbers.
- **New weapons:** Arc Emitter and Nova Cannon, alongside the existing Pulse Blaster, Scatter Cannon, Railgun, Plasma Lance and Diamond Repeater. Craft in Fabricator; equip from Customize.
- **Buy new ships:** Kestrel Interceptor, Atlas Prospector, Marauder Gunship, Phantom Strikecraft and Leviathan Dreadnought. Ships change speed, acceleration, hull durability, cargo space, mining bonus and weapon damage. Buy and deploy at a docked station.
- **Test-account resources:** the local browser pilot gets a **one-time** grant of at least 50,000 simulated $JUNK, 50 of each of the five raw ores, and 50 of each of the five material tokens. The test pilot also gets +300 temporary cargo space to accommodate 250 starting ore units without blocking mining. The grant is recorded in the versioned browser save and does not reapply on every reload. All values are simulated; no real crypto assets are involved.
- **Recycling:** material tokens spent on ships, upgrades and crafting return to a local reward vault for future refining instead of disappearing. This is a prototype accounting mechanism, not a blockchain.

## Gameplay and implementation limitations

GitHub Pages hosts the static single-player test sector. Real player-vs-player multiplayer, shared station inventories, authenticated wallets, and cryptocurrency settlement **are not** live on GitHub Pages. The old Node/WebSocket multiplayer source is still present in the repository for a subsequent backend integration. Balancing, economic limits and anti-bot measures need production implementation before any real tokens are introduced.

## Tested

Syntax checked under Node.js 22. Chromium browser smoke tests at 1920×1080, 1366×768, and 390×844; checked loading, no console errors, one-time test grant, destination cancellation on manual input, zone chart, ship purchases and deployment, weapon upgrades, crafting and equipping.