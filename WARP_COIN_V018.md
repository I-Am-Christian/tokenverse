# Warp Coin v0.18 — Pulse & Cruise

This update preserves the v0.16 **192,000 × 115,200** world in each of the five public systems, plus player-owned solar systems. It is additive to the v0.17 trade route scanner.

## How travel feels

- **Warp Cruise:** when long-distance autopilot is engaged, flight automatically accelerates to approximately **3,600–8,200 units/s** (ship and thruster dependent), versus the previous ~220–245 units/s autopilot cap. High-speed travel only engages when a corridor has a clear asteroid segment and no nearby drones or stations. The ship returns to ordinary precise controls for mining, docking, combat, and waypoint arrival.
- **Pulse Jump:** press **J** or click/tap the new button on the flight bar. The ship instantly crosses up to **8,500 world units**, leaving at least **650** to its current waypoint. Costs **28 energy** and has a **9-second cooldown**; a line-segment safety check blocks paths with asteroids, drones, stations or inaccessible regions. It does not operate in the Heart Chamber, and no instant remote trading or docking is possible.
- **Visual and interface feedback:** a small Warp Cruise indicator in telemetry, a pulse button that becomes available when a route is plotted, subtle high-speed streaks (respecting reduced-motion setting), navigation-chart explanation.
- **Exploration rewards:** first visit to each new public star system earns **90 simulated SC + 18 XP**. First docking at each Outer Meridian station earns **45 SC + 12 XP**. Discoveries are locally saved and can only be claimed once per system/station.
- Existing personal solar systems, saved coordinates, material tokens, faction allegiance, crafted ships and structures are preserved by **saveVersion 18**, with the same local save key and **worldScaleVersion 4**.

## How to play

1. Plot a long station or waypoint route. Far from hazards the ship automatically engages Warp Cruise.
2. Press **J** for Pulse Jump when you want an extra leap; it is automatically blocked when the corridor isn't safe.
3. Near mining targets and station ports, autopilot returns to normal lower speeds for precise maneuvering.
4. Explore a different star system or discover a new Meridian station to earn a one-time navigation bonus.

## Test and rollout

Run `npm test` on Node 22+. New pure-helper tests and runtime smoke tests cover cruise eligibility, speed caps, pulse range, obstacle safety, cooldown, and one-time exploration rewards. Follow up with browser/phone tests before declaring live deployment complete.

**No Supabase connector was called.** Tokenverse will eventually use a new game-only Supabase project; the existing Hello Earth / Atlas AI database remains separate. No real crypto funds, withdrawals, NFTs or shared player economy have been enabled.
