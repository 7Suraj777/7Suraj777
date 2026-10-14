# Next step: swap the drawings for real food photos

The danglers (`danglers/`) and the menu (`menu/`) are built to take real photos: every round
"plate" accepts a `photo:` path. Photos could not be downloaded in the first session because
`images.unsplash.com` was blocked by the environment's network settings.

## Already shortlisted on Unsplash (free for commercial use, all vegetarian)

| Use | Unsplash ID | Image URL (add `?w=2000&q=85&fm=jpg`) | Note |
|---|---|---|---|
| Menu hero (meals) | gep3f7NQzZY | https://images.unsplash.com/photo-1742281257687-092746ad6021 | "A traditional vegetarian Tamil lunch thali", Zoshua Colah |
| Menu hero (alt) | 4pT9e68P_mU | https://images.unsplash.com/photo-1742281258189-3b933879867a | same series, portrait |
| Menu Power Lunch | HohIHrmr_E0 | https://images.unsplash.com/photo-1771074168436-8692a866cdb1 | rice bowl with grilled paneer and chickpeas, Sumit Bhatia |
| Menu Continental | R02KgL5Ti3Y | https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c | ratatouille (confit byaldi), top-down |
| Veg Pulao candidate | 7EVD7HFvCfY | https://images.unsplash.com/photo-1626266799523-941311ea2273 | rice with green peas and carrots — check it looks like pulao |
| Variety rice candidate | LU2U_p3JMdY | https://images.unsplash.com/photo-1733414717515-d997dafb7341 | white bowl of rice and nuts (lemon-rice style) |

## Still to find (search Unsplash, check each photo by eye, vegetarian only)

- Soya Oats Chilla with paneer and veggies (search: "besan chilla", "chilla", "savoury pancake")
- Murungai (drumstick) soup, creamy mushroom soup
- Thinai dosai, pesarettu dosai (search: "dosa", "pesarattu"), ragi idiyappam (search: "idiyappam", "string hoppers")
- Momos (search: "momos", "dumplings steamer")
- Bisebela bath, tomato rice
- Vegan platter: veg balls and fingers (search: "vegan meatballs", "veggie nuggets") — no real meat

Skip any photo that shows chicken, fish, egg or mutton; the stall is vegetarian.

## How to apply

1. Download each pick to `danglers/photos/<name>.jpg` (and `menu/photos/` for the menu) at ~2000 px.
2. Look at each photo; crop to a square centred on the food if needed (ImageMagick `convert`).
3. In `danglers/dangler.html`, set `photo: "photos/<name>.jpg"` on each plate; in `menu/menu.html`
   the `PHOTOS` object already points at `photos/hero-meals.jpg`, `power-bowl.jpg`, `continental.jpg`.
4. Rebuild: `NODE_PATH=$(npm root -g) node build.cjs` in each folder (needs `pip install pikepdf fonttools`).
5. Check every preview, then commit, push, and re-zip `danglers/output/Danglers_Print_Files.zip`.
