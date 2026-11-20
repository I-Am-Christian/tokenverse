# Warp Coin v0.21 — Weapons Reforged

## Graphics and firing

- **New procedural projectile renderer** in \`docs/combat-fx.js\`. Weapon types now look different: cyan pulse lances, amber spread pellets, sharp green-white rail tracers, purple plasma spheres, crystalline diamond bolts, jagged teal arc electricity, wide magenta siege shells and other weapon-specific colors. NPC projectiles remain visually distinct.
- **Muzzle flashes, fading projectile trails, localized hit ripples and victory shockwaves** render over the existing galaxy backdrop. Larger elimination hits display a DESTROYED popup. Bosses and faction patrols trigger impact effects too.
- **Mobile and keyboard:** Hold **F** to fire automatically with the equipped weapon's existing fire rate, or hold the new FIRE button on a touch screen. The right-mouse-click firing shortcut remains. FIRE is at the beginning of the compact mobile action bar, with Warp Drive still next to it.
- **Protected ports:** Show harmless holographic training tracers and muzzle flashes rather than creating combat bullets or allowing friendly-fire damage. This lets new pilots inspect the animation without flying away from the starter area. Existing safe-zone weapon restrictions otherwise remain.
- **Eidon Rift:** The Heart Chamber now uses the new projectile and impact visuals with its existing combat rules.
- **Weapon-dependent original audio:** Pulse, scatter/flak, rail, plasma, siege, diamond and arc/ion weapons use distinct Web Audio sound cues, subject to the existing explicit Sound toggle and volume control.
- **Performance:** Effects are cosmetic and bounded (maximum 70 active impact ripples and 70 flashes, 12 training tracers). Existing weapon damage, cooldowns, currency, energy, ship balance and drop rates are unchanged. Visual quality and reduced-motion preferences continue to apply.

## Testing and release

Run \`npm test\` on Node 22+. The v0.21 suite tests root/docs parity, module loading, weapon palettes, effect lifetime and caps, safe-zone no-damage training, combat damage compatibility, rifle firing metadata and hold-F/button bindings. Update is shipped to both playable HTML entrypoints.

\`saveVersion\` remains 20 because the cosmetic-only update does not change the persisted state schema, and no save reset is needed.

**No Supabase project or other external database was accessed or modified.** Multiplayer, real cryptocurrencies, real NFTs and shared market settlements are not enabled.
