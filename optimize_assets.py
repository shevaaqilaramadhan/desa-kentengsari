"""Kompresi aset gambar website Desa Kentengsari agar ringan dimuat."""
from PIL import Image
from pathlib import Path

ASSETS = Path(r"D:\testing-web-cline\assets")

# (nama file, lebar maksimum, kualitas JPEG)
JOBS = [
    ("hero-background.jpg",   1920, 80),  # latar hero / page-hero
    ("profil-desa-image.jpg", 1400, 80),
    ("kata-sambutan-1.jpg",   1000, 80),
    ("kata-sambutan-2.jpg",   1000, 80),
    ("destinasi-image-1.jpg", 1400, 80),
    ("destinasi-image-2.jpg", 1400, 80),
    ("galeri-1.jpg",          1600, 80),
    ("galeri-2.jpg",          1600, 80),
    ("galeri-3.jpg",          1600, 80),
]

for name, max_w, quality in JOBS:
    path = ASSETS / name
    before = path.stat().st_size
    img = Image.open(path).convert("RGB")
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, round(img.height * ratio)), Image.LANCZOS)
    img.save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    after = path.stat().st_size
    print(f"{name:26s} {before/1e6:6.2f} MB -> {after/1e6:5.2f} MB  ({img.width}x{img.height})")

logo = ASSETS / "kentengsari-logo.png"
before = logo.stat().st_size
img = Image.open(logo)
if img.width > 512:
    img = img.resize((512, round(img.height * 512 / img.width)), Image.LANCZOS)
img.save(logo, "PNG", optimize=True)
print(f"{'kentengsari-logo.png':26s} {before/1e6:6.2f} MB -> {logo.stat().st_size/1e6:5.2f} MB  ({img.width}x{img.height})")
print("SELESAI")
