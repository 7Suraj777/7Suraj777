// Renders every dangler to print-ready files.
//   NODE_PATH=$(npm root -g) node build.cjs
// Output (in output/):
//   print/  <name>_A3_PRINT.pdf   front + back, 3 mm bleed, crop marks, TrimBox/BleedBox
//   jpg/    <name>_A3_300dpi.jpg  full-bleed 303 x 426 mm image for shops that want JPG
//   All-Danglers_A3_preview.pdf   one page per dangler at A3 trim size
//   previews/<name>.png           small previews
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const here = __dirname;
const out = path.join(here, "output");
for (const d of ["print", "jpg", "previews"]) fs.mkdirSync(path.join(out, d), { recursive: true });
const url = (q) => "file://" + path.join(here, "dangler.html") + q;
const ids = [...fs.readFileSync(path.join(here, "dangler.html"), "utf8").matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const open = async (q) => {
    await page.goto(url(q), { waitUntil: "load" });
    await page.waitForFunction(() => window.__ready === true);
  };

  for (const id of ids) {
    await open(`?mode=print&copies=2&id=${id}`);
    const pdf = path.join(out, "print", `${id}_A3_PRINT.pdf`);
    await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });

    await open(`?mode=bleed&id=${id}`);
    const tmp = path.join(out, "jpg", `${id}.tmp.pdf`);
    await page.pdf({ path: tmp, preferCSSPageSize: true, printBackground: true });
    execFileSync("pdftoppm", ["-r", "300", "-jpeg", "-jpegopt", "quality=92", "-singlefile", tmp, path.join(out, "jpg", `${id}_A3_300dpi`)]);
    fs.unlinkSync(tmp);
    console.log("done", id);
  }

  await open("?mode=a3");
  await page.pdf({ path: path.join(out, "All-Danglers_A3_preview.pdf"), preferCSSPageSize: true, printBackground: true });

  const shot = await browser.newPage({ viewport: { width: 1200, height: 1700 }, deviceScaleFactor: 1.6 });
  for (const id of ids) {
    await shot.goto(url(`?mode=a3&id=${id}`), { waitUntil: "load" });
    await shot.waitForFunction(() => window.__ready === true);
    await shot.locator(".page").screenshot({ path: path.join(out, "previews", `${id}.png`) });
  }
  await browser.close();

  execFileSync("python3", [path.join(here, "set_boxes.py")], { stdio: "inherit" });
})();
