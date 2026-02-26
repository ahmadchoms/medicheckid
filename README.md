# MediCheck ID

**Platform Cek Gejala & Literasi Kesehatan Berbasis Visual**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web-brightgreen.svg)
![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4.svg)
![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20.svg)
![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)

---

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Cara Menggunakan](#cara-menggunakan)
- [Struktur Proyek](#struktur-proyek)
- [API Endpoints](#api-endpoints)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## 🎯 Tentang Proyek

**MediCheck ID** adalah platform kesehatan digital yang revolusioner yang mengubah cara masyarakat Indonesia berinteraksi dengan kesehatan mereka. Melalui antarmuka yang intuitif dan berbasis visual, platform ini memudahkan pengguna untuk:

- 🔍 Mengidentifikasi gejala melalui body map interaktif
- 🤔 Memahami kemungkinan kondisi kesehatan dengan decision tree terstruktur
- 📊 Mengevaluasi kesehatan holistik melalui Health Score Calculator
- 🆘 Mengakses panduan pertolongan pertama dalam situasi darurat
- 💬 Berkomunikasi dengan sistem menggunakan bahasa alami
- 🏥 Mempersiapkan kunjungan ke dokter dengan ringkasan gejala yang terstruktur

Platform ini dirancang dengan fokus pada **literasi kesehatan** dan **pemberdayaan pengguna**, bukan sebagai pengganti konsultasi medis profesional.

---

## ✨ Fitur Utama

### 1. **Animated SVG Body Map** 🏥

Ilustrasi tubuh manusia interaktif yang memungkinkan pengguna mengklik area tubuh untuk memulai proses identifikasi gejala.

**Fitur:**

- Interactive hotspot untuk 8-10 area tubuh utama
- Highlight animasi dengan pulse effect
- Tooltip informatif saat hover
- Responsive untuk desktop dan mobile
- Area yang tercakup: kepala, dada, perut, anggota gerak, dan kulit

**Value Proposition:**
Mengubah proses pengecekan gejala dari "mengisi kuesioner" menjadi "menjelajahi tubuh sendiri" — pengalaman yang lebih natural dan memorable.

---

### 2. **Decision Tree Symptom Checker** 🌳

Sistem navigasi gejala berbasis pohon keputusan yang memandu pengguna melalui serangkaian pertanyaan terstruktur.

**Fitur:**

- Setiap jawaban menentukan pertanyaan berikutnya
- Progress indicator yang jelas (Step X dari Y)
- Tombol "Kembali" untuk navigate ulang
- Hasil yang mencakup:
    - 1-3 kemungkinan kondisi
    - Tingkat urgensi (Darurat/Segera/Bisa Tunggu/Mandiri)
    - Rekomendasi tindakan (Home care/Klinik/Puskesmas/UGD)
    - Red flags (tanda-tanda bahaya)

**Kondisi yang Dicakup (Preview):**

- ISPA (Infeksi Saluran Pernapasan Akut)
- Demam
- Diare
- Sakit Kepala
- Nyeri Dada
- Nyeri Perut
- Batuk
- Sesak Nafas
- Pusing
- Mata Merah
- Luka & Perdarahan
- Alergi
- Mual & Muntah
- Nyeri Sendi
- Gangguan Tidur

---

### 3. **Health Score Calculator (6-Dimensional)** 📈

Kalkulator kesehatan holistik yang mengukur kualitas hidup pengguna secara komprehensif.

**6 Dimensi yang Diukur:**

1. **Tidur** - Durasi, kualitas, konsistensi jadwal
2. **Aktivitas Fisik** - Frekuensi, intensitas, durasi olahraga
3. **Nutrisi** - Keragaman makanan, konsumsi buah/sayur
4. **Hidrasi** - Konsumsi air putih harian
5. **Stres & Mental** - Level stres, metode coping, relaksasi
6. **Koneksi Sosial** - Kualitas hubungan, dukungan sosial

**Output:**

- Skor individual 0-100 untuk setiap dimensi
- Skor agregat 0-100
- Radar chart visual yang mengidentifikasi kekuatan dan kelemahan
- Rekomendasi prioritas yang dipersonalisasi
- System badges/achievements untuk gamification

**Dampak:**
Mengubah platform dari "untuk orang sakit" menjadi "untuk semua orang" termasuk yang sehat ingin mengoptimalkan wellness mereka.

---

### 4. **Interactive P3K (Pertolongan Pertama) Guide** 🆘

Panduan pertolongan pertama yang dapat diakses dalam kondisi darurat nyata.

**Kondisi yang Tercakup:**

- Luka dan perdarahan
- Luka bakar
- Tersedak (Heimlich maneuver)
- CPR (Resusitasi Jantung Paru)
- Pingsan
- Kejang
- Gigitan hewan
- Keracunan makanan
- Patah tulang (pertolongan awal)
- Heat stroke

**Fitur:**

- Step-by-step visual guide dengan SVG illustrations
- Large, clear text untuk legibilitas di kondisi panik
- Timer built-in untuk langkah yang memerlukan durasi tertentu
- Emergency numbers yang selalu visible
- Design yang optimized untuk kecepatan baca dan aksi

---

### 5. **AI-Powered Natural Language Symptom Input** 🤖

Pengguna bisa mendeskripsikan gejala mereka dalam bahasa natural/sehari-hari.

**Fitur:**

- Textarea input untuk cerita bebas: "Ceritakan apa yang kamu rasakan..."
- AI memproses teks dan mengidentifikasi:
    - Area tubuh yang relevan
    - Gejala spesifik
    - Entry point yang tepat di decision tree
    - Assessment awal dengan pertanyaan klarifikasi

**Benefit:**
Menurunkan barrier to entry untuk pengguna yang tidak tech-savvy atau tidak tahu terminology medis.

---

### 6. **AI Medical Summary Generator** 📝

Menghasilkan ringkasan gejala profesional yang dapat dibawa ke dokter.

**Fitur:**

- Ringkasan dalam format yang bisa dibaca dokter
- Versi bahasa medis dan bahasa sederhana
- Mencakup: durasi gejala, intensitas, faktor yang memperburuk/membaik
- Rekomendasi topik yang ditanyakan ke dokter
- Exportable sebagai print atau screenshot

**Manfaat:**
Memposisikan platform sebagai "jembatan menuju dokter" bukan pengganti dokter.

---

### 7. **Contextual Health Education** 📚

Penjelasan kesehatan yang dipersonalisasi berdasarkan hasil assessment pengguna.

**Fitur:**

- Penjelasan dalam bahasa awam
- Koneksi antara gejala pengguna dan kondisi
- Faktor risiko yang relevan dengan profil pengguna
- Langkah pencegahan yang konkret dan actionable

---

## 🔧 Tech Stack

### Backend

- **Framework:** Laravel 12.0
- **Language:** PHP 8.2+
- **Database:** MySQL/PostgreSQL (via Eloquent ORM)
- **API:** RESTful API dengan JSON responses
- **Authentication:** Laravel native auth + Inertia
- **Validation:** Form validation dengan custom rules

### Frontend

- **UI Framework:** React 19.2
- **Styling:** Tailwind CSS 4.0 + Shadcn UI
- **Form Management:** React Hook Form 7.71
- **Data Fetching:** TanStack React Query 5.90
- **Animations:** Framer Motion 12.34 + GSAP 3.14
- **Charts:** Recharts 3.7 (untuk Health Score radar chart)
- **Icons:** Lucide React 0.575
- **Toast Notifications:** Sonner 2.0
- **Server Communication:** Axios 1.11
- **Router:** Inertia.js React 2.3

### Build Tools

- **Build System:** Vite 7.0.7
- **Concurrency:** Concurrently untuk dev mode
- **Task Runner:** Artisan (Laravel CLI)
- **Package Manager:** Composer (PHP) + NPM (Node.js)

### Development Tools

- **Testing:** PHPUnit 11.5 (Backend), Jest (Frontend)
- **Code Quality:** Laravel Pint (PHP linter)
- **Environment:** Laravel Sail (Docker)
- **Debugging:** Laravel Pail (log viewer)

---

## 🖥️ Persyaratan Sistem

### Minimum Requirements

- **PHP:** 8.2 atau lebih tinggi
- **Node.js:** 18.0 atau lebih tinggi
- **NPM:** 9.0 atau lebih tinggi
- **Composer:** 2.0 atau lebih tinggi
- **Database:** MySQL 8.0+ atau PostgreSQL 12+
- **RAM:** 2GB minimum
- **Disk Space:** 1GB minimum

### Recommended Requirements

- **PHP:** 8.3+
- **Node.js:** 20 LTS
- **RAM:** 4GB+
- **SSD:** 5GB+
- **OS:** Linux, macOS, atau Windows (dengan WSL2)

---

## 📦 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/medicheckid.git
cd medicheckid
```

### 2. Quick Setup (Otomatis)

```bash
composer run-script setup
```

Atau setup manual dengan langkah-langkah berikut:

### 3. Backend Setup

```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database dan run migrations
php artisan migrate

# Seed database (opsional)
php artisan db:seed
```

### 4. Frontend Setup

```bash
# Install Node dependencies
npm install

# Build frontend assets
npm run build
```

### 5. Start Development Server

```bash
npm run dev
```

Perintah ini akan menjalankan:

- Laravel development server (http://localhost:8000)
- Vite development server
- Laravel queue listener
- Laravel Pail (log viewer)

Akses aplikasi di: **http://localhost:8000**

---

## ⚙️ Konfigurasi

### Environment Variables (.env)

```bash
# App Configuration
APP_NAME=MediCheck
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medicheckid
DB_USERNAME=root
DB_PASSWORD=

# Cache & Session
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

# Mail (untuk email notifications)
MAIL_MAILER=log
MAIL_FROM_ADDRESS=hello@example.com

# AI API (untuk Natural Language & Health Education)
ANTHROPIC_API_KEY=your-api-key-here
# atau
OPENAI_API_KEY=your-api-key-here
```

### Database Setup

```bash
# Buat database baru
mysql -u root -p -e "CREATE DATABASE medicheckid CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
php artisan migrate

# Seed data khusus
php artisan db:seed --class=HealthFacilitySeeder
php artisan db:seed --class=RegionSeeder
```

---

## 🚀 Cara Menggunakan

### Menggunakan Body Map

1. Buka halaman utama aplikasi
2. Lihat ilustrasi tubuh SVG di tengah layar
3. **Klik area tubuh** yang mengalami masalah
4. Panel samping akan menampilkan daftar gejala untuk area tersebut
5. Pilih gejala yang relevan dan klik "Cek Gejala Ini"

### Natural Language Input

1. Di bawah body map, temukan textarea dengan placeholder "Ceritakan apa yang kamu rasakan..."
2. **Ketik deskripsi gejala Anda** dalam bahasa natural (contoh: "Kepala saya nyut-nyutan dari tadi pagi, mual, dan mata saya terasa berat")
3. Klik tombol "Analisis"
4. AI akan mengidentifikasi gejala dan membawa Anda ke decision tree yang tepat

### Menjalankan Symptom Checker

1. Setelah masuk ke decision tree, **jawab pertanyaan** dengan memilih salah satu opsi
2. Progress bar di atas menunjukkan langkah Anda
3. Gunakan tombol **"Kembali"** untuk mengubah jawaban
4. Setelah mencapai hasil akhir, review kemungkinan kondisi dan rekomendasi

### Menggunakan Health Score Calculator

1. Dari halaman hasil symptom checker, klik **"Cek Health Score"**
2. Jawab **30 pertanyaan interaktif** tentang tidur, aktivitas, nutrisi, dll.
3. Proses ini memakan waktu 5-7 menit
4. Lihat **radar chart** yang menunjukkan 6 dimensi kesehatan Anda
5. Terima rekomendasi prioritas untuk meningkatkan skor Anda

### Mengakses Panduan P3K

1. Dari navigasi utama, pilih **"Pertolongan Pertama"**
2. **Pilih kondisi darurat** yang ingin Anda pelajari
3. Ikuti **langkah demi langkah** dengan visual yang jelas
4. Gunakan **timer built-in** untuk langkah yang memerlukan waktu tertentu
5. Emergency numbers selalu tersedia di banner atas

### Export & Share

- **Ringkasan untuk Dokter:** Dari hasil symptom checker, klik tombol "Ringkasan Dokter" → Screenshot atau Print
- **Health Score:** Dari hasil Health Score, tombol "Share" untuk membagikan ke social media

---

## 📁 Struktur Proyek

```
medicheckid/
├── app/
│   ├── Http/
│   │   ├── Controllers/          # Frontend controllers
│   │   └── Middleware/           # Middleware custom
│   ├── Models/
│   │   ├── User.php              # User model
│   │   ├── HealthFacility.php    # Health facility model
│   │   └── Region.php            # Region/area model
│   └── Providers/
│       └── AppServiceProvider.php # Service providers
│
├── resources/
│   ├── css/
│   │   └── app.css               # Global styles
│   ├── js/
│   │   ├── app.jsx               # Main React app
│   │   ├── bootstrap.js          # Bootstrap configuration
│   │   ├── components/           # Reusable React components
│   │   │   ├── BodyMap.jsx       # SVG Body Map
│   │   │   ├── SymptomChecker.jsx
│   │   │   ├── HealthScore.jsx
│   │   │   └── P3KGuide.jsx
│   │   ├── features/             # Feature modules
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utility functions
│   │   └── Pages/                # Inertia page components
│   └── views/
│       └── app.blade.php         # Main Blade template
│
├── routes/
│   ├── web.php                   # Web routes
│   ├── api.php                   # API routes
│   └── console.php               # Console/CLI routes
│
├── database/
│   ├── migrations/               # Database migrations
│   │   ├── create_health_facilities_table.php
│   │   └── create_regions_table.php
│   ├── seeders/                  # Database seeders
│   └── factories/                # Model factories
│
├── config/
│   ├── app.php                   # App configuration
│   ├── database.php              # Database configuration
│   ├── auth.php                  # Authentication
│   └── ...
│
├── tests/
│   ├── Feature/                  # Feature tests
│   └── Unit/                     # Unit tests
│
├── public/
│   ├── index.php                 # Entry point
│   ├── build/                    # Vite build output
│   └── ...
│
├── storage/                      # Application storage
│   ├── app/
│   ├── framework/
│   └── logs/
│
├── package.json                  # NPM dependencies
├── composer.json                 # Composer dependencies
├── vite.config.js                # Vite configuration
├── phpunit.xml                   # PHPUnit configuration
└── artisan                       # Laravel CLI
```

---

## 🔌 API Endpoints

### Symptom Checker API

```
POST   /api/symptom-checker/parse-natural-language
  - Input: { text: string }
  - Output: { symptoms: [], bodyArea: string, urgency: string }

GET    /api/symptom-checker/tree/:bodyArea
  - Output: Decision tree untuk area tubuh tertentu

POST   /api/symptom-checker/evaluate
  - Input: { answers: object }
  - Output: { conditions: [], urgency: string, recommendations: [] }
```

### Health Score API

```
GET    /api/health-score/questions
  - Output: Array dari 30 pertanyaan

POST   /api/health-score/calculate
  - Input: { responses: object }
  - Output: { dimensions: {}, aggregate: number, chart: {} }
```

### AI Enhancement API

```
POST   /api/ai/generate-medical-summary
  - Input: { symptomResults: object }
  - Output: { summary: string, recommendations: [] }

POST   /api/ai/generate-health-education
  - Input: { condition: string, userProfile: object }
  - Output: { explanation: string, tips: [] }
```

### Utilities API

```
GET    /api/health-facilities
  - Params: ?region=&type=&search=
  - Output: Array dari health facilities

GET    /api/regions
  - Output: Array dari semua region/area

GET    /api/p3k-guides
  - Output: Array dari panduan pertolongan pertama
```

---

## 🧪 Testing

### Run All Tests

```bash
php artisan test
```

### Run Feature Tests Only

```bash
php artisan test --testsuite=Feature
```

### Run Unit Tests Only

```bash
php artisan test --testsuite=Unit
```

### Run With Coverage

```bash
php artisan test --coverage
```

---

## 🤝 Kontribusi

Kami mengapresiasi kontribusi dari komunitas! Berikut cara berkontribusi:

1. **Fork repository** ini
2. **Buat branch fitur** (`git checkout -b feature/AmazingFeature`)
3. **Commit perubahan Anda** (`git commit -m 'Add some AmazingFeature'`)
4. **Push ke branch** (`git push origin feature/AmazingFeature`)
5. **Buka Pull Request**

### Panduan Kontribusi

- Pastikan kode mengikuti laravel/php best practices
- Tulis test untuk fitur baru
- Update dokumentasi jika diperlukan
- Gunakan meaningful commit messages

---

## 📝 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

---

## 👤 Author

**MediCheck ID Development Team**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: hello@medicheckid.com

---

## 🙏 Ucapan Terima Kasih

- Laravel framework team
- React.js community
- Tailwind CSS documentation
- Inertia.js documentation
- Semua kontributor yang telah membantu

---

## 📞 Dukungan

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. **Buka Issue** di [GitHub Issues](https://github.com/yourusername/medicheckid/issues)
2. **Hubungi tim** melalui email: support@medicheckid.com
3. **Join komunitas** di [Discord Server](https://discord.gg/medicheckid)

---

## 🚀 Roadmap

### Beta Release (Q1 2026)

- ✅ Animated SVG Body Map
- ✅ Decision Tree Symptom Checker (10 kondisi)
- ✅ Health Score Calculator
- 🔄 AI Natural Language Input
- 🔄 Medical Summary Generator

### V1.0 Release (Q2 2026)

- 📋 Interactive P3K Guide
- 📋 AI Health Education
- 📋 User Accounts & History
- 📋 Health Facility Integration

### Future Enhancements (Q3-Q4 2026)

- 🎯 Symptom Checker dengan 50+ kondisi
- 🎯 Integration dengan real healthcare providers
- 🎯 Telemedicine features
- 🎯 Mobile app (iOS/Android)
- 🎯 Community forum & user stories

---

<div align="center">

**Made with ❤️ for better health literacy in Indonesia**

[Website](https://medicheckid.com) • [Documentation](https://docs.medicheckid.com) • [Issues](https://github.com/yourusername/medicheckid/issues)

</div>
