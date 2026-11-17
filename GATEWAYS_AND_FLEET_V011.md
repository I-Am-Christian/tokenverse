# Tokenverse v0.11 — Safe Navigation, Star Gates and 30 New Ships

## Play
https://i-am-christian.github.io/tokenverse/

**Deployment:** GitHub Pages browser prototype, no install needed. This release preserves the large 24,000 × 14,400 galaxy, upgraded weapon system, open hub regions, and existing premium ships from v0.10.

### Flight/autopilot fixes
- Return to Port, Scan Ore, and mouse-selected destinations now use a collision-aware A* waypoint route with obstacle clearance and active braking rather than flying in a direct line through asteroids.
- The autopilot replans around obstacles and performs emergency braking if a collision becomes unavoidable. The station-docking route ends at low speed.
- Orion Port's safe radius increased from 250 to **700** world units. Ore spawns outside a wider buffer; hostile drones are kept outside the protected perimeter. Enemy shots cannot damage ships inside the safe zone.
- Tested a long return route with zero asteroid bumps and no hull damage.

### Four interstellar jump gates
The **North, East, South and West** portals are near the edges of each galaxy map and visible as glowing gates. Open the **Gates** drawer for navigation. Approach slowly and the portal transfers you to another system, preserving ship, equipment, cargo and token balances.

- **North:** Borealis Drift — Neonite-heavy, Mining Mk-2
- **East:** Helios Reach — Stardust-heavy, Thrusters Mk-2
- **South:** Titan Foundry — Void-rich, Mining Mk-3
- **West:** Umbra Exclusion — Diamond-rich, Mining Mk-3 and Thrusters Mk-2

The four gates connect all five systems. Each destination regenerates a distinct asteroid field and encounters. Gate travel is not a blockchain bridge.

### 30 additional ships
The ship dealer now contains **36 ships**: the existing six premium designs plus 30 new hulls, organized as five roles × six tiers. New roles: Scout, Miner, Fighter, Hauler, Explorer. Every new ship can be purchased using **Scrap Credits (SC)** alone. Each hull has individual speed, thrust, hull, cargo, mining and damage values. Previous purchased ships, weapons, upgrades and local saves remain supported.

### Scrap Credits and sustainable mining
- Non-crypto **Scrap Credits (SC)** replace the previous $JUNK label. These are ordinary in-game points, not tradeable tokens.
- Docked hull repairs cost **24 SC**, without requiring a crypto token or any ore.
- Base mining now takes roughly **3–4 seconds per ore**, before mining ship/rig bonuses.
- Individual asteroids yield **1–4 units**, and rare deposits often contain less; dangerous sectors retain higher ore density.
- Refinement uses recycled material-token payments first; new issuance is rate-limited per player/day ($MOON 50, $NEON 24, $DUST 8, $VOID 3, $DIAM 3). Rare reserves are finite, while common token issuance remains subject to the daily limit.
- New test pilots start with ordinary resources instead of v0.10's large test grant. Previously saved test balances are not confiscated.

### Gameplay limitations
GitHub Pages runs a **single-player local browser simulation**. Multiplayer, authoritative PvP, secure accounts, real cryptocurrency and withdrawals are not implemented on Pages. The repository still contains the separate prototype Node.js multiplayer server for future deployment. Browser saves are local and not financially secure.

