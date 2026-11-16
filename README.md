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