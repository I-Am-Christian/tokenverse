# Warp Coin v0.22 — Immersive 3D Galaxy

## What changed

A genuine WebGL2 renderer now draws the same game state as a third-person perspective 3D scene, rather than applying a two-dimensional tilt filter. It uses actual triangle meshes, perspective matrices, depth testing, directional lighting and perspective picking. These are generated procedurally and self-contained in \`docs/scene-3d-core.js\` and \`docs/scene-3d.js\`; no external 3D assets or CDN libraries are required.

- **Spacecraft:** a faceted 3D hull, wings, luminous canopy, glowing engine plume and per-ship sizes and paint colors, controlled by the existing ships and upgrades.
- **World:** depthful star points, an illuminated distant ringed gas giant, faceted mineral asteroids, station modules and orbiting rings, standing interstellar gate portals, player outposts, convoy ships, faction patrols, pirates, boss vessels, distinct energy-bolt meshes, particle debris and beacons.
- **Immersive camera:** smoothed third-person chase perspective, zoom with mouse wheel or camera-distance slider, and perspective-projected labels for nearby locations.
- **Controls:** move with W/A/S/D, steer by pointer horizontal placement or Q/R, fire with F or the FIRE button, click the projected space plane to route, use H/J for fast travel. Long-distance Nav chart, existing docking, scanning, mining, economy, and keyboard shortcuts remain available.
- **Toggle and fallback:** use the right-side 3D ON / 2D VIEW button to return to the old full 2D renderer at any time. The game safely falls back to 2D if WebGL2 is not supported or rendering stops working. Graphics quality and reduced-motion accessibility settings are retained.
- **Same single-player simulation:** existing game coordinates, shooting damage, mining, stations, ship inventory, factions, progression, world dimensions (192,000 × 115,200 per public galaxy), and local browser saves are unchanged.

## Implementation boundary

This release changes the rendered view, not the underlying navigation physics: ship movement remains on the established X/Y navigation plane, so the 3D version is **not yet a full six-degrees-of-freedom flight simulator**. A full volumetric rewrite with upward/downward movement, Z-axis collision, 3D autopilot, new AI and save migration would be a separate release. The optional camera distance is saved inside the existing \`S.settings\` object without increasing save version from 20.

## Tests

Run \`npm test\` on Node.js 22+. New v0.22 tests validate:
- Real perspective, matrix and mesh math (ship/asteroid/planet/torus geometry).
- True WebGL2 draw calls using a simulated GPU context, polygon depth and star points.
- Third-person camera projection and click/ray-ground intersection.
- Graceful fallback on unsupported WebGL2 devices.
- Correct root and \`docs/\` game entrypoint parity, all local 3D asset paths, and original save/travel/combat invariants.

## Data separation

No new accounts, servers, databases, cryptocurrency, NFTs or multiplayer network integrations were added. No Supabase connection was used. Any future Warp Coin backend must be a newly created, isolated project and not reuse the user's Hello Earth / Atlas AI Supabase database.
