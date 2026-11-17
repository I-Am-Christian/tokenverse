# Tokenverse v0.13 — Faction Frontiers

## Play in your browser
https://i-am-christian.github.io/tokenverse/

This release preserves the v0.12 fullscreen browser experience, 36-ship dealership, nine weapons, blueprint crafting, drone support, modular outposts, simulated resource-token market and four directional interstellar gates.

### Four new factions

Pick a faction on first launch after the update; the choice is **free** and keeps your existing ship, credits, resources and equipment. Factions can be changed only while docked at the neutral Orion Port or Concord Exchange; transferring costs **500 Scrap Credits** and resets standing with your former faction.

| Faction | Territory | Specialty | Perk | Home |
|---|---|---|---|---|
| Solar Union | Northwest | Protection and industry | 10% less incoming damage | Solar Citadel |
| Crimson Marauders | Northeast | Combat and raiding | 8% more weapon damage | Redline Bastion |
| Verdant Accord | Southwest | Mining and trade | 10% faster mining | Verdant Anchorage |
| Void Scholars | Southeast | Research and exploration | 15% more scanner range | Void Archive |

All four factions have color-coded territories, protected home stations, and friendly NPC patrols. Rival NPC patrols become hostile when you approach inside their territory beyond safe zones. Enemy faction stations deny docking. Friendly patrols assist against rogue drones near their base.

### Bigger world and contested zones

The per-system world increased from **24,000 × 14,400 to 48,000 × 28,800** units, exactly **4× the map area**. The four faction territories are physically separated by neutral corridors. **The Disputed Rift** occupies the central contested region and offers dense, high-risk diamond/void mining. Neutral **Concord Exchange** provides a protected central docking point.

These territories repeat across all five connected star systems: Orion Belt, Borealis Drift, Helios Reach, Titan Foundry and Umbra Exclusion. Scan signals and the mothership boss of each system have been distributed across the expanded universe. The original four gates still work at the edges of each map.

### Reputation, faction contracts and territory incentives

- Solar Union: Mine 12 units of ore → **180 SC**, +14 reputation
- Crimson Marauders: Destroy 3 rogue drones → **225 SC**, +15 reputation
- Verdant Accord: Refine 3 ore batches → **190 SC**, +13 reputation
- Void Scholars: Complete 3 scanner pulses → **210 SC**, +14 reputation

Contracts are repeatable after claiming; progress restarts on claim. Faction home-base maintenance costs half the usual SC repair price. No material tokens are minted by faction contracts.

### UI and performance

- **Factions** is a compact button in the right console. Open it to view territory choices, reputation, contract progress and a route-to-home control.
- The initial four-way faction selection is a one-time, responsive overlay. After joining, it disappears.
- The full-screen game canvas stays dominant; no new permanent sidebars were added.
- The navigation chart and radar display distinct faction territories/home bases. Enemy and ally patrols use distinct faction colors.
- Asteroids remain clear of protected homes. Obstacle-aware A* navigation continues to avoid asteroid collisions; a long-distance cross-faction route was verified in smoke tests.
- Existing browser saves, hulls, weapons, market orders, explored discoveries and user outposts remain supported.

### Current limitations

**GitHub Pages is static.** These are **solo NPC factions, not genuine player alliances**. Rival patrols are NPCs and the central region is PvE for now; real player-versus-player territorial control, shared stations, accounts, land ownership, war rewards and real cryptocurrency require an authenticated multiplayer backend and server-authoritative economy. All material tokens remain simulated with no cash value, wallet integration or withdrawals.

### Ideas for a future multiplayer milestone

Shared faction headquarters, joinable player corporations, territory-capture beacons, faction supply convoys, convoy piracy, diplomacy/alliances, faction-color ship skins, safe trading hubs, seasonal territory resets, ranked faction wars and faction-specific ship modules would give players meaningful cooperation and strategic conflict.