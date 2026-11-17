# Tokenverse v0.12 — Frontier Industries

**Browser game:** https://i-am-christian.github.io/tokenverse/

This release expands the existing v0.11 game. It retains the **full-screen flight view**, the large 24,000 × 14,400 map, **36 ships**, seven previous weapons, collision-avoiding autopilot, four directional portals, **five connected star systems**, and the controlled material-token economy. The UI remains compact while flying: the new systems open only when needed through the Scan and Ops controls or the station console.

## Features

### Blueprints and customized weapons
- Discover blueprint fragments while scanning and salvaging, defeating each system's mothership, or purchasing small fragment quantities for Scrap Credits.
- Research weapon blueprints before crafting them. Previously crafted weapons stay available, including on older saves.
- Two additional weapons: **Ion Harpoon** and **Flak Array**. Nine gun types total.
- Install one weapon modifier: Rapid Capacitor (faster shooting), Focusing Lens (greater damage), or Energy Recycler (reduced energy cost).

### Modular player outposts
- Deploy up to **two locally owned outposts per star system** in deep space, for **170 SC + 8 Moonstone ore + 3 Neonite ore**. Protected ports and existing stations have construction clearance zones.
- Dock at your outpost and build upgrades for: **Refinery** (lower material-refining fees), **Storage** (persistent ore deposits), **Hangar** (cheaper hull repairs), and **Defenses** (turrets firing on hostile NPCs).
- Outposts and their modules are saved in the local browser save. They are not synchronized across players in this GitHub Pages build.

### PvE mothership bosses
- One distinct large alien mothership per connected star system, with tiered health, attack patterns, multi-shot volleys and hull bars.
- Defeating a boss grants **SC, blueprint fragments and small salvage rewards**. The system boss has a **24-hour local respawn cooldown** to limit reward farming.
- Boss damage and cooldowns persist in the local save.

### Scanning and exploration
- Pulse scanner reveals nearby **rare ore, salvage, anomalies, wrecks, and bosses**, with temporary clickable markers.
- Discoveries can be claimed once per site per saved pilot and award SC/blueprint fragments, sometimes a small raw-ore bonus.
- Upgrade scanner radius at a station up to Mk-4.

### Mining and combat drones
- Craft **one mining drone** and **one escort drone** at a station, then deploy or recall them through Ops.
- Mining drones recover raw ore slowly, limited by ship cargo space; they never mint crypto tokens.
- Escort drones fire at nearby hostile NPCs and bosses. Each drone has three upgrade tiers.

### Simulated material-token exchange
- Dedicated station-only Token Exchange tab with quoted SC bid/ask prices for $MOON, $NEON, $DUST, $VOID, and $DIAM.
- Limited market-maker inventories, trading fees and spreads; **no infinite or unbacked market buy availability**.
- Post up to eight buy/sell **limit orders** in a local simulated order book. Assets are escrowed on order placement and refunded on cancellation; orders fill only when the local simulated market price crosses the limit.
- Tokens spent on existing ship upgrades, guns, and other token-based recipes still return to the **recycled token reward reserve** rather than being destroyed.

## Preserved gameplay
- Flight remains mouse-aimed with zero-gravity thrust and optional stabilizers.
- Obstacle-aware return-to-port and mining route planning.
- Four portals connect five star systems; region difficulty still varies by enemy tier.
- 36 ships in the dealership (including 30 purchasable SC ships).
- Scrap Credits (SC) are distinct from the five material tokens and pay for ordinary services.

## Platform and security limitations

This GitHub Pages build is a **single-player local prototype**. The token exchange is a simulation, not a real order book, a blockchain, a wallet, or a cryptocurrency market. SC and material tokens have no real-money value or withdrawal support. Bosses, stations, drones, market prices, and pilot data are local to each browser save and can be manipulated by the browser's owner.

To enable actual shared PvP, player-to-player markets, real token custody, and persistent stations, Tokenverse needs a deployed authoritative game server, account security, an audited transaction ledger, and a separate Supabase-backed database. GitHub Pages alone cannot provide this safely.