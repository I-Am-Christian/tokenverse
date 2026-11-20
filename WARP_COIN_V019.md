# Warp Coin v0.19 — The Living Frontier

**World dimensions remain unchanged:** 192,000 × 115,200 per public star system, with private player systems and the Twelve Bells Rift kept intact. Warp Cruise and Pulse Jump remain available.

## Gameplay update

- **Dynamic frontier signals:** As pilots cover distance in unprotected public space, the ship detects occasional optional encounters along its current heading. A new **Signals** console glows while an encounter is available. Each event stays active for up to 150 seconds and can be ignored without cost. No encounters spawn in safe stations, protected faction/neutral spaceports, the Heart Chamber, or the private solar system.
- **Abandoned salvage:** Fly to the drifting wreck and stabilize to recover 65 SC, 15 XP and up to two units of raw ore (within existing cargo capacity).
- **Distress transmissions:** Approach a stranded pilot to earn 100 SC and 30 XP. The rescue is handled as a short optional navigation activity.
- **Pirate ambush:** One raider in low-tier space or two in tougher systems become actual hostile NPC drones, attack and can be defeated with existing blasters. Existing per-drone salvage and experience are retained; defeating every raider also grants a one-time 115 SC + 35 XP bounty.
- **Rare Eidon caches:** Optional lore-linked relic markers award 135 SC, 40 XP and two blueprint fragments.
- **Tactical radar and on-screen navigation:** Active signals show a bright marker and in-world shape, plus a persistent listing in the Signals console. Clicking a marker or pressing **Plot signal** routes the existing obstacle-aware autopilot to the location. You can investigate from close range with **E** or slow to a stop near the marker.
- **Progress and safety:** Every reward is awarded once; old save contents survive. Encounter state, cooldowns, and a capped history remain in the same existing browser save under \`roaming\`; a v0.19 save version does not change \`worldScaleVersion=4\`. Large teleports, system changes, and Pulse Jumps do not artificially count as ordinary travelled distance. There is no token minting, real NFT or real-crypto settlement.

## Playing

1. Plot a route into the unprotected reaches or simply explore with your ship.
2. When a signal is detected, open **Signals** (glowing symbol) and choose **Plot signal**.
3. Brake near a wreck, rescue beacon or rare cache. Pilot rescue/salvage/relic collection resolves automatically once your ship is close and slow, or press **E** to inspect.
4. For an ambush, fight or fly away. Pirate bounties are paid only on complete victory.
5. Continue exploring; future events will vary between salvage, rescue, pirates and relics.

## Verification

\`npm test\` on Node.js 22+ runs original regression checks plus tests for deterministic event types, teleport exclusion, safe-zone spawn rejection, single-claim rewards, pirate bounty, active-event save restoration and expiration. Desktop/mobile gameplay checks recommended.

## Backend separation

No Supabase connector was accessed or modified. Online multiplayer, email login, shared chats, actual NFTs, cash withdrawals and cryptocurrency transactions remain disabled. Tokenverse will eventually use its **own new Supabase project**, never the existing Hello Earth database.
