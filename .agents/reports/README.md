# Agent Reports

Folder ini menyimpan keluaran audit terbaru dari worker orchestrator:

- `orion/latest.md` — ringkasan implementasi/perbaikan, validasi dasar, dan status kesiapan audit.
- `lyra/latest.md` — konsistensi template dan tampilan.
- `litcq/latest.md` — bug dan regresi website.
- `xavier/latest.md` — verifikasi ketiga laporan Orion, Lyra, dan Litcq serta keputusan `PUSH` atau `DO_NOT_PUSH`.

Orion menulis laporannya setelah implementasi dan sebelum master menjalankan Lyra serta Litcq. Master menjalankan Xavier setelah kedua auditor selesai. Master hanya boleh push ketika laporan Xavier untuk diff yang sama berisi keputusan `PUSH`; keputusan `DO_NOT_PUSH` dikembalikan kepada Orion untuk diperbaiki dan diaudit ulang.

File dalam folder ini adalah artefak audit dan dikecualikan dari fingerprint calon push. Perubahan laporan tidak membatalkan gate, tetapi perubahan file lain akan membatalkannya.
