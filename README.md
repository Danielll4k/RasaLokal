# RasaLokal 🍽️
> **Platform Ulasan Restoran Berbasis Verifikasi Pembelian dan Voucher untuk Pemberdayaan UMKM Kuliner Indonesia**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-61DAFB.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC.svg)](https://tailwindcss.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF.svg)](https://github.com/Danielll4k/RasaLokal/actions)

Karya Finalis **Kompetisi Mahasiswa Muhammadiyah (KMM) 2026**  
Bidang Lomba: **KMM-1 (Pengembangan Aplikasi Perangkat Lunak)**  
Institusi: **Universitas Muhammadiyah Yogyakarta (UMY)**

---

## 📌 Latar Belakang & Masalah

Di Indonesia, lebih dari **64,2 juta unit UMKM** menggerakkan perekonomian nasional dengan sektor kuliner sebagai penyumbang terbesar kedua. Namun, kredibilitas ulasan digital saat ini menghadapi tiga hambatan besar:
1. **Ulasan Rentan Dimanipulasi**: Siapa pun dapat menulis ulasan tanpa bukti pernah membeli, membuka celah ulasan palsu dan bot.
2. **Bias Platform Pesan-Antar**: Penilaian rasa hidangan sering kali tercampur oleh keluhan kemasan dan kecepatan kurir pengantaran.
3. **Rendahnya Retensi Pelanggan**: UMKM kesulitan mendorong kunjungan ulang (*repeat order*) tanpa promosi berbayar yang mahal.

**RasaLokal** menghadirkan solusi berupa platform ulasan restoran yang mensyaratkan **bukti transaksi riil (*Proof-of-Purchase Verification*)**. Ulasan hanya dapat diberikan setelah memverifikasi token barcode unik nota belanja fisik yang diterbitkan mesin kasir restoran (berlaku maksimal 24 jam). Sebagai imbalan atas ulasan jujur, pelanggan langsung memperoleh **voucher diskon 5%** untuk pembelanjaan berikutnya.

---

## ✨ Fitur Unggulan

- 🧾 **Verifikasi Nota Pembelian (Single-Use Token 24 Jam)**: 1 Transaksi kasir = 1 Kode unik nota = Tepat 1 ulasan berlabel **Pembelian Terverifikasi**. Token kadaluarsa dalam 24 jam untuk menjamin ulasan relevan dengan kunjungan nyata.
- 📷 **Live Camera Barcode & QR Scanner**: Pemindaian langsung menggunakan kamera perangkat (`html5-qrcode`) dilengkapi audio feedback (chime saat sukses, soft buzzer saat tidak cocok).
- 🖨️ **Pencetakan Nota Termal Kasir 80mm**: Mesin kasir restoran dapat mencetak struk thermal berstandar POS lengkap dengan Barcode Code128, QR Code, rincian menu, dan peringatan batas ulasan 24 jam.
- 🎁 **Reward Kupon Diskon 5% Otomatis**: Pelanggan yang menuntaskan ulasan langsung memperoleh voucher diskon 5% (minimal belanja Rp 100.000) yang tersimpan di Dompet Voucher dengan QR modal untuk divalidasi kasir.
- 📱 **Simulasi Perangkat Hape & Responsive Mobile**: Tampilan antarmuka dilengkapi mode *Tampilan Hape* dengan dynamic island, floating navigation bar, dan interaksi *liquid-glass* modern.
- 👥 **Dual-Role Switcher (Kasir vs Reviewer)**: Kemudahan pengujian demo bagi juri KMM untuk beralih peran seketika antara kasir resto (*Sore Dining*) dan pembeli (*Alya Rahman*).
- ⭐ **Trigger Kalkulasi Rating Otomatis**: Rating dan statistik ulasan diperbarui seketika (*real-time*) melalui trigger database PostgreSQL 16 tanpa beban agregasi lambat.

---

## 🏗️ Arsitektur Sistem & Tech Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                     │
│           React.js 18 + Vite + Tailwind CSS + Lucide        │
│         (Responsive Mobile View & Portal Kasir POS)         │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (JSON / HTTP)
┌──────────────────────────────▼──────────────────────────────┐
│                      APPLICATION LAYER                      │
│            Node.js & Express REST API Service               │
│     - Voucher Engine (24h Expiration & Single-Use Check)    │
│     - Review & Rating Processor                             │
│     - Role-Based Access Control (Cashier vs Customer)       │
└──────────────────────────────┬──────────────────────────────┘
                               │ Pool Connection (SSL)
┌──────────────────────────────▼──────────────────────────────┐
│                         DATA LAYER                          │
│               Managed PostgreSQL 16 Cluster                 │
│     - UUID Primary Keys & Relational Constraints            │
│     - Auto-Calculation Rating Database Triggers             │
│     - In-Memory Fallback Store (Local Demo Ready)           │
└─────────────────────────────────────────────────────────────┘
```

| Lapisan | Teknologi | Peran Utama |
|:---|:---|:---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide | Antarmuka web responsif, mode tampilan hape, & scanner kamera |
| **Backend** | Node.js, Express.js, QR Code Generator | REST API, validasi token barcode 24 jam, & reward engine |
| **Database** | PostgreSQL 16 | Penyimpanan relasional, constraint token unik, & trigger auto-rating |
| **DevOps** | Docker, Docker Compose, GitHub Actions | Standardisasi lingkungan kontainer & pipeline automated CI/CD |

---

## 🗄️ Skema Basis Data Relasional (PostgreSQL 16)

```text
[ users ]
   │
   ├── (1:N) ──> [ restaurants ] (sebagai owner/merchant)
   ├── (1:N) ──> [ transactions ] (sebagai cashier)
   ├── (1:N) ──> [ reviews ] (sebagai reviewer)
   └── (1:N) ──> [ discount_vouchers ] (sebagai pemegang voucher)

[ restaurants ]
   │
   ├── (1:N) ──> [ transactions ]
   ├── (1:N) ──> [ review_vouchers ]
   ├── (1:N) ──> [ reviews ]
   └── (1:N) ──> [ discount_vouchers ]

[ transactions ]
   │
   └── (1:1) ──> [ review_vouchers ] (satu struk kasir menerbitkan satu token nota)

[ review_vouchers ]
   │
   └── (1:1 UNIQUE) ──> [ reviews ] (voucher valid membuka tepat satu ulasan terverifikasi)

[ reviews ]
   │
   └── (1:1 UNIQUE) ──> [ discount_vouchers ] (ulasan sukses otomatis menerbitkan reward diskon 5%)
```

### Trigger Otomatis Kalkulasi Rating

```sql
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restaurants
    SET 
        average_rating = (
            SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0.00) 
            FROM reviews 
            WHERE restaurant_id = NEW.restaurant_id
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE restaurant_id = NEW.restaurant_id
        ),
        updated_at = NOW()
    WHERE id = NEW.restaurant_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_review_change
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_restaurant_rating();
```

---

## 📂 Struktur Repositori Monorepo

```text
RasaLokal/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # BottomNav, MobileHeader, LoginModal, RestaurantCard, PrintVoucherModal
│   │   ├── pages/              # Home, Explore, Detail, ScanNota, SubmitReview, MyVouchers, Profile, MerchantPortal
│   │   ├── services/           # Axios API Client Service
│   │   ├── App.jsx             # Root View Controller (Mobile Simulator & Desktop Mode)
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Backend REST API Service (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Database connection & memory store fallback
│   │   ├── controllers/        # Voucher, Review, Restaurant, Auth Controllers
│   │   ├── middlewares/        # Authentication & global error handling
│   │   ├── routes/             # Express API endpoints (/api/v1)
│   │   ├── utils/              # Generator kode unik nota & diskon
│   │   ├── app.js              # Express app setup & root landing page
│   │   └── server.js
│   └── package.json
│
├── database/                   # Database Artifacts
│   ├── migrations/             # 001_initial_schema.sql (PostgreSQL DDL, Triggers, Indexes)
│   └── seeds/                  # 001_demo_seed.sql (Data awal: Sore Dining, voucher SORE-8X29K)
│
├── docker/                     # Containerization
│   ├── docker-compose.yml      # PostgreSQL 16 + Adminer Web GUI
│   └── Dockerfile.server       # Multi-stage production container
│
├── .github/workflows/          # CI/CD Pipeline (GitHub Actions)
│   └── ci.yml
├── package.json                # Root monorepo workspace configuration
└── README.md
```

---

## 🚀 Panduan Menjalankan Proyek (Quick Start)

### 1. Prasyarat
- **Node.js** (v18 atau lebih baru)
- **npm** (v9 atau lebih baru)
- *(Opsional)* **Docker Desktop** (jika ingin menyalakan PostgreSQL lokal)

### 2. Instalasi Dependensi
```bash
# Clone repositori
git clone https://github.com/Danielll4k/RasaLokal.git
cd RasaLokal

# Install seluruh dependensi client dan server
npm install --workspace=server
npm install --workspace=client
```

### 3. Menjalankan Server & Client

**Terminal 1 — Backend API Server**:
```bash
cd server
npm run dev
# Server aktif di http://localhost:5000
```

**Terminal 2 — Frontend Web React**:
```bash
cd client
npm run dev
# Frontend aktif di http://localhost:5173
```

Buka peramban di **`http://localhost:5173`**.

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
