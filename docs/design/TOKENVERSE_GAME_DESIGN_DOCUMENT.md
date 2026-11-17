---
title: "TOKENVERSE — Game Design Document"
subtitle: "Living Design Specification | Proposed Release v0.14"
date: "18 November 2026"
---

# TOKENVERSE — GAME DESIGN DOCUMENT

**Working subtitle:** *The Tokenized Frontier*  
**Version:** Design revision 0.14-proposal, 18 November 2026  
**Genre:** fullscreen 2D / 2.5D browser space action, mining, crafting, faction competition and logistics economy  
**Target:** desktop browser first; fully responsive mobile controls  
**Repository:** [`I-Am-Christian/tokenverse`](https://github.com/I-Am-Christian/tokenverse)  
**Current player URL:** <https://i-am-christian.github.io/tokenverse/>  
**Status:** **design document, not a claim that the proposed v0.14 systems have shipped.**

## 1. Executive vision

**One-sentence pitch:** Tokenverse is a browser-native space frontier where pilots mine the remains of a shattered star, build and customize ships, join rival factions, move cargo through a living economy, and compete in twelve timed Rift openings each day.

**Player fantasy:** Start in a patched-up ship near a safe port. Explore a vast map, mine enough Moonstone to repair and grow, craft your first meaningful weapon, buy a faction-styled hull, plan your first dangerous convoy run, and prepare for the next Bell—an event everyone can see coming, but nobody can fully control.

**Design priorities:**

1. **Flight is the game:** at least 80% of the visible viewport remains navigable space when not in a modal. A clean action bar, compact telemetry and drawers, never a permanent dashboard.
2. **Decisions every few minutes:** evade, salvage, scan, escort, trade, craft, defend or explore. Avoid long stretches of watching an unattended ship mine.
3. **Scarcity without dead ends:** common ore remains accessible. Rare ore adds optional advantages, distinctive designs and prestige, not mandatory paywalls.
4. **Faction choice matters:** distinct silhouettes, identity, regional trade, missions and social incentives, without eliminating fair neutral play.
5. **Progress survives upgrades:** existing v0.13 saves, ship ownership, material tokens, faction standing and modules migrate without silent loss.
6. **No false blockchain promises:** current GitHub Pages builds use simulated currencies. Actual NFTs and crypto markets are a separate, optional later project requiring legal review, security and an authoritative backend.

## 2. What is already in Tokenverse v0.13

The repo currently includes **36 ships**, **nine weapon families**, blueprint crafting, weapon mods, zero-gravity movement, mouse steering, collision-aware autopilot, slow mining, **Scrap Credits (SC)**, five simulated material tokens, station markets, small local limit-order simulation, mining/combat drones, modular player outposts, PvE motherships, scans, **five linked systems**, four directional gates, and **four NPC-led factions** on a **48,000 × 28,800** map per system.

**Important limitation:** The deployed GitHub Pages game remains a **local single-player simulation** with browser-local state. The separate Node/WebSocket multiplayer prototype exists in the repo but does not power that Pages build. Shared PvP, faction leaderboards, cross-player exchange settlement, real blockchain mints and authenticated player ownership are not live. All multiplayer-facing mechanics below must clearly display **simulation** or **coming with server release** when appropriate.

## 3. Core gameplay loop

```text
LAUNCH FROM STATION
     ↓
CHOOSE A CONTRACT or SCAN A SIGNAL
     ↓
FLY / EXPLORE / MINE / FIGHT / ESCORT
     ↓
DECIDE: CONTINUE FOR MORE or RETURN TO SAFETY
     ↓
DELIVER CARGO → EARN SC / REFINE MATERIAL / FIND BLUEPRINTS
     ↓
REPAIR, CRAFT, CUSTOMIZE, PURCHASE SHIPS, SUPPORT FACTION
     ↓
PREPARE FOR THE NEXT BELL → TAKE THE RISK → EXTRACT
     ↺
```

**Session types:** 5-minute casual pilot (one delivery); 15-minute regular run (contract plus craft); 30–45-minute focused session (convoy, Rift preparation and a Bell). Event participation is optional; ordinary progression must never require being online at a specified hour.

### First 30 minutes of a new player

| Time | What they learn | Reward |
|---|---|---|
| 0–3 min | Move, aim, mouse autopilot, stop near port | First Moonstone |
| 3–7 min | Mine and avoid an obstacle; compare raw ore and certificates | Starter SC, cargo tutorial |
| 7–11 min | Dock, sell, repair, refine; explain why SC is not crypto | First refinery certificate |
| 11–16 min | Scan a wreck, retrieve a Chorus recording | Blueprint fragment + lore |
| 16–21 min | View four factions and choose one with reversible, clearly priced later transfer | Faction badge + home route |
| 21–26 min | Try a faction mission and view an NPC convoy | Reputation and useful cargo |
| 26–30 min | See a Bell preview, loadout preparation and safe extraction training | First cosmetic decal or title |

The new player must not be trapped by a mandatory Rift event, expensive hull, failed extraction or wallet connection.

## 4. Galaxy structure and territorial gameplay

### Existing macro-layout

- **Five connected worlds:** Orion Belt, Borealis Drift, Helios Reach, Titan Foundry and Umbra Exclusion.
- **Each world:** 48,000 × 28,800 logical units in v0.13.
- **Four faction quadrants:** Solar Union NW, Crimson Marauders NE, Verdant Accord SW, Void Scholars SE.
- **Neutral passage:** protected trade arteries and the Concord Exchange.
- **Disputed Rift:** dangerous central ore region, future event lobby and later multiplayer conflict hub.
- **Four edge gates:** north, east, south and west transfers.

### Proposed layered map in v0.14

**Layer 1: tactical radar.** Ship position, nearby hostiles, ore signatures, nearest dock and immediate heading. No text clutter.  
**Layer 2: navigation chart.** Whole system, territories, gates, station addresses, active convoys, planned route and risk level; opened via Navigation.  
**Layer 3: galaxy atlas.** Five systems and their trade routes, travel-time estimates, faction controls and event state; opened via Gates/Exchange.

**Territory interaction:** crossing another faction's border changes patrol attitudes and gives contextual warnings; neutral ships retain passage via Concord lanes. In the solo prototype all rival combatants are NPCs. Later, a server-controlled faction war system can change ownership of specific capture beacons—not the whole map every day.

**Navigation requirement:** existing safe-route planning must avoid asteroids, player outposts and temporary boss hazards. Gate entry, docking and escort AI use an explicit deceleration threshold and a fallback safe route. Enlarging a map must not multiply route-search latency or crash frequency.

## 5. The Twelve Bells: recurring Rift expedition

**Feature pillar:** competitive anticipation with a reliable schedule, short duration, controlled rare rewards and a dramatic extraction phase.

### Proposed timing

Every even hour **UTC**, 12 openings per 24 hours. Each event lasts **12 minutes**, with a **20-minute warning** before start and visible final **3-minute collapse warnings**. The prototype may simulate a Bell using an in-game event clock. Once multiplayer exists, the server clock is authoritative and the interface shows the player's converted local time.

| Phase | Time | Activity |
|---|---:|---|
| Muster | T−20 to T−1 min | Resupply, form party, load gear, select role, take escort contracts |
| Alignment | T to T+1 min | Four entrance gates activate; outer chamber accessible |
| Extraction race | T+1 to T+9 min | Mining, salvage, elite enemies, harvester beacons, convoy escort |
| Collapse | T+9 to T+12 min | Audible warnings, visible exit routes, unstable hazards and limited last-minute opportunities |
| Debrief | T+12 onward | Escape/penalty resolution, scoreboard and supply bulletin |

**Entry:** no crypto staking and no pay-to-enter barrier. Use ordinary SC for optional convenience supplies rather than a required cash-linked ticket. Solo-compatible outer objectives permit meaningful participation before shared PvP works. The Heartward Vault is reserved for top-tier gear and a hard encounter; its mineral rewards are bounded per Bell.

**Solo prototype event:** instance-like local chamber, NPC rivals, a visible countdown, one-time deposits and predictable extraction/penalty rules. Do **not** pretend other online players are in the same instance.

**Future online event:** authoritative timed matchmaker; player squads; late join rules; alliance/friendly-fire policies; regional latency thresholds; server-recorded loot and extraction; anti-duplication and bot defenses. PvP zones must be clearly marked on entry. Account for all regions and mobile players; event rewards should also have non-time-locked routes.

### Win conditions beyond killing

- **Miner:** deliver refined ore to a safe extraction cache.
- **Scout:** discover stable approaches or ancient signal archives.
- **Escort:** protect an NPC supply barge or wounded wingmate.
- **Engineer:** repair and defend a harvester beacon.
- **Fighter:** repel hostile drones and defend teammates.
- **Smuggler:** risky cargo escape with heightened pursuit, but not unlimited griefing of beginners.

### Reward rules (initial tuning targets, subject to playtesting)

- Rare ore appears in fixed **per-instance pools**, not a new currency faucet.
- A Bell rewards at most **limited amounts per account** per event plus reputation and cosmetics.
- A successful extraction retains all earned raw ore; emergency recovery retains a reduced quantity, with **no permanent ship deletion**.
- A defeated ship should not lose paid skins, existing owned hulls, or full wallets.
- Blueprints and cosmetic progress can drop via non-monetary gameplay; event-only cosmetics should have transparent access rules and consider rotating schedules.

## 6. Faction ships and combat identity

Four faction design languages apply to existing hull classes and new optional faction variants. Keep the current **36 ships** available; do not silently replace ownership. Proposed family examples (not yet built):

| Faction | Visual identity | Gameplay specialty | Planned ship concepts |
|---|---|---|---|
| Solar Union | White ceramics, gold edge trim, armor fins, broad symmetry | Defensive escorts and shield-support | Helion Interceptor, Bastion Guardian, Sunlance Frigate, Crown Carrier |
| Crimson Marauders | Black/red salvage, asymmetry, exposed engines and weapons | Fast assault, risky burst damage | Reaver Dart, Bloodhook Corvette, Ravager Destroyer, Ashen Crow |
| Verdant Accord | Green/bronze industrial modules, cranes and drone racks | Cargo, mining, logistics and repair | Prospector Rig, Canopy Carrier, Rootline Tender, Verdigris Barge |
| Void Scholars | Curved graphite/silver hulls, violet sensors, holographic surfaces | Scanning, precision and anomaly work | Oracle Skiff, Archive Needle, Parallax Sloop, Singularity Frame |

**Avoid pay-to-win:** A faction ship can have different stats, but should be balanced against comparable unlockable neutral hulls; no cosmetic NFT changes battle stats. Each base-class performance band gets counterplay. Each faction receives recognizable audio signatures and paint palettes, not just recolored triangles.

**Loadouts:** 1–3 hardpoints depending on ship class, engine slot, shield or utility slot, drones, cargo upgrades and cosmetics. Loadout weight, energy draw and heat create tradeoffs. Upgrade requirements should be visible at a station, and repairs must remain purchasable in ordinary SC.

## 7. Ship cosmetics and limited serial-numbered collections

### The skin system before any NFT launch

Build an ordinary cosmetic inventory with immutable **skin IDs, edition size, issued count and serial number** tracked locally in prototype / server ledger later. Users should be able to preview skins in the shipyard and customize paint, decals, thruster effects and damage weathering. A serial can be proudly displayed without being stored on a blockchain.

**Suggested caps are design proposals, not minted items:**

| Collection | Proposed maximum | Identity | Status |
|---|---:|---|---|
| Founders Fleet | 500 | Pre-Shattering recovery craft | Concept only |
| Solar Relics | 300 | White/gold military heritage | Concept only |
| Crimson Warframes | 300 | Salvaged combat plating | Concept only |
| Verdant Industrial | 300 | Weathered industrial finishes | Concept only |
| Void Archive Prototypes | 300 | Silver/violet experimental composites | Concept only |
| Bell Survivor Season 1 | ≤100 | Event commemorative visuals | Concept only |

**Immutable edition rules:** never increase a stated supply cap after public release; reserve creator, promotional and test allocations in the announced total; assign serials exactly once; disclose whether and how existing owners can sell or transfer; never offer guaranteed returns. Different seasons can create **distinct collections**, but must not secretly remint the same edition.

**Future optional NFT bridge:** Wallet connection via supported chain, audited mint contract, verified ownership, chain-ID protection, payment cancellation flows, metadata permanence policy, anti-phishing prompts and purchase receipts. Cosmetic display must work for walletless players. No wallet/marketplace integration goes live until a secure server and legal checks exist. Keep external cash trading and game-item valuation separate from the simulated material-token economy.

## 8. Galactic Exchange and logistics operations

### One terminal, two main tabs

**Exchange:** five resource-certificate markets (MOON, NEON, DUST, VOID, DIAM), current **simulated SC price**, 24-hour range in game time, change, supply, spread, order book, recent trades, refinery inventory and risk disclosure.  
**Logistics:** origin/destination, cargo type, required capacity, distance, expected travel time, tariff, escort risk, faction border, convoy status and reward in SC. Interactive chart routes should be readable from a single drawer.

**Optional separate market (future):** simulated fractional interests in fictional logistics companies may be possible, but do **not** conflate that with ownership of actual securities. A 'stock exchange' interface should be labeled as a fictional *corporate-share simulation* if it ever includes company shares.

### Trade route examples

| Route | Cargo | Opportunity | Risk |
|---|---|---|---|
| Orion → Borealis | Industrial clamps, Moonstone | Neonite demand and cold-storage supplies | Ice storms and navigation drift |
| Borealis → Helios | Neonite, cooling coils | Stardust transport contracts | Pirate interdiction |
| Helios → Titan | Stardust, capacitors | Foundry production surges | Heat and heavy drones |
| Titan → Umbra | Void Crystal components | High-value research deliveries | Anomalies and interdiction |
| Umbra → Orion | Scan data, limited Diamond Core | Research and specialty fabrication | Long-distance route with hostile border crossings |

### Mechanisms that create interactive choices

1. **Visible supply:** stations publish a limited buy/sell inventory and a refreshed order book, not invented infinite bids.
2. **Costs:** fuel/service/repair paid in SC; optional faction tariffs paid in SC; cargo insurance modeled as a transparent SC fee, not actual financial insurance.
3. **Market shocks:** a Bell increases *possible raw ore deliveries*, but prices move only when cargo is actually delivered. Avoid scripted guaranteed pump-and-dump behavior.
4. **Convoy missions:** NPC routes with announced arrival windows, escort risk, combat ambushes and optional rescue objectives.
5. **Risk/reward:** longer dangerous routes pay higher SC for successful delivery, but cannot indefinitely print SC; NPC contract issuance has daily budgets.
6. **Arbitrage controls:** cooldowns, travel time, cargo capacity, slippage, taxes and supply budgets limit risk-free cycling.
7. **Local honesty:** the prototype's exchange has simulated snapshots and no cross-player ownership. A later server handles actual settlement atomically.

### Currency balance

**Scrap Credits (SC):** earned through selling raw ore, ordinary bounties, missions and logistics; spent on repairs, local ship purchases, non-premium services, taxes and fabrication. Not transferable on-chain.  
**Raw ore:** world-item inventory; mineable, storable, tradable in future multiplayer.  
**Material certificates:** `$MOON`, `$NEON` common controlled issuance; `$DUST`, `$VOID`, `$DIAM` limited reward reserves; existing upgrade payments return to reserves instead of being permanently consumed.  
**Cosmetic serials:** nonfunctional collectibles, separate from all the above.

**Economic warning:** A fixed supply or rarity never guarantees a price. Introducing real crypto would require reliable server rules, a recorded issuance and reserve schedule, anti-bot security, transaction auditability and review of applicable law.

## 9. More interaction per minute

Rather than more UI, introduce **short interactive encounters**:

- **Distress signal:** decide whether to divert and save an NPC crew for reputation or continue hauling cargo.
- **Debris field:** aim the scanner at a wreck and identify two salvageable compartments before choosing one.
- **Convoy attack:** protect three fragile cargo pods while outnumbered.
- **Drone tuning:** choose 'mine nearby,' 'guard formation' or 'return cargo' using small contextual radial controls.
- **Harvester beacon:** stay within an objective ring and defend it while the ore pump starts; the team can leave early with less cargo.
- **Anomaly puzzle:** rotate three frequency dials to recover lore, not just tap 'Collect.'
- **Crate salvage:** short reaction-and-aim action to recover damaged equipment.
- **Faction patrol stop:** show credentials, pay a fair SC toll, take a safe detour or attempt an escape.

Aim for one meaningful interaction, decision or signal within every **60–120 seconds** of active exploration. Do not use deceptive reward loops or require excessive daily attendance.

## 10. More realistic-looking graphics without abandoning browser performance

Tokenverse is a top-down game; a **stylized physically grounded** presentation will usually be more readable and performant than trying to become a full 3D simulator overnight.

### Art pillars

- **Material truth:** metallic hull plating, edge highlights, recessed vents, chipped paint, glass canopies and thruster nozzles.
- **Faction silhouettes:** identifiable at a glance even when muted or zoomed out.
- **Lighting hierarchy:** dark broad environment, bright cockpit/engine cues, softer nebula scattering, restrained bloom for weapons and rare minerals.
- **Scale:** small miners look functional; boss motherships dwarf them and cast convincing shadow silhouettes.
- **Impact:** sparks, shield ripples, debris, recoil, heat and audible hull stress correspond to real events.
- **Readable mining:** distinct crystal textures and fracture colors for every ore type, visible resource depletion and precise hit feedback.

### Practical rendering path

1. Keep the existing fullscreen HTML Canvas 2D client. Introduce **ship layers** (base hull, panel seams, turret, damage, engines) and multi-layer asteroid shapes before adding any engine dependency.
2. Use deterministic procedural noise, limited texture atlases and pre-rendered offscreen canvases for expensive lighting effects.
3. Add a render-quality switch: Low / Medium / High / Auto. Auto adjusts particles/bloom based on actual frame timing.
4. Preserve motion clarity: ship outline and heading remain visible over dark nebulae and energetic effects.
5. Build in keyboard navigation, reduced motion, muted palettes and optional screen shake.

### Performance budgets (targets, not measured facts)

- **Desktop 1920×1080:** sustain ~60 FPS on a mainstream recent laptop, not only a high-end GPU.
- **Mobile:** prefer 30–60 FPS as available; no interaction depends on hover.
- **Visible game canvas:** ≥80% of available screen when no station dialog is open; fixed HUD occupies far less.
- **Initial asset weight:** aim ≤5 MB for first load after optimization, with optional higher-resolution assets loaded on demand.
- **UI:** opening Ledger, Cargo, Navigation or Factions should not cover the ship by default; overlays should avoid the right-side minimap and honor safe-area insets.

## 11. Player-facing interfaces

### Flight screen (default)

Always visible: game canvas, small hull/energy/cargo cluster, minimal radar, one-line location/faction status, Scan, Ops, Gates, Navigation and a tiny Bell countdown when relevant. No permanent exchange charts or mission walls.

### Station screen (contextual)

When docked: Market, Upgrades, Workshop, Shipyard, Ship Dealer, Drones, Construction, Exploration, Exchange & Logistics. Each tab opens as needed and keeps the previous choice if the pilot re-docks. Show one clear craft cost and action rather than a full dashboard of repeated buttons.

### Bell screen (contextual)

One compact preparation view when approaching the event: countdown, selected role, cargo capacity, recommended hull, extraction loss rules, party status (later multiplayer), and a **Join** button. During the event, show objective, time remaining and extraction direction. No external payment prompt.

### Ship collection screen

Preview full 2D/2.5D ship render, faction styling and compatible gear. Show cosmetic serial/edition size only when that cosmetic exists in the registry. Do not label unreleased designs as owned or minted.

## 12. Audio and atmosphere

- **Ship engine audio:** throttle, reverse thrust, boost, docking clamp, hull damage and emergency warning should have distinct envelopes.
- **Faction sound identity:** Solar clean synthetic brass, Crimson dirty percussive radio, Verdant low mechanical bass, Void airy harmonic pulses; short original procedural stingers are sufficient initially.
- **Bell theme:** an original twelve-beat pulse that adds orchestration as opening nears, with an optional thirteenth faint undertone for story chapters.
- **Accessibility:** volume sliders for master/music/effects/radio, complete mute, text subtitles for all critical announcements and reduced visual flashes.

All sound should be original, properly licensed, or generated from public-domain assets; don't assume copyrighted soundtrack use.

## 13. Safety, fairness and player trust

- No functional advantage linked to paid cosmetics, NFTs, or ownership of limited series.
- No direct conversion of SC to crypto in the prototype.
- Underage or unknown-age players must not be pushed into wallet connections, speculative trading or real money use; determine legal age and regional requirements before any real crypto integration.
- Future player trading requires server-authoritative account identity, anti-dupe checks, limits, ledger invariants and review of actual jurisdictional obligations.
- PvP requires clear opt-in boundaries, protected beginner areas, respawn rules and anti-griefing safeguards.
- Event times must be presented in local time, with practical routes for players who cannot attend fixed windows.
- Never describe live crypto balances, withdrawal capability, NFT minting or multiplayer presence until verified and deployed.

## 14. Success metrics and acceptance gates

| Goal | Initial test target | How to evaluate |
|---|---|---|
| More active play | Players choose at least two distinct activities in a 20-minute test | Session logs and short post-test survey |
| Readable UI | ≥80% viewport occupied by playable world in default state | Browser screenshots at 1920×1080, 1366×768, 390×844 |
| Safe navigation | Zero unavoidable asteroid collisions on standard return-to-port routes in regression test scenarios | Simulated route tests at different ship speeds |
| Bell clarity | Players can find countdown, entry rule and extraction point unassisted | Five-person usability test |
| Fair cosmetic ownership | No equipment stats change when cosmetic changes | Automated loadout equivalence tests |
| Conserved economy | No negative balances, duplicate orders or funds on cancellation | Invariant-based transaction tests |
| Faction identity | Players can distinguish four silhouettes without color labels | Blind artwork comparison |
| Browser performance | Target sustained 60 FPS desktop / ≥30 mobile on representative hardware | Actual device frame timing and memory checks |

## 15. Scope boundaries

### Proposed for **v0.14 browser prototype**

- Local timed Bell event and safe extraction.
- Four faction-specific visual ship treatments based on existing hulls.
- Graphics pass for layered hull materials, asteroids, lighting, impact feedback and user-selectable quality.
- Exchange + logistics tab with simulated regional stock and NPC convoys.
- Cosmetic collectible registry and preview with limited *simulated* edition counts; no real NFT mint.
- A short lore prologue and collectible Archive recordings.
- Additional regression tests and save migration.

### Explicitly **not v0.14**

- Live player-versus-player Bell lobbies and authenticated faction warfare.
- Real cryptocurrency token minting, actual exchange deposits or withdrawals.
- On-chain NFT contracts, wallet custody or real-money sales.
- A production-grade matching engine, hosted servers or externally synchronized player inventories.
- Replacing the game with a heavy 3D engine.

These belong to later server, security, monetization and compliance milestones after prototype gameplay is proven fun.

---

**Related documents:** `TOKENVERSE_LORE_BIBLE.md` for narrative canon and `TOKENVERSE_V014_IMPLEMENTATION_ROADMAP.md` for staged engineering tasks, dependencies and acceptance checks.