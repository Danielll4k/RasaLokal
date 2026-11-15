# RasaLokal 🍽️
> **Platform Ulasan Restoran Berbasis Verifikasi Pembelian dan Voucher untuk Pemberdayaan UMKM Kuliner Indonesia**

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF.svg)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Karya Finalis **Kompetisi Mahasiswa Muhammadiyah (KMM) 2026**  
Bidang Lomba: **KMM-1 (Pengembangan Aplikasi Perangkat Lunak)**  
Institusi: **Universitas Muhammadiyah Yogyakarta**

---

## 📌 Ringkasan Sistem
RasaLokal adalah platform ulasan kuliner yang mensyaratkan bukti transaksi nyata (*Proof-of-Purchase Verification*). Modul basis data dan infrastruktur ini dirancang khusus untuk memastikan:
1. **Integritas Ulasan 1:1**: Satu transaksi kasir hanya dapat menerbitkan satu voucher ulasan sekali pakai (*single-use token constraint*).
2. **Kalkulasi Rating Otomatis**: Pembaruan rating dan total ulasan dilakukan secara *real-time* melalui stored procedure dan database trigger tanpa membebani performa query pembacaan.
3. **Infrastruktur Terisolasi**: Lingkungan lokal dikontainerisasi menggunakan Docker Compose (PostgreSQL 16 dan Adminer Web GUI), serta didukung pipeline otomasi CI/CD GitHub Actions.

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

### Entitas Inti
- `users`: Autentikasi dan otorisasi berbasis peran (`customer`, `merchant`, `admin`).
- `restaurants`: Profil tempat makan, jam operasional, koordinat lokasi, dan rating agregat.
- `transactions`: Log transaksi kasir dengan *constraint* anti-duplikasi nomor struk per restoran.
- `review_vouchers`: Token nota berbatas waktu (30 hari) berstatus `issued`, `redeemed`, atau `expired`.
- `reviews`: Ulasan nyata berlabel **Pembelian Terverifikasi** yang terikat secara unik ke `voucher_id`.
- `discount_vouchers`: Reward potongan 5% (minimal belanja Rp 100.000) yang terbit otomatis setelah ulasan dikirim.

---

## ⚙️ Trigger Otomatis Kalkulasi Rating

Untuk memenuhi target performa waktu respons pencarian di bawah 2 detik, diterapkan trigger tingkat database:

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

## 📂 Struktur Repositori

```text
.
├── database/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # DDL skema relasional, custom enums, indexes, & triggers
│   └── seeds/
│       └── 001_demo_seed.sql       # Data awal: Sore Dining, voucher demo SORE-8X29K, users
├── docker/
│   ├── docker-compose.yml          # Konfigurasi container PostgreSQL 16 & Adminer Web GUI
│   └── Dockerfile.server           # Multi-stage container build
├── .github/
│   └── workflows/
│       └── ci.yml                  # Pipeline CI/CD automated lint & deployment webhook
├── .editorconfig
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Panduan Menjalankan Lingkungan Lokal

### Prasyarat
- **Docker** dan **Docker Compose**

### Langkah Menjalankan
1. Masuk ke direktori `docker/`:
   ```bash
   cd docker
   ```
2. Jalankan seluruh layanan dalam satu perintah:
   ```bash
   docker compose up -d
   ```
3. Akses basis data:
   - **PostgreSQL**: `localhost:5432` (User: `rasalokal_user`, Database: `rasalokal_db`)
   - **Adminer (Database Web Viewer)**: Buka peramban di `http://localhost:8080`

---

## 👥 Tim Pengusul (RacikCode — UMY)

- **Aditya Yuda Lesmana** (NIM: 20250140044) — *Ketua Tim / Backend API & Logika Voucher*
- **Heyden Alya Syailendra** (NIM: 20250140141) — *Anggota / Arsitektur Basis Data, Kontainerisasi & DevOps*
- **Ally Cahhyo Virmansyah** (NIM: 20250140147) — *Anggota / Analisis Kebutuhan & UI/UX Frontend*

**Dosen Pendamping**: Chayadi Oktomy N S, S.T., M.Eng., Ph.D  
**Program Studi**: S-1 Teknologi Informasi, Universitas Muhammadiyah Yogyakarta
