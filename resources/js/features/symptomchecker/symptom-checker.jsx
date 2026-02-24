import { useState, useRef } from "react";
import {
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    AlertTriangle,
    Phone,
    Printer,
    Share2,
    Loader2,
    Sparkles,
    Send,
    MessageSquare,
    ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SYMPTOM_AREAS, SYMPTOM_TREE } from "@/lib/symptomTree";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepProgress } from "@/components/ui/feedback";
import { toast } from "sonner";
import axios from "axios";

// ── Question Card (Mode Opsi) ────────────────────────────
function QuestionCard({ node, onAnswer, stepIndex, isLoading }) {
    if (!node) return null;

    return (
        <div className="animate-slide-up relative">
            {isLoading && (
                <div className="absolute inset-0 z-10 bg-brutal-white/50 backdrop-blur-sm flex items-center justify-center border-3 border-brutal-black">
                    <div className="flex flex-col items-center gap-2 bg-brutal-white p-4 border-3 border-brutal-black shadow-brutal">
                        <Loader2
                            size={24}
                            className="animate-spin text-brutal-blue"
                        />
                        <p className="font-display text-sm">
                            Menganalisis Pilihan...
                        </p>
                    </div>
                </div>
            )}

            <div className="mb-5">
                <StepProgress
                    steps={Array.from(
                        { length: Math.max(5, stepIndex + 1) },
                        () => ({ label: "" }),
                    )}
                    currentStep={stepIndex}
                />
            </div>

            <Card className="overflow-hidden border-3 border-brutal-black shadow-brutal-lg">
                <CardHeader className="bg-brutal-blue">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brutal-yellow border-2 border-brutal-yellow flex items-center justify-center font-display text-brutal-black text-sm">
                            {stepIndex + 1}
                        </div>
                        <p className="font-body text-brutal-white/80 text-xs font-bold uppercase tracking-wider">
                            Pertanyaan
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="p-5">
                    <h3 className="font-display text-xl md:text-2xl text-brutal-black mb-6 leading-tight">
                        {node.question}
                    </h3>

                    <div className="flex flex-col gap-3">
                        {node.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => onAnswer(opt)}
                                disabled={isLoading}
                                className={cn(
                                    "w-full text-left px-4 py-4 border-3 border-brutal-black",
                                    "font-body font-bold text-sm",
                                    "shadow-brutal-sm hover:shadow-brutal",
                                    "hover:-translate-x-0.5 hover:-translate-y-0.5",
                                    "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                                    "transition-all duration-150 group",
                                    "bg-brutal-white hover:bg-brutal-yellow",
                                    "flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed",
                                )}
                            >
                                <span className="w-7 h-7 shrink-0 border-2 border-brutal-black bg-brutal-gray group-hover:bg-brutal-black group-hover:text-brutal-yellow flex items-center justify-center font-display text-xs transition-all duration-150">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="flex-1">{opt.label}</span>
                                <ChevronRight
                                    size={16}
                                    className="shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150"
                                />
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ── AI Prompt Card (Mode Cerita) ─────────────────────────
function AIPromptCard({ areaId, onAnalyze, isLoading }) {
    const [symptomDesc, setSymptomDesc] = useState("");
    const area = SYMPTOM_AREAS[areaId];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!symptomDesc.trim()) {
            toast.error("Tolong ceritakan gejala Anda terlebih dahulu.");
            return;
        }
        onAnalyze(symptomDesc);
    };

    return (
        <div className="animate-slide-up">
            <Card className="overflow-hidden border-3 border-brutal-black shadow-brutal-lg">
                <CardHeader className="bg-brutal-blue">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brutal-yellow border-2 border-brutal-yellow flex items-center justify-center">
                            <Sparkles size={16} className="text-brutal-black" />
                        </div>
                        <p className="font-body text-brutal-white/80 text-xs font-bold uppercase tracking-wider">
                            Analisis AI Aktif
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="p-5">
                    <h3 className="font-display text-xl md:text-2xl text-brutal-black mb-2 leading-tight">
                        Apa yang Anda rasakan di area {area?.label}?
                    </h3>
                    <p className="font-body text-sm text-brutal-muted mb-4">
                        Ceritakan sedetail mungkin. Berapa lama gejalanya,
                        seberapa sakit, dan apakah ada pemicunya?
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <textarea
                            className="w-full min-h-[120px] p-4 border-3 border-brutal-black font-body text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brutal-yellow transition-all"
                            placeholder="Contoh: Saya merasa sakit kepala sebelah kiri berdenyut sejak kemarin sore..."
                            value={symptomDesc}
                            onChange={(e) => setSymptomDesc(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brutal-yellow text-brutal-black hover:bg-brutal-yellow/80 border-3 border-brutal-black shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Menganalisis...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Mulai Analisis AI
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

// ── Result Card ──────────────────────────────────────────
function ResultCard({ result, userQuery, onReset, pathArr }) {
    const printRef = useRef(null);

    const urgencyConfig = {
        emergency: {
            bg: "bg-brutal-red",
            text: "text-brutal-white",
            icon: "🚨",
            title: "DARURAT — Cari Bantuan Segera",
        },
        high: {
            bg: "bg-brutal-orange",
            text: "text-brutal-white",
            icon: "⚠️",
            title: "PERLU PERHATIAN SEGERA",
        },
        moderate: {
            bg: "bg-brutal-yellow",
            text: "text-brutal-black",
            icon: "⏰",
            title: "PERLU PERHATIAN",
        },
        low: {
            bg: "bg-brutal-green",
            text: "text-brutal-white",
            icon: "✅",
            title: "BISA DITANGANI MANDIRI",
        },
    };

    const urg = urgencyConfig[result.urgency] || urgencyConfig.low;
    const isEmergency = result.urgency === "emergency";

    const handlePrint = () => {
        window.print();
        toast.success("Membuka dialog cetak...");
    };
    const handleShare = async () => {
        const text = `Hasil Cek Gejala:\n${result.conditions?.join(", ")}\nUrgency: ${result.urgency}`;
        if (navigator.share)
            await navigator.share({ title: "Hasil Cek", text });
        else {
            await navigator.clipboard.writeText(text);
            toast.success("Disalin ke clipboard!");
        }
    };

    return (
        <div className="animate-slide-up space-y-4" ref={printRef}>
            {/* Urgency Banner */}
            <div
                className={cn(
                    "border-4 border-brutal-black p-4 shadow-brutal-lg flex items-center gap-3",
                    urg.bg,
                )}
            >
                <span className="text-3xl">{urg.icon}</span>
                <div>
                    <p className={cn("font-display text-sm", urg.text)}>
                        {urg.title}
                    </p>
                    <p
                        className={cn(
                            "font-body text-xs mt-0.5 opacity-80",
                            urg.text,
                        )}
                    >
                        {result.likelihood}
                    </p>
                </div>
            </div>

            {/* Emergency Call */}
            {isEmergency && (
                <a
                    href="tel:119"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-brutal-red border-4 border-brutal-black shadow-brutal-lg hover:shadow-brutal-xl hover:-translate-x-1 hover:-translate-y-1 transition-all"
                >
                    <Phone size={24} className="text-brutal-white" />
                    <div className="text-left">
                        <p className="font-display text-2xl text-brutal-white leading-none">
                            119
                        </p>
                        <p className="font-body text-brutal-white/80 text-xs">
                            Panggil Ambulans Sekarang
                        </p>
                    </div>
                </a>
            )}

            {/* Possible Conditions */}
            <Card className="border-3 border-brutal-black shadow-brutal-lg">
                <CardHeader>
                    <h3 className="font-display text-lg">
                        🔍 Kemungkinan Kondisi
                    </h3>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {result.conditions?.map((c, i) => (
                            <Badge
                                key={i}
                                variant={i === 0 ? "default" : "secondary"}
                                className="border-2 border-brutal-black rounded-none"
                            >
                                {c}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-sm font-body text-brutal-muted italic border-l-3 border-brutal-yellow pl-3">
                        ⚠️ {result.disclaimer}
                    </p>
                </CardContent>
            </Card>

            {/* Home Care */}
            {result.homeCare?.length > 0 && (
                <Card className="border-3 border-brutal-black shadow-brutal">
                    <CardHeader>
                        <h3 className="font-display text-lg">
                            💊 Yang Bisa Dilakukan
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {result.homeCare.map((step, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2.5 text-sm font-body"
                                >
                                    <span className="w-5 h-5 shrink-0 bg-brutal-black text-brutal-white flex items-center justify-center font-display text-xs mt-0.5">
                                        {i + 1}
                                    </span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Red Flags */}
            {result.redFlags?.length > 0 && (
                <Card className="border-3 border-brutal-red shadow-brutal">
                    <CardHeader className="bg-brutal-red/5">
                        <h3 className="font-display text-lg flex items-center gap-2">
                            <AlertTriangle
                                size={18}
                                className="text-brutal-red"
                            />{" "}
                            Segera ke Dokter Jika Ada
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-1.5">
                            {result.redFlags.map((flag, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-sm font-body"
                                >
                                    <span className="text-brutal-red font-bold shrink-0 mt-0.5">
                                        ⚡
                                    </span>
                                    <span className="font-bold text-brutal-red">
                                        {flag}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* When to see doctor & Explanation */}
            {result.whenToSeeDoctor && (
                <Card className="border-3 border-brutal-black bg-brutal-yellow/10 shadow-brutal">
                    <CardContent className="pt-5">
                        <p className="font-body text-sm font-bold text-brutal-black">
                            <span className="font-display text-base block mb-1">
                                🏥 Kapan Harus ke Dokter?
                            </span>
                            {result.whenToSeeDoctor}
                        </p>
                    </CardContent>
                </Card>
            )}

            {result.explanation && (
                <Card className="border-3 border-brutal-black bg-brutal-gray shadow-brutal-sm">
                    <CardContent className="pt-5">
                        <p className="font-body text-sm text-brutal-muted leading-relaxed">
                            <span className="font-bold text-brutal-black block mb-1">
                                ℹ️ Penjelasan Singkat
                            </span>
                            {result.explanation}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Riwayat Keluhan */}
            <div className="border-t-3 border-brutal-gray pt-4">
                <p className="text-xs font-body text-brutal-muted font-bold mb-2">
                    KELUHAN ANDA:
                </p>
                {pathArr && pathArr.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {pathArr.map((p, i) => (
                            <span
                                key={i}
                                className="text-xs bg-brutal-gray border border-brutal-black px-2 py-0.5 font-body"
                            >
                                {i + 1}. {p}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm font-body italic">"{userQuery}"</p>
                )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                    variant="outline"
                    onClick={onReset}
                    className="w-full border-3 border-brutal-black shadow-brutal-sm"
                >
                    <RefreshCw size={14} className="mr-2" /> Cek Ulang
                </Button>
                <Button
                    variant="default"
                    onClick={handlePrint}
                    className="w-full no-print border-3 border-brutal-black shadow-brutal-sm"
                >
                    <Printer size={14} className="mr-2" /> Cetak
                </Button>
            </div>
            <Button
                variant="secondary"
                onClick={handleShare}
                className="w-full no-print border-3 border-brutal-black shadow-brutal-sm"
            >
                <Share2 size={14} className="mr-2" /> Bagikan Ringkasan
            </Button>
        </div>
    );
}

// ── Main Checker ─────────────────────────────────────────
export default function SymptomChecker({ areaId, onReset: onExternalReset }) {
    const [inputMode, setInputMode] = useState("options"); // 'options' atau 'text'
    const [currentNode, setCurrentNode] = useState(
        () => SYMPTOM_TREE[areaId] || null,
    );
    const [path, setPath] = useState([]); // Untuk menyimpan history klik opsi
    const [history, setHistory] = useState([]);
    const [stepIndex, setStepIndex] = useState(0);

    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userQuery, setUserQuery] = useState(""); // Untuk mode teks

    // Fungsi utama untuk memanggil AI (baik dari Opsi maupun Input Teks)
    const handleAnalyze = async (symptomsText, isFromOptions = false) => {
        setIsLoading(true);
        if (!isFromOptions) {
            setUserQuery(symptomsText);
        }

        try {
            const response = await axios.post("/ai/symptom-check", {
                area: SYMPTOM_AREAS[areaId].label,
                symptoms: symptomsText,
            });

            setResult(response.data);
            toast.success("Analisis selesai!");
        } catch (error) {
            console.error("Gagal menganalisis gejala:", error);
            toast.error("Gagal terhubung ke layanan AI. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handler saat user memilih opsi di QuestionCard
    const handleOptionSelect = (option) => {
        const newPath = [...path, option.label];

        if (option.analyze) {
            // Jika mencapai ujung tree, susun kalimat dari pilihan dan kirim ke AI
            setPath(newPath);
            const compiledSymptoms = `Pengguna memilih gejala berikut secara berurutan: ${newPath.join(" ➔ ")}. Tolong berikan hasil analisisnya.`;
            handleAnalyze(compiledSymptoms, true);
        } else if (option.next) {
            // Jika masih ada cabang, maju ke pertanyaan berikutnya
            setHistory((prev) => [...prev, { node: currentNode, path }]);
            setCurrentNode(option.next);
            setPath(newPath);
            setStepIndex((i) => i + 1);
        }
    };

    const handleBack = () => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        setCurrentNode(prev.node);
        setPath(prev.path);
        setHistory((h) => h.slice(0, -1));
        setStepIndex((i) => Math.max(0, i - 1));
        setResult(null);
    };

    const handleReset = () => {
        setCurrentNode(SYMPTOM_TREE[areaId] || null);
        setResult(null);
        setPath([]);
        setHistory([]);
        setStepIndex(0);
        setUserQuery("");
        onExternalReset?.();
    };

    return (
        <div>
            {/* Header: Tombol Back & Area Info */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    {(history.length > 0 || result) &&
                        !result?.urgency?.includes("emergency") && (
                            <button
                                onClick={result ? handleReset : handleBack}
                                className="flex items-center gap-1.5 text-sm font-body font-bold text-brutal-muted hover:text-brutal-black mb-2 transition-colors"
                            >
                                <ChevronLeft size={16} />{" "}
                                {result ? "Mulai Ulang" : "Kembali"}
                            </button>
                        )}

                    {!result && SYMPTOM_AREAS[areaId] && (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">
                                {SYMPTOM_AREAS[areaId].emoji}
                            </span>
                            <div>
                                <p className="font-body text-xs text-brutal-muted font-bold uppercase tracking-wide">
                                    Area Dipilih
                                </p>
                                <p className="font-display text-lg leading-none">
                                    {SYMPTOM_AREAS[areaId].label}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toggle Mode (Hanya tampil jika belum ada hasil Result) */}
                {!result && (
                    <div className="flex bg-brutal-gray border-2 border-brutal-black p-1 rounded-sm shadow-brutal-sm">
                        <button
                            onClick={() => setInputMode("options")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-bold transition-all",
                                inputMode === "options"
                                    ? "bg-brutal-white border-2 border-brutal-black shadow-sm"
                                    : "text-brutal-muted hover:text-brutal-black",
                            )}
                        >
                            <ListChecks size={14} /> Opsi
                        </button>
                        <button
                            onClick={() => setInputMode("text")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-bold transition-all",
                                inputMode === "text"
                                    ? "bg-brutal-white border-2 border-brutal-black shadow-sm"
                                    : "text-brutal-muted hover:text-brutal-black",
                            )}
                        >
                            <MessageSquare size={14} /> Ketik
                        </button>
                    </div>
                )}
            </div>

            {/* Content Switcher */}
            {result ? (
                <ResultCard
                    result={result}
                    userQuery={userQuery}
                    pathArr={path}
                    onReset={handleReset}
                    areaId={areaId}
                />
            ) : inputMode === "options" && currentNode ? (
                <QuestionCard
                    node={currentNode}
                    onAnswer={handleOptionSelect}
                    stepIndex={stepIndex}
                    isLoading={isLoading}
                />
            ) : (
                <AIPromptCard
                    areaId={areaId}
                    onAnalyze={(text) => handleAnalyze(text, false)}
                    isLoading={isLoading}
                />
            )}

            {/* Fallback jika tree tidak ditemukan untuk opsi */}
            {inputMode === "options" && !currentNode && !result && (
                <div className="text-center py-8">
                    <p className="font-body text-brutal-muted">
                        Tidak ada opsi panduan untuk area ini. Silakan gunakan
                        mode "Ketik".
                    </p>
                </div>
            )}
        </div>
    );
}
