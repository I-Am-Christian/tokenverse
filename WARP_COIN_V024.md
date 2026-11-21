# Warp Coin v0.24 — Salvage Wars

## Collectible enemy wreckage

Defeated NPC drones, raiders, hostile faction patrols and bosses leave floating salvage pods. Each kill generates one temporary pod that can contain:
- Scrap Credits for general upgrades and market purchases
- A small sample of mineral ore, scaled by defeated NPC tier
- Rare blueprint fragments, guaranteed for bosses

Pods have distinct gold/green/purple colors and emit a glowing, animated icon. Fly within 82 units of a pod to collect it. If your cargo hold is full, mineral pods stay in the field rather than overflowing your hold. Non-mineral pod rewards do not need cargo space.

The **Salvage** action bar button or **V** plots a route to the nearest pod; you can click/tap a pod in the 2D galaxy to plot a route directly. Floating drops expire after roughly 165 seconds (240 seconds for bosses) and are capped at 48 active pods. This prevents an ever-growing world state. Only the recovered reward and cumulative pickup count are saved, so changing star systems or refreshing clears any uncollected pods.

## New Evasive Dash

The **Dash** action bar button or **Z** applies a short velocity impulse along the ship's facing direction, with no positional teleport. Costs 22 energy, has a 13.5 second cooldown, and a brief 650 millisecond enhanced speed window. Includes glowing afterimages and engine particles.

The system checks a safe forward corridor before firing. Dashes cannot be used inside protected ports or the Heart Chamber and do not bypass regular asteroid collisions or faction restrictions. Using Dash cancels autopilot and mining approach; the ship then continues under normal controls.

## Improved opponent flight

Pirate drones now circle and strafe at combat distances, adjust their preferred range, and lead the player's velocity for a modest improvement in aiming. Advanced tier enemies also maneuver more than tier-one NPCs. Their existing HP, weapon damage, faction status and reward payouts remain unchanged; salvage is a small additional reward for active players.

## In-game UI

Added an explicit nearby-loot counter, salvage locator, dash cooldown, blue/purple dash trail, loot pod reward popups, and clearer sound cues when picking up drops. The HUD is still the familiar 2D canvas.

## Save and environment

No changes to the existing save key \`tokenverse-deep-space-v10\`, original saved data schema version \`saveVersion=20\` or map dimensions (192,000 × 115,200 in public systems). The only additional saved values are dash cooldown state and the lifetime count \`S.stats.salvaged\`. Active loot pods themselves are not saved.

This release does **not** connect to Supabase, Web3 services, payment APIs, or real user accounts. It remains a local single-player economy simulation.

## Tests

\`npm test\` on Node 22+ exercises module-level drop type generation, one-time collection and cargo limits, boss loot, finite loot lifetimes, pirate strafing and lead aiming, safe corridor dash and cooldown, root/docs gameplay parity, and old save compatibility. All older gameplay regressions remain in the same CI suite.
