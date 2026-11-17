---
title: "TOKENVERSE — v0.14 Engineering Roadmap"
subtitle: "The Twelve Bells | Implementation Plan & Acceptance Criteria"
date: "18 November 2026"
---

# TOKENVERSE v0.14 — THE TWELVE BELLS

**Engineering implementation roadmap | Proposal | 18 November 2026**

**Objective:** Build the next coherent iteration of the existing Tokenverse browser prototype: a local timed Rift event, sharper faction visuals, a more interactive logistics/exchange screen, limited cosmetic skin registry, and grounded space graphics. Maintain ≥80% fullscreen playfield and preserve existing v0.13 progress.

**Primary repository:** [`I-Am-Christian/tokenverse`](https://github.com/I-Am-Christian/tokenverse)  
**Player URL:** <https://i-am-christian.github.io/tokenverse/>  
**Baseline:** v0.13 Faction Frontiers, checked against `FACTION_FRONTIERS_V013.md`, `FRONTIER_INDUSTRIES_V012.md`, and current `package.json`.

> **Planning status:** This roadmap and the accompanying lore/GDD documents are deliverables. The v0.14 gameplay below has **not** been implemented or deployed by this documentation update.

---

## 1. Strategic release target

**Release name:** Tokenverse v0.14 — *The Twelve Bells*  
**Players should notice:** an unmistakable countdown to the next Rift opening, an optional compact expedition interface, faction-distinct hulls, richer mining and impact effects, NPC logistics journeys, and a collectible ship skin showroom.  
**Players should not need:** installations, wallet login, real crypto deposits, or an always-open trading dashboard.

### Definition of success

A player can launch the game on GitHub Pages, retain their v0.13 save, see the next Bell in their time zone, prepare at a station, enter a **local solo** Heart Chamber on an opening, collect bounded raw ore and a lore recording, escape safely or experience a clear salvage penalty, then dock to trade, craft or view a cosmetic skin without obscuring most of the flight view.

## 2. Existing implementation and constraints

| Existing surface | Present today | v0.14 change |
|---|---|---|
| `index.html` and `docs/index.html` | Two mirrored static Pages entry points | Keep them identical, ideally via a build/copy step |
| Canvas renderer | Procedural stars, ship/asteroid sprites and HUD | Layered faction hull sprites, lighting pass and quality settings |
| Pilot save | Browser `localStorage`, version-migrated since earlier releases | Add v14 fields with defaults and validations |
| `WORLD` and `SYSTEMS` | Five connected 48k × 28.8k systems | Preserve macro map; add a separate timed Rift arena |
| `GATES` | Four directional portals per system | Keep existing travel; introduce a fifth **event-specific** entrance without stealing a directional gate |
| Factions | Solar / Crimson / Verdant / Void with NPC bases | Add ship art families, visuals and lore hooks; do not reset reputation |
| Shipyard | 36 ships and crafting | Add cosmetic preview and limited *local* catalog |
| Exchange | Simulated SC/token market, limited inventory/orders | Regional supply, convoy delivery ledger and logistics terminal |
| Scanner | Resource/anomaly site discovery | Add Bell resonance and first Eidon recording |
| Multiplayer server (`server.js`) | Separate Node/WebSocket prototype | Do not pretend static Pages multiplayer is live; plan future server port |

### Known architectural risk

Much of the current browser game logic is in a **large monolithic HTML script**. Splitting it into modules lowers long-term risk but must be staged carefully. Do not combine a full game-engine rewrite with the Bell event in a single untestable commit.

**Recommended incremental extraction path:**

```text
src/
  core/       clock.js, state.js, save.js, events.js
  world/      galaxy.js, rift.js, factions.js, pathfinding.js
  gameplay/   mining.js, combat.js, loot.js, convoys.js
  economy/    inventory.js, market.js, logistics.js
  cosmetics/  skins.js, catalog.js
  render/     particles.js, ship-layers.js, effects.js
  ui/         hud.js, bell.js, station.js
  lore/       dialogue.js, collectibles.js
  tests/      fixtures/ (or continue root tests/)
```

This is a **suggested target structure**, not the present file layout. During migration, create a small asset loader or build step that still emits GitHub Pages-compatible static HTML/JS with relative URLs and no server requirement.

## 3. Dependency map

```text
SAVE MIGRATION + BASELINE TESTS
            |
  ------------------------
  |           |          |
EVENT CLOCK  SHIP ART   LORE DATA
  |           |          |
RIFT ARENA   EFFECTS    PROLOGUE
  |           |          |
EXTRACTION   SKIN UI    DISCOVERIES
  |           |          |
  ------------------------
            |
REGIONAL MARKET + NPC CONVOYS
            |
   INTEGRATION / BALANCE
            |
     v0.14 RELEASE

Future branch, after v0.14:
 AUTH + REALTIME SERVER + LEDGER → SHARED BELLS → OPTIONAL ON-CHAIN COSMETICS
```

## 4. Milestones and deliverables

### M0 — Stabilize the baseline and preserve saves

**Tasks**

1. Record the v0.13 commit SHA, `npm test` baseline and GitHub Pages root/docs publishing mode.
2. Create a deterministic test fixture for an existing pilot with SC, ore, faction reputation, a purchased hull, crafted gun, station modules, blueprints and exchange orders.
3. Add `saveVersion: 14` and a migration function that **adds** fields without rewriting existing values.
4. Normalize and validate numeric inputs: no `NaN`, negative inventory, infinite payouts or unsupported ship/skin keys.
5. Add a feature flag `bellPrototypeEnabled` for rollback without wiping saves.
6. Introduce a test harness that exercises browser game logic outside the DOM where possible. Keep the existing multiplayer integration tests intact.

**Suggested new save fields**

```json
{
  "saveVersion": 14,
  "lastBellId": null,
  "riftRuns": [],
  "riftLootClaimed": {},
  "loreFound": [],
  "cosmetics": {"ownedSkinIds": [], "equippedByHull": {}},
  "regionalMarkets": {},
  "convoyContracts": [],
  "settings": {"quality": "auto", "reducedMotion": false}
}
```

**Acceptance:** old saves load unchanged; no reward is duplicated by refreshing; a malformed save shows recovery options instead of breaking the page; root and docs HTML are byte-equivalent for release.

### M1 — Bell scheduler and local Rift event (highest priority)

**Functional specification**

- Determine a stable event ID using UTC: `YYYY-MM-DDTHH`, where HH is an even hour.
- Next event is the next UTC even-hour boundary. Display countdown and local start time.
- Event phases are `upcoming`, `open`, `collapsing`, `closed`, with transitions tied to a deterministic time value.
- A Bell instance is **solo and local in v0.14**. Do not name it 'PvP' in the UI; label NPC rival skirmishes instead.
- Entry requires being near the central Rift portal, not paying any real-money ticket.
- A dedicated Heart Chamber arena has bounded ore allocation, three difficulty bands, NPC defenders and visible extraction markers.
- Once an asteroid's event loot has been collected and recorded, re-entry in the same Bell must not regenerate the same reward.
- At T+12m the event seals. Escape routes or emergency recovery resolve the ship; there is no permanent loss of purchased hulls or cosmetics.
- Event rewards: raw ore, SC contracts, faction reputation, limited story discoveries and optional simulated cosmetic participation progress. No extra on-chain material issuance.

**Pure state machine**

```text
CLOSED ──[T−20m]──> MUSTER ──[T]──> OPEN
  ^                                |
  |                           [T+9m]
  |                                v
  +────[T+12m]──── COLLAPSING ←─────+

On every transition:
  validate Bell ID → persist one resolution record → update countdown → notify UI
```

**Specific timers**

- Mustering: 20 minutes before each even-hour UTC boundary.
- Active: 12 minutes total.
- Last 3 minutes: collapsing alert, extraction arrows and escalating original audio.
- Next event countdown always visible in a minimal badge; expanded information only in Bell modal.
- If a player opens the game halfway through a Bell, show remaining time; no fake replay.

**Testing cases**

- UTC boundary at 23:59 and the following day's 00:00.
- Local time zone conversion including daylight savings where relevant.
- Browser sleep/resume at T+11:59; no negative clock or award duplication.
- Save/reload during a Rift run; restore the exact event and spent ore state or resolve safely.
- Multiple entrances and exits in one Bell; reward caps are stable.
- No playable Rift entrance once the event is closed.
- Extraction fallback when a pilot's engines cannot reach the gate at current speed (recoverable loss, not softlock).

### M2 — Faction ship families and visual readability

**First deliverable:** four family-level hull *visual variants* applied to existing ships, one per faction, without changing their current game balance. Additional purchasable faction-exclusive hulls can follow only after balancing.

**Tasks**

1. Create a `renderFactionHull(hullId, factionId, palette, damageState)` pipeline with separate layers: silhouette, panels, cockpit, faction trim, weapon hardpoint, thruster.
2. Distinct silhouette tests at 64×64 and 128×128 pixels; do not depend solely on color.
3. Implement 4 palette presets and optional faction insignia decals.
4. Add station shipyard preview and one-click side-by-side comparison with existing hull.
5. Preserve original 36 hull stats and ownership. New visual treatments are cosmetic-only at launch.
6. Add original sound stingers for faction ship launch and dock.

**Proposed pilot art brief**

| Faction | Prototype shape | Surface treatment | Readability cue |
|---|---|---|---|
| Solar | Broad symmetric trapezoid | White ceramic/gold panel seams | Twin stabilizer fins |
| Crimson | Needle-like asymmetric raider | Burned black/red steel | Exposed side guns |
| Verdant | Boxy utility frame | Moss green/bronze with cargo modules | External cranes and drone bays |
| Void | Curved narrow lens | Dark graphite/silver with violet glow | Crescent sensor wing |

**Acceptance:** players can tell factions apart in grayscale at gameplay scale; cosmetics cannot increase engine thrust, DPS or mining yield.

### M3 — Visual and audio pass

**Tasks**

- Replace flat ship fill with layered hull plate rendering and local shadows.
- Add wear-level and damage materials; consider per-frame offscreen caching.
- Improve mineral identification with cracked rocky silhouettes, translucent crystal veins and consistent color families.
- Add soft starfield parallax, subtle nebula volumetric gradients and readable portal distortion shaders made from Canvas compositing.
- Add buffered weapon muzzle flashes, recoil, shield hits, impact particles, wreck fragmentation and heavy boss blast cues.
- Provide `Low / Medium / High / Auto` quality modes. Medium as safe default if automatic performance tracking is unreliable.
- Add sound categories and captions for Bell warnings; respect browser gesture activation and mute persistence.
- Use a single coherent spatial scale: asteroids, fighters, freighters and motherships must be proportionally legible.

**Measurable acceptance:** 80%+ gameplay viewport, no control overlap at 1920×1080, 1366×768 and 390×844; tested stable performance on at least one mainstream desktop and one mid-range phone, with fallback quality if frame time exceeds budget.

### M4 — Regional Exchange and Logistics terminal

**Feature screen:** Station → **Exchange & Logistics** with two top-level tabs. Default navigation menu stays closed while flying.

**Regional model**

- Each system has simulated `oreStock`, `demand`, `offerPrice`, `bidPrice`, `convoyCount` and `riskIndex` per material.
- Existing SC and five material tokens remain unchanged.
- NPC convoys move limited raw ore from surplus regions to deficit regions. Deliveries alter simulated stock; only then may prices drift within published bounds.
- One supply bulletin after each Bell aggregates **successfully extracted** ore, not simply ore discovered.
- Visible historical chart snapshots must be generated consistently from game events, not random points on every render.

**Convoy mission loop**

```text
CHOOSE CONTRACT → ALLOCATE CARGO/HULL → ACCEPT RISK & ROUTE
      → LAUNCH → NAVIGATE → DEFEND OR EVADE → ARRIVE
      → DELIVERY VERIFIED → SC REWARD & FACTION STANDING
```

**Required fields**

- Shipment ID, origin, destination, material, quantity, cargo weight, reward SC, station tariff SC, travel estimate, risk rating, departure state and deadline or arrival condition.
- Contract SC reward is escrowed or reserved from a finite simulated NPC budget.
- Delivery must only pay once. Failure has bounded penalties, never cosmetic confiscation.

**Marketplace integrity cases**

1. Buy/sell cycles cannot increase SC and token balance for free when fees are included.
2. A posted limit order debits escrow once, fills once and refunds only unfilled amounts.
3. Two updates arriving in the same frame cannot double-complete a convoy.
4. Portal transitions preserve cargo and mission state.
5. Regional scarcity is visible and understandable, not secretly manipulated to encourage purchases.

**Suggested logistics board UI**

| Contract | Route | Cargo | Risk | Reward |
|---|---|---|---|---|
| Coolant Run | Orion → Borealis | Moonstone clamps | Low | SC only |
| Solar Capacitors | Borealis → Helios | Neonite | Medium | SC + reputation |
| Foundry Supply | Helios → Titan | Stardust | High | SC + blueprint chance |
| Archive Specimens | Titan → Umbra | Void Crystal | Very high | SC + story collectible |

Numbers require playtesting; do not hardcode attractive risk-free yield ratios in advance.

### M5 — Cosmetic registry and Skin Showroom

**Prototype collection model**

```json
{
  "collectionId": "founders-fleet-s1",
  "editionCap": 500,
  "issued": 0,
  "items": [
    {
      "skinId": "founders-fleet-s1-0001",
      "serial": 1,
      "hullCompatibility": ["scout_1", "scout_2"],
      "properties": {"paint": "cobalt", "trail": "ion-blue"},
      "affectsStats": false
    }
  ]
}
```

**Tasks**

1. Add skin preview, apply/remove and faction filter inside Shipyard.
2. Add game-only issuance registry with hard edition cap and one-owner-at-a-time rule **within this local prototype**, clearly labeled nontransferable simulation until server-backed.
3. Distinguish `unreleased`, `preview`, `locallyOwned`, `serverVerified` (future), `onChainVerified` (future). Never show "minted" for a preview item.
4. Create four faction-specific palette mockups plus Founders Fleet proof-of-concept.
5. Guarantee cosmetic stats equality by automated test; preview must not overwrite ship ownership, weapons or save.
6. Document licensing, metadata, transfer rules and rarity for a possible *future* NFT program, but do not integrate payments, wallets or mint contracts into v0.14.

**Acceptance:** serial caps cannot be exceeded by the prototype generator, duplicate IDs are rejected, a skin does not modify any combat or economy value, and users can play identically without skins or wallets.

### M6 — Lore chapter zero and archival discoveries

Add **The Broken Relay** as a five-step tutorial story within existing mechanics:

1. Receive an unknown Eidon distress beacon in Orion Belt.
2. Navigate around asteroids to recover a data crystal.
3. Mine enough Moonstone to repair a salvage relay.
4. Speak with a neutral Concord operator and optionally investigate a faction contact.
5. Hear a distorted recording of the *Thirteenth Note* and unlock the future Rift storyline.

**Content artifacts:** 4 introductory radio lines, 6 optional field recordings, 4 faction interpretation messages, 1 Bell preflight message and a glossary panel linking to the lore bible. Add skip/replay and subtitles. Story rewards must be one-time per account/browser save.

### M7 — Balance, documentation and publish

- Validate ore extraction per hour, SC faucet/sink ratio, contracts per session, average time until first craft and Rift extraction success rate.
- Measure desktop/mobile GPU performance, user input errors and gameplay-area coverage.
- Run all unit tests, the current `npm test` suite, and deterministic scenario tests for Rift, logistics, cosmetics and save migration.
- Export root and docs static HTML files identically; confirm relative asset paths work at `/tokenverse/`.
- Update `README.md`, `CHANGELOG.md`, docs and on-screen prototype disclosures.
- Publish one atomic release commit. Verify GitHub Actions tests and GitHub Pages deployment **after** pushing.

---

## 5. Proposed UI layout for v0.14

```text
┌──────────────────────────────────────────────────────────────────┐
│ TOKENVERSE   Faction | Location | Hull/Energy | Next Bell 01:23 │  ← compact
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│               UNOBSTRUCTED GAMEPLAY CANVAS                       │
│          [ships, ore, drones, portals, encounters]              │
│                                                                  │
│   [small radar]                  [Scan][Ops][Nav][Gates][Bell]   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│   [Fire] [Brake] [Boost] [Mine] [Port]           [Menu]          │  ← compact
└──────────────────────────────────────────────────────────────────┘

Only while docked:
  [Market] [Upgrades] [Workshop] [Shipyard] [Dealer]
  [Drones] [Construction] [Exchange & Logistics] [Lore]

Only during Muster/Open Bell:
  [Event details] [Role] [Extraction warning] [Enter/Exit]
```

The game occupies 100% of viewport as a background canvas and **at least 80% remains visually and interactively unobstructed** during ordinary flight. Overlays can temporarily exceed this during docking by explicit player action.

## 6. Engineering data contracts

### Event state (prototype)

```ts
// A design interface, NOT an existing exported type.
type BellRun = {
  bellId: string;               // even UTC opening hour
  startUtcMs: number;
  endUtcMs: number;             // start + 12 minutes
  phase: 'muster'|'open'|'collapsing'|'closed';
  arenaSeed: string;            // deterministic based on bellId + save ID
  enteredAtMs?: number;
  extractedAtMs?: number;
  oneTimeDepositIds: string[];
  claimedRewardKeys: string[];
  oreAcquired: Record<string, number>;
  result?: 'extracted'|'recovered'|'abandoned';
};
```

### Client/server future separation

**Client can own:** rendering, input capture, cosmetics preview, sound playback, tutorial dialogue, local-only practice simulations.  
**Server must own when multiplayer ships:** authoritative position, damage, asteroid depletion, enemy/convoy state, contracts, exchange balances, market orders, item ownership, station module inventory, real countdown synchronization and any real token or NFT linkage.

**Supabase fit:** authentication, PostgreSQL game data, archival event records, item catalog, station ownership, public leaderboards, downloadable logs; add Row Level Security. But Supabase alone is **not** a deterministic tick server for real-time PvP: keep an authoritative WebSocket game service for combat and movement. Use database transactions or RPC functions for ledger settlement.

### Future database concepts

```text
users / profiles
pilots / faction_memberships / reputation_ledger
ships / ship_loadouts / cosmetics_registry / cosmetics_ownership
inventory_balances / raw_ore_lots / material_ledger
stations / station_modules / station_storage
rift_events / rift_instances / rift_loot_ledger
markets / order_books / trade_fills / price_snapshots
shipments / convoy_routes / mission_claims
wallet_links (OPTIONAL FUTURE, separate permission model)
```

**Never trust browser-supplied token balances or unverified client item ownership in the shared game.** RLS is necessary but not sufficient; sensitive game actions must be checked by server-side transactions.

## 7. Automation and test matrix

| Test | Setup | Must pass |
|---|---|---|
| Save migration | v0.13 pilot with owned ship, faction and exchange order | All balances and ownership persist |
| Event boundary | 23:59 UTC then 00:00 UTC | Correct Bell ID and one opening |
| Event reload | Enter, mine, refresh | No duplicated ore; correct remaining time |
| Event collapse | Remain through T+12 | Exactly one extraction/recovery resolution |
| Faction skin | Equip all four visual families | Same hull performance as baseline |
| Cosmetics cap | Attempt serial 501 of 500 | Rejected; no duplicate ownership |
| Exchange escrow | Post buy order, partial fill, cancel | Exact unspent SC returned |
| Convoy contract | Arrive, crash/reload, retry | Reward paid at most once |
| NPC ambush | Cargo under attack | Can defend, evade or recover after loss |
| Large-world route | 48k × 28.8k traversal | No involuntary asteroid collision on standard return route |
| Visual occlusion | Full HD and smaller displays | Radar not behind right-side controls |
| Mobile input | Touch fly, scan, dock, exit Rift | All critical actions reachable without hover |
| Accessibility | Reduced motion, mute, subtitles | All critical warnings still accessible |
| Server boundary | Force browser economy edit | No claim of cross-player or real-value settlement |

## 8. Metrics and balance targets

Suggested first playtest metrics, **not guaranteed outcomes**:

- First ore delivered within 6 minutes for a typical new player.
- First crafted improvement within 20–35 minutes without Rift attendance.
- Rift extraction success high enough to motivate re-entry after failure, without guaranteeing rare loot.
- Ordinary SC spending (repair, services, ship purchases, logistics) meaningfully offsets SC generation; monitor daily net issuance.
- Common Moonstone/Neonite supply supports manufacturing without making rare mineral drops worthless.
- Local event caps and rare material reserve budgets are visible in logs.
- 80% screen visibility measured on representative devices.
- Progression respects both short casual sessions and longer planned Bell runs.

### Example economy invariants

```text
SC_total_after = SC_total_before + earned_SC − spent_SC
rawOre_after = rawOre_before + minedOre + deliveredOre − refinedOre − soldOre
materialTotal = wallet + stationReserve + marketStock + orderEscrow + treasury − burned
cosmeticOwnedIds has no duplicates
riftClaimedRewardKeys has no duplicates
```

For actual on-chain finance, these are only the starting invariants; full transaction-level ledgers, settlement finality and external audit are required.

## 9. Scope cuts if development becomes too large

**Protect the Bell first.** If a feature is late, cut in this order:

1. Full simulated corporate-share market (keep resource exchange and convoy logistics).
2. Elaborate cosmetic serial displays (keep gallery and rarity data).
3. Complex layered lighting (keep recognizable faction silhouettes and readable effects).
4. Multiple Rift minibosses (keep one signature Heart guardian).

Do **not** cut save migration, stable event timings, extraction behavior, accessibility of warnings, ship preservation or testing of currency invariants. These are the backbone of trust.

## 10. Post-v0.14 milestones (not for this commit)

| Planned milestone | Focus | Prerequisites |
|---|---|---|
| v0.15: Convoy Frontiers | More active supply runs, NPC faction raids, trade route events | Stable v0.14 market/logistics |
| v0.16: Rift Seasons | Rotating chamber layouts, lore chapters, non-financial cosmetics | Bell telemetry, balanced drop rates |
| v0.2x: Shared Universe | Real multiplayer factions, parties, shared stations, server-authoritative PvP | Hosted game server + database + account auth |
| Later optional: Token/skin chain bridge | Opt-in verified NFTs and, separately, evaluated crypto material economy | Legal/compliance reviews, audits, custody/wallet policy, secure backend |

## 11. Concrete pull-request breakdown

Ship the work in small reviewable increments rather than one huge HTML rewrite:

1. **PR-01 `test/save-migration-v14`:** versioned save schema + fixtures + no-loss tests.
2. **PR-02 `feat/bell-clock`:** UTC scheduler + countdown chip + local time conversion.
3. **PR-03 `feat/rift-arena`:** arena generation + entry + extraction + one-time ore ledger.
4. **PR-04 `feat/faction-visuals`:** four hull styles + shipyard preview + no-stat tests.
5. **PR-05 `feat/graphics-pass`:** lighting, minerals, hit effects + graphics settings.
6. **PR-06 `feat/logistics`:** regional supply simulation + NPC convoy route board.
7. **PR-07 `feat/cosmetic-collection`:** gallery, serial cap, edition counts, preview only.
8. **PR-08 `feat/eidon-prologue`:** relay mission, lore logs, captions, glossary.
9. **PR-09 `chore/v014-release`:** integration, balance, documentation, Pages deployment.

For every PR, require: deterministic core logic test; minimal UI screenshot at 1920×1080 and 390×844; no local-save regression; clear prototype disclaimers. For releases, confirm all tests and deployment checks are green before announcing a feature live.

## 12. Ownership / decisions still needed

These are **open design decisions**, not blockers to drafting the plan:

- Choose the precise legal/operational jurisdiction and any platform age requirements before real wallet/NFT work.
- Decide whether neutral pilots can opt out of faction membership with reduced benefits.
- Choose exact rare ore quantities after observing real playtest extraction and turnover, rather than hardcoding speculative percentages now.
- Approve final faction ship silhouette sheets and colorblind-friendly emblems.
- Decide whether Bell event time should also offer alternate schedule windows during early testing to accommodate different regions.
- Choose deployment target for the future authoritative WebSocket server and Supabase project, if and when multiplayer development proceeds.

**No decision above changes the definition of the current GitHub Pages game: a playable solo prototype with simulated resources and currencies.**

---

**Companion documents:** `TOKENVERSE_LORE_BIBLE.md` (setting, history, factions, chronology and narrative arcs) and `TOKENVERSE_GAME_DESIGN_DOCUMENT.md` (gameplay, economy, UX, content and balance).