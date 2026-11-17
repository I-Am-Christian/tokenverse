# Tokenverse — Design Archive

**Narrative foundation + game design + v0.14 build roadmap**  
Prepared 18 November 2026. These documents are **proposed future design**, not a statement that v0.14 has shipped.

## Documents

1. [The Eidon Chronicles — Lore Bible](TOKENVERSE_LORE_BIBLE.md)  
   Complete story foundation: the First Navigators, Shattering of Eidon, five mineral types, four factions and leaders, five star systems, the Twelve Bells and the Thirteenth Note, five-act narrative, chronology, dialogue, glossary, and canon rules.

2. [Tokenverse Game Design Document](TOKENVERSE_GAME_DESIGN_DOCUMENT.md)  
   Gameplay loops, PvE/PvP limits, faction ship identity, twelve timed Rift events, realistic browser graphics, simulated exchange and convoy logistics, cosmetic collection caps, UX, balancing and player trust.

3. [v0.14 — The Twelve Bells Implementation Roadmap](TOKENVERSE_V014_IMPLEMENTATION_ROADMAP.md)  
   Prioritized work packages, architecture, proposed files and data contracts, save migration, tests, acceptance criteria, PR breakdown, deferred multiplayer and optional NFT security work.

## Status and vocabulary

| Area | As of v0.13 | Design status |
|---|---|---|
| Browser play at GitHub Pages | Implemented solo | Preserve and improve |
| Factions and protected territories | Implemented as NPCs | Story and distinctive ship silhouettes proposed |
| Five star systems, four directional gates | Implemented | Add an event-specific central Rift entrance |
| 36 ships, nine weapons, SC and five material tokens | Implemented (simulated) | Preserve inventory and improve roles/economy |
| Modular outposts, scans, drones, bosses | Implemented locally | Connect narrative and logistics |
| Twelve timed Heart Chamber openings | Not implemented | Proposed v0.14 solo event |
| Cross-player PvP, globally synchronized markets | Not implemented in Pages | Requires hosted authoritative game server |
| Real NFT ship skins, real token trading | Not implemented | Optional future; security and legal review first |

**Gameplay URL:** https://i-am-christian.github.io/tokenverse/  
**Repo:** https://github.com/I-Am-Christian/tokenverse

### Contribution notes

- Treat the lore bible as **draft canon** until individual story chapters are approved and shipped.
- Log new canon changes when adding quests, faction figures, mineral rules or ancient Navigator revelations.
- No functional advantages for paid or rare cosmetic skins.
- No cryptographic ownership claims without verified on-chain and server-side infrastructure.
- Keep the fullscreen game playable and the navigational viewport unobscured on typical desktop and mobile sizes.