# Photos

Everything here should be **your own photography** — food you cooked, your
dining room, your family. No stock images.

## What's in here now

| File | What it is | Status |
|------|------------|--------|
| `logo.jpg` | The Tumba Tumba logo | ✅ from you |
| `menu.jpg` | Photo of the printed menu (linked from the site as "view printed menu") | ✅ from you |

## What to add

| File name | Where it shows | Target size | Notes |
|-----------|----------------|-------------|-------|
| `hero-pata.jpg` | Big image under the hero | ~2000 px wide, landscape | The whole crispy pata, good light, shallow background. This is the first photo people see. |
| `story.jpg` | Beside "Our Story" | ~1400 px wide, portrait or square | Aling Nene, the family, or the kitchen mid-service. A real moment, not a posed group shot. |

Optional extras you could work into the page later: pancit bilao from above,
sisig on the sizzling plate, the storefront on General Kalentong.

## Before committing a photo

1. **Resize** to the target width above (a 4000 px phone photo is ~6 MB and will
   make the page slow).
2. **Compress** — aim for under 300 KB each. Free tools: <https://squoosh.app>
   (MozJPEG, quality ~75) or `magick input.jpg -resize 2000x -quality 78 hero-pata.jpg`.
3. Keep the file names above so the HTML/CSS picks them up. In `index.html`,
   swap the placeholder `<figure>` for the real one (there's a comment showing how).
