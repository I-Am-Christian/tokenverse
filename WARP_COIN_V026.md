# Warp Coin v0.26 — Persistent Frontier

## Why this update exists

The v0.25 fleet system spawned 29 NPCs close to the player and recreated them when the pilot traveled more than 2,600 world units. This caused overcrowding and a nonpersistent-feeling world. The 2D ship designs also needed better silhouettes and mechanical detail.

## Persistent star systems

A star system now has one small saved NPC fleet: at most 8 roaming ships per public star system and 4 peaceful ships in the private homestead. Every ship has a stable ID and saves its position, hull HP, velocity, anchor and security-escort hire state in the existing browser pilot save. Flying away no longer respawns, recenters or replaces them; leaving a star system and returning restores their exact positions. Defeated roaming outlaw ships stay defeated.

Other enemy drone and faction patrol systems remain intact. The persistence change specifically covers roaming v0.25 NPC fleets, not multiplayer on a remote server.

Asteroid fields use deterministic per-system seeds and stable asteroid IDs. A sparse per-system map saves only changed ore amounts. Mining a deposit to zero is remembered between visits. Decorative rocks, derelicts and probes come from stable world-coordinate cells instead of random player-relative spawning.

All original ships, credits, inventory, asteroid types, weapons, factions, Warp Drive and huge galaxy dimensions remain. Older saves gain new fields with no loss of existing assets.

## New original 2D ship artwork

A new Canvas 2D module contains original hulls guided by public ship design references, with no copied sprite sheets or purchased assets.

- Interceptors: sharp nose, swept wings, twin engines and compact wing guns.
- Explorers: manta-like wide wings, distinctive bridge and light armor.
- Miners: bulky industrial frame, resource arms and mechanical detail.
- Haulers and freighters: segmented cargo chassis and exposed containers.
- Raider fighters: aggressive forked prows, armored outer fins and red accents.
- Capital ships: central armored spine, side hangar decks, broadside turrets and banks of engines.

Each uses multiple material gradients, armor plates, visible lighting and differentiated shapes rather than drawing the same triangle at different sizes. The new renderer works for NPCs and player ships while preserving hull paint and existing cosmetics.

Research links:
- https://www.disruptorart.com/pages/starsector-game-artist.html
- https://2dgameartguru.com/space-ships-starting-with-the-design/
- https://dgbaumgart.itch.io/spaceship-sprites-3-styles (paid reference, not embedded)

## Proposal: pivot toward Warp Coin — Rift Frontier

Why: A vast map and many features do not automatically produce entertaining decisions. The game needs a compelling repeatable loop connecting ships, fights, mining, cargo, risk and markets.

A 12–15 minute expedition:
1. Choose a contract, outfit a ship and pay for an escort or scanning equipment.
2. Enter a high-risk anomaly sector, with carefully planned landmarks rather than featureless space.
3. Mine or capture valuable minerals, fight NPCs and decide when enough loot is enough.
4. Extract before the anomaly collapses, risking any unbanked cargo if you stay too long.
5. Use gains to develop a persistent owned outpost, build ship modules and influence faction markets.

The twelve daily rift events already in the lore can become the actual heartbeat of the game. Keep the giant galaxy as a wider strategy map, but focus the minute-to-minute play on concentrated interesting sectors.

Alternative: Sector Syndicate, an economy-first factory and logistics sim with fleet defense. Or Last Light, a tactical modular-ship roguelite with escalating boss contracts and crew.

The pivot is a design proposal, not an implemented replacement; save files and current gameplay remain safe until the user selects a direction.

## Compatibility and tests

Existing local save key and schema version 20 remain. World scale stays 192,000 × 115,200. No WebGL3D or Supabase connections were introduced. Run npm test to verify old saves, repeatable asteroid coordinates, saved mined deposits, persistent fleet positions across travel and reload, dead NPCs staying dead, original ship art and root/docs source parity.
