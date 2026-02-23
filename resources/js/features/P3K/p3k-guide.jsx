// resources/js/features/P3K/p3k-guide.jsx
import { useState, useEffect, useRef } from "react";
import {
    Play,
    Pause,
    RotateCcw,
    ChevronRight,
    Phone,
    AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const P3K_DATA = [
    {
        id: "cpr",
        title: "CPR (Resusitasi Jantung Paru)",
        emoji: "❤️",
        urgency: "emergency",
        color: "red",
        callFirst: true,
        steps: [
            {
                title: "Pastikan Keamanan",
                instruction:
                    "Pastikan area aman untuk kamu dan korban. Jangan pindahkan korban jika ada kemungkinan cedera leher/punggung.",
                duration: null,
            },
            {
                title: "Cek Respons",
                instruction:
                    'Tepuk bahu korban dengan tegas dan panggil namanya keras-keras: "Pak/Bu, apa kamu baik-baik saja?"',
                duration: 10,
            },
            {
                title: "Hubungi 119",
                instruction:
                    "Jika tidak ada respons, segera hubungi 119 atau minta orang lain menelepon. Aktifkan speaker agar bisa terus melakukan CPR.",
                duration: null,
                action: { type: "call", number: "119" },
            },
            {
                title: "Posisi Tangan",
                instruction:
                    "Letakkan tumit telapak tangan di tengah dada (setengah bawah tulang dada). Tempatkan tangan satunya di atas dan kunci jari-jari.",
                duration: null,
            },
            {
                title: "30 Kompresi",
                instruction:
                    "Tekan keras (5-6 cm) dan cepat (100-120x/menit). Biarkan dada kembali naik penuh setelah setiap kompresi. Hitung: 1-2-3...30",
                duration: 18,
            },
            {
                title: "2 Napas Bantuan",
                instruction:
                    "Miringkan kepala, angkat dagu. Tutup hidung, tiupkan udara selama 1 detik hingga dada mengembang. Ulangi 2x.",
                duration: 5,
            },
            {
                title: "Ulangi Siklus",
                instruction:
                    "Lanjutkan siklus 30 kompresi : 2 napas. Jangan berhenti sampai bantuan medis tiba atau korban menunjukkan tanda kehidupan.",
                duration: null,
            },
        ],
    },
    {
        id: "choking",
        title: "Tersedak (Heimlich Maneuver)",
        emoji: "🫁",
        urgency: "emergency",
        color: "red",
        callFirst: false,
        steps: [
            {
                title: "Kenali Tersedak",
                instruction:
                    'Tanda: tidak bisa bicara/batuk/bernapas, memegang leher dengan kedua tangan, wajah membiru. Tanya: "Apakah kamu tersedak?"',
                duration: null,
            },
            {
                title: "Berdiri di Belakang",
                instruction:
                    "Berdiri di belakang korban. Untuk anak <5 tahun, berlutut. Minta korban menundukkan sedikit kepalanya ke depan.",
                duration: null,
            },
            {
                title: "Posisi Tangan",
                instruction:
                    "Kepalkan satu tangan dan letakkan ibu jari di atas pusar, di bawah tulang dada. Genggam kepalan dengan tangan satunya.",
                duration: null,
            },
            {
                title: "Hentakan ke Dalam-Atas",
                instruction:
                    "Berikan hentakan kuat ke arah dalam dan atas (seperti huruf J terbalik). Ulangi hingga benda asing keluar atau korban pingsan.",
                duration: null,
            },
            {
                title: "Jika Pingsan",
                instruction:
                    "Jika korban pingsan, rebahkan dengan hati-hati ke lantai dan hubungi 119 segera. Mulai CPR jika tidak ada napas.",
                duration: null,
                action: { type: "call", number: "119" },
            },
        ],
    },
    {
        id: "burn",
        title: "Luka Bakar",
        emoji: "🔥",
        urgency: "high",
        color: "orange",
        callFirst: false,
        steps: [
            {
                title: "Jauhkan dari Panas",
                instruction:
                    "Segera jauhkan korban dari sumber panas. Untuk kebakaran pakaian: STOP (berhenti), DROP (jatuh), ROLL (berguling).",
                duration: null,
            },
            {
                title: "Siram Air Dingin",
                instruction:
                    "Siram area yang terbakar dengan air mengalir yang sejuk (bukan es) selama minimal 20 menit. Ini langkah paling penting!",
                duration: 1200,
            },
            {
                title: "Lepas Perhiasan",
                instruction:
                    "Lepas perhiasan, jam tangan, sabuk di sekitar area luka SEBELUM area membengkak. Jangan lepas pakaian yang menempel.",
                duration: null,
            },
            {
                title: "Tutup dengan Kain Bersih",
                instruction:
                    "Tutup dengan kain bersih yang tidak berbulu atau plastik wrap yang bersih. Jangan gunakan kapas, selimut berbulu, atau mentega.",
                duration: null,
            },
            {
                title: "Cari Bantuan Medis",
                instruction:
                    "Untuk luka bakar: lebih besar dari telapak tangan, di wajah/tangan/kaki/sendi, atau mengelupas — SEGERA ke IGD.",
                duration: null,
            },
        ],
    },
    {
        id: "bleeding",
        title: "Luka dan Perdarahan",
        emoji: "🩸",
        urgency: "high",
        color: "orange",
        callFirst: false,
        steps: [
            {
                title: "Lindungi Diri",
                instruction:
                    "Gunakan sarung tangan lateks atau kantong plastik bersih jika tersedia untuk melindungi diri dari darah orang lain.",
                duration: null,
            },
            {
                title: "Tekan Langsung",
                instruction:
                    "Tekan luka dengan kain atau pembalut bersih. Tekan kuat dan tahan tanpa melepaskan. Jangan lihat luka setiap saat.",
                duration: 600,
            },
            {
                title: "Pertahankan Tekanan",
                instruction:
                    "Terus tekan selama minimal 10 menit. Jika kain basah oleh darah, JANGAN dilepas — tambahkan kain baru di atasnya.",
                duration: null,
            },
            {
                title: "Tinggikan",
                instruction:
                    "Jika luka di anggota gerak, angkat bagian tersebut di atas level jantung (jika tidak ada kemungkinan fraktur).",
                duration: null,
            },
            {
                title: "Ke IGD Jika Berat",
                instruction:
                    "Segera ke IGD jika: perdarahan tidak berhenti setelah 15 menit tekanan, luka dalam/panjang, atau luka karena gigitan hewan.",
                duration: null,
            },
        ],
    },
    {
        id: "fainting",
        title: "Pingsan (Sinkop)",
        emoji: "😵",
        urgency: "moderate",
        color: "yellow",
        callFirst: false,
        steps: [
            {
                title: "Tangkap dan Rebahkan",
                instruction:
                    "Tangkap korban sebelum jatuh. Rebahkan secara perlahan dalam posisi telentang di permukaan yang aman.",
                duration: null,
            },
            {
                title: "Tinggikan Kaki",
                instruction:
                    "Angkat kaki korban sekitar 30 cm di atas level jantung (kecuali ada cedera kaki). Ini membantu aliran darah ke otak.",
                duration: null,
            },
            {
                title: "Longgarkan Pakaian",
                instruction:
                    "Longgarkan pakaian yang ketat di leher, dada, dan pinggang. Pastikan ada sirkulasi udara yang baik.",
                duration: null,
            },
            {
                title: "Pantau Pernapasan",
                instruction:
                    "Periksa apakah korban bernafas. Jika ya, biarkan berbaring dan tunggu sadar sendiri (biasanya 1-2 menit).",
                duration: 120,
            },
            {
                title: "Setelah Sadar",
                instruction:
                    "Bantu duduk perlahan setelah sadar. Jangan berdiri terlalu cepat. Berikan minuman manis jika sadar penuh dan bisa menelan.",
                duration: null,
            },
        ],
    },
    {
        id: "seizure",
        title: "Kejang",
        emoji: "⚡",
        urgency: "high",
        color: "orange",
        callFirst: true,
        steps: [
            {
                title: "Jauhkan Bahaya",
                instruction:
                    "Jauhkan benda-benda keras atau tajam dari sekitar korban. Jangan menahan gerakan kejang — biarkan mengikuti alaminya.",
                duration: null,
            },
            {
                title: "Amankan Kepala",
                instruction:
                    "Letakkan sesuatu yang lunak (jaket, bantal) di bawah kepala. Jangan masukkan apapun ke dalam mulut!",
                duration: null,
            },
            {
                title: "Posisi Recovery",
                instruction:
                    "Jika memungkinkan, miringkan korban ke satu sisi untuk mencegah tersedak jika muntah.",
                duration: null,
            },
            {
                title: "Catat Durasi",
                instruction:
                    "Catat waktu mulai kejang. Hubungi 119 segera jika kejang berlangsung > 5 menit atau tidak ada riwayat epilepsi sebelumnya.",
                duration: null,
                action: { type: "call", number: "119" },
            },
            {
                title: "Setelah Kejang",
                instruction:
                    "Setelah berhenti, korban mungkin bingung atau mengantuk (post-ictal state). Tetap tenang, bicaralah dengan lembut.",
                duration: null,
            },
        ],
    },
];

// ── Timer Component ──────────────────────────────────────
function StepTimer({ duration, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);

    const start = () => setRunning(true);
    const pause = () => setRunning(false);
    const reset = () => {
        setRunning(false);
        setTimeLeft(duration);
    };

    useEffect(() => {
        if (running && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((t) => {
                    if (t <= 1) {
                        clearInterval(intervalRef.current);
                        setRunning(false);
                        onComplete?.();
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [running]);

    const pct = ((duration - timeLeft) / duration) * 100;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    return (
        <div className="border-3 border-brutal-black bg-brutal-black p-4 mt-3">
            {/* Circular timer display */}
            <div className="relative w-24 h-24 mx-auto mb-3">
                <svg
                    viewBox="0 0 100 100"
                    className="transform -rotate-90 w-full h-full"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke="#2a2a2a"
                        strokeWidth="8"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke={timeLeft === 0 ? "#00C851" : "#FFE500"}
                        strokeWidth="8"
                        strokeDasharray={`${(276 * pct) / 100} 276`}
                        strokeLinecap="square"
                        style={{ transition: "stroke-dasharray 1s linear" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-brutal-white text-xl leading-none">
                        {timeLeft === 0
                            ? "✓"
                            : `${mins}:${String(secs).padStart(2, "0")}`}
                    </span>
                </div>
            </div>

            <div className="flex justify-center gap-2">
                {!running && timeLeft === duration && (
                    <Button
                        size="sm"
                        variant="default"
                        onClick={start}
                        className="border-2 border-brutal-yellow bg-brutal-yellow text-brutal-black hover:bg-brutal-yellow/80"
                    >
                        <Play size={14} />
                        Mulai Timer
                    </Button>
                )}
                {running && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={pause}
                        className="border-2 border-brutal-white text-brutal-white hover:bg-brutal-white/10"
                    >
                        <Pause size={14} />
                        Pause
                    </Button>
                )}
                {!running && timeLeft < duration && timeLeft > 0 && (
                    <>
                        <Button
                            size="sm"
                            variant="default"
                            onClick={start}
                            className="border-2 border-brutal-yellow bg-brutal-yellow text-brutal-black hover:bg-brutal-yellow/80"
                        >
                            <Play size={14} />
                            Lanjut
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={reset}
                            className="border-2 border-brutal-white text-brutal-white hover:bg-brutal-white/10"
                        >
                            <RotateCcw size={14} />
                            Reset
                        </Button>
                    </>
                )}
                {timeLeft === 0 && (
                    <Button
                        size="sm"
                        variant="default"
                        onClick={reset}
                        className="border-2 border-brutal-green bg-brutal-green text-brutal-white hover:bg-brutal-green/80"
                    >
                        ✓ Selesai — Lanjut
                    </Button>
                )}
            </div>
        </div>
    );
}

// ── Guide Viewer ─────────────────────────────────────────
function GuideViewer({ guide, onBack }) {
    const [currentStep, setCurrentStep] = useState(0);

    const step = guide.steps[currentStep];
    const isLast = currentStep === guide.steps.length - 1;
    const isFirst = currentStep === 0;

    const urgencyBg = {
        emergency: "bg-brutal-red text-brutal-white",
        high: "bg-brutal-orange text-brutal-white",
        moderate: "bg-brutal-yellow text-brutal-black",
    }[guide.urgency];

    return (
        <div className="animate-slide-in">
            {/* Header */}
            <div
                className={cn(
                    "border-4 border-brutal-black p-4 mb-4 shadow-brutal-lg flex items-center gap-3",
                    urgencyBg,
                )}
            >
                <span className="text-3xl">{guide.emoji}</span>
                <div>
                    <h2 className="font-display text-xl leading-tight">
                        {guide.title}
                    </h2>
                    {guide.callFirst && (
                        <p className="text-xs font-body font-bold opacity-80 mt-0.5">
                            ⚠️ Hubungi 119 sebelum atau sambil melakukan ini
                        </p>
                    )}
                </div>
            </div>

            {guide.callFirst && (
                <a
                    href="tel:119"
                    className="flex items-center justify-center gap-3 w-full py-3 mb-4 bg-brutal-red border-4 border-brutal-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                    <Phone size={20} className="text-brutal-white" />
                    <div className="text-center">
                        <span className="font-display text-2xl text-brutal-white leading-none block">
                            119
                        </span>
                        <span className="font-body text-brutal-white/80 text-xs">
                            Panggil Ambulans
                        </span>
                    </div>
                </a>
            )}

            {/* Step counter */}
            <div className="flex gap-1.5 mb-4">
                {guide.steps.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setCurrentStep(i)}
                        className={cn(
                            "h-2 flex-1 border-2 border-brutal-black cursor-pointer transition-all",
                            i < currentStep
                                ? "bg-brutal-black"
                                : i === currentStep
                                    ? "bg-brutal-yellow"
                                    : "bg-brutal-gray",
                        )}
                    />
                ))}
            </div>

            {/* Step Content */}
            <Card className="mb-4 border-3 border-brutal-black shadow-brutal-lg">
                <CardHeader className="bg-brutal-black">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brutal-yellow border-2 border-brutal-yellow flex items-center justify-center font-display text-xl text-brutal-black">
                            {currentStep + 1}
                        </div>
                        <h3 className="font-display text-xl text-brutal-white">
                            {step.title}
                        </h3>
                    </div>
                </CardHeader>
                <CardContent className="p-5">
                    <p className="font-body text-base leading-relaxed text-brutal-black">
                        {step.instruction}
                    </p>

                    {step.duration && (
                        <StepTimer
                            key={`timer-${currentStep}`}
                            duration={step.duration}
                            onComplete={() => {
                                if (!isLast) setCurrentStep((s) => s + 1);
                            }}
                        />
                    )}

                    {step.action?.type === "call" && (
                        <a
                            href={`tel:${step.action.number}`}
                            className="mt-3 flex items-center gap-2 border-3 border-brutal-black bg-brutal-red text-brutal-white px-4 py-3 font-body font-bold shadow-brutal hover:shadow-brutal-lg transition-all"
                        >
                            <Phone size={18} />
                            Hubungi {step.action.number} Sekarang
                        </a>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    disabled={isFirst}
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="border-3 border-brutal-black"
                >
                    ← Kembali
                </Button>
                {!isLast ? (
                    <Button
                        variant="default"
                        onClick={() => setCurrentStep((s) => s + 1)}
                        className="flex-1 border-3 border-brutal-black shadow-brutal-sm"
                    >
                        Langkah Berikutnya
                        <ChevronRight size={14} />
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        onClick={onBack}
                        className="flex-1 border-3 border-brutal-black bg-brutal-green hover:bg-brutal-green/90 shadow-brutal-sm"
                    >
                        ✓ Selesai
                    </Button>
                )}
            </div>
        </div>
    );
}

// ── Main P3K Guide ───────────────────────────────────────
export default function P3KGuide() {
    const [selected, setSelected] = useState(null);

    if (selected) {
        return (
            <GuideViewer guide={selected} onBack={() => setSelected(null)} />
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Emergency Banner */}
            <div className="bg-brutal-red border-4 border-brutal-black shadow-brutal-lg p-4 mb-6 flex items-center gap-3">
                <AlertTriangle
                    size={24}
                    className="text-brutal-white shrink-0"
                    strokeWidth={2.5}
                />
                <div>
                    <p className="font-display text-brutal-white">
                        Dalam Keadaan Darurat?
                    </p>
                    <div className="flex gap-4 mt-1">
                        <a
                            href="tel:119"
                            className="font-body text-brutal-yellow font-bold text-sm hover:underline"
                        >
                            📞 119 — Ambulans
                        </a>
                        <a
                            href="tel:1500567"
                            className="font-body text-brutal-yellow font-bold text-sm hover:underline"
                        >
                            📞 1500-567 — Hotline
                        </a>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="border-b-3 border-brutal-black pb-4 mb-6">
                <h2 className="font-display text-3xl">
                    Panduan Pertolongan Pertama
                </h2>
                <p className="font-body text-brutal-muted text-sm mt-1">
                    Pilih kondisi darurat untuk panduan step-by-step
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {P3K_DATA.map((guide) => {
                    const urgencyConfig = {
                        emergency: {
                            border: "border-brutal-red",
                            badgeVariant: "destructive",
                            label: "DARURAT",
                        },
                        high: {
                            border: "border-brutal-orange",
                            badgeVariant: "default",
                            label: "SEGERA",
                        },
                        moderate: {
                            border: "border-brutal-black",
                            badgeVariant: "secondary",
                            label: "PENTING",
                        },
                    }[guide.urgency];

                    return (
                        <button
                            key={guide.id}
                            onClick={() => setSelected(guide)}
                            className={cn(
                                "text-left border-4 p-4 bg-brutal-white",
                                "shadow-brutal hover:shadow-brutal-lg transition-all duration-150",
                                "hover:-translate-x-1 hover:-translate-y-1",
                                "active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm",
                                urgencyConfig.border,
                            )}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-4xl">{guide.emoji}</span>
                                <Badge
                                    variant={urgencyConfig.badgeVariant}
                                    className="border-2 border-brutal-black rounded-none text-xs"
                                >
                                    {urgencyConfig.label}
                                </Badge>
                            </div>
                            <h3 className="font-display text-lg leading-tight mb-1">
                                {guide.title}
                            </h3>
                            <p className="font-body text-xs text-brutal-muted">
                                {guide.steps.length} langkah
                                {guide.callFirst && " • Hubungi 119 dulu"}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-brutal-blue font-body font-bold text-sm">
                                <span>Lihat Panduan</span>
                                <ChevronRight size={14} />
                            </div>
                        </button>
                    );
                })}
            </div>

            <p className="text-center text-xs text-brutal-muted font-body mt-6">
                Panduan ini bersifat informatif berdasarkan standar PMI dan WHO.
                Ikuti pelatihan P3K resmi untuk penanganan yang lebih tepat.
            </p>
        </div>
    );
}
