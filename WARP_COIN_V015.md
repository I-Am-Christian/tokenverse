# Warp Coin v0.15 — Pioneer Systems

## Play

https://i-am-christian.github.io/tokenverse/

> **New branding:** The game is now **Warp Coin**. The GitHub repository and GitHub Pages URL remain under the legacy `tokenverse` slug to avoid breaking existing links and browser saves. Rename the repository / domain separately once a replacement address is chosen.

## Galaxy expansion

- Five public star-system maps now each cover **96,000 × 57,600** simulation units, versus 48,000 × 28,800 in v0.14 (exactly **four times the map area**).
- Solar, Crimson, Verdant and Void faction territories, stations, danger zones, alien motherships, Rift Anchor and Concord Exchange are moved proportionally to preserve travel geometry.
- Mineral belts and scanner discoveries are spread across the expanded galaxy; mining density rises in selected faction territories.
- The A* autopilot grid grows to 360-unit cells to control pathfinding memory costs on the new map.
- Existing saved pilot positions and **player outposts are migrated once** to the expanded coordinates via `worldScaleVersion=2`. Existing ships, credits, crafting, tokens, faction progress and Rift records are retained. The old localStorage key is deliberately preserved.

## Personal solar system

- Open **My System** from the right console and claim a **free Pioneer Charter**.
- Warp to a separate, locally instanced **Pioneer System** with a rendered sun, four orbiting planets, a dockable personal headquarters and mineable asteroid belts. Returning takes you to your recorded departure location and system.
- Rename the star, headquarters and all four planets; change each planet's appearance and the base's color.
- Build and upgrade **Solar Arrays, Orbital Extractors, Cargo Silos, Refinery Wings, Merchant Docks, Defense Turrets and Habitat Rings**. Modules cost finite SC and raw ore.
- Producing raw ore requires powered extractors, warehouse room and **SC operating costs**. One production cycle is 90 seconds. At most six hours of elapsed offline production can accrue, subject to resource and treasury limits; production is not a source of SC or minted tokens.
- Dock at the private HQ to transfer ore between warehouse and ship. Take ore to a public exchange to sell and refine it.
- Your private solar system and cosmetics are **saved in the local browser**; this is not a live player-owned universe nor an account-synchronized land deed.

## Economy console

- Open **Economy** from the right console for a simultaneous five-region **Galactic Supply Board** of raw-ore bids, asks and regional warehouse stock.
- View your SC liquidity and estimated raw-ore asset value. Trade at public docked stations using the existing bounded regional exchange; market prices already depend on inventories, completed deliveries and NPC shipments.
- Use existing convoy contracts to transport finite ore between regions for SC payments. Personal colony manufacturing consumes SC and has finite warehouse capacity.
- All SC, materials, valuations, market quotes and exchange activities are **in-game simulations only**. No wallet connectivity, real deposits, cash withdrawals, globally scarce NFTs or real securities are included.

## Preserved gameplay and known limits

- Four factions, 36 existing hulls, nine weapon types, five main public systems, Twelve Bells PvE Rift events, blueprint system, drones and trade remain.
- This is a solo static GitHub Pages game. Persistent multiplayer, email authentication, live chats, friends, shared player-created markets and actual currency trading require a dedicated authenticated backend and separate security work. The existing Hello Earth database has not been changed.
- JavaScript localStorage can be changed by the player, and local clock manipulations affect offline production; these mechanics are not authoritative economies.
- Tests cover world size, coordinate migration, colony claims, warp/return, base economics, warehouse transfer, and the existing v0.14 gameplay.