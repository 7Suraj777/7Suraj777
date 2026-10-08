// Renders menu.html to print-ready PDFs and PNG previews.
//   NODE_PATH=$(npm root -g) node build.cjs
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const here = __dirname;
const out = path.join(here, "output");
fs.mkdirSync(out, { recursive: true });
const url = (q) => "file://" + path.join(here, "menu.html") + q;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const pdf = async (query, file) => {
    await page.goto(url(query), { waitUntil: "load" });
    await page.waitForFunction(() => window.__ready === true);
    await page.pdf({ path: path.join(out, file), preferCSSPageSize: true, printBackground: true });
    console.log("pdf ", file);
  };

  // A4 trim size: for viewing, WhatsApp, office/home printers
  await pdf("?mode=a4", "RiceRusikaRusika_Menu_A4.pdf");
  // A4 + 3 mm bleed + crop marks: for the print shop
  await pdf("?mode=print", "RiceRusikaRusika_Menu_PRINT_A4_bleed-cropmarks.pdf");

  // PNG previews of each side
  const shot = await browser.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 2.4 });
  for (const side of ["en", "ta"]) {
    await shot.goto(url(`?mode=a4&side=${side}`), { waitUntil: "load" });
    await shot.waitForFunction(() => window.__ready === true);
    await shot.locator(".page").screenshot({ path: path.join(out, `preview_${side === "en" ? "front_english" : "back_tamil"}.png`) });
    console.log("png ", side);
  }
  await browser.close();

  // TrimBox / BleedBox + document info (needs: pip install pikepdf)
  execFileSync("python3", [path.join(here, "set_boxes.py")], { stdio: "inherit" });
})();
