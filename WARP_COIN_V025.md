# Warp Coin v0.25 — Galactic Armada

## 2D camera zoom
The original Canvas 2D renderer now offers a proper camera transform rather than shrinking the rendered UI. Press − / + / 0, click − / + / 1:1 inside ship telemetry, or scroll over the space canvas to zoom between 36% and 240%. World sprites, station markers, asteroid rocks, weapon trajectories and all ship hulls scale together; the fixed toolbar and the navigation chart stay readable.

Click-to-fly targeting divides by the active camera zoom so stations, ore, salvage and friendly bot targets still use their true X/Y world positions. Object visibility checks account for the zoomed camera size. The zoom value is stored in the existing settings object; all world physics remains unchanged.

## Four larger ships
- Orion Starcarrier: 365 hull, 180 extra cargo, 2.05× visual size
- Aegis Battlecruiser: 480 hull, 95 extra cargo, 2.4× visual size
- Exodus Star Ark: 510 hull, 310 extra cargo, 2.8× visual size
- Titan Fleet Fortress: 720 hull, 260 extra cargo, 3.35× visual size

All are available in the existing Hangar under Capital ships for in-game Scrap Credits and resource tokens. Their lower acceleration/speed trades off against size, durability, storage and damage. Capital hulls feature visible side-hangars, segmented armor and broadside mounts. Existing Leviathan, Titan Freighter and Colossus Drill visuals are also enlarged, and ship collision radius and muzzle origins respect ship size.

## Five weapon variants
- Vulcan Autocannon — rapid kinetic shots
- Flak Barrage — wide six-shot blast
- Prism Twin-Laser — paired high-velocity beamlike projectiles
- Ion Storm Projector — three electrical arcs
- Stellar Seeker Torpedo — guided heavy projectile with bounded splash

The existing weapon fabricator lets pilots craft and upgrade these weapons using the same local material economy. Each gun has distinct visual effects, fire rates, projectile velocities and damage; friendly ships cannot be harmed by guided-torpedo splash.

## Living AI fleets
Locally simulated NPC merchants, miners, freighters, security escorts and outlaw raiders move around the nearby galaxy. Outlaws may fire at players outside faction-protected areas; escorts fire at nearby outlaws using separate friendly projectiles. Hail NPCs directly by clicking their ships or visit the new Fleets drawer to plot approach routes or purchase services:
- Merchant hull repair: 75 SC
- Prospector Neonite delivery: 28 SC, limited by cargo space
- Freighter energy refuel: 50 SC
- Security escort for 90 seconds: 230 SC

World embellishments include drifting dust, decorative probes, crystalline fragments and broken wrecks. All new NPCs and ambient props are bounded and local to the player's position, not global multiplayer or saved full-world actors.

## Compatibility
The same enormous 192,000 × 115,200 public galaxy, factions, economy, missions, craftables, Warp Drive, home system, Rift events and old browser saves remain. The same existing local save key and saveVersion 20 are retained. This stays a **2D game** with no WebGL3D. No Supabase, payment integration or real cryptocurrency is connected.

## Tests
Use npm test (Node.js 22+) to exercise rendering transforms, zoom picking, new ship and gun catalog, live NPC roles, combat and merchant/escort behavior, root/docs entrypoint parity and historic regressions.
