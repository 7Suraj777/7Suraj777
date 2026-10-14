"""Stamps TrimBox / BleedBox and document info onto the dangler print PDFs."""
from pathlib import Path
import pikepdf

MM = 72 / 25.4
OUT = Path(__file__).parent / "output"

for pdf_path in sorted((OUT / "print").glob("*.pdf")):
    name = pdf_path.stem.replace("_A3_PRINT", "").split("_", 1)[1].replace("-", " ")
    with pikepdf.open(pdf_path, allow_overwriting_input=True) as pdf:
        for page in pdf.pages:
            x0, y0, x1, y1 = [float(v) for v in page.MediaBox]
            t, b = 13 * MM, 10 * MM  # 10 mm slug + 3 mm bleed
            page.TrimBox = pikepdf.Array([x0 + t, y0 + t, x1 - t, y1 - t])
            page.BleedBox = pikepdf.Array([x0 + b, y0 + b, x1 - b, y1 - b])
        pdf.docinfo["/Title"] = f"{name} — Dangler A3 (front + back)"
        pdf.docinfo["/Subject"] = "A3 297 x 420 mm, 3 mm bleed, crop marks. Page 1 = front, page 2 = back."
        pdf.save(pdf_path)
    print("boxes", pdf_path.name)
