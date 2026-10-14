# Stall Danglers — print files

Six hanging danglers, same design on both sides:

| # | Dangler | Price |
|---|---|---|
| 01 | Soya Oats Chilla — with Paneer and Veggies | ₹150 |
| 02 | Soup — Murungai Soup, Creamy Mushroom | ₹30 |
| 03 | MITA Millets — Thinai Dosai, Pesarettu Dosai, Ragi Idiyappam | ₹150 |
| 04 | Momos — 5 Pieces | ₹50 |
| 05 | Rice Rusika Rusika — Variety Rice with Curd Rice, Pickle and Papad (Bisebela Bath, Veg Pulao, Tomato Rice) | ₹100 |
| 06 | Vegan Veg — Veg Chicken Balls 12, Veg Fish Fingers 8, Veg Mutton Balls 12 | ₹200 |

## What to send the printer

- **`output/print/*_A3_PRINT.pdf`** — the main print files. A3 (297 × 420 mm), 3 mm bleed, crop marks, all text and artwork in vector, fonts embedded. Page 1 = front, page 2 = back (identical).
- **`output/jpg/*_A3_300dpi.jpg`** — backup for shops that only take images. 300 dpi, includes the 3 mm bleed (cut 3 mm off each edge).

**Print spec to tell the shop:** A3, 300–350 gsm art card, both sides printed (same design), matte or gloss lamination, one punched hole at top centre about 10 mm from the top edge, with thread or a hook.

Need A4 instead? A-sizes scale exactly — ask them to print the A3 PDF "fit to A4" (70.7%). Everything stays in proportion.

## Changing things

All wording, prices and colours are in the `DANGLERS` list in `dangler.html`. To use a real photo instead of a drawing, set `photo: "photos/your-file.jpg"` on that plate. Rebuild with:

```bash
NODE_PATH=$(npm root -g) node build.cjs
```

Fonts (Fraunces, Jost) are shared with the menu in `../menu/fonts`, SIL Open Font License.
