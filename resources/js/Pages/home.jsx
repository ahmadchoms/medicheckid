// resources/js/pages/Public/Home.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import {
    Activity,
    BookOpen,
    MapPin,
    AlertTriangle,
    Heart,
    ArrowRight,
    ChevronRight,
    TrendingUp,
    Users,
    Shield,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PublicLayout from "@/components/layouts/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ── Animated counter ─────────────────────────────────────
function AnimatedCounter({
    target,
    suffix = "",
    prefix = "",
    duration = 2000,
}) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasRun = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasRun.current) {
                    hasRun.current = true;
                    const startTime = performance.now();
                    const step = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(step);
                        else setCount(target);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);

    return (
        <span ref={ref} className="tabular-nums">
            {prefix}
            {count.toLocaleString("id-ID")}
            {suffix}
        </span>
    );
}

// ── Stats Section ─────────────────────────────────────────
const STATS = [
    {
        value: 21,
        suffix: "%",
        label: "Balita Indonesia alami stunting",
        source: "SSGI 2022",
        color: "red",
        emoji: "📊",
    },
    {
        value: 64,
        suffix: "JT",
        label: "Kasus ISPA per tahun di Indonesia",
        source: "Kemenkes 2023",
        color: "blue",
        emoji: "😷",
    },
    {
        value: 9.8,
        suffix: "%",
        label: "Penduduk alami gangguan mental",
        source: "Riskesdas 2018",
        color: "orange",
        emoji: "🧠",
    },
    {
        value: 62,
        suffix: "%",
        label: "Tidak tahu kapan harus ke IGD",
        source: "Kemenkes 2023",
        color: "yellow",
        emoji: "🏥",
    },
];

// ── Features ──────────────────────────────────────────────
const FEATURES = [
    {
        href: "/cek-gejala",
        icon: Activity,
        emoji: "🩺",
        title: "Cek Gejala Interaktif",
        desc: "Body map anatomis + decision tree 12 kondisi. Cari tahu kemungkinan penyebab gejalamu dan apa yang harus dilakukan.",
        color: "blue",
        badge: "Fitur Utama",
    },
    {
        href: "/health-score",
        icon: BookOpen,
        emoji: "📊",
        title: "Health Score Check",
        desc: "Evaluasi gaya hidup dari 6 dimensi kesehatan. Dapatkan skor personal dan rekomendasi prioritas.",
        color: "green",
        badge: "Popular",
    },
    {
        href: "/p3k",
        icon: AlertTriangle,
        emoji: "🚨",
        title: "Panduan P3K",
        desc: "Panduan step-by-step CPR, tersedak, luka bakar, kejang dan lebih banyak lagi. Dengan timer built-in.",
        color: "red",
        badge: "Life-saving",
    },
    {
        href: "/faskes",
        icon: MapPin,
        emoji: "📍",
        title: "Cari Faskes Terdekat",
        desc: "Filter puskesmas, klinik, dan RS di kotamu. Lihat jam operasional dan kontak langsung.",
        color: "yellow",
        badge: "Lokasi",
    },
];

// ── How It Works ──────────────────────────────────────────
const HOW_IT_WORKS = [
    {
        step: "01",
        title: "Pilih Area",
        desc: "Klik area tubuh yang tidak nyaman di body map interaktif kami.",
    },
    {
        step: "02",
        title: "Jawab Pertanyaan",
        desc: "Sistem memandu kamu melalui pertanyaan terstruktur untuk memahami gejala.",
    },
    {
        step: "03",
        title: "Terima Panduan",
        desc: "Dapatkan kemungkinan kondisi, home care, dan tanda darurat dalam hitungan detik.",
    },
];

export default function Home() {
    return (
        <PublicLayout fullWidth>
            {/* ── Hero ──────────────────────────────────────────── */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brutal-white">
                {/* Grid background */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(10,10,10,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.06) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* Yellow accent block */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-brutal-yellow border-l-4 border-brutal-black hidden lg:block" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div className="animate-slide-up">
                            <Badge variant="blue" size="lg" className="mb-4">
                                🏥 Platform Kesehatan Interaktif #1 Indonesia
                            </Badge>

                            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-none mb-6">
                                Pahami
                                <br />
                                <span className="inline-block bg-brutal-black text-brutal-yellow px-3 py-1 mt-1">
                                    Tubuhmu.
                                </span>
                                <br />
                                Ambil
                                <br />
                                Langkah
                                <br />
                                <span className="inline-block border-4 border-brutal-black px-3 py-1 mt-1">
                                    Tepat.
                                </span>
                            </h1>

                            <p className="font-body text-lg text-brutal-muted max-w-md mb-8 leading-relaxed">
                                Cek gejala interaktif, health score personal,
                                panduan P3K, dan cari faskes terdekat — semua
                                dalam satu platform yang dirancang untuk
                                masyarakat Indonesia.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="primary"
                                    size="xl"
                                    onClick={() =>
                                        (window.location.href = "/cek-gejala")
                                    }
                                >
                                    Cek Gejala Sekarang
                                    <ArrowRight size={20} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="xl"
                                    onClick={() =>
                                        (window.location.href = "/health-score")
                                    }
                                >
                                    Cek Health Score
                                </Button>
                            </div>

                            <p className="mt-4 text-xs font-body text-brutal-muted">
                                ⚠️ Platform edukasi — bukan pengganti diagnosis
                                dokter
                            </p>
                        </div>

                        {/* Right: Hero visual */}
                        <div className="hidden lg:flex justify-center items-center">
                            <div className="relative">
                                {/* Big stat cards floating */}
                                <div className="border-4 border-brutal-black bg-brutal-white shadow-brutal-xl p-6 w-72 animate-float">
                                    <p className="font-body text-sm font-bold text-brutal-muted mb-1">
                                        INDONESIA BUTUH PLATFORM INI
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-display text-6xl text-brutal-red">
                                            62%
                                        </span>
                                        <span className="font-body text-sm text-brutal-black font-bold leading-tight">
                                            masyarakat tidak tahu kapan harus ke
                                            IGD
                                        </span>
                                    </div>
                                    <div className="mt-3 border-t-3 border-brutal-black pt-2 flex items-center gap-1 text-xs font-body text-brutal-muted">
                                        <TrendingUp size={12} />
                                        <span>Kemenkes RI 2023</span>
                                    </div>
                                </div>

                                {/* Badge cards */}
                                <div className="absolute -bottom-6 -right-6 border-4 border-brutal-black bg-brutal-blue p-4 shadow-brutal-lg">
                                    <div className="text-center">
                                        <p className="font-display text-4xl text-brutal-white">
                                            12
                                        </p>
                                        <p className="font-body text-xs text-brutal-white/80 font-bold">
                                            Kondisi tercakup
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute -top-6 -left-6 border-4 border-brutal-black bg-brutal-yellow p-3 shadow-brutal">
                                    <div className="flex items-center gap-2">
                                        <Shield
                                            size={20}
                                            className="text-brutal-black"
                                        />
                                        <span className="font-display text-sm">
                                            Data Valid WHO
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats ─────────────────────────────────────────── */}
            <section className="bg-brutal-black border-y-4 border-brutal-black py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <p className="font-display text-brutal-yellow text-center mb-8 text-sm uppercase tracking-widest">
                        Mengapa Platform Ini Penting untuk Indonesia
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {STATS.map((stat, i) => (
                            <div
                                key={i}
                                className="border-3 border-brutal-white/20 p-5 text-center"
                            >
                                <p className="text-3xl mb-2">{stat.emoji}</p>
                                <p className="font-display text-4xl sm:text-5xl text-brutal-yellow leading-none mb-1">
                                    <AnimatedCounter
                                        target={parseFloat(stat.value)}
                                        suffix={stat.suffix}
                                    />
                                </p>
                                <p className="font-body text-brutal-white/80 text-xs leading-snug mb-2">
                                    {stat.label}
                                </p>
                                <p className="font-mono text-brutal-white/40 text-xs">
                                    {stat.source}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ──────────────────────────────────────── */}
            <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <Badge variant="outline" size="md" className="mb-3">
                            Fitur Platform
                        </Badge>
                        <h2 className="font-display text-4xl md:text-5xl leading-none">
                            Satu Platform,
                            <br />
                            <span className="bg-brutal-yellow px-2">
                                Semua Kebutuhan
                            </span>
                        </h2>
                    </div>
                    <p className="font-body text-brutal-muted max-w-sm">
                        Dari cek gejala hingga cari faskes, semua tersedia tanpa
                        perlu install aplikasi.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {FEATURES.map((feature, i) => {
                        const Icon = feature.icon;
                        const colorMap = {
                            blue: {
                                bg: "bg-brutal-blue",
                                icon: "text-brutal-white",
                                accent: "border-brutal-blue",
                            },
                            green: {
                                bg: "bg-brutal-green",
                                icon: "text-brutal-white",
                                accent: "border-brutal-green",
                            },
                            red: {
                                bg: "bg-brutal-red",
                                icon: "text-brutal-white",
                                accent: "border-brutal-red",
                            },
                            yellow: {
                                bg: "bg-brutal-yellow",
                                icon: "text-brutal-black",
                                accent: "border-brutal-yellow",
                            },
                        };
                        const c = colorMap[feature.color];

                        return (
                            <Link
                                key={feature.href}
                                href={feature.href}
                                className={cn(
                                    "group border-4 border-brutal-black bg-brutal-white p-6",
                                    "shadow-brutal hover:shadow-brutal-xl transition-all duration-150",
                                    "hover:-translate-x-1 hover:-translate-y-1",
                                    "active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm",
                                    "block",
                                )}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className={cn(
                                            "w-12 h-12 border-3 border-brutal-black flex items-center justify-center",
                                            c.bg,
                                        )}
                                    >
                                        <Icon
                                            size={22}
                                            className={c.icon}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                    <Badge variant="outline" size="sm">
                                        {feature.badge}
                                    </Badge>
                                </div>
                                <h3 className="font-display text-2xl mb-2">
                                    {feature.title}
                                </h3>
                                <p className="font-body text-brutal-muted text-sm leading-relaxed mb-4">
                                    {feature.desc}
                                </p>
                                <div className="flex items-center gap-1.5 font-body font-bold text-sm text-brutal-blue group-hover:gap-3 transition-all">
                                    <span>Buka Fitur</span>
                                    <ChevronRight size={16} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* ── How It Works ──────────────────────────────────── */}
            <section className="py-16 bg-brutal-gray border-y-4 border-brutal-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <Badge variant="default" size="md" className="mb-3">
                            Cara Kerja
                        </Badge>
                        <h2 className="font-display text-4xl md:text-5xl">
                            Mudah. Cepat. Tepat.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        {HOW_IT_WORKS.map((step, i) => (
                            <div key={i} className="relative">
                                {/* Connector line */}
                                {i < HOW_IT_WORKS.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-[calc(100%-1rem)] w-8 h-1 bg-brutal-black z-10" />
                                )}
                                <Card className="p-6 border-3 border-brutal-black shadow-brutal">
                                    <CardContent className="p-0">
                                        <div className="border-3 border-brutal-black bg-brutal-black w-16 h-16 flex items-center justify-center mb-4 shadow-brutal-sm">
                                            <span className="font-display text-2xl text-brutal-yellow">
                                                {step.step}
                                            </span>
                                        </div>
                                        <h3 className="font-display text-2xl mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="font-body text-brutal-muted text-sm">
                                            {step.desc}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Button
                            variant="primary"
                            size="xl"
                            onClick={() =>
                                (window.location.href = "/cek-gejala")
                            }
                        >
                            <Zap size={20} />
                            Coba Cek Gejala Sekarang
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Trust / Disclaimer ───────────────────────────── */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
                <div className="border-4 border-brutal-black bg-brutal-yellow shadow-brutal-xl p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="border-4 border-brutal-black bg-brutal-black p-4 flex-shrink-0">
                            <Shield size={36} className="text-brutal-yellow" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-display text-2xl mb-2">
                                Platform yang Jujur dan Transparan
                            </h3>
                            <p className="font-body text-brutal-black/80 text-sm leading-relaxed">
                                MediCheck ID adalah alat edukasi kesehatan,{" "}
                                <strong>bukan pengganti dokter</strong>. Semua
                                informasi didasarkan pada panduan WHO, Kemenkes
                                RI, dan IDAI. Data yang kamu masukkan{" "}
                                <strong>tidak pernah dikirim ke server</strong>{" "}
                                — tersimpan hanya di perangkatmu.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-3">
                                <Badge variant="default" size="md">
                                    🏥 Berbasis Panduan WHO
                                </Badge>
                                <Badge variant="default" size="md">
                                    🔒 Data Tersimpan Lokal
                                </Badge>
                                <Badge variant="default" size="md">
                                    📚 Referensi Kemenkes RI
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
