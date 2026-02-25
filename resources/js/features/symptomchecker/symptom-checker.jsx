import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
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
import BodyMap from "@/features/bodymap/body-map";

// ── Question Card (Mode Opsi) ────────────────────────────
function QuestionCard({ node, onAnswer, stepIndex, isLoading }) {
    if (!node) return null;

    return (
        <div className="animate-slide-up relative">
            {isLoading && (
                <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-clinical-xl">
                    <div className="flex flex-col items-center gap-2 bg-white p-5 rounded-clinical-lg shadow-clinical-lg">
                        <Loader2
                            size={24}
                            className="animate-spin text-clinical-primary"
                        />
                        <p className="font-display text-sm font-semibold text-clinical-text">
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

            <Card className="overflow-hidden border border-clinical-border rounded-clinical-xl shadow-clinical-md">
                <CardHeader className="bg-clinical-primary text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-display text-white text-sm font-bold">
                            {stepIndex + 1}
                        </div>
                        <p className="font-body text-white/80 text-xs font-semibold uppercase tracking-wider">
                            Pertanyaan
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="p-5">
                    <h3 className="font-display text-xl md:text-2xl text-clinical-text font-bold mb-6 leading-tight">
                        {node.question}
                    </h3>

                    <div className="flex flex-col gap-3">
                        {node.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => onAnswer(opt)}
                                disabled={isLoading}
                                className={cn(
                                    "w-full text-left px-4 py-4 border border-clinical-border rounded-clinical-md",
                                    "font-body font-medium text-sm",
                                    "shadow-clinical-xs hover:shadow-clinical-sm",
                                    "hover:-translate-y-0.5 hover:border-clinical-primary",
                                    "transition-all duration-200 group",
                                    "bg-white hover:bg-clinical-primary-light",
                                    "flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed",
                                )}
                            >
                                <span className="w-7 h-7 shrink-0 rounded-full border border-clinical-border bg-clinical-bg group-hover:bg-clinical-primary group-hover:text-white flex items-center justify-center font-display text-xs font-bold transition-all duration-200">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="flex-1">{opt.label}</span>
                                <ChevronRight
                                    size={16}
                                    className="shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-clinical-primary"
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
            <Card className="overflow-hidden border border-clinical-border rounded-clinical-xl shadow-clinical-md">
                <CardHeader className="bg-clinical-primary text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <p className="font-body text-white/80 text-xs font-semibold uppercase tracking-wider">
                            Analisis AI Aktif
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="p-5">
                    <h3 className="font-display text-xl md:text-2xl text-clinical-text font-bold mb-2 leading-tight">
                        Apa yang Anda rasakan di area {area?.label}?
                    </h3>
                    <p className="font-body text-sm text-clinical-text-secondary mb-4">
                        Ceritakan sedetail mungkin. Berapa lama gejalanya,
                        seberapa sakit, dan apakah ada pemicunya?
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <textarea
                            className="w-full min-h-[120px] p-4 border border-clinical-border rounded-clinical-md font-body text-sm resize-y focus:outline-none focus:border-clinical-primary focus:ring-2 focus:ring-clinical-primary/20 transition-all"
                            placeholder="Contoh: Saya merasa sakit kepala sebelah kiri berdenyut sejak kemarin sore..."
                            value={symptomDesc}
                            onChange={(e) => setSymptomDesc(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
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
            bg: "bg-clinical-danger",
            text: "text-white",
            lightBg: "bg-clinical-danger-light",
            icon: "🚨",
            title: "DARURAT — Cari Bantuan Segera",
        },
        high: {
            bg: "bg-clinical-warning",
            text: "text-white",
            lightBg: "bg-clinical-warning-light",
            icon: "⚠️",
            title: "PERLU PERHATIAN SEGERA",
        },
        moderate: {
            bg: "bg-clinical-warning-light",
            text: "text-clinical-text",
            lightBg: "bg-clinical-warning-light/50",
            icon: "⏰",
            title: "PERLU PERHATIAN",
        },
        low: {
            bg: "bg-clinical-success",
            text: "text-white",
            lightBg: "bg-clinical-success-light",
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
                    "rounded-clinical-xl p-4 shadow-clinical-md flex items-center gap-3",
                    urg.bg,
                )}
            >
                <span className="text-3xl">{urg.icon}</span>
                <div>
                    <p
                        className={cn(
                            "font-display text-sm font-bold",
                            urg.text,
                        )}
                    >
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

            {isEmergency && (
                <div className="flex items-center justify-center gap-3 w-full py-4 bg-clinical-danger rounded-clinical-xl shadow-clinical-lg">
                    <Phone size={24} className="text-white" />
                    <div className="text-left">
                        <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm font-display text-2xl text-white font-bold rounded-full">
                            119
                        </span>
                        <p className="font-body text-white/80 text-xs mt-1">
                            Hubungi Ambulans Segera
                        </p>
                    </div>
                </div>
            )}

            {/* Possible Conditions */}
            <Card className="border border-clinical-border rounded-clinical-xl shadow-clinical-sm">
                <CardHeader>
                    <h3 className="font-display text-lg font-bold text-clinical-text">
                        🔍 Kemungkinan Kondisi
                    </h3>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {result.conditions?.map((c, i) => (
                            <Badge
                                key={i}
                                variant={i === 0 ? "default" : "secondary"}
                                className="rounded-full"
                            >
                                {c}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-sm font-body text-clinical-text-secondary italic border-l-2 border-clinical-warning pl-3">
                        ⚠️ {result.disclaimer}
                    </p>
                </CardContent>
            </Card>

            {/* Home Care */}
            {result.homeCare?.length > 0 && (
                <Card className="border border-clinical-border rounded-clinical-xl shadow-clinical-sm">
                    <CardHeader>
                        <h3 className="font-display text-lg font-bold text-clinical-text">
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
                                    <span className="w-5 h-5 shrink-0 bg-clinical-primary text-white rounded-full flex items-center justify-center font-display text-xs mt-0.5">
                                        {i + 1}
                                    </span>
                                    <span className="text-clinical-text-secondary">
                                        {step}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Red Flags */}
            {result.redFlags?.length > 0 && (
                <Card className="border border-clinical-danger/30 rounded-clinical-xl shadow-clinical-sm">
                    <CardHeader className="bg-clinical-danger-light">
                        <h3 className="font-display text-lg font-bold flex items-center gap-2 text-clinical-danger">
                            <AlertTriangle
                                size={18}
                                className="text-clinical-danger"
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
                                    <span className="text-clinical-danger font-bold shrink-0 mt-0.5">
                                        ⚡
                                    </span>
                                    <span className="font-semibold text-clinical-danger">
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
                <Card className="border border-clinical-border rounded-clinical-xl bg-clinical-primary-light/30 shadow-clinical-sm">
                    <CardContent className="pt-5">
                        <p className="font-body text-sm text-clinical-text">
                            <span className="font-display text-base font-bold block mb-1">
                                🏥 Kapan Harus ke Dokter?
                            </span>
                            {result.whenToSeeDoctor}
                        </p>
                    </CardContent>
                </Card>
            )}

            {result.explanation && (
                <Card className="border border-clinical-border rounded-clinical-xl bg-clinical-bg shadow-clinical-xs">
                    <CardContent className="pt-5">
                        <p className="font-body text-sm text-clinical-text-secondary leading-relaxed">
                            <span className="font-semibold text-clinical-text block mb-1">
                                ℹ️ Penjelasan Singkat
                            </span>
                            {result.explanation}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Riwayat Keluhan */}
            <div className="border-t border-clinical-border pt-4">
                <p className="text-xs font-body text-clinical-muted font-semibold mb-2">
                    KELUHAN ANDA:
                </p>
                {pathArr && pathArr.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {pathArr.map((p, i) => (
                            <span
                                key={i}
                                className="text-xs bg-clinical-bg border border-clinical-border rounded-full px-2.5 py-0.5 font-body text-clinical-text-secondary"
                            >
                                {i + 1}. {p}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm font-body italic text-clinical-text-secondary">
                        "{userQuery}"
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="outline" onClick={onReset} className="w-full">
                    <RefreshCw size={14} className="mr-2" /> Cek Ulang
                </Button>
                <Button
                    variant="default"
                    onClick={handlePrint}
                    className="w-full no-print"
                >
                    <Printer size={14} className="mr-2" /> Cetak
                </Button>
            </div>
            <Button
                variant="secondary"
                onClick={handleShare}
                className="w-full no-print"
            >
                <Share2 size={14} className="mr-2" /> Bagikan Ringkasan
            </Button>

            {!isEmergency && (
                <div className="bg-clinical-bg border border-clinical-border rounded-clinical-lg p-4">
                    <p className="font-body text-xs font-semibold mb-2 text-clinical-text">
                        📞 Nomor Darurat Penting
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center bg-white border border-clinical-border rounded-clinical-md p-2">
                            <span className="inline-flex items-center px-2 py-0.5 bg-clinical-danger-light font-body text-sm font-bold text-clinical-danger rounded-full">
                                119
                            </span>
                            <p className="text-xs font-body text-clinical-muted mt-1">
                                Ambulans
                            </p>
                        </div>
                        <div className="text-center bg-white border border-clinical-border rounded-clinical-md p-2">
                            <span className="inline-flex items-center px-2 py-0.5 bg-clinical-primary-light font-body text-sm font-bold text-clinical-primary rounded-full">
                                1500-567
                            </span>
                            <p className="text-xs font-body text-clinical-muted mt-1">
                                Hotline
                            </p>
                        </div>
                        <div className="text-center bg-white border border-clinical-border rounded-clinical-md p-2">
                            <span className="inline-flex items-center px-2 py-0.5 bg-clinical-success-light font-body text-sm font-bold text-clinical-success rounded-full">
                                ext 8
                            </span>
                            <p className="text-xs font-body text-clinical-muted mt-1">
                                Mental
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main Checker ─────────────────────────────────────────
export default function SymptomChecker({ mode }) {
    // Area selection state (body map step)
    const [areaId, setAreaId] = useState(null);

    const [inputMode, setInputMode] = useState(
        mode === "ai" ? "text" : "options",
    );
    const [currentNode, setCurrentNode] = useState(null);
    const [path, setPath] = useState([]);
    const [history, setHistory] = useState([]);
    const [stepIndex, setStepIndex] = useState(0);

    const [result, setResult] = useState(null);
    const [userQuery, setUserQuery] = useState("");

    // ── useMutation for AI analysis ──
    const analysisMutation = useMutation({
        mutationFn: (payload) =>
            axios.post("/api/ai/symptom-check", payload).then((r) => r.data),
        onSuccess: (data) => {
            setResult(data);
            toast.success("Analisis selesai!");
        },
        onError: (error) => {
            const msg =
                error.response?.data?.message ||
                "Gagal terhubung ke layanan AI. Silakan coba lagi.";
            toast.error(msg);
        },
    });

    const isLoading = analysisMutation.isPending;

    // Area selection handler
    const handleAreaSelect = (id) => {
        setAreaId(id);
        const tree = SYMPTOM_TREE[id] || null;
        setCurrentNode(tree);
    };

    // Fungsi utama untuk memanggil AI
    const handleAnalyze = (symptomsText, isFromOptions = false) => {
        if (!isFromOptions) {
            setUserQuery(symptomsText);
        }

        analysisMutation.mutate({
            area: SYMPTOM_AREAS[areaId].label,
            symptoms: symptomsText,
        });
    };

    // Handler saat user memilih opsi di QuestionCard
    const handleOptionSelect = (option) => {
        const newPath = [...path, option.label];

        if (option.analyze) {
            setPath(newPath);
            const compiledSymptoms = `Pengguna memilih gejala berikut secara berurutan: ${newPath.join(" ➔ ")}. Tolong berikan hasil analisisnya.`;
            handleAnalyze(compiledSymptoms, true);
        } else if (option.next) {
            setHistory((prev) => [...prev, { node: currentNode, path }]);
            setCurrentNode(option.next);
            setPath(newPath);
            setStepIndex((i) => i + 1);
        }
    };

    const handleBack = () => {
        if (history.length === 0) {
            // Go back to area selection
            setAreaId(null);
            setCurrentNode(null);
            return;
        }
        const prev = history[history.length - 1];
        setCurrentNode(prev.node);
        setPath(prev.path);
        setHistory((h) => h.slice(0, -1));
        setStepIndex((i) => Math.max(0, i - 1));
        setResult(null);
    };

    const handleReset = () => {
        setAreaId(null);
        setCurrentNode(null);
        setResult(null);
        setPath([]);
        setHistory([]);
        setStepIndex(0);
        setUserQuery("");
        analysisMutation.reset();
    };

    // ── Step 1: Area Selection via BodyMap ──
    if (!areaId) {
        return (
            <div className="animate-slide-up">
                <div className="bg-white border border-clinical-border rounded-clinical-xl shadow-clinical-sm p-6 mb-4">
                    <h3 className="font-display text-xl font-bold text-clinical-text mb-2 text-center">
                        Pilih Area Tubuh
                    </h3>
                    <p className="font-body text-sm text-clinical-muted text-center mb-6">
                        Ketuk area tubuh yang terasa tidak nyaman
                    </p>
                    <BodyMap
                        onAreaSelect={handleAreaSelect}
                        selectedArea={areaId}
                    />
                </div>
            </div>
        );
    }

    // ── Step 2: Symptom Input & Analysis ──
    return (
        <div>
            {/* Header: Back & Area Info */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    {(history.length > 0 || result || areaId) &&
                        !result?.urgency?.includes("emergency") && (
                            <button
                                onClick={result ? handleReset : handleBack}
                                className="flex items-center gap-1.5 text-sm font-body font-medium text-clinical-text-secondary hover:text-clinical-primary mb-2 transition-colors"
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
                                <p className="font-body text-xs text-clinical-muted font-semibold uppercase tracking-wide">
                                    Area Dipilih
                                </p>
                                <p className="font-display text-lg font-bold leading-none text-clinical-text">
                                    {SYMPTOM_AREAS[areaId].label}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toggle Mode */}
                {!result && (
                    <div className="flex bg-clinical-bg border border-clinical-border p-1 rounded-clinical-lg">
                        <button
                            onClick={() => setInputMode("options")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-semibold rounded-clinical-md transition-all",
                                inputMode === "options"
                                    ? "bg-white shadow-clinical-sm text-clinical-text"
                                    : "text-clinical-muted hover:text-clinical-text",
                            )}
                        >
                            <ListChecks size={14} /> Opsi
                        </button>
                        <button
                            onClick={() => setInputMode("text")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-semibold rounded-clinical-md transition-all",
                                inputMode === "text"
                                    ? "bg-white shadow-clinical-sm text-clinical-text"
                                    : "text-clinical-muted hover:text-clinical-text",
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

            {/* Fallback */}
            {inputMode === "options" && !currentNode && !result && (
                <div className="text-center py-8">
                    <p className="font-body text-clinical-text-secondary">
                        Tidak ada opsi panduan untuk area ini. Silakan gunakan
                        mode "Ketik".
                    </p>
                </div>
            )}
        </div>
    );
}
