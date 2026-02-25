
import { useState, useRef } from "react";
import {
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    AlertTriangle,
    Phone,
    Printer,
    Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SYMPTOM_TREE, SYMPTOM_AREAS } from "@/lib/symptomTree";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepProgress } from "@/components/ui/feedback";
import { toast } from "sonner";

// ── Question Card ────────────────────────────────────────
function QuestionCard({ node, onAnswer, stepIndex, totalSteps }) {
    return (
        <div className="animate-slide-up">
            <div className="mb-5">
                <StepProgress
                    steps={Array.from({ length: Math.max(totalSteps, stepIndex + 1) }, (_, i) => ({ label: "" }))}
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
                                className={cn(
                                    "w-full text-left px-4 py-4 border-3 border-brutal-black",
                                    "font-body font-bold text-sm",
                                    "shadow-brutal-sm hover:shadow-brutal",
                                    "hover:-translate-x-0.5 hover:-translate-y-0.5",
                                    "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                                    "transition-all duration-150 group",
                                    "bg-brutal-white hover:bg-brutal-yellow",
                                    "flex items-center gap-3",
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

// ── Result Card ──────────────────────────────────────────
function ResultCard({ result, path, onReset, areaId }) {
    const printRef = useRef(null);
    const area = SYMPTOM_AREAS[areaId];

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
        const text = `Hasil Cek Gejala MediCheck ID:\n${result.conditions.join(", ")}\nUrgency: ${result.urgency}\n\nPlatform: medicheckid.com`;
        if (navigator.share) {
            await navigator.share({ title: "Hasil Cek Gejala", text });
        } else {
            await navigator.clipboard.writeText(text);
            toast.success("Ringkasan disalin ke clipboard!");
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

            {isEmergency && (
                <div className="flex items-center justify-center gap-3 w-full py-4 bg-brutal-red border-4 border-brutal-black shadow-brutal-lg select-none">
                    <Phone size={24} className="text-brutal-white" />
                    <div className="text-left">
                        <span className="inline-flex items-center px-2.5 py-1 bg-brutal-yellow/90 border-2 border-brutal-yellow font-display text-2xl text-brutal-black rounded-md">
                            119
                        </span>
                        <p className="font-body text-brutal-white/80 text-xs mt-1">
                            Hubungi Ambulans Segera
                        </p>
                    </div>
                </div>
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
                        {result.conditions.map((c, i) => (
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
            <Card className="border-3 border-brutal-black shadow-brutal">
                <CardHeader>
                    <h3 className="font-display text-lg">
                        💊 Yang Bisa Dilakukan Sekarang
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

            {/* Red Flags */}
            <Card className="border-3 border-brutal-red shadow-brutal">
                <CardHeader className="bg-brutal-red/5">
                    <h3 className="font-display text-lg flex items-center gap-2">
                        <AlertTriangle size={18} className="text-brutal-red" />
                        Segera ke Dokter / IGD Jika Ada
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

            {/* When to see doctor */}
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

            {/* Explanation */}
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

            {/* Path taken */}
            {path.length > 0 && (
                <div className="border-t-3 border-brutal-gray pt-4">
                    <p className="text-xs font-body text-brutal-muted font-bold mb-2">
                        JALUR PERTANYAAN:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {path.map((p, i) => (
                            <span
                                key={i}
                                className="text-xs bg-brutal-gray border border-brutal-black px-2 py-0.5 font-body"
                            >
                                {i + 1}. {p}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                    variant="outline"
                    onClick={onReset}
                    className="w-full border-3 border-brutal-black shadow-brutal-sm"
                >
                    <RefreshCw size={14} />
                    Cek Ulang
                </Button>
                <Button
                    variant="default"
                    onClick={handlePrint}
                    className="w-full no-print border-3 border-brutal-black shadow-brutal-sm"
                >
                    <Printer size={14} />
                    Cetak
                </Button>
            </div>
            <Button
                variant="secondary"
                onClick={handleShare}
                className="w-full no-print border-3 border-brutal-black shadow-brutal-sm"
            >
                <Share2 size={14} />
                Bagikan Ringkasan
            </Button>

            {!isEmergency && (
                <div className="border-3 border-brutal-black bg-brutal-gray p-3">
                    <p className="font-body text-xs font-bold mb-2">
                        📞 Nomor Darurat Penting
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center border-2 border-brutal-black bg-brutal-white p-2 select-none">
                            <span className="inline-flex items-center px-2 py-0.5 bg-brutal-red/10 border border-brutal-red font-display text-sm text-brutal-red rounded-md">119</span>
                            <p className="text-xs font-body text-brutal-muted mt-1">Ambulans</p>
                        </div>
                        <div className="text-center border-2 border-brutal-black bg-brutal-white p-2 select-none">
                            <span className="inline-flex items-center px-2 py-0.5 bg-brutal-blue/10 border border-brutal-blue font-display text-sm text-brutal-blue rounded-md">1500-567</span>
                            <p className="text-xs font-body text-brutal-muted mt-1">Hotline</p>
                        </div>
                        <div className="text-center border-2 border-brutal-black bg-brutal-white p-2 select-none">
                            <span className="inline-flex items-center px-2 py-0.5 bg-brutal-green/10 border border-brutal-green font-display text-sm text-brutal-green rounded-md">ext 8</span>
                            <p className="text-xs font-body text-brutal-muted mt-1">Mental</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main Checker ─────────────────────────────────────────
export default function SymptomChecker({ areaId, onReset: onExternalReset }) {
    const [currentNode, setCurrentNode] = useState(
        () => SYMPTOM_TREE[areaId] || null,
    );
    const [result, setResult] = useState(null);
    const [path, setPath] = useState([]); // array of chosen labels
    const [history, setHistory] = useState([]); // for back navigation
    const [stepIndex, setStepIndex] = useState(0);

    if (!currentNode) {
        return (
            <div className="text-center py-8">
                <p className="font-body text-brutal-muted">
                    Area tidak dikenali. Pilih area tubuh terlebih dahulu.
                </p>
            </div>
        );
    }

    const handleAnswer = (option) => {
        const newPath = [...path, option.label];

        if (option.result) {
            // Leaf node — show result
            setPath(newPath);
            setResult(option.result);
        } else if (option.next) {
            // Branch — go deeper
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
        onExternalReset?.();
    };

    return (
        <div>
            {/* Back button */}
            {(history.length > 0 || result) &&
                !result?.urgency?.includes("emergency") && (
                    <button
                        onClick={result ? handleReset : handleBack}
                        className="flex items-center gap-1.5 text-sm font-body font-bold text-brutal-muted hover:text-brutal-black mb-4 transition-colors"
                    >
                        <ChevronLeft size={16} />
                        {result ? "Mulai Ulang" : "Kembali"}
                    </button>
                )}

            {/* Area info */}
            {!result && SYMPTOM_AREAS[areaId] && (
                <div className="flex items-center gap-2 mb-4">
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

            {/* Content */}
            {result ? (
                <ResultCard
                    result={result}
                    path={path}
                    onReset={handleReset}
                    areaId={areaId}
                />
            ) : (
                <QuestionCard
                    node={currentNode}
                    onAnswer={handleAnswer}
                    stepIndex={stepIndex}
                    totalSteps={5}
                />
            )}
        </div>
    );
}
