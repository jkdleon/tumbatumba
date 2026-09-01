# Stock placeholders — DO NOT SHIP

Every file here is a dev-only stand-in. Replace each with the family's own
photo before launch and flip the matching `isStock` flag / caption in
`web/content/dishes.ts`, `web/components/Hero.tsx`, `web/components/OurStory.tsx`.

`npm run check:stock` (in `web/`) lists any `/stock/` reference still present
in the built output.

Shot list (spec §10): hero pata, the 4 signature dishes, kitchen/family, storefront.

**Update:** `hero-pata.jpg` and `dish-pata.jpg` are done — replaced with real photos of the
family's own crispy pata, edited and cropped, now served from `web/public/photos/` (not
`/stock/`). `content/dishes.ts`'s pata entry has `isStock: false`. Still needed: sisig, lengua
asado, pancit by the bilao, and a kitchen/family/storefront shot for Our Story.
