# Warp Coin v0.25 — Galactic Armada

**Play:** https://i-am-christian.github.io/tokenverse/ (after merge and GitHub Pages publication).

Warp Coin now has a **zoomable 2D camera**, **four substantially bigger capital ships**, **living AI traffic with civilian and hostile bots**, plus **five additional craftable weapon types**. Every large galaxy, old ship, currency, faction, mine, station, Warp Drive route, Rift mission and save continues to work.

### Camera zoom

The **− / + / 1:1** controls in the left ship telemetry panel, the **mouse wheel over the game field**, or keyboard **− / + / 0** zoom the whole 2D world between **36% and 240%**. At 36%, roughly 2.8× more map width is visible than at 100%. Click-to-fly, asteroid mining, stations, gates and floating salvage keep targeting the correct **world position** at all zoom levels. The minimap and fixed UI remain normal size. Zoom preference is kept in the local pilot save.

### New capital ships

Four late-game hangar hulls—**Orion Starcarrier**, **Aegis Battlecruiser**, **Exodus Star Ark** and **Titan Fleet Fortress**—have enlarged silhouettes, side decks and visible weapons, **365–720 hull**, significantly enlarged cargo holds and appropriately slower handling. The original Leviathan, Titan Freighter and Colossus Drill also now look substantially bigger. Open **Dock Console → Hangar → Capital ships** to browse and buy them using in-game Scrap Credits and material tokens.

### More space activity and bots

The game generates a bounded local population of nearby **merchants, miners, freighters, escort ships and outlaw raiders**. Ships move independently and security escorts attack outlaws. Outlaws can fire on you outside protected zones and leave salvage when defeated. Click NPC ships to hail them: buy repairs, Neonite ore, energy refills or a temporary security escort with in-game Scrap Credits. You can also browse the nearest ships in the new **Fleets** console. Background probes, broken satellites, drifting debris and crystal clusters make routes more visually interesting without bloating save files. Reduced graphics mode spawns fewer ships.

### Extended gun arsenal

Craft at stations: **Vulcan Autocannon** (rapid-fire kinetic), **Flak Barrage** (six-pellet spread), **Prism Twin-Laser** (fast twin bolt), **Ion Storm Projector** (three electric arcs) and **Stellar Seeker Torpedo** (slow guided explosive with small splash). They have distinct visual effects, damage, rates, speed and materials. Existing weapons, upgrades, damage multipliers and Rift shooting are preserved.

**Controls:** W/A/S/D to fly, F fire, Q Shield Pulse, Z Dash, H Warp Drive, J Pulse Jump, V collect salvage route, **−/+** or mouse wheel to zoom, **0** reset zoom. Click a bot to hail or track it. The game remains fully 2D; no WebGL3D or Supabase connected.

[Detailed notes for v0.25](WARP_COIN_V025.md)

---

# Warp Coin v0.24 — Salvage Wars

**Play:** https://i-am-christian.github.io/tokenverse/ (after merging to the main branch and GitHub Pages publishing).

### New features

- **Recoverable enemy salvage** — defeated drones, pirates, rival patrols and boss ships leave glowing collectible pods. Fly within 82 units to recover Scrap Credits, ore, or occasionally blueprint fragments. Ore waits if your hold is full. Pods expire after a few minutes to keep the galaxy fast. The **◇ Salvage** button or **V** plots a safe route to the nearest drop, and you can click directly on a pod. The HUD shows how many pods are nearby, and your lifetime collected-pod count is saved.
- **Evasive Dash** — press **Z** or use **↯ Dash** for a brief 400-unit/s velocity burst. Costs 22 energy, lasts 650 milliseconds, and recharges for 13.5 seconds. The dash checks the forward corridor, respects normal asteroid collision and restricted/safe zones, cancels autopilot, and generates fading ship afterimages. No teleporting through hazards.
- **Smarter enemy pilots** — pirates and advanced drones now strafe and circle rather than flying directly into you. Their shots can lead moving targets a little, while beginner drones remain easier. Existing damage and enemy rewards remain unchanged; drops provide extra small pickups.
- **Visual polish and discoverability** — neon salvage crates, rarity-specific colors, animated pickup flashes, temporary bonus labels, on-screen loot count, dash trails and ability cooldowns. All built for the existing Canvas 2D renderer with the 2D map, faction economy, sound and Warp Drive intact.

**Controls:** W/A/S/D fly, hold **F** to shoot, **Q** Shield Pulse, **Z** Evasive Dash, **V** nearest Salvage, **H** Warp Drive, **J** Pulse Jump, and **M** nearest ore. Existing mouse/touch firing, navigation and mining controls still work.

**Compatibility and data:** Your 192,000 × 115,200 world, five public star systems, personal solar system, ship inventory, credits, tokens, factions, daily contracts and local save remain. Salvage crates are temporary world objects (not saved between sessions); recovered rewards and lifetime salvage total are saved to the existing local pilot profile. No Supabase project or account was connected.

[Full v0.24 release notes](WARP_COIN_V024.md)

---

# Warp Coin v0.23 — Living 2D Galaxy

**Play:** https://i-am-christian.github.io/tokenverse/

Warp Coin is back to a **beautiful 2D space game**. The native WebGL2 3D renderer, 3D canvas, camera controls, 3D assets and 3D mode switches have been removed. Both the root game entry and `docs/index.html` now load the same 2D-only build.

### What's new

- **Visuals overhauled:** richer system-specific nebulae and atmospheric light, multilayer parallax stars, subtle scenic shooting stars, better ringed planets, crystalline mineral glints, more elaborate pirate drone ships and multiple glowing engine plumes. All procedural; no image downloads or dependencies. Quality and reduced-motion settings are respected.
- **Daily Field Contracts:** open **Contracts** on the right console to see repeatable NPC bounty, mining and scanning missions. Claim Scrap Credits and XP when completed. Each contract refreshes once per UTC day; progress and claimed rewards are stored in your existing local save.
- **Shield Pulse:** press **Q** or use the **Shield** button to consume 28 energy and reduce incoming damage by 65% for 6 seconds, with a 32-second cooldown. A glowing shield ring and ability countdown provide clear feedback.
- **Combat chains:** consecutive enemy kills within 12 seconds build a chain; 3+ consecutive kills award a limited extra Scrap Credits and XP bonus.
- **Tactical HUD:** subtle nearest-hostile targeting ring and a new expanding scanner wave on Scan. Existing weapon-specific projectiles, damage feedback, sounds, warp effects and portable save remain intact.

**Controls:** W/A/S/D to fly, point with mouse, hold **F** or **FIRE** to shoot, **Q** for Shield Pulse, **H** for Warp Drive, **J** for Pulse Jump. The galaxy chart remains usable for click-to-plot routes.

**Preserved:** 192,000 × 115,200 world units per system, factions, ships, inventories, solo economy, mining, Rift events, Warp Drive, weapon upgrades and local browser saves. **No Supabase database connected or changed.**

[Detailed release notes](WARP_COIN_V023.md)

---

# Warp Coin v0.21 — Weapons Reforged

**Play:** https://i-am-christian.github.io/tokenverse/ (new version appears after the main branch deploys).

**New weapon animations:** Bright muzzle flashes, different projectiles for pulse, scatter, railgun, plasma, diamond, arc/ion, flak, and siege weapons; ballistic tracers, plasma glows, electrical arcs, laser streaks, impact rings and larger elimination shockwaves. Also added hit popups, boss and faction impacts, **hold F** to auto-fire, and a touch-friendly **FIRE** button (press and hold). Inside peaceful protected stations, shooting generates a harmless holographic preview instead of dealing damage. Rift weapons receive the same graphics treatment. Original procedural sounds now vary by weapon. [See v0.21 release notes](WARP_COIN_V021.md).

The huge **192,000 × 115,200** world, ships, upgrades, game economy, saved progress, Warp Drive, trading and discoveries are preserved. The game remains a local single-player simulation; **no Supabase project was connected**. The future backend must use a completely separate new Supabase project, not Hello Earth.

---

# Warp Coin v0.20 — Hyperdrive & Living Galaxy

**Play the game:** https://i-am-christian.github.io/tokenverse/

**Deployment fix:** Both the repository root `index.html` and the `docs/index.html` version now contain the **same latest gameplay code** and load all six required scripts using correct relative paths. The previous GitHub Pages root had remained at v0.16.

**New controls:** Tap **Warp Drive** for a plotted course, or click the Navigation chart to select any position; then Warp Drive's clear-corridor cruise engages automatically. Press **J** / **Pulse Jump** or click Warp Drive again to hop along safe autopilot waypoints (28 energy, nine-second cooldown). **H** opens/engages Warp Drive. The 192,000 × 115,200 map size is unchanged.

**Visuals/audio:** Procedural parallax starfields, system-coloured nebula clouds, distant ringed planets, more detailed mineral asteroids, improved ship exhaust and warp streaks. Click **Sound OFF** in the right-side control rail to opt in to an original procedural ambient space soundscape plus effects for lasers, scans, alerts, warp and rewards. Volume is adjustable in the Twelve Bells settings; reduced-motion setting remains available.

**No Supabase was accessed or modified.** This is still a browser-local solo game. Any multiplayer backend will use a brand-new, separate Supabase project, never the Hello Earth / Atlas AI database.

[Release notes for v0.20](WARP_COIN_V020.md)

---

# Warp Coin v0.19 — The Living Frontier

**Play:** https://i-am-christian.github.io/tokenverse/ (updates after the v0.19 branch is merged and GitHub Pages deploys).

The unchanged **192,000 × 115,200** worlds now feature optional roaming frontier encounters as you travel: **salvage drifting vessels**, **answer distress transmissions**, **fight pirate ambushes**, and **discover rare Eidon caches**. Open the new **Signals** panel to plot the event marker, investigate or ignore it. Events are local-only with one-time SC, XP, ore and research rewards; pirate raids use the existing ship combat system. [Read release notes](WARP_COIN_V019.md).

**No Supabase connection**: The browser remains solo with local saves. A completely separate, new Supabase project will be used for Tokenverse later; the Hello Earth / Atlas AI database remains untouched.

---

# Warp Coin v0.18 — Pulse & Cruise (development build)

**Public game:** https://i-am-christian.github.io/tokenverse/ (the published site updates when this branch merges)

The world remains **192,000 × 115,200 units per public system**. Safe long-range autopilot routes now engage **Warp Cruise**, while asteroid fields, combat zones and docking approaches retain precise low-speed handling. Press **J** or use the **Pulse Jump** button to jump up to **8,500 units** along a verified clear corridor (28 energy, 9-second cooldown). New public systems and four Outer Meridian stations also give one-time local exploration bonuses. [Read the v0.18 details](WARP_COIN_V018.md).

**Database:** Tokenverse will use its own *new* Supabase project later. No existing Supabase project is connected or touched. All market balances, rewards and progress in the browser remain local simulated game data.

---

# Warp Coin v0.17 — Trade Route Intelligence (review build)

**Existing playable game:** https://i-am-christian.github.io/tokenverse/ (currently v0.16 until this branch merges).

This proposed update adds a **Trade Route Scanner** to the Economy drawer: evaluate local market price spreads between five public star systems, account for ship cargo capacity and available Scrap Credits, and plot a persistent multi-gate route toward the destination. The route remembers its target in the existing local browser save. See [v0.17 release notes](WARP_COIN_V017.md).

**Backend separation:** No Supabase connection is used. When multiplayer accounts are introduced, Warp Coin / Tokenverse will use a **new, independent Supabase project**. Hello Earth's database is not shared with the game. All credits and token prices in this browser prototype are simulated; real deposits, NFTs and withdrawals remain disabled.

---

# Warp Coin v0.16 — The Outer Meridian

**Play the updated game:** https://i-am-christian.github.io/tokenverse/

The five public maps are now **192,000 × 115,200 units each**, with four neutral Outer Meridian trade stations, outer mining belts, dangerous drone encounters and a larger interactive navigation chart. Use **Navigation** to plot a route or dock at a station and jump to a Meridian hub for **85 SC**.

Custom player-owned solar systems, four factions, Eidon lore, twelve daily Rift events, ships, production facilities and local economy are retained. Save migration from v0.15 runs exactly once. [Release notes](WARP_COIN_V016.md) · [Separate Supabase setup guide](WARP_COIN_SUPABASE_SETUP.md).

**Important:** All gameplay and balances remain local and simulated. Supabase email accounts, chat, real-money deposits, and shared multiplayer have not yet been activated. The connected **Hello Earth DB** is unrelated and remains unchanged.

---


# Tokenverse v0.14 — The Twelve Bells

**Play in your browser:** https://i-am-christian.github.io/tokenverse/

The **Eidon Chronicles** has arrived in the solo browser prototype: a twelve-times-daily local Heart Chamber event, faction-specific ship silhouettes, more grounded Canvas effects, regional ore exchange, cross-system cargo deliveries, cosmetic ship skins and the Chapter Zero lore mission. [Read the v0.14 release notes](TWELVE_BELLS_V014.md) and the [complete narrative/game-design archive](docs/design/README.md).

The existing 48,000 × 28,800 worlds, five connected systems, four factions, 36 ships, weapons, drones, bases and markets remain. Older pilot saves are migrated in place.

**Important:** GitHub Pages is a local solo simulation: no shared PvP, real NFTs, crypto withdrawals, or genuine global scarcity. All material token prices, collections and SC rewards are for gameplay only.

---

# Tokenverse v0.13 — Faction Frontiers

## Universe design archive — lore and v0.14 planning

**New planning documents (18 November 2026):** [The Eidon Chronicles lore bible](docs/design/TOKENVERSE_LORE_BIBLE.md), [game design document](docs/design/TOKENVERSE_GAME_DESIGN_DOCUMENT.md), and [v0.14 The Twelve Bells implementation roadmap](docs/design/TOKENVERSE_V014_IMPLEMENTATION_ROADMAP.md). These describe **proposed** lore and future gameplay. The current GitHub Pages build remains the v0.13 solo prototype; real NFTs, shared PvP and crypto settlement are not deployed.


**Play directly in your browser:** https://i-am-christian.github.io/tokenverse/

Choose one of four factions, establish a home base in a separate territory, earn reputation through repeatable contracts, and explore a **48,000 × 28,800** universe (four times the previous area). Each faction has protected stations and patrols; the neutral Disputed Rift has dense rare ore. The existing 36-ship dealer, crafting, markets, scanner, drones, bosses, modular player outposts and five connected star systems remain.

[Read v0.13 release notes](FACTION_FRONTIERS_V013.md).

**This GitHub Pages build is a solo browser simulation.** Faction rivals are NPCs; shared PvP, player-owned territory, crypto wallet transfers and real token trading are not active.

---

# Tokenverse v0.12 — Frontier Industries

**Play the browser game:** https://i-am-christian.github.io/tokenverse/

This update adds blueprint research, two more craftable weapons, weapon modifiers, modular outposts, scanning, mining and combat drones, five alien mothership bosses, and a simulated material-token exchange with limit orders. It keeps the fullscreen game, 36 ships, and five linked star systems. [Read the release notes](FRONTIER_INDUSTRIES_V012.md).

**GitHub Pages mode is local single-player.** Material tokens and SC are simulated game balances, not real crypto. The browser version cannot run a real multiplayer exchange or provide withdrawals.

---

# Tokenverse v0.11 — Fleet & Gateways

**Play in the browser:** https://i-am-christian.github.io/tokenverse/

The newest GitHub Pages release features safer obstacle-aware flight, four star gates, five connected systems, 30 additional ships, Scrap Credits for repairs, and slower controlled mining. The large v0.10 galaxy and advanced weapon systems remain. [Read v0.11 release notes](GATEWAYS_AND_FLEET_V011.md).

**Note:** Browser mode is still solo. No real cryptocurrency or cash withdrawals are available.

---

## Tokenverse v0.10 — Deep Space Expansion

**Play:** https://i-am-christian.github.io/tokenverse/

The browser game is now 10× larger by area (24,000 × 14,400), all regions are accessible, and manual movement cancels mouse-navigation autopilot. Distant regions contain denser high-value ore and stronger tiered enemies. At stations, pilots can enhance gun damage (+20% per level), fabricate seven weapons, and buy or deploy six ship classes with distinct statistics. The local test pilot receives a one-time grant of at least 50,000 simulated JUNK, 50 of each ore and 50 of each material token, plus test cargo capacity.

Read the [full release notes](DEEP_SPACE_RELEASE_NOTES.md).

**Note:** GitHub Pages still hosts a solo browser test sector, not synchronized PvP multiplayer or real cryptocurrency. Real assets and withdrawals are not enabled.

---

## Tokenverse Pilot Command — v0.9

**Play in your browser:** https://i-am-christian.github.io/tokenverse/

The GitHub Pages build has a new fullscreen, spacecraft-inspired pilot cockpit with compact telemetry, holographic instrument buttons, hidden ledger/cargo/navigation/comms menus, and a dock-only upgrade, crafting and ship customisation console. Mouse click-to-move and its visible destination marker are retained. See [release notes](PILOT_COMMAND_RELEASE_NOTES.md).

**Current scope:** This browser-hosted build is single-player, uses local browser saves and simulated material tokens. Shared multiplayer, PvP with other humans, and real cryptocurrency remain unconnected to GitHub Pages.

---

## Tokenverse v0.5 — Galactic Expansion

Play: https://i-am-christian.github.io/tokenverse/

New: original synthesized sound effects, working dock upgrades and stable button interaction, Full HD mission-control layout, 7,200×4,800 galaxy, gated high-tier PvE sectors, and a diamond-rich contested solo zone with simulated $DIAM. See [release notes](RELEASE_NOTES.md). **This GitHub Pages version is single-player; real multiplayer/PvP and on-chain tokens are not active.**

---

# TOKENVERSE — Browser Flight Update v0.4

**Play in your browser:** https://i-am-christian.github.io/tokenverse/

The GitHub Pages build is a self-contained, playable **solo test sector**. No installation, game server, or wallet connection is required. Your simulated resources and upgrades are saved in this browser under the existing `tokenverse-pages-v1` save key, retaining earlier progress.

## New in v0.4

- **Zero-gravity inertia:** The ship accelerates under engine thrust and continues drifting without drag after releasing thrust. Active braking and an optional Flight Assist switch help pilots stabilize.
- **Mouse aiming + click-to-navigate:** Face the cursor, click empty space for physics-based autopilot, click a mineral asteroid to mine it, or click the port or a space station to dock. The autopilot uses reverse thrust to slow for arrival.
- **Ship combat and hazards:** Fight solo rogue-drone enemies, fire blasters, dodge their projectiles, collide with asteroids, collect wreck salvage and repair damaged hulls.
- **Polished visuals:** Animated engine plumes, particle trails, laser effects, nebula parallax, station and port graphics, screen shake and a tactical minimap.
- **Progression:** Repeatable mining, refinement and combat contracts grant simulated $JUNK credits and experience.
- **Economy:** Four simulated material tokens, simulated token exchange, uncapped controlled $MOON/$NEON issuance and recycled upgrade/station token costs, with $DUST and $VOID limited by available reserves.
- **Mobile:** Touch-to-navigate, directional thrust, boost, brake and fire buttons.

### Browser controls

| Input | Action |
|---|---|
| Move mouse over playfield | Aim the ship |
| Click empty space | Set an autopilot waypoint |
| Click asteroid | Fly to it and mine automatically |
| Click port or your outpost | Autopilot and dock |
| W / S | Forward / reverse thrust in facing direction |
| A / D | Lateral maneuvering thrusters |
| Shift | Boost (consumes energy) |
| Space | Active braking thrust |
| F | Fire weapon (disabled inside port safety zone) |
| Right-click on the game | Fire weapon |
| M | Mine nearest asteroid |
| Escape | Cancel autopilot |
| Flight assist toggle | Apply stabilizing thrust when controls are released |

**Important:** The GitHub Pages version is not shared multiplayer. GitHub Pages serves static files only; the existing Node/WebSocket multiplayer code remains in `server.js` and `public/`, but it must be hosted separately and connected to the browser client for live shared PvP, chat, player stations, and authoritative trading. The solo economy is not a secure ledger, cryptocurrency, or withdrawal service.

---

## Play immediately on GitHub Pages (solo mode)

The static browser sandbox lives in `docs/index.html`. After enabling **Settings → Pages → Deploy from a branch → main /docs**, the website will be `https://i-am-christian.github.io/tokenverse/`. This version saves locally in the player's browser, supports spaceflight, asteroid mining, refining, ship upgrades, token recycling and station construction. **It is NOT multiplayer**: GitHub Pages cannot host the WebSocket game server, persistent shared stations or authenticated real-crypto balances. The existing Node server remains available for later deployment behind a separate hosting service or Supabase-backed architecture.

## Revised economy

Ship upgrades, station construction and fortification, and warp now return spent tokens to the refinement reward reserve. $MOON and $NEON no longer have a maximum supply in the prototype: controlled new issuance occurs only when their recycled reward reserve is insufficient, with the original per-day and per-player reward caps. $DUST and $VOID remain capped. Marketplace fees still burn tokens. See `ECONOMY.md`.

> **Website proposal:** `tokenverse.online` (availability and ownership not confirmed). This prototype is not deployed yet.

# TOKENVERSE — The Tokenized Frontier (Multiplayer Alpha 0.2)

A real-time multiplayer browser game with asteroid mining, PvP ship combat, player-built space stations and **four separate simulated material tokens**. The client and shared game server are in the same project. **No real cryptocurrency, wallets, NFT transfers or cash withdrawals are implemented.**

## Play on your own computer

Install **Node.js 20 or newer**. Then unzip this folder and open a terminal inside `tokenverse`:

```sh
npm start
```

Visit **http://localhost:3000**. Enter a pilot name and begin exploring. The project includes a minimal WebSocket fallback, so `npm start` works without installing third-party packages. For a preferred production-ready WebSocket library, run `npm install` before `npm start` to install the optional `ws` package (normal internet access required). The fallback is designed for demonstration, not an audited production stack.

On Windows you can double-click `start-windows.bat` if Node is already installed. On Mac/Linux run `sh start-mac-linux.sh`.

### Try the multiplayer features

Open the website in **two different browser profiles** or one normal and one private/incognito window. Different tabs in the same profile deliberately share a guest pilot key, so the latest tab signs the previous one out.

- **WASD / arrow keys:** Pilot ship. Mobile: on-screen directional pad.
- **Click/tap an asteroid** or select **MINE NEAREST:** Autopilot to a rock, mine it automatically. The server decides what resources you receive.
- **Return to the glowing central port:** Safe area; trade, refine and upgrade. Click **FIND PORT** for port autopilot.
- **SPACE / FIRE:** Shoot other ships outside the safe zone. Click a rival ship first for targeting. Hull damage and projectiles are server-calculated.
- **Build a station:** Be outside the central ring, holding 10 Moonstone ore, 4 Neonite ore, 1 Stardust ore, 2 $MOON and 160 $JUNK. Maximum 2 per pilot.
- **Station services:** Dock beside your own station to deposit/withdraw ore, repair, and fortify it. Neonite ore stored there fuels automatic defensive shots. Offline station owners are protected from raids.
- **Player-to-player marketplace:** Post raw ore in escrow for a chosen material token; other pilots can buy the listings while docked. A 2% fee (rounded down) is burned.
- **Emergency warp:** Burn 1 $VOID to warp to a player-owned outpost, subject to a cooldown and combat restriction.
- **Sector chat and leaderboard:** Shared with everyone on the server.

**PvP loss rule:** On defeat, a player respawns at the port. Twenty-five percent of raw cargo is dropped as salvage. The player's material tokens and $JUNK are **never** taken on a kill. The central port has a protected area and respawn grants a short shield.

## File structure

```
tokenverse/
  server.js                 Shared authoritative Node HTTP + WebSocket server
  miniws.js                 Dependency-free fallback WebSocket protocol server
  public/
    index.html              Responsive game website
    style.css               Game UI styles
    client.js               Canvas world, inputs, HUD and socket client
    favicon.svg
  data/                     Local saves (created automatically, ignored by Git)
  ECONOMY.md                Economy limits, pricing and suggested next steps
  README.md
  render.yaml               Example deployment config
  start-windows.bat
  start-mac-linux.sh
  package.json
```

## Publish the game so friends can join online

**GitHub Pages alone cannot run this multiplayer server.** You need a persistent Node web service with WebSocket support.

1. Create a **new GitHub repository** for Tokenverse (do not mix it with any other application's confidential data). See `PUBLISH_GITHUB.md` or run `publish-github-windows.bat` for a guided private-repository upload.
2. Push the contents of this folder to that repository.
3. Create a **Render Web Service** connected to the repository, using `npm install` to build and `npm start` to run; the included `render.yaml` is a starting blueprint.
4. Render allocates a `PORT` environment variable; this server binds to `0.0.0.0` on it. WebSockets run on the same public URL as the website.
5. Share the Render public HTTPS link with friends. They will join the **same** multiplayer sector; you don't need a second URL for the socket.
6. **Important persistence warning:** on a free or otherwise ephemeral server, `data/world.json` may be lost when the service restarts/redeploys. For genuine online play, use a persistent disk mounted through `DATA_DIR`, or (better) migrate accounts/stations/trades/markets to PostgreSQL (e.g. a separate Supabase project). Use one game server instance until shared persistence and coordination are implemented.

Render's Web Service and WebSocket docs: https://render.com/docs/web-services and https://render.com/docs/websocket

## Safety and production limitations

- All tokens, credits and balances are **simulated**. Prices are denominated in simulated $JUNK only; neither USD prices nor token redeemability exist.
- Guest identities are based on a random browser key. This is **not** secure identity verification and must **never** protect real assets.
- One Node process and a local JSON file provide prototype persistence. Not ready for many servers or large concurrent worlds; the design currently caps at 80 connected players.
- The server verifies movement, combat, inventory, trades, crafting and issuance. This reduces obvious browser-side save editing but **does not** prevent macros, bot farms, account farming or all exploits.
- Production needs database transactions, authentication, request/connection rate limiting, moderation, analytics, testing, abuse prevention, robust error monitoring and authoritative audit logs.
- Do not publish real crypto contracts, promise returns, or allow withdrawals until the economics, smart contracts, custody design and applicable legal requirements have been reviewed.

## Tests

Run `npm test` with Node.js **22+** to run the included multiplayer integration test. (The game itself also starts on Node.js 20.)

## Optional settings

- `PORT`: HTTP/WebSocket port (default `3000`)
- `DATA_DIR`: directory for local `world.json` (default `./data`)

All credits, tokens, prices and gameplay parameters in this project are **illustrative alpha settings** subject to tuning and balancing.