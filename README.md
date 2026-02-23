# MediCheck ID
### Platform Literasi Kesehatan Interaktif untuk Indonesia
**SOFTCOMPT TECHSOFT 2026 — HIMA-RPL Politeknik Negeri Indramayu**

---

## 🏗️ Arsitektur & Stack

| Layer | Teknologi | Alasan Pemilihan |
|---|---|---|
| **Backend Framework** | Laravel 11 | Ekosistem mature, Inertia adapter |
| **SPA Bridge** | Inertia.js | SSR-ready, routing Laravel, tanpa REST API boilerplate |
| **Frontend** | React 18 | Component model, hooks, concurrent features |
| **Styling** | TailwindCSS 3 + Custom Theme | Utility-first, Neo-Brutalism design system |
| **Build Tool** | Vite 5 | HMR cepat, code splitting otomatis |
| **Charts** | Recharts | Composable, React-native |
| **Animation** | Framer Motion + GSAP | Motion: component-level; GSAP: scroll & timeline |
| **Form** | React Hook Form + Zod | Performant, type-safe validation |
| **Server State** | TanStack Query | Caching, background sync (siap backend) |
| **Icons** | Lucide React | Consistent, tree-shakeable |
| **Date** | Day.js | Ringan, immutable |
| **Persistence** | localStorage (client-only) | Privacy-first: data tidak ke server |

---

## 📁 Feature-Based Folder Structure

```
resources/js/
├── app.jsx                         # Entry point: providers, Inertia setup
├── styles/
│   └── globals.css                 # CSS variables, base styles, component classes
│
├── lib/                            # Pure logic / data (no React)
│   ├── utils.js                    # cn(), formatters, storage helpers
│   ├── symptomTree.js              # Decision tree data (12 conditions, 6 areas)
│   └── healthScore.js              # 6-dimension scoring algorithm + DIMENSIONS data
│
├── hooks/                          # Reusable React hooks
│   ├── useHealthScore.js           # Read/write health score localStorage
│   └── index.js                   # useLocalStorage, useDebounce, useMediaQuery
│
├── components/
│   ├── ui/                         # Design System — atomic components
│   │   ├── Button.jsx              # 6 variants, 5 sizes, loading state
│   │   ├── Card.jsx                # Card + CardHeader + CardBody + CardFooter
│   │   ├── Badge.jsx               # Badge + UrgencyBadge
│   │   ├── Input.jsx               # Input + Textarea + Select + Checkbox + RangeSlider
│   │   ├── Modal.jsx               # Accessible modal with portal
│   │   ├── Toast.jsx               # Toast system with ToastProvider + useToast
│   │   └── Feedback.jsx            # ProgressBar + StepProgress + Skeleton + EmptyState + ErrorBoundary
│   │
│   ├── layouts/
│   │   └── PublicLayout.jsx        # Header + EmergencyBanner + DesktopNav + MobileDrawer + BottomNav + Footer
│   │
│   └── features/                   # Feature-specific components
│       ├── bodymap/
│       │   └── BodyMap.jsx         # SVG body map + hotspot overlays + area buttons
│       ├── symptomchecker/
│       │   └── SymptomChecker.jsx  # QuestionCard + ResultCard + decision tree engine
│       ├── healthscore/
│       │   └── HealthScoreAssessment.jsx  # Multi-step form + RadarChart + ResultScreen
│       ├── p3k/
│       │   └── P3KGuide.jsx        # GuideViewer + StepTimer + 6 emergency guides
│       └── faskes/                 # (expandable)
│
└── pages/                          # Inertia page components (route-level)
    └── Public/
        ├── Home.jsx                # Landing page: Hero + AnimatedCounters + Features + HowItWorks
        ├── CekGejala.jsx           # BodyMap + SymptomChecker split layout
        ├── HealthScore.jsx         # HealthScoreAssessment wrapper
        ├── P3K.jsx                 # P3KGuide wrapper
        └── Faskes.jsx              # Search + Filter + FaskesCard grid
```

---

## 🎨 Neo-Brutalism Design System

### Color Palette
```css
--brutal-yellow:   #FFE500   /* Primary accent — CTA, highlights */
--brutal-blue:     #0047FF   /* Secondary — info, links */
--brutal-red:      #FF2D20   /* Danger, emergency */
--brutal-green:    #00C851   /* Success, safe */
--brutal-orange:   #FF6B00   /* Warning, moderate */
--brutal-black:    #0A0A0A   /* Text, borders */
--brutal-white:    #FAFAFA   /* Background */
--brutal-gray:     #F0F0F0   /* Subtle backgrounds */
```

### Typography
- **Display**: `Archivo Black` — headings, numbers, labels
- **Body**: `DM Sans` — paragraphs, descriptions, UI text
- **Mono**: `JetBrains Mono` — scores, data, codes

### Shadow System (Offset Hard Shadow)
```css
shadow-brutal:    4px 4px 0px #0A0A0A   /* Default */
shadow-brutal-sm: 2px 2px 0px #0A0A0A   /* Compact */
shadow-brutal-lg: 6px 6px 0px #0A0A0A   /* Emphasis */
shadow-brutal-xl: 8px 8px 0px #0A0A0A   /* Hero/modal */
```

### Interaction Pattern
```
Default  → hover: translate(-2px, -2px) + larger shadow
Hover    → active: translate(+2px, +2px) + smaller shadow
Active   → release: back to default
```

---

## 🔑 Fitur Utama

### 1. Interactive Body Map (`/cek-gejala`)
- SVG anatomical silhouette dengan 7 hotspot overlay
- Klik/tap area → highlight visual + label muncul
- Fallback: tombol area di bawah (aksesibel, mobile-friendly)
- 6 area: Kepala, Dada, Perut, Kulit, Anggota Gerak, Umum

### 2. Decision Tree Symptom Checker
- Decision tree JavaScript murni (zero backend)
- Max depth 5 level, 12 kondisi, 6 area tubuh
- Card stack navigation dengan tombol "Kembali"
- Result: kemungkinan kondisi, urgency, home care, red flags, penjelasan
- Export: print / share result

### 3. Health Score Assessment (6 Dimensi)
- 6 dimensi: Tidur, Aktivitas, Nutrisi, Hidrasi, Stres, Sosial
- 20 pertanyaan (range slider + pilihan visual)
- Radar chart interaktif (Recharts)
- Skor 0-100 + grade A-E + rekomendasi prioritas
- Auto-save ke localStorage

### 4. P3K Interactive Guide
- 6 kondisi: CPR, Tersedak, Luka Bakar, Perdarahan, Pingsan, Kejang
- Step-by-step dengan timer built-in (circular SVG countdown)
- Emergency call button langsung di dalam guide
- Berdasarkan standar PMI + WHO

### 5. Faskes Finder
- 8 data faskes (puskesmas, klinik, RS) di Indramayu + Cirebon
- Filter: nama, kota, tipe, IGD saja
- One-tap call + Google Maps link
- Data statis — expandable ke API Kemenkes

---

## 🚀 Setup & Development

```bash
# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Copy env & generate key
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Development (both servers)
php artisan serve &
npm run dev

# Production build
npm run build
```

---

## 📱 Responsive Design

| Breakpoint | Layout |
|---|---|
| `< 640px` (mobile) | Single column, bottom navigation bar |
| `640–768px` (tablet) | 2-column grid, mobile nav |
| `768–1024px` (small desktop) | Hamburger nav, wider cards |
| `>= 1024px` (desktop) | Full navigation, split layout (body map + checker) |

**Mobile-first strategy:**
- Bottom navigation bar dengan 5 tab (mobile only)
- Body map + checker: vertical stack pada mobile, side-by-side pada desktop
- Touch targets minimum 44x44px (Apple HIG standard)
- Hotspot SVG responsif dengan ellipse yang cukup besar

---

## ⚡ Performance Optimizations

- **Code splitting**: vendor / charts / motion / forms / icons di-chunk terpisah
- **Lazy JSON loading**: WHO LMS tables hanya di-load saat kalkulator digunakan
- **LocalStorage caching**: health score & profil tersimpan tanpa API call
- **CSS-only animations**: micro-interactions menggunakan Tailwind keyframes
- **SVG optimization**: body map menggunakan shape primitif (bukan file eksternal)
- **Font preloading**: Google Fonts dengan `display=swap`

---

## 🔒 Privacy & Safety

- **Zero server data**: semua input pengguna tersimpan hanya di `localStorage` device
- **Medical disclaimer**: tampil di setiap halaman dan setiap result
- **Safe messaging**: konten kesehatan mental mengikuti panduan WHO safe messaging
- **Verified sources**: WHO Growth Standards, Kemenkes RI, Permenkes 2019, PMI
- **Emergency always visible**: nomor 119 selalu tersedia di emergency banner dan result cards

---

## 🏆 Competitive Advantages (Demo Points)

1. **Body Map SVG** — visual yang langsung memorable dan berbeda dari semua pesaing
2. **Decision Tree Navigation** — card stack dengan animasi slide terasa seperti "ngobrol dengan dokter"  
3. **Radar Chart Health Score** — visual reveal saat pertama muncul sangat impactful
4. **P3K Timer Built-in** — satu-satunya platform dengan countdown timer untuk langkah P3K
5. **Neo-Brutalism Design** — identitas visual yang berani dan mudah diingat
6. **Mobile Bottom Navigation** — UX premium yang jarang ada di website kompetisi
7. **Emergency Always Accessible** — 119 terlihat di setiap kondisi, menunjukkan safety-consciousness

---

*MediCheck ID — SOFTCOMPT TECHSOFT 2026*  
*HIMA-RPL Politeknik Negeri Indramayu*