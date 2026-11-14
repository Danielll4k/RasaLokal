# RasaLokal 🍽️
> **Platform Ulasan Restoran Berbasis Verifikasi Pembelian dan Voucher untuk Pemberdayaan UMKM Kuliner Indonesia**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-61DAFB.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC.svg)](https://tailwindcss.com/)

Proposal & Karya Finalis **Kompetisi Mahasiswa Muhammadiyah (KMM) 2026**  
Bidang Lomba: **KMM-1 (Pengembangan Aplikasi Perangkat Lunak)**  
Institusi: **Universitas Muhammadiyah Yogyakarta**

---

## 📌 Latar Belakang & Masalah
Di Indonesia, lebih dari **64,2 juta unit UMKM** menggerakkan perekonomian nasional dengan sektor kuliner sebagai penyumbang terbesar kedua. Namun, kredibilitas ulasan digital saat ini menghadapi tiga hambatan besar:
1. **Ulasan Mudah Dimanipulasi**: Siapa pun dapat menulis ulasan tanpa bukti pernah membeli, membuka celah buzzer dan ulasan palsu.
2. **Bias Platform Pesan-Antar**: Penilaian rasa sering kali tercampur oleh keluhan kemasan dan kecepatan kurir pengantaran.
3. **Rendahnya Retensi Pelanggan**: UMKM kesulitan mendorong kunjungan ulang tanpa promosi berbayar yang mahal.

**RasaLokal** menghadirkan solusi berupa platform ulasan restoran yang mensyaratkan **bukti transaksi riil (Proof-of-Purchase Verification)**. Ulasan hanya dapat diberikan setelah memverifikasi voucher nota unik sekali pakai yang diterbitkan kasir. Sebagai imbalan atas ulasan jujur, pelanggan langsung memperoleh **voucher diskon 5%** untuk pembelanjaan berikutnya.

---

## ✨ Fitur Utama

- 🧾 **Verifikasi Pembelian (Single-Use Token)**: Satu transaksi kasir = Satu kode nota unik = Tepat satu ulasan berlabel **Pembelian Terverifikasi**.
- 🖨️ **Tombol Cetak Voucher Kasir**: Halaman merchant kasir dilengkapi pencetakan lembar voucher siap pakai (printer termal / PDF) berkode QR.
- 🎁 **Reward Ulasan Otomatis**: Pelanggan yang menuntaskan ulasan langsung memperoleh voucher diskon 5% (minimal belanja Rp 100.000) dengan masa aktif 30 hari.
- ⭐ **Auto-Rating Engine**: Rating dan statistik ulasan diperbarui seketika (*real-time*) melalui trigger basis data PostgreSQL tanpa beban agregasi lambat.
- 🏪 **Portal & Analitik Merchant**: Dasbor ringkas bagi pelaku usaha untuk memantau voucher terbit, rasio konversi ulasan, dan validasi diskon saat checkout.

---

## 🏗️ Arsitektur Sistem & Tech Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                     │
│           React.js + Tailwind CSS + Lucide Icons            │
│         (Responsive Web: Modul Pelanggan & Kasir)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (JSON)
┌──────────────────────────────▼──────────────────────────────┐
│                      APPLICATION LAYER                      │
│            Node.js & Express REST API Service               │
│     - Voucher Engine (Single-Use Verification)              │
│     - Review & Rating Processor                             │
│     - JWT Role-Based Access Control (RBAC)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Pool Connection (SSL)
┌──────────────────────────────▼──────────────────────────────┐
│                         DATA LAYER                          │
│               Managed PostgreSQL 16 Cluster                 │
│     - UUID Primary Keys & Relational Integrity Constraints  │
│     - Auto-Calculation Rating Triggers                      │
│     - Cloud Object Storage (Foto Ulasan & Banners)          │
└─────────────────────────────────────────────────────────────┘
```

| Lapisan | Teknologi | Peran Utama |
|:---|:---|:---|
| **Frontend** | React 18, Vite, Tailwind CSS | Antarmuka web responsif pelanggan dan portal kasir |
| **Backend** | Node.js, Express, QR Code Engine | REST API, logika validasi nota sekali pakai, & reward engine |
| **Database** | PostgreSQL 16 | Relational data store, constraint unik voucher, & trigger auto-rating |
| **DevOps** | Docker, Docker Compose, GitHub Actions | Standardisasi lingkungan lokal & pipeline automated CI/CD |

---

## 📂 Struktur Repositori

```text
RasaLokal/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # Reusable UI (Sidebar, RestaurantCard, Modal, StarRating)
│   │   ├── pages/              # Halaman Aplikasi (Home, Explore, Detail, ScanNota, Review, Voucher, Profile, Merchant)
│   │   ├── services/           # API Client Service
│   │   ├── App.jsx             # Root View Controller
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Backend REST API Service (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Database connection & memory store fallback
│   │   ├── controllers/        # Business logic (Resto, Voucher, Review, Auth)
│   │   ├── middlewares/        # Authentication & global error handling
│   │   ├── routes/             # Express API endpoints
│   │   ├── utils/              # Generator kode unik nota & diskon
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── database/                   # Database Artifacts
│   ├── migrations/             # 001_initial_schema.sql (PostgreSQL DDL & Triggers)
│   └── seeds/                  # 001_demo_seed.sql (Demo data: Sore Dining, voucher SORE-8X29K)
│
├── docker/                     # Containerization
│   ├── docker-compose.yml      # Multi-container: PostgreSQL 16 + Adminer Web UI
│   └── Dockerfile.server       # Multi-stage production container
│
├── .github/workflows/          # CI/CD Pipeline (GitHub Actions)
└── README.md
```

---

## 🚀 Panduan Menjalankan Proyek (Quick Start)

### 1. Prasyarat
- **Node.js** (v18 atau lebih baru)
- **npm** (v9 atau lebih baru)
- *(Opsional)* **Docker Desktop** (untuk database PostgreSQL lokal)

### 2. Instalasi Dependensi
Jalankan instalasi dependensi pada root folder:
```bash
# Clone repositori
git clone https://github.com/Danielll4k/RasaLokal.git
cd RasaLokal

# Install dependensi server dan client
npm install --workspace=server
npm install --workspace=client
```

### 3. Menjalankan Database (Pilihan)
- **Opsi A (Docker PostgreSQL Lokal)**:
  ```bash
  cd docker
  docker compose up -d
  ```
  *Adminer Database GUI aktif di `http://localhost:8080`.*
- **Opsi B (Standalone Mode)**:
  Backend telah dilengkapi *in-memory fail-safe store* yang memuat data contoh (*Sore Dining*, voucher demo `SORE-8X29K`) sehingga dapat diuji coba langsung tanpa menyalakan server PostgreSQL eksternal.

### 4. Menjalankan Aplikasi
Buka dua terminal terpisah:

**Terminal 1 — Backend API**:
```bash
cd server
npm run dev
# Server aktif di http://localhost:5000
```

**Terminal 2 — Frontend Web**:
```bash
cd client
npm run dev
# Client aktif di http://localhost:5173
```

Buka peramban di `http://localhost:5173`.

---

## 🧪 Skenario Demonstrasi Alur Inti (Demo Guide)

1. **Kasir Menerbitkan Voucher**:
   - Buka menu **Portal Kasir / Resto** di bilah kiri.
   - Pada tab **Cetak Voucher Nota**, isi nomor struk (contoh: `INV-SORE-001`) dan total belanja `Rp 175.000`.
   - Klik **Cetak Lembar Voucher Pelanggan** untuk melihat lembar cetak siap pakai dengan kode unik & QR.
2. **Pelanggan Memverifikasi Nota**:
   - Buka menu **Scan Nota**.
   - Klik tombol **Simulasikan scan nota** (atau ketik manual kode `SORE-8X29K`).
   - Sistem memvalidasi keabsahan token dan membuka formulir ulasan.
3. **Mengirim Ulasan & Menerima Diskon 5%**:
   - Pilih bintang (1-5), tulis komentar pengalaman, lalu klik **Kirim Ulasan & Klaim Diskon 5%**.
   - Muncul modal reward **Voucher Diskon 5%**.
4. **Cek & Pakai Voucher Diskon**:
   - Buka menu **Voucher Saya** untuk melihat daftar voucher aktif dan menekan tombol **Pakai**.
5. **Kasir Memvalidasi Diskon di Kunjungan Berikutnya**:
   - Di **Portal Kasir / Resto**, buka tab **Validasi Diskon 5%**.
   - Masukkan kode voucher diskon dan nilai belanja saat ini ($\ge$ Rp 100.000). Sistem otomatis memotong tagihan 5%.

---

## 👥 Tim Pengusul (RacikCode — UMY)

| Nama Mahasiswa | NIM | Peran & Tanggung Jawab |
|:---|:---:|:---|
| **Aditya Yuda Lesmana** | 20250140044 | **Ketua Tim** · Backend API, Logika Voucher & Algoritma Rating |
| **Heyden Alya Syailendra** | 20250140141 | **Anggota** · Arsitektur Basis Data, Kontainerisasi & DevOps Deployment |
| **Ally Cahhyo Virmansyah** | 20250140147 | **Anggota** · Analisis Kebutuhan, UI/UX Frontend & Pengujian SUS |

**Dosen Pendamping**: Chayadi Oktomy N S, S.T., M.Eng., Ph.D  
**Program Studi**: S-1 Teknologi Informasi, Fakultas Teknik, Universitas Muhammadiyah Yogyakarta

---

## 📄 Lisensi
Didistribusikan di bawah Lisensi MIT. Lihat berkas `LICENSE` untuk informasi selengkapnya.
