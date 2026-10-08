"""Stamps printer page boxes + document info onto the PDFs made by build.cjs."""
import sys
from pathlib import Path
import pikepdf

MM = 72 / 25.4
OUT = Path(__file__).parent / "output"
INFO = dict(Title="Rice Rusika Rusika — Menu (English / Tamil)", Author="Rice Rusika Rusika",
            Subject="Weekly menu card · A4 · front English, back Tamil")

def stamp(name, slug_mm=0.0, bleed_mm=0.0):
    path = OUT / name
    with pikepdf.open(path, allow_overwriting_input=True) as pdf:
        for page in pdf.pages:
            x0, y0, x1, y1 = [float(v) for v in page.MediaBox]
            t = (slug_mm + bleed_mm) * MM
            b = slug_mm * MM
            page.TrimBox = pikepdf.Array([x0 + t, y0 + t, x1 - t, y1 - t])
            page.BleedBox = pikepdf.Array([x0 + b, y0 + b, x1 - b, y1 - b])
        with pdf.open_metadata() as meta:
            meta["dc:title"] = INFO["Title"]
            meta["dc:creator"] = [INFO["Author"]]
        for k, v in INFO.items():
            pdf.docinfo[f"/{k}"] = v
        pdf.save(path)
    print("boxes", name)

stamp("RiceRusikaRusika_Menu_A4.pdf")
stamp("RiceRusikaRusika_Menu_PRINT_A4_bleed-cropmarks.pdf", slug_mm=10, bleed_mm=3)
