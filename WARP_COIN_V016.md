# Warp Coin v0.16 — The Outer Meridian

**Play:** https://i-am-christian.github.io/tokenverse/

This update expands the existing five public star-system maps from **96,000 × 57,600** to **192,000 × 115,200** world units — a further **4× map area**. The game remains a GitHub Pages **single-player browser simulation**, with no real-money token exchange or shared account backend.

## More useful space, not just a larger boundary

- The original Solar Union, Crimson Marauder, Verdant Accord and Void Scholar territories expand proportionally, with the central Disputed Rift and Concord Exchange retained in their corresponding relative positions.
- Four new neutral safe trade stations: **North Meridian Exchange**, **South Meridian Exchange**, **West Frontier Port** and **East Frontier Port**.
- Every outer station has a surrounding belt of mineable minerals and additional hostile drones; rich diamond pockets are rare rather than an unlimited near-safe-zone source.
- Public mineral distribution and scanner discoveries now cover the larger world, without changing inventory balances or material-token refinement limits.
- The **Navigation** drawer has a larger tactical chart, with **Route** buttons for distant destinations.
- When docked at a station, pilots may use a **Meridian transit jump for 85 Scrap Credits**, subject to a 20-second cooldown. The network is only available in public space. It does not carry players in or out of the Heart Chamber or private solar system.

## Save integrity

The original browser save key remains `tokenverse-deep-space-v10` to retain existing pilots. A one-time migration moves public player positions, built outposts and pending return coordinates into the doubled coordinate space. A saved private solar system is translated with its star, rather than stretching its local planet orbits. World-scale marker **4** prevents double-migration on reload; `saveVersion` is **16**.

The neutral starter port remains at **X 900, Y 900**. Pilots already near it retain their local neighborhood. Their original 36 hulls, weapons, research, currencies, customized colonies, mine production, faction standings, contract histories and Twelve Bells outcomes remain in the same save.

Pathfinding uses a coarser bounded navigation grid to keep long routes practical despite the larger map.

## Automated checks

The v0.12–v0.15 regression tests have been updated to the new world coordinates without dropping their previous game-behavior checks. New v0.16 tests verify map extent, station safety, one-time migration, private colony geometry, deterministic credit cost/cooldown of transit, and mining fields near the new frontier outposts.

## Supabase is the next separate milestone

The Supabase connector presently exposes a project named **Hello Earth DB**, which is unrelated to Warp Coin and was **not modified**. Warp Coin needs a dedicated Supabase project before real email login, account-synchronized saves, global/faction/private chat, friends and shared multiplayer data can be launched. See [Supabase onboarding](WARP_COIN_SUPABASE_SETUP.md).

This release does **not** represent real NFTs, real cryptocurrency investment, cash withdrawals, live global stock exchange or online cross-player trading. Any SC, prices, resources, or edition counts shown in the browser are simulated and can be altered locally.
