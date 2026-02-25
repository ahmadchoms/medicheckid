import { useState, useCallback } from "react";
import {
    Activity,
    RotateCcw,
    Info,
    Search,
    ArrowRight,
    MessageSquare,
    MousePointer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PublicLayout from "@/components/layouts/public-layout";
import SymptomChecker from "@/features/symptomchecker/symptom-checker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SYMPTOM_AREAS } from "@/lib/symptomTree";
import BodyMap from "@/features/bodymap/body-map";

const KEYWORD_MAP = {
    "sakit kepala": { area: "head", label: "Kepala & Wajah", emoji: "🧠" },
    pusing: { area: "head", label: "Kepala & Wajah", emoji: "🧠" },
    vertigo: { area: "head", label: "Kepala & Wajah", emoji: "🧠" },
    migrain: { area: "head", label: "Kepala & Wajah", emoji: "🧠" },
    "mata merah": { area: "head", label: "Kepala & Wajah", emoji: "🧠" },
    demam: { area: "general", label: "Umum / Seluruh Tubuh", emoji: "🌡️" },
    lelah: { area: "general", label: "Umum / Seluruh Tubuh", emoji: "🌡️" },
    kelelahan: { area: "general", label: "Umum / Seluruh Tubuh", emoji: "🌡️" },
    meriang: { area: "general", label: "Umum / Seluruh Tubuh", emoji: "🌡️" },
    batuk: { area: "chest", label: "Dada & Paru-paru", emoji: "🫁" },
    sesak: {
        area: "chest",
        label: "Dada & Paru-paru",
        emoji: "🫁",
        emergency: true,
    },
    "nyeri dada": {
        area: "chest",
        label: "Dada & Paru-paru",
        emoji: "🫁",
        emergency: true,
    },
    "dada sakit": {
        area: "chest",
        label: "Dada & Paru-paru",
        emoji: "🫁",
        emergency: true,
    },
    mual: { area: "abdomen", label: "Perut & Pencernaan", emoji: "🤢" },
    muntah: { area: "abdomen", label: "Perut & Pencernaan", emoji: "🤢" },
    diare: { area: "abdomen", label: "Perut & Pencernaan", emoji: "🤢" },
    "sakit perut": {
        area: "abdomen",
        label: "Perut & Pencernaan",
        emoji: "🤢",
    },
    maag: { area: "abdomen", label: "Perut & Pencernaan", emoji: "🤢" },
    kembung: { area: "abdomen", label: "Perut & Pencernaan", emoji: "🤢" },
    gatal: { area: "skin", label: "Kulit", emoji: "🩹" },
    ruam: { area: "skin", label: "Kulit", emoji: "🩹" },
    bengkak: { area: "skin", label: "Kulit", emoji: "🩹" },
    luka: { area: "skin", label: "Kulit", emoji: "🩹" },
    "nyeri sendi": { area: "limbs", label: "Anggota Gerak", emoji: "🦵" },
    kram: { area: "limbs", label: "Anggota Gerak", emoji: "🦵" },
    kesemutan: { area: "limbs", label: "Anggota Gerak", emoji: "🦵" },
    "sakit pinggang": { area: "limbs", label: "Anggota Gerak", emoji: "🦵" },
    cemas: { area: "general", label: "Umum / Seluruh Tubuh", emoji: "🌡️" },
    panik: { area: "general", label: "Umum / Seluruh Tubuh", emoji: "🌡️" },
    "tidak nafsu makan": {
        area: "general",
        label: "Umum / Seluruh Tubuh",
        emoji: "🌡️",
    },
    pilek: { area: "chest", label: "Dada & Paru-paru", emoji: "🫁" },
    flu: { area: "chest", label: "Dada & Paru-paru", emoji: "🫁" },
};

function analyzeText(text) {
    const lower = text.toLowerCase();
    const matches = [];
    const seen = new Set();

    for (const [keyword, info] of Object.entries(KEYWORD_MAP)) {
        if (lower.includes(keyword) && !seen.has(info.area)) {
            seen.add(info.area);
            matches.push({ keyword, ...info });
        }
    }

    return matches;
}

const MODES = [
    { id: "select", label: "Pilih Gejala", icon: MousePointer, emoji: "🖱️" },
    {
        id: "describe",
        label: "Ceritakan Gejala",
        icon: MessageSquare,
        emoji: "💬",
    },
];

export default function CekGejala() {
    const [mode, setMode] = useState("select");
    const [selectedArea, setSelectedArea] = useState(null);
    const [checkerKey, setCheckerKey] = useState(0);

    const [freeText, setFreeText] = useState("");
    const [textResult, setTextResult] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const handleModeChange = useCallback((newMode) => {
        setMode(newMode);
        setSelectedArea(null);
        setCheckerKey((k) => k + 1);
        setFreeText("");
        setTextResult(null);
        setShowResult(false);
    }, []);

    const handleAreaSelect = (areaId) => {
        setSelectedArea(areaId);
        setCheckerKey((k) => k + 1);
        setTimeout(() => {
            const el = document.getElementById("checker-panel");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
    };

    const handleReset = () => {
        setSelectedArea(null);
        setCheckerKey((k) => k + 1);
    };

    // LOGIKA BARU UNTUK TEXT SUBMIT
    const handleTextSubmit = () => {
        if (!freeText.trim()) return;
        const matches = analyzeText(freeText);
        setTextResult(matches);

        // Jika persis 1 gejala terdeteksi, langsung auto-render SymptomChecker
        if (matches.length === 1) {
            setSelectedArea(matches[0].area);
            setCheckerKey((k) => k + 1);
        } else {
            // Jika > 1 atau 0, tampilkan hasil list
            setSelectedArea(null);
        }

        setShowResult(false);
        requestAnimationFrame(() => {
            setTimeout(() => setShowResult(true), 50);
        });
    };

    return (
        <PublicLayout>
            {/* Page Header */}
            <div className="mb-8 border-b-3 border-brutal-black pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-brutal-blue border-3 border-brutal-black shadow-brutal flex items-center justify-center">
                                <Activity
                                    size={20}
                                    className="text-brutal-white"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <h1 className="font-display text-3xl md:text-4xl">
                                Cek Gejala
                            </h1>
                        </div>
                        <p className="font-body text-brutal-muted max-w-xl">
                            Pilih cara yang paling nyaman untuk memeriksa gejala
                            yang kamu rasakan.
                        </p>
                    </div>
                    {mode === "select" && selectedArea && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            className="shrink-0"
                        >
                            <RotateCcw size={14} />
                            Mulai Ulang
                        </Button>
                    )}
                </div>
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6">
                {MODES.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => handleModeChange(m.id)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-4 py-3 border-3 border-brutal-black font-body font-bold text-sm cursor-pointer transition-all duration-150",
                            mode === m.id
                                ? "bg-brutal-yellow text-brutal-black shadow-brutal -translate-x-0.5 -translate-y-0.5"
                                : "bg-brutal-white text-brutal-muted hover:bg-brutal-gray hover:shadow-brutal-sm",
                        )}
                    >
                        <m.icon size={16} />
                        {m.label}
                    </button>
                ))}
            </div>

            {/* Disclaimer */}
            <div className="border-3 border-brutal-yellow bg-brutal-yellow/10 p-3 mb-6 flex items-start gap-2">
                <Info
                    size={16}
                    className="text-brutal-orange shrink-0 mt-0.5"
                />
                <p className="text-xs font-body text-brutal-black">
                    <strong>Penting:</strong> Alat ini bersifat edukatif dan
                    BUKAN pengganti diagnosis dokter. Untuk kondisi darurat,
                    segera hubungi{" "}
                    <span className="inline-flex items-center px-1.5 py-0.5 bg-brutal-red/10 border-2 border-brutal-red font-display text-xs text-brutal-red rounded-md select-none">
                        119
                    </span>
                    .
                </p>
            </div>

            {/* ─── Mode: Pilih Gejala ─── */}
            {mode === "select" && (
                <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6 xl:gap-8">
                    <div className="order-1">
                        <Card className="sticky top-[76px] border-3 border-brutal-black shadow-brutal-lg">
                            <CardHeader>
                                <h2 className="font-display text-xl">
                                    Pilih Area Tubuh
                                </h2>
                                <p className="font-body text-xs text-brutal-muted mt-0.5">
                                    Klik ilustrasi atau tombol di bawah
                                </p>
                            </CardHeader>
                            <CardContent>
                                <BodyMap
                                    selectedArea={selectedArea}
                                    onAreaSelect={handleAreaSelect}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="order-2" id="checker-panel">
                        {!selectedArea ? (
                            <div className="h-full">
                                <Card className="p-6 mb-6 border-3 border-brutal-black bg-brutal-gray shadow-brutal-sm">
                                    <CardContent className="p-0">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-4xl">👈</span>
                                            <div>
                                                <p className="font-display text-xl">
                                                    Pilih area tubuh dulu
                                                </p>
                                                <p className="font-body text-sm text-brutal-muted">
                                                    Klik bagian yang sakit di
                                                    body map
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                                            {Object.values(SYMPTOM_AREAS).map(
                                                (area) => (
                                                    <button
                                                        key={area.id}
                                                        onClick={() =>
                                                            handleAreaSelect(
                                                                area.id,
                                                            )
                                                        }
                                                        className={cn(
                                                            "flex flex-col items-center gap-1 p-3 border-3 border-brutal-black cursor-pointer",
                                                            "font-body font-bold text-xs bg-brutal-white text-brutal-black",
                                                            "shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5",
                                                            "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                                                            "transition-all duration-150 hover:bg-brutal-yellow",
                                                        )}
                                                    >
                                                        <span className="text-2xl">
                                                            {area.emoji}
                                                        </span>
                                                        <span className="leading-tight text-center">
                                                            {area.label}
                                                        </span>
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <SymptomChecker
                                key={`${selectedArea}-${checkerKey}`}
                                areaId={selectedArea}
                                onReset={handleReset}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* ─── Mode: Ceritakan Gejala ─── */}
            {mode === "describe" && (
                <div className="max-w-2xl mx-auto">
                    <Card className="border-3 border-brutal-black shadow-brutal-lg">
                        <CardHeader>
                            <h2 className="font-display text-xl">
                                💬 Ceritakan Gejala Kamu
                            </h2>
                            <p className="font-body text-xs text-brutal-muted mt-0.5">
                                Jelaskan apa yang kamu rasakan dengan bahasa
                                sehari-hari
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <textarea
                                value={freeText}
                                onChange={(e) => setFreeText(e.target.value)}
                                placeholder="Contoh: Saya sudah dua hari demam tinggi, badan pegal-pegal, dan mual setiap habis makan..."
                                rows={4}
                                className={cn(
                                    "w-full p-4 border-3 border-brutal-black font-body text-sm",
                                    "bg-brutal-white placeholder:text-brutal-muted/60",
                                    "focus:outline-none focus:ring-2 focus:ring-brutal-blue focus:border-brutal-blue",
                                    "resize-none transition-colors",
                                )}
                            />
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleTextSubmit}
                                disabled={!freeText.trim()}
                                className="w-full"
                            >
                                <Search size={16} />
                                Analisis Gejala
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Container Hasil Analisis */}
                    <div className="mt-6">
                        {/* Jika area sudah otomatis terpilih ATAU user klik salah satu dari hasil analisis */}
                        {selectedArea ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {/* Tombol kembali hanya dimunculkan jika ada > 1 keluhan */}
                                {textResult && textResult.length > 1 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedArea(null)}
                                        className="mb-4 bg-brutal-white border-2 border-brutal-black shadow-brutal-sm hover:-translate-y-0.5"
                                    >
                                        <RotateCcw size={14} className="mr-2" />
                                        Kembali ke Daftar Gejala
                                    </Button>
                                )}
                                <SymptomChecker
                                    key={`${selectedArea}-${checkerKey}`}
                                    areaId={selectedArea}
                                    onReset={() => {
                                        setSelectedArea(null);
                                        setFreeText("");
                                        setTextResult(null);
                                    }}
                                />
                            </div>
                        ) : (
                            textResult !== null && (
                                /* Jika belum ada area terpilih, tampilkan list (terjadi jika >1 hasil atau 0 hasil) */
                                <div
                                    className={cn(
                                        "transition-all duration-300 ease-out",
                                        showResult
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-4",
                                    )}
                                >
                                    {textResult.length > 0 ? (
                                        <Card className="border-3 border-brutal-black shadow-brutal">
                                            <CardHeader>
                                                <h3 className="font-display text-lg">
                                                    🔍 Ditemukan Beberapa Gejala
                                                </h3>
                                                <p className="font-body text-xs text-brutal-muted">
                                                    Pilih salah satu area untuk
                                                    mulai diperiksa:
                                                </p>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {textResult.map((match) => (
                                                    <div
                                                        key={match.area}
                                                        className="flex items-center justify-between p-3 border-3 border-brutal-black bg-brutal-gray"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">
                                                                {match.emoji}
                                                            </span>
                                                            <div>
                                                                <p className="font-body font-bold text-sm">
                                                                    {
                                                                        match.label
                                                                    }
                                                                </p>
                                                                <p className="font-body text-xs text-brutal-muted">
                                                                    Kata kunci:
                                                                    "
                                                                    {
                                                                        match.keyword
                                                                    }
                                                                    "
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {match.emergency ? (
                                                            <span className="inline-flex items-center px-2 py-1 bg-brutal-red/10 border-2 border-brutal-red font-display text-xs text-brutal-red rounded-md select-none">
                                                                Darurat
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedArea(
                                                                        match.area,
                                                                    );
                                                                    setCheckerKey(
                                                                        (k) =>
                                                                            k +
                                                                            1,
                                                                    );
                                                                }}
                                                                className={cn(
                                                                    "inline-flex items-center gap-1 px-3 py-1.5 cursor-pointer",
                                                                    "bg-brutal-blue text-white border-2 border-brutal-black",
                                                                    "font-body font-bold text-xs",
                                                                    "hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5",
                                                                    "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                                                                    "transition-all duration-150",
                                                                )}
                                                            >
                                                                Periksa
                                                                <ArrowRight
                                                                    size={12}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}

                                                {textResult.some(
                                                    (m) => m.emergency,
                                                ) && (
                                                    <div className="p-3 mt-4 border-3 border-brutal-red bg-brutal-red/5 flex items-start gap-2">
                                                        <span className="text-lg shrink-0">
                                                            ⚠️
                                                        </span>
                                                        <p className="font-body text-xs text-brutal-red font-bold">
                                                            Gejala darurat
                                                            terdeteksi. Segera
                                                            hubungi layanan
                                                            darurat{" "}
                                                            <span className="inline-flex items-center px-1.5 py-0.5 bg-brutal-red/10 border border-brutal-red font-display text-xs text-brutal-red rounded-md select-none">
                                                                119
                                                            </span>{" "}
                                                            atau kunjungi IGD
                                                            terdekat.
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="border-3 border-brutal-black shadow-brutal bg-brutal-gray">
                                            <CardContent className="p-6 text-center">
                                                <span className="text-4xl block mb-3">
                                                    🤔
                                                </span>
                                                <h3 className="font-display text-lg mb-2">
                                                    Tidak Ditemukan Kecocokan
                                                </h3>
                                                <p className="font-body text-sm text-brutal-muted mb-4 max-w-md mx-auto">
                                                    Kami belum bisa mendeteksi
                                                    gejala dari deskripsi kamu.
                                                    Coba gunakan kata kunci lain
                                                    atau mode{" "}
                                                    <strong>
                                                        "Pilih Gejala"
                                                    </strong>
                                                    .
                                                </p>
                                                <Button
                                                    variant="primary"
                                                    onClick={() =>
                                                        handleModeChange(
                                                            "select",
                                                        )
                                                    }
                                                >
                                                    <MousePointer
                                                        size={14}
                                                        className="mr-2"
                                                    />
                                                    Gunakan Peta Tubuh
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
