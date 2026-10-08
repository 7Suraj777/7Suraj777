# Rice Rusika Rusika — Menu Card

A4 menu card, printed double-sided: **front = English, back = Tamil**.

## Files to use

| File | Use it for |
|---|---|
| `output/RiceRusikaRusika_Menu_PRINT_A4_bleed-cropmarks.pdf` | **Send this to the print shop.** A4 trim, 3 mm bleed, crop marks, TrimBox/BleedBox set. Page 1 = front (English), page 2 = back (Tamil). |
| `output/RiceRusikaRusika_Menu_A4.pdf` | Exact A4 — WhatsApp, email, office/home printer. |
| `output/preview_front_english.png`, `output/preview_back_tamil.png` | Quick previews / social posts. |

Everything in the PDFs is vector (no photos or bitmaps), and all fonts are embedded, so it stays sharp at any size.

**Print suggestion:** 300–350 gsm art card, double-sided, matte lamination (wipeable at the counter). Ask the printer for one proof copy before the full run to check colour.

## Design system

- **Colours:** banana-leaf green `#1C3A27`, turmeric gold `#D6A443`, chilli red `#A8402A` (accents only), cream paper `#F7F0E0`.
- **English type:** Fraunces (headings, dish names), Jost (menu items, labels).
- **Tamil type:** Noto Serif Tamil (headings), Noto Sans Tamil (menu items).
- **Motifs:** mango-leaf thoranam, kolam texture, banana leaves, clay-pot emblem — all drawn as vectors.

Fonts are from Google Fonts under the SIL Open Font License.

## Editing & rebuilding

All wording lives in the `MENU` object near the bottom of `menu.html` (`en` and `ta` blocks). Open `menu.html` in Chrome to preview, then rebuild:

```bash
pip install pikepdf
NODE_PATH=$(npm root -g) node build.cjs
```
