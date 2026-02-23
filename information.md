═══════════════════════════════════════════════════════════
PROYEK TIER S #2: MEDICHECK ID
Platform Cek Gejala & Literasi Kesehatan Berbasis Visual
═══════════════════════════════════════════════════════════

BAGIAN A: ANALISIS RINCI FITUR UTAMA

FITUR 1: Animated SVG Body Map
"Antarmuka Anatomis yang Mengubah Cara Orang Berinteraksi dengan Kesehatan"
Fungsi Produk
Ilustrasi tubuh manusia interaktif berbasis SVG di mana pengguna dapat mengklik atau mengetuk area tubuh mana pun untuk memulai proses identifikasi gejala. Area yang tersedia:

Kepala (mata, telinga, hidung, mulut, tenggorokan)
Dada (jantung, paru-paru, dada)
Perut (lambung, usus, liver, ginjal)
Anggota gerak (lengan, kaki, sendi)
Kulit (seluruh permukaan tubuh)

Setiap area memiliki "hotspot" tersembunyi yang responsif terhadap klik dan hover. Saat diklik, area terpilih berubah warna (highlight), dan panel samping muncul dengan daftar gejala yang relevan untuk area tersebut.
Mekanisme Teknis
html<!-- SVG dengan hotspot overlay -->
<svg id="body-map" viewBox="0 0 300 600">
  <!-- Ilustrasi tubuh statis -->
  <image href="body-silhouette.svg" width="300" height="600"/>
  
  <!-- Hotspot transparan (invisible shapes) -->
  <ellipse class="hotspot" data-area="head" 
           cx="150" cy="80" rx="50" ry="60"
           fill="transparent" stroke="none"/>
  <ellipse class="hotspot" data-area="chest" 
           cx="150" cy="220" rx="65" ry="70"
           fill="transparent" stroke="none"/>
  <!-- dst. -->
</svg>
javascriptdocument.querySelectorAll('.hotspot').forEach(hotspot => {
  hotspot.addEventListener('click', (e) => {
    const area = e.target.dataset.area;
    highlightArea(area);          // visual feedback
    showSymptomPanel(area);       // tampil panel gejala
    trackAreaSelection(area);     // untuk analytics lokal
  });
  
  hotspot.addEventListener('mouseenter', (e) => {
    pulseAnimation(e.target);     // hover glow effect
    showAreaTooltip(e.target.dataset.area);
  });
});
Animasi pulse menggunakan CSS keyframes:
css@keyframes anatomical-pulse {
  0% { fill: rgba(99, 179, 237, 0); }
  50% { fill: rgba(99, 179, 237, 0.3); }
  100% { fill: rgba(99, 179, 237, 0); }
}
.hotspot:hover { animation: anatomical-pulse 1.5s infinite; }
Value Proposition
Ini adalah diferensiator terkuat MediCheck ID. Semua platform kesehatan menggunakan form atau dropdown untuk input gejala. Body map mengubah pengalaman dari "mengisi kuesioner" menjadi "menjelajahi tubuh sendiri" — sebuah paradigm shift dalam health literacy UX yang membuat platform ini langsung memorable dan shareable.
Dampak terhadap User

Lowered cognitive friction: Tidak perlu tahu istilah medis terlebih dahulu — cukup klik "di sini sakit"
Spatial awareness: Pengguna menyadari koneksi antar organ (nyeri perut bisa berhubungan dengan liver atau usus)
Engagement yang organik: Banyak pengguna akan "menjelajahi" area yang tidak sakit pun karena rasa ingin tahu

Kompleksitas Teknis
Tingkat: Medium

SVG body map perlu dibuat atau diadaptasi dari sumber open-source (Wikimedia Commons memiliki body map SVG yang bebas lisensi)
Hotspot perlu dikalibrasi manual berdasarkan posisi SVG — ini memerlukan trial and error
Mobile touch events (touchstart, touchend) harus dihandle terpisah dari mouse events
Risiko: SVG yang terlalu detail bisa memperlambat rendering — gunakan versi yang di-simplify
Simplifikasi: Gunakan body silhouette sederhana dengan 8–10 hotspot area besar (bukan detail anatomis per organ)


FITUR 2: Decision Tree Symptom Checker
"Navigasi Gejala yang Terasa Seperti Percakapan dengan Dokter"
Fungsi Produk
Sistem pengecekan gejala berbasis pohon keputusan (decision tree) yang memandu pengguna melalui serangkaian pertanyaan terstruktur. Setiap jawaban menentukan pertanyaan berikutnya, hingga mencapai kesimpulan yang berisi:

Kemungkinan kondisi (1–3 kemungkinan, bukan diagnosa)
Tingkat urgensi (Darurat / Perlu Segera / Bisa Tunggu / Mandiri)
Rekomendasi tindakan (Home care / Klinik / Puskesmas / UGD)
Red flags — tanda-tanda yang harus segera ke dokter

Mekanisme Teknis
Decision tree dimodelkan sebagai objek JavaScript bersarang:
javascriptconst symptomTree = {
  "kepala": {
    question: "Di mana tepatnya rasa sakit atau tidak nyaman di kepala?",
    options: [
      {
        label: "Sakit kepala / pusing",
        next: {
          question: "Sudah berapa lama?",
          options: [
            {
              label: "Baru saja (< 24 jam)",
              next: {
                question: "Apakah disertai demam (> 38°C)?",
                options: [
                  {
                    label: "Ya",
                    result: {
                      conditions: ["Flu", "Infeksi virus"],
                      urgency: "moderate",
                      action: "Istirahat, minum banyak air. Jika demam > 39°C atau tidak turun 3 hari, ke Puskesmas.",
                      redFlags: ["Kaku leher", "Ruam kulit", "Kejang"]
                    }
                  },
                  {
                    label: "Tidak",
                    result: { /* ... */ }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
};
UI decision tree menggunakan pendekatan "card stack" — setiap langkah adalah card baru yang muncul dengan slide-in animation, menggantikan card sebelumnya. Progress bar di atas menunjukkan estimasi langkah tersisa.
Value Proposition
Mengubah proses "Googling gejala" yang menghasilkan WebMD-induced health anxiety menjadi navigasi terstruktur yang memberikan respons proporsional. Seseorang dengan sakit kepala biasa tidak perlu panik membaca artikel tentang tumor otak — sistem akan memfilter dan memberikan respons yang tepat sesuai konteks.
Dampak terhadap User

Reduced health anxiety: Memberikan kerangka berpikir yang tenang dan terstruktur
Action clarity: Pengguna tahu persis apa yang harus dilakukan — tidak ada ambiguitas
Trust building: Setiap rekomendasi dilengkapi reasoning yang transparan

Kompleksitas Teknis
Tingkat: Medium

Membangun decision tree yang komprehensif tapi tidak terlalu dalam (max 5 level) adalah tantangan desain, bukan teknis
State management tree harus menyimpan path yang sudah dilalui (untuk tombol "Kembali")
Jumlah kondisi yang direkomendasikan untuk 2 minggu: 10–15 kondisi umum (ISPA, demam, diare, sakit kepala, nyeri dada, nyeri perut, batuk, sesak nafas, pusing, mata merah, luka, alergi, mual, nyeri sendi, gangguan tidur)
Validasi medis: Minta review dari teman yang punya latar belakang medis atau kesehatan sebelum launch


FITUR 3: Health Score Calculator (6-Dimensional)
"Kesehatan Bukan Hanya Tidak Sakit — Ini Buktinya"
Fungsi Produk
Kalkulator kesehatan holistik yang mengukur kualitas hidup pengguna melalui 6 dimensi:

Tidur: Durasi, kualitas, konsistensi jadwal
Aktivitas Fisik: Frekuensi, intensitas, durasi olahraga per minggu
Nutrisi: Keragaman makanan, frekuensi makan, konsumsi buah/sayur
Hidrasi: Jumlah air putih per hari
Stres & Mental: Level stres, metode coping, waktu relaksasi
Koneksi Sosial: Kualitas hubungan sosial, isolasi, dukungan sosial

Output: Skor 0–100 untuk setiap dimensi + skor agregat + radar chart yang memvisualisasikan kekuatan dan kelemahan + rekomendasi prioritas yang dipersonalisasi.
Mekanisme Teknis
javascriptfunction calculateHealthScore(responses) {
  const weights = {
    sleep: 0.20,
    activity: 0.20,
    nutrition: 0.20,
    hydration: 0.15,
    stress: 0.15,
    social: 0.10
  };
  
  const dimensionScores = {
    sleep: scoreSleep(responses.sleep),       // 0-100
    activity: scoreActivity(responses.activity),
    nutrition: scoreNutrition(responses.nutrition),
    hydration: scoreHydration(responses.hydration),
    stress: scoreStress(responses.stress),
    social: scoreSocial(responses.social)
  };
  
  const aggregate = Object.entries(dimensionScores)
    .reduce((sum, [dim, score]) => sum + (score * weights[dim]), 0);
  
  return { dimensions: dimensionScores, aggregate, tier: getTier(aggregate) };
}
Radar chart via Chart.js dengan animasi fill yang smooth saat pertama kali muncul memberikan efek "reveal" yang sangat impactful.
Value Proposition
Health Score mengubah platform dari "platform untuk orang sakit" menjadi "platform untuk semua orang" — termasuk orang sehat yang ingin optimize wellness mereka. Ini memperluas target audience secara signifikan dan memberikan alasan untuk kembali ke platform secara reguler.
Dampak terhadap User

Self-awareness: Banyak pengguna tidak menyadari mereka kurang tidur, terhidrasi, atau terisolasi sosial
Gamification naturally: Skor mendorong pengguna ingin "naik level" — engagement tanpa harus dibuat-buat
Progress tracking: Re-test setiap bulan untuk melihat improvement — retention mechanic organik

Kompleksitas Teknis
Tingkat: Low-Medium

Algoritma scoring adalah weighted average — sangat straightforward
Tantangan utama: desain questionnaire yang tidak terasa boring (30+ pertanyaan harus terasa ringan)
Solusi: Gunakan slider, emoji picker, dan visual rating daripada radio button biasa
Radar chart Chart.js: implementasi standar, dokumentasi sangat baik


FITUR 4: Interactive P3K (Pertolongan Pertama) Guide
"Panduan Darurat yang Bisa Diakses Saat Paling Dibutuhkan"
Fungsi Produk
Panduan pertolongan pertama yang disajikan dalam format step-by-step visual yang dapat digunakan dalam kondisi darurat real. Dirancang untuk bisa dibaca cepat, bahkan dalam kondisi panik. Kondisi yang dicakup:

Luka dan perdarahan
Luka bakar
Tersedak (Heimlich maneuver)
CPR (Resusitasi Jantung Paru)
Pingsan
Kejang
Gigitan hewan
Keracunan makanan
Patah tulang (pertolongan awal)
Heat stroke

Setiap panduan memiliki:

Step indicators yang besar dan jelas (untuk dibaca sambil melakukan tindakan)
Timer built-in untuk langkah yang memerlukan durasi tertentu (misal: 30 kompresi CPR)
Visual illustration untuk setiap langkah (SVG animated)
Emergency numbers yang always visible di banner atas

Mekanisme Teknis
javascriptconst cprGuide = {
  title: "CPR (Resusitasi Jantung Paru)",
  emergency: true,
  steps: [
    {
      number: 1,
      title: "Pastikan Keamanan",
      instruction: "Pastikan area aman untuk kamu dan korban.",
      duration: null,
      illustration: "step1-safety.svg"
    },
    {
      number: 2,
      title: "Cek Respons",
      instruction: "Tepuk bahu korban kuat-kuat, panggil namanya.",
      duration: 10,  // seconds, trigger timer
      illustration: "step2-check.svg"
    },
    {
      number: 3,
      title: "Panggil Bantuan",
      instruction: "Hubungi 119 segera. Minta orang lain menelepon.",
      duration: null,
      action: { type: "call", number: "119" },
      illustration: "step3-call.svg"
    }
    // dst.
  ]
};
Timer built-in menggunakan setInterval dengan visual countdown circle (CSS animation).
Value Proposition
Panduan P3K yang bisa benar-benar digunakan dalam kondisi nyata — bukan hanya konten informatif yang dibaca saat santai. Ini mengangkat level utilitas platform dari "informatif" menjadi "life-saving." Narasi ini sangat powerful untuk presentasi.
Dampak terhadap User

Emergency readiness: Pengguna yang pernah membaca bisa mengingat langkah utama lebih baik
Accessibility: Dirancang untuk dibaca di bawah tekanan — font besar, langkah singkat
Trust anchor: Fitur ini membangun kepercayaan bahwa platform ini serius tentang kesehatan

Kompleksitas Teknis
Tingkat: Low

Konten panduan adalah yang paling kompleks — pastikan akurasi medis dengan mereview panduan dari PMI atau WHO
Timer component: standar setInterval, tidak ada kompleksitas
Ilustrasi step: gunakan SVG sederhana atau ikon yang ekspresif


BAGIAN B: EVALUASI STRATEGIS INTEGRASI AI — MediCheck ID

🤖 AI Enhancement #1: Natural Language Symptom Input
Tipe: Enhancement terhadap Symptom Checker — menambahkan entry point alternatif
Use Case Konkret:
Di bawah body map, tersedia juga input teks bebas: "Ceritakan apa yang kamu rasakan..."
Pengguna mengetik: "Kepala saya nyut-nyutan dari tadi pagi, mual, dan mata saya terasa berat"
AI memproses teks ini dan:

Mengidentifikasi area tubuh yang relevan (kepala)
Mengekstrak gejala spesifik (nyeri berdenyut, mual, mata berat)
Menentukan entry point yang tepat di decision tree
Menghasilkan assessment awal berupa summary + pertanyaan klarifikasi

System: Kamu adalah medical triage assistant. Identifikasi gejala dari teks berikut,
tentukan sistem organ yang terlibat, tingkat urgensi awal (low/medium/high/emergency),
dan 2-3 pertanyaan klarifikasi untuk memperjelas kondisi.
Respond ONLY in JSON format:
{
  "identified_symptoms": [],
  "body_area": "",
  "initial_urgency": "",
  "clarifying_questions": [],
  "summary": ""
}

User: "Kepala saya nyut-nyutan dari tadi pagi, mual, dan mata saya terasa berat"
Bagaimana AI Bekerja dalam Sistem:
[User input teks bebas]
      ↓
[API call ke LLM dengan structured output prompt]
      ↓
[Parse JSON response]
      ↓
[Highlight area tubuh di body map secara otomatis]
      ↓
[Pre-fill decision tree dengan gejala yang teridentifikasi]
      ↓
[Lanjut ke pertanyaan klarifikasi dalam decision tree]
Dampak terhadap UX:
Pengguna yang tidak tahu harus klik mana di body map kini bisa bercerita dalam bahasa natural. Ini menurunkan barrier to entry secara drastis dan membuat platform inklusif untuk pengguna yang kurang tech-savvy.
Dampak terhadap Keunggulan Kompetitif:
Menggabungkan body map (visual) + natural language input (verbal) + decision tree (terstruktur) menciptakan multi-modal health interaction yang tidak ada di platform manapun di Indonesia saat ini.

🤖 AI Enhancement #2: Symptom Summary & Medical Letter Generator
Tipe: Enhancement terhadap output Symptom Checker
Use Case Konkret:
Setelah pengguna menyelesaikan symptom checker, AI menghasilkan ringkasan yang bisa dibawa ke dokter:
System: Buat ringkasan gejala pasien dalam format yang bisa dibaca dokter.
Gunakan bahasa medis yang tepat tapi juga tersedia versi sederhana.
Sertakan: durasi gejala, intensitas, faktor yang memperburuk/membaik,
gejala penyerta, dan pertanyaan yang disarankan untuk ditanyakan ke dokter.

Context:
- Gejala utama: Sakit kepala berdenyut, area frontal-temporal
- Durasi: 6 jam
- Intensitas: 7/10
- Faktor memperburuk: Cahaya terang, suara keras
- Gejala penyerta: Mual, sensitif cahaya
- Riwayat: Tidak ada pengobatan saat ini
Output: "Ringkasan Gejala untuk Dokter" dalam format yang bisa di-print atau di-screenshot, beserta 3 pertanyaan yang direkomendasikan untuk ditanyakan ke dokter.
Dampak:
Mengubah platform dari "cek gejala sendiri" menjadi "persiapan kunjungan dokter" — bridging gap antara self-care dan professional care. Ini juga merespons kekhawatiran bahwa platform ini menggantikan dokter, dengan memposisikan dirinya sebagai jembatan menuju dokter.

🤖 AI Enhancement #3: Contextual Health Education
Tipe: Enhancement terhadap setiap result page
Use Case Konkret:
Setelah hasil assessment muncul (misalnya: kemungkinan tension headache), pengguna bisa klik "Pelajari Lebih Lanjut" dan AI menghasilkan penjelasan yang dipersonalisasi:

Apa itu tension headache dalam bahasa awam
Kenapa gejala yang dialami pengguna konsisten dengan kondisi ini
Faktor risiko yang relevan berdasarkan profil pengguna (jika sudah diisi)
Langkah pencegahan yang bisa dilakukan mulai hari ini

AI education ini jauh lebih engaging daripada artikel statis karena berbicara langsung ke kondisi spesifik pengguna — bukan artikel generik yang bisa dibaca di mana saja.

BAGIAN C: USER FLOW & SYSTEM FLOW — MediCheck ID

User Flow: Perjalanan Lengkap Pengguna
┌─────────────────────────────────────────────────────────────────┐
│  ENTRY POINT: Landing Page                                       │
│  User: Budi, 32 tahun, merasa tidak enak badan                  │
└─────────────────────────┬───────────────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │ Entry Path A                    │ Entry Path B
          │ [Klik area di Body Map]         │ [Ketik gejala di NL input]
          │                                 │
          ▼                                 ▼
   [Klik area "Perut"]            ["Perut saya sakit
          │                        sejak kemarin, mual"]
          │                                 │
          │                          [API call → JSON]
          │                          [Identifikasi: perut]
          │                          [Pre-fill gejala]
          └────────────────┬────────────────┘
                           │
┌─────────────────────────▼───────────────────────────────────────┐
│  STATE 1: Symptom Selection Panel                               │
│  Panel muncul dari samping (slide-in animation)                 │
│  Tampil daftar gejala untuk area "Perut":                       │
│  ☐ Mual    ☐ Kembung    ☐ Nyeri    ☐ Diare    ☐ Sembelit      │
│  ☐ Mual + Muntah    ☐ Nyeri setelah makan    ☐ Heartburn       │
│                                                                 │
│  [Budi centang: Nyeri + Mual + Kembung]                        │
│  [Klik: Cek Gejala Ini]                                        │
└─────────────────────────┬───────────────────────────────────────┘
                           │
┌─────────────────────────▼───────────────────────────────────────┐
│  STATE 2: Decision Tree Navigation (Step-by-step Cards)         │
│                                                                 │
│  Step 1/5: "Sudah berapa lama nyeri ini?"                      │
│  → [< 24 jam] → [1-3 hari] → [> 1 minggu]                     │
│  Budi pilih: 1-3 hari                                          │
│                                                                 │
│  Step 2/5: "Di mana tepatnya nyeri?"                           │
│  → [Atas perut] → [Tengah] → [Bawah] → [Menyebar]             │
│  Budi pilih: Atas perut                                        │
│                                                                 │
│  Step 3/5: "Apakah nyeri memburuk setelah makan?"             │
│  → [Ya] → [Tidak] → [Kadang-kadang]                            │
│  Budi pilih: Ya                                                │
│                                                                 │
│  Step 4/5: "Ada gejala lain yang menyertai?"                   │
│  → [Demam] → [Mual/Muntah] → [Tidak nafsu makan] → [Lainnya]  │
│  Budi pilih: Mual/Muntah                                       │
│                                                                 │
│  Step 5/5: "Adakah riwayat lambung/maag sebelumnya?"          │
│  → [Ya, pernah didiagnosa] → [Mungkin] → [Tidak tahu]         │
│  Budi pilih: Mungkin                                           │
└─────────────────────────┬───────────────────────────────────────┘
                           │
┌─────────────────────────▼───────────────────────────────────────┐
│  STATE 3: Result Page                                           │
│                                                                 │
│  🟡 KEMUNGKINAN KONDISI:                                        │
│  1. Gastritis (Maag) — kemungkinan tinggi                       │
│  2. GERD (Refluks Asam) — kemungkinan sedang                   │
│  3. Dispepsia Fungsional — kemungkinan rendah                  │
│                                                                 │
│  ⏰ TINGKAT URGENSI: SEDANG                                     │
│  Perlu perhatian dalam 24-48 jam. Tidak darurat.               │
│                                                                 │
│  ✅ YANG BISA DILAKUKAN SEKARANG:                               │
│  - Makan dalam porsi kecil tapi sering                         │
│  - Hindari makanan pedas, asam, berlemak                       │
│  - Posisi tidur kepala lebih tinggi                            │
│  - Antasida OTC bisa membantu gejala sementara                 │
│                                                                 │
│  🚨 SEGERA KE DOKTER JIKA:                                      │
│  - Nyeri sangat hebat tiba-tiba                                │
│  - Muntah darah atau feses berwarna hitam                      │
│  - Penurunan berat badan signifikan                            │
│                                                                 │
│  [Minta Ringkasan untuk Dokter - AI]                           │
│  [Cari Faskes Terdekat]                                        │
│  [Pelajari Lebih Lanjut - AI]                                  │
└─────────────────────────┬───────────────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │                                 │
   [Klik: Ringkasan Dokter]      [Klik: Cari Faskes]
          │                                 │
   [API call → generate]          [Filter form muncul]
   [medical summary]              [Pilih: Kota/Kab]
          │                       [Pilih: Jenis: Puskesmas/Klinik]
   [Tampil kartu ringkasan]       [Tampil daftar faskes simulasi]
   [Tombol: Print / Screenshot]   [Dengan embed Google Maps]
          │                                 │
          └────────────────┬────────────────┘
                           │
┌─────────────────────────▼───────────────────────────────────────┐
│  STATE 4: Health Score (Cross-selling antar fitur)              │
│  Banner: "Cegah Lebih Baik dari Mengobati"                     │
│  "Cek Health Score kamu untuk tahu risiko masalah lambung"     │
│  [Mulai Health Score Test]                                     │
└─────────────────────────┬───────────────────────────────────────┘
                           │
┌─────────────────────────▼───────────────────────────────────────┐
│  STATE 5: Health Score Assessment                               │
│  30 pertanyaan interaktif (slider + emoji picker)              │
│  Estimasi waktu: 5-7 menit                                     │
│  Progress bar selalu visible                                   │
└─────────────────────────┬───────────────────────────────────────┘
                           │
┌─────────────────────────▼───────────────────────────────────────┐
│  STATE 6: Health Score Result                                   │
│  Radar chart 6 dimensi (animasi reveal)                        │
│  Skor agregat: 62/100 — "Cukup Baik, Bisa Ditingkatkan"       │
│  Dimensi terendah: Stres (45/100) & Tidur (50/100)            │
│  Rekomendasi prioritas: 3 aksi konkret minggu ini             │
│  Badge: "Health Explorer — Level 1"                            │
│  [Share ke IG/WA] [Cek Ulang Bulan Depan] [Lihat Panduan P3K] │
└─────────────────────────────────────────────────────────────────┘

System Flow: Aliran Data Internal
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT SIDE (Browser)                                          │
│                                                                 │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────────┐ │
│  │  Body Map   │   │  NL Input    │   │  Direct Navigation   │ │
│  │  (SVG)      │   │  (Textarea)  │   │  (Search / Menu)     │ │
│  └──────┬──────┘   └──────┬───────┘   └─────────┬────────────┘ │
│         │                 │                      │             │
│         ▼                 ▼                      ▼             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Symptom Router                                         │   │
│  │  - Menerima input dari semua entry point               │   │
│  │  - Menentukan entry point decision tree                │   │
│  │  - Normalize data ke format internal                   │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────▼─────────────────────────────┐   │
│  │  Decision Tree Engine                                   │   │
│  │  - Load tree data dari JSON                            │   │
│  │  - Navigate berdasarkan user responses                 │   │
│  │  - Maintain navigation history (untuk tombol back)     │   │
│  │  - Generate result object saat leaf node tercapai      │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────▼─────────────────────────────┐   │
│  │  Result Renderer                                        │   │
│  │  - Map result object ke UI components                  │   │
│  │  - Urgency color coding                                │   │
│  │  - Action card generation                              │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────▼─────────────────────────────┐   │
│  │  Persistence Layer (localStorage)                       │   │
│  │  Key: "medicheck_history" → Array of past checks       │   │
│  │  Key: "medicheck_health_score" → Score + date          │   │
│  │  Key: "medicheck_profile" → Usia, kondisi kronis       │   │
│  │  Key: "medicheck_api_count" → Rate limit counter       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │ (conditional — AI features)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  EXTERNAL SERVICES                                              │
│                                                                 │
│  Anthropic / OpenAI API                                         │
│  - NL Symptom Parsing → structured JSON                        │
│  - Medical summary generation → formatted text                 │
│  - Health education → personalized explanation                 │
│  - Fallback: pre-written template responses jika API error     │
│                                                                 │
│  Google Maps Embed (opsional)                                   │
│  - Embed iframe untuk tampilkan faskes terdekat                │
│  - Tidak memerlukan API key untuk basic embed                  │
└─────────────────────────────────────────────────────────────────┘

State Machine: Critical States MediCheck ID
IDLE ──[klik body map / NL input / navigasi]──▶ AREA_SELECTED
                                                      │
                                             [pilih gejala]
                                                      │
                                                      ▼
                                              TREE_NAVIGATING ◀──[back]
                                                      │
                                             [mencapai leaf]
                                                      │
                                                      ▼
                                               RESULT_SHOWN
                                                      │
                    ┌─────────────────────────────────┤
                    │                                 │
                    ▼                                 ▼
            AI_GENERATING                    HEALTH_SCORE_TEST
                    │                                 │
                    ▼                                 ▼
            AI_RESULT_SHOWN                  HEALTH_SCORE_RESULT

Bottleneck & Risiko Teknis — MediCheck ID
Bottleneck 1: Akurasi dan Tanggung Jawab Medis
Masalah: Decision tree memberikan output yang mirip diagnosa — meskipun hanya "kemungkinan" — ini membawa risiko legal dan etis jika salah.
Solusi Komprehensif:

Disclaimer yang kuat dan visible di setiap langkah (bukan hanya di footer)
Framing bahasa: "kemungkinan kondisi" bukan "kamu menderita X"
Selalu akhiri dengan "konsultasikan dengan tenaga medis"
Tambahkan nama dan referensi sumber medis (WHO, Kemenkes, IDI) untuk memperkuat kredibilitas
Untuk 10 kondisi yang dicakup, review konten dengan referensi medis yang valid

Bottleneck 2: Kompleksitas Decision Tree Scale
Masalah: Decision tree yang terlalu dalam (>6 level) menjadi sulit di-maintain dan rawan inkonsistensi. Terlalu dangkal (<3 level) menghasilkan output yang tidak akurat.
Solusi: Terapkan maximum depth 5 level. Jika kondisi terlalu kompleks untuk ditangani dalam 5 level, arahkan ke "Kondisi Kompleks — Perlu Konsultasi Dokter" sebagai safe exit.
Bottleneck 3: UX Body Map di Mobile
Masalah: Area hotspot yang kecil sulit di-tap di layar sentuh kecil (< 5 inch). Satu hotspot bisa overlap dengan hotspot lain (dada vs perut).
Solusi:

Hotspot harus berukuran minimum 44x44px (standar Apple HIG untuk touch targets)
Tambahkan label teks di bawah body map sebagai alternatif klik
Gunakan pointer-events: all dengan area yang cukup besar di SVG

Bottleneck 4: Decision Tree JSON Size
Masalah: Jika 15 kondisi dengan masing-masing 5 level decision tree, JSON bisa mencapai 200KB+ dan memperlambat initial load.
Solusi: Lazy loading per area tubuh — hanya load tree untuk area "kepala" saat pengguna klik kepala. Bukan load seluruh tree sekaligus.
Bottleneck 5: AI Rate Limiting
Masalah: Demo dengan banyak pengguna atau juri yang mencoba bersamaan bisa menyebabkan API rate limit tercapai.
Solusi: Implementasi queue sederhana + loading state yang informatif. Fallback: tampilkan template response yang sudah disiapkan jika API gagal. Juri tidak perlu tahu apakah response dari AI atau template — yang penting konten berkualitas.