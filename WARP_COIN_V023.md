# Warp Coin v0.23 — Living 2D Galaxy

## Removed

The native WebGL2 3D mode from v0.22 has been **fully removed** from the runnable game. Deleted the 3D renderer scripts, 3D camera code and their tests, and restored the last reliable 2D simulation. The playable root and \`docs/index.html\` serve identical 2D gameplay; there are no orphaned WebGL imports or 3D toggles.

## Better graphics

\`docs/space-visuals.js\` provides richer procedural nebula layers and atmospheric glows, scattered galactic dust, animated parallax starfields, scenic shooting stars, layered ringed planets, refractive ore glints, sharper alien enemy drone silhouettes, and multi-layer glowing engine flames and warp trails.

The original shooting animation system from v0.21 still works. Added small HUD improvements: target lock indicator for the nearest enemy and a growing scanner echo wave. Existing graphic quality settings and reduced-motion preferences are respected. The rendering uses only HTML Canvas 2D and requires no external texture assets.

## New features

**Field Contracts:** \`docs/field-contracts.js\` provides three daily jobs: clear hostile space lanes, mine ore by hand, and survey with the anomaly scanner. Mission objectives and rewards scale modestly with player level. The player can claim each reward exactly once. Missions reset by UTC calendar day. Progress lives in \`S.fieldContracts\` within the existing \`tokenverse-deep-space-v10\` local save. No server or payment needed.

**Shield Pulse:** Press Q or the Shield button. Costs 28 energy, reduces incoming damage by 65% for 6 seconds, with a 32-second cooldown. Shows a glowing aura and status button, stores the active and cooldown timestamps in \`S\`, and works with existing combat damage logic.

**Combat chains:** Sequential enemy kills less than 12 seconds apart build a combo; from the third kill the player gains capped bonus Scrap Credits and XP with an on-screen chain banner. Regular reward drops, damage and skill progression still apply.

## Preserved

All five enormous public systems (192,000 × 115,200 units each) plus the player's home solar system, NPC factions, station commerce, mining, portals, the Warp Drive / Pulse Jump, spaceship customization, Rift encounters, loot and weapon-specific projectiles remain in the game.

The existing save key and \`saveVersion=20\` continue unchanged. Two legacy v0.22 preferences (\`view3D\`, \`cameraZoom\`) are cleaned up on load without disturbing other settings, balances or objects.

## Verification

Run \`npm test\` using Node.js 22+. New v0.23 tests assert absence of WebGL and 3D modules, root/docs parity, pure contract progression and claim integrity, shield damage/cooldowns, combat combo bonuses, 2D Canvas effects and old save migration.

## Privacy and monetary state

Warp Coin remains a local, single-player browser simulation. No Supabase project was accessed, created or connected, and no new blockchain, payment, real NFT or crypto settlement integration was added.
