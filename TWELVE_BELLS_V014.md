# TOKENVERSE v0.14 — The Twelve Bells

**Implementation release notes — 18 November 2026**

**Play:** https://i-am-christian.github.io/tokenverse/

The **Eidon Chronicles** now have a playable first chapter. This release builds directly on the documented v0.13 Faction Frontiers prototype and the three design documents under [`docs/design/`](docs/design/README.md). The website is still a **solo local browser game** hosted through GitHub Pages, not live multiplayer, real cryptocurrency, real NFTs or a real financial stock exchange.

## 1. The Twelve Bells — timed local Rift expeditions

- **12 daily openings**: at every even UTC hour (00, 02, ... 22 UTC), using the local device clock for this solo prototype.
- **Muster** starts 20 minutes before each opening. Every Bell stays **open for 12 minutes**; the last **3 minutes** are marked **Collapsing**.
- One tiny Bell countdown remains in the top HUD; click it for full event details, entry and extraction options.
- Travel to the original universe's **Orion Belt**, approach the **Eidon Rift Anchor** in the Disputed Rift (around X 24,000 / Y 13,300), and brake below 95 units/s before entering while the Bell is open.
- A distinct **Heart Chamber** arena contains deterministic mineral seams, a hostile guardian, an extraction beacon and a maximum of **14 raw ore** per pilot per Bell.
- Mining and depleted deposits persist in the browser save. Each Bell can be **resolved only once**; neither refreshes nor re-entry after resolution duplicate the SC reward or replenish its ore.
- Bring ore back to the **blue extraction beacon**, brake, and use the **Extract cargo** button in the Bell panel (or `E`). Successful extraction grants a bounded SC reward and one-time lore progress. Emergency collapse recovers the pilot with limited raw-ore/hull penalties but never confiscates purchased ships or cosmetic skins.
- The event exposes **raw ore**, not extra blockchain token minting. Existing material-token refinement caps continue to apply.
- This is a **solo NPC challenge**. Real faction PvP lobbies are deferred to a server-authoritative multiplayer release.

## 2. Faction ship identities and more grounded graphics

Each existing hull now uses a faction-specific **silhouette**, material palette and visual trim without changing stats, ship ownership or loadouts:

- **Solar Union:** symmetrical white ceramic hulls with gold accents and stabilizer fins.
- **Crimson Marauders:** dark, asymmetric needle-like raiders and exposed hot-metal seams.
- **Verdant Accord:** boxier industrial ships with bronze cargo sections and utility frames.
- **Void Scholars:** curved graphite lenses with violet sensor arcs and pale cockpit glow.

The Canvas renderer adds layered plating, seams, cockpit reflections, clearer mineral vein highlights, soft nebula gradients, visible travelling NPC cargo craft, a distinct Rift Anchor and a separate Heart Chamber atmosphere. The Bell console includes **Low / Medium / High / Auto** quality and **Reduced motion** controls. These changes remain stylized Canvas 2D, not a new 3D engine.

## 3. Exchange & Logistics

- Accessible **only while docked**, in the station's **Exchange & Logistics** tab.
- Regional **raw ore** bid/ask quotes derive from warehouse stock in each of the five star systems. Quotes include spreads; buying and immediately selling in the same region is intentionally loss-making.
- New **cargo shipment contracts** require actual raw ore in cargo and a small SC tariff. Accepting a contract removes and seals the cargo. Completing the trip through the existing gate network and docking in the correct destination system pays the **SC reward only once** and deposits ore in the destination stock ledger.
- Cancelling a shipment is possible at its origin, with cargo returned only if hold capacity permits; the tariff remains spent. Each contract has a deadline and published risk classification.
- NPC supply movements update local warehouse stock in limited quantities every five minutes of *local simulation time*. Regional bulletins display completed deliveries and the Bell's successfully extracted resources. No synthetic endless SC reward loop is provided.
- The pre-existing **simulated token exchange** remains separate. There is no securities market, on-chain trade, wallet withdrawal or cash value.

## 4. Limited cosmetic ship skins — prototype registry

A new **Shipyard showroom** previews and equips cosmetic skins, preserving hull, weapon and engine statistics. Prototype designs include Founders Fleet (500 planned editions), Solar Relic (300), Crimson Warframe (300), Verdant Industrial (300), Void Archive Prototype (300), and Bell Survivor (100). Bell Survivor requires three successful local expeditions; other local cosmetics are bought with **Scrap Credits**.

**Important:** The number in each collection is a **future design cap**. Local browsers cannot establish globally limited supply, serial uniqueness or transferrable ownership. This release only includes a **local nontransferable cosmetic simulation**, not minted NFTs, verified serials or global scarcity. A later secure server registry would be needed before considering actual on-chain editions.

## 5. Chapter Zero — The Broken Relay

A new **Eidon Archives** station tab gives players an optional five-step opening mission:

1. Scan in Orion Belt to discover the broken Navigator relay.
2. Mine four units of raw ore for repair components.
3. Dock and repair the relay using 2 Moonstone and 10 SC.
4. Speak with a faction archivist.
5. Escape a Bell with extracted cargo to hear a first recording of the **Thirteenth Note**.

Recovered recordings persist in the pilot save and can be reopened for the core history of the First Navigators, the Stellar Loom and Eidon.

## 6. Existing game and compatibility

The release keeps the existing **48,000 × 28,800 units per system**, five interstellar systems, four directional gates, four factions, 36 ships, nine weapon types, drones, alien motherships, crafting, modular player outposts, SC economy and simulated material-token exchange. The default gameplay surface remains a fullscreen Canvas with contextual menus.

The existing `tokenverse-deep-space-v10` browser save key is retained to preserve older pilot progress. Version 14 adds Bell expedition history, depletion records, archive progress, cosmetic selections and regional logistics. Previous faction membership, ship purchases, credits, ores and exchange orders are retained.

## 7. Tests and limitations

New Node regression tests exercise UTC boundaries, phase changes, Rift depletion persistence and one-time payout, cosmetic stat invariants, shipment escrow/delivery invariants, and existing feature preservation. The existing multiplayer and UI test suites continue to run in GitHub Actions.

GitHub Pages serves a static browser game: local pilots can modify local saves and clocks. Before shared Bell races, authenticated NFTs or real token trading, Tokenverse needs secure accounts, an authoritative gameplay server, a transactional settlement ledger, auditing and relevant legal review. **There is no money earning or NFT minting capability in v0.14.**