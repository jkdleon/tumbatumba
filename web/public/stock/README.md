# Stock placeholders — DO NOT SHIP

Every file here is a dev-only stand-in. Replace each with the family's own
photo before launch and flip the matching `isStock` flag / caption in
`web/content/dishes.ts`, `web/components/Hero.tsx`, `web/components/OurStory.tsx`.

`npm run check:stock` (in `web/`) lists any `/stock/` reference still present
in the built output.

Shot list (spec §10): hero pata, the 4 signature dishes, kitchen/family, storefront.

**Update:** the hero photo and 2 of the 4 signature-dish cards are done — replaced with real,
edited photos of the family's own crispy pata and crispy ulo, now served from
`web/public/photos/` (not `/stock/`; the old `hero-pata.jpg`, `dish-pata.jpg`, and
`dish-lengua.jpg` placeholders here were removed as unused). The signature strip now shows
Crispy Ulo instead of Lengua Asado (Lengua stays on the full menu — `content/menu.ts` —
just not one of the 4 highlighted cards; swap it back in if real lengua photos turn up).
`content/dishes.ts`'s pata and ulo entries both have `isStock: false`. Still needed: sisig,
pancit by the bilao, and a kitchen/family/storefront shot for Our Story.
