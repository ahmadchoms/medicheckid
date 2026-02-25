import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Share2 } from "lucide-react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import {
    DIMENSIONS,
    calculateHealthScore,
    getScoreGrade,
    getWeakestDimensions,
} from "@/lib/healthScore";
import { storage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepProgress } from "@/components/ui/feedback";
import { toast } from "sonner";

// ── Progress Bar ────────────────────────────────────────────
function ProgressBar({ label, value, max = 100, color = "blue", showValue = true, className }) {
    const pct = Math.min((value / max) * 100, 100);
    const colorMap = {
        blue: "bg-clinical-primary",
        green: "bg-clinical-success",
        yellow: "bg-clinical-warning",
        orange: "bg-clinical-warning",
        red: "bg-clinical-danger",
        gray: "bg-clinical-muted",
    };
    return (
        <div className={className}>
            {label && (
                <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-xs font-semibold text-clinical-text">{label}</span>
                    {showValue && (
                        <span className="font-mono text-xs font-semibold text-clinical-muted">
                            {Math.round(value)}/{max}
                        </span>
                    )}
                </div>
            )}
            <div className="clinical-progress-track">
                <div
                    className={cn("clinical-progress-fill", colorMap[color] || colorMap.blue)}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

// ── Range Slider ────────────────────────────────────────────
function RangeSlider({ label, value, min, max, step = 1, onChange }) {
    return (
        <div className="py-2">
            {label && (
                <p className="font-display text-xl md:text-2xl font-bold text-clinical-text mb-5 leading-tight">{label}</p>
            )}
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="flex-1 h-2 appearance-none bg-clinical-bg border border-clinical-border rounded-full cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                        [&::-webkit-slider-thumb]:bg-clinical-primary [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:shadow-clinical-sm [&::-webkit-slider-thumb]:cursor-grab
                        [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6
                        [&::-moz-range-thumb]:bg-clinical-primary [&::-moz-range-thumb]:rounded-full"
                />
                <span className="w-12 h-12 flex items-center justify-center rounded-clinical-lg bg-clinical-primary text-white font-display text-xl">
                    {value}
                </span>
            </div>
        </div>
    );
}

// ── Single Question ──────────────────────────────────────────
function QuestionStep({ question, value, onChange }) {
    if (question.type === "range") {
        return (
            <div className="py-4">
                <RangeSlider
                    label={question.text}
                    value={value ?? question.min}
                    min={question.min}
                    max={question.max}
                    step={1}
                    onChange={onChange}
                />
                <div className="flex justify-between text-xs text-clinical-muted mt-2 font-body">
                    <span>
                        {question.id.includes("stress")
                            ? "Sangat Rendah"
                            : "Sangat Tidak Puas"}
                    </span>
                    <span>
                        {question.id.includes("stress")
                            ? "Sangat Tinggi"
                            : "Sangat Puas"}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2.5 py-2">
            {question.options.map((opt, i) => {
                const isSelected = value === opt.value;
                return (
                    <button
                        key={i}
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "w-full text-left px-4 py-3.5 border rounded-clinical-md",
                            "font-body text-sm transition-all duration-200",
                            "shadow-clinical-xs hover:shadow-clinical-sm",
                            "hover:-translate-y-0.5",
                            "flex items-center gap-3 group",
                            isSelected
                                ? "bg-clinical-primary text-white border-clinical-primary font-semibold shadow-clinical-sm"
                                : "bg-white text-clinical-text border-clinical-border hover:bg-clinical-primary-light hover:border-clinical-primary",
                        )}
                    >
                        <span
                            className={cn(
                                "w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-display text-xs transition-all",
                                isSelected
                                    ? "bg-white text-clinical-primary font-bold"
                                    : "border border-clinical-border bg-clinical-bg text-clinical-text group-hover:bg-clinical-primary group-hover:text-white",
                            )}
                        >
                            {isSelected ? "✓" : String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1">{opt.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

// ── Radar Chart ──────────────────────────────────────────────
function ScoreRadarChart({ dimensionScores }) {
    const data = DIMENSIONS.map((d) => ({
        dimension: d.label.split(" ")[0],
        score: dimensionScores[d.id] || 0,
        fullMark: 100,
    }));

    return (
        <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={data}>
                <PolarGrid
                    stroke="#E2E8F0"
                    strokeWidth={1}
                    strokeDasharray="4 2"
                />
                <PolarAngleAxis
                    dataKey="dimension"
                    tick={{
                        fontSize: 11,
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fill: "#475569",
                    }}
                />
                <Radar
                    name="Skor Kamu"
                    dataKey="score"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fill="#2563EB"
                    fillOpacity={0.15}
                />
                <Tooltip
                    contentStyle={{
                        border: "1px solid #E2E8F0",
                        borderRadius: "0.5rem",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: 12,
                        boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.07)",
                    }}
                    formatter={(val) => [`${val}/100`, "Skor"]}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}

// ── Result Screen ────────────────────────────────────────────
function HealthScoreResult({ result, onRetake }) {
    const grade = getScoreGrade(result.aggregate);
    const weakest = getWeakestDimensions(result.dimensions, 2);

    const gradeColors = {
        green: { bg: "bg-clinical-success", text: "text-white" },
        blue: { bg: "bg-clinical-primary", text: "text-white" },
        yellow: { bg: "bg-clinical-warning-light", text: "text-clinical-text" },
        orange: { bg: "bg-clinical-warning", text: "text-white" },
        red: { bg: "bg-clinical-danger", text: "text-white" },
    };

    const gc = gradeColors[grade.color];

    const handleShare = async () => {
        const text = `Health Score saya di MediCheck ID: ${result.aggregate}/100 — Grade ${grade.grade} (${grade.label}) 💪\nCek kesehatan kamu juga di medicheckid.com`;
        if (navigator.share) {
            await navigator.share({ title: "Health Score MediCheck ID", text });
        } else {
            await navigator.clipboard.writeText(text);
            toast.success("Disalin ke clipboard!");
        }
    };

    storage.set("medicheck_health_score", {
        ...result,
        date: new Date().toISOString(),
    });

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Score Hero */}
            <div
                className={cn(
                    "rounded-clinical-2xl p-8 text-center shadow-clinical-lg",
                    gc.bg,
                )}
            >
                <p
                    className={cn(
                        "font-body text-sm font-semibold uppercase tracking-widest mb-2",
                        gc.text,
                    )}
                >
                    HEALTH SCORE KAMU
                </p>
                <div className="flex items-end justify-center gap-3 mb-2">
                    <span
                        className={cn(
                            "font-display leading-none text-8xl font-extrabold",
                            gc.text,
                        )}
                    >
                        {result.aggregate}
                    </span>
                    <span
                        className={cn(
                            "font-display text-3xl mb-2 opacity-60",
                            gc.text,
                        )}
                    >
                        /100
                    </span>
                </div>
                <div
                    className={cn(
                        "inline-block border border-current/30 rounded-full px-5 py-1.5 font-display text-lg font-bold",
                        gc.text,
                    )}
                >
                    Grade {grade.grade} — {grade.label}
                </div>
                <p
                    className={cn(
                        "font-body text-sm mt-3 max-w-xs mx-auto opacity-80",
                        gc.text,
                    )}
                >
                    {grade.message}
                </p>
            </div>

            {/* Radar Chart */}
            <Card className="border border-clinical-border rounded-clinical-xl shadow-clinical-sm">
                <CardHeader>
                    <h3 className="font-display text-xl font-bold text-clinical-text">
                        📊 Profil Kesehatan 6 Dimensi
                    </h3>
                </CardHeader>
                <CardContent>
                    <ScoreRadarChart dimensionScores={result.dimensions} />
                </CardContent>
            </Card>

            {/* Dimension Breakdown */}
            <Card className="border border-clinical-border rounded-clinical-xl shadow-clinical-sm">
                <CardHeader>
                    <h3 className="font-display text-lg font-bold text-clinical-text">Skor Per Dimensi</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                    {DIMENSIONS.map((dim) => {
                        const score = result.dimensions[dim.id] || 0;
                        return (
                            <ProgressBar
                                key={dim.id}
                                label={`${dim.emoji} ${dim.label}`}
                                value={score}
                                max={100}
                                color={
                                    score >= 70
                                        ? "green"
                                        : score >= 45
                                            ? "yellow"
                                            : "red"
                                }
                                showValue
                            />
                        );
                    })}
                </CardContent>
            </Card>

            {/* Priority Recommendations */}
            <Card className="border border-clinical-border rounded-clinical-xl bg-clinical-primary-light/30 shadow-clinical-sm">
                <CardHeader>
                    <h3 className="font-display text-lg font-bold text-clinical-text">
                        ⚡ Prioritas Perbaikan
                    </h3>
                </CardHeader>
                <CardContent>
                    <p className="font-body text-sm font-semibold text-clinical-text mb-4">
                        Fokus pada 2 dimensi dengan skor terendah kamu:
                    </p>
                    {weakest.map((dim) => (
                        <div
                            key={dim.id}
                            className="bg-white border border-clinical-border rounded-clinical-lg p-3 mb-3 shadow-clinical-xs"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{dim.emoji}</span>
                                <span className="font-display text-base font-bold text-clinical-text">
                                    {dim.label}
                                </span>
                                <Badge
                                    variant="default"
                                    className="ml-auto rounded-full"
                                >
                                    {dim.score}/100
                                </Badge>
                            </div>
                            <p className="text-xs font-body text-clinical-text-secondary">
                                {dim.id === "sleep" &&
                                    "Tingkatkan konsistensi jam tidur. Targetkan 7-8 jam per malam dengan jadwal tetap."}
                                {dim.id === "activity" &&
                                    "Mulai dengan 20-30 menit jalan kaki 3x seminggu, lalu tingkatkan bertahap."}
                                {dim.id === "nutrition" &&
                                    "Tambahkan satu porsi sayur atau buah setiap hari. Kurangi makanan ultra-proses."}
                                {dim.id === "hydration" &&
                                    "Siapkan botol minum 1.5L setiap pagi. Habiskan sebelum tidur."}
                                {dim.id === "stress" &&
                                    "Coba 10 menit meditasi atau pernapasan dalam setiap pagi. Journaling bisa membantu."}
                                {dim.id === "social" &&
                                    "Jadwalkan satu sesi berkualitas dengan orang tersayang setiap minggu."}
                            </p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    onClick={onRetake}
                    className="w-full"
                >
                    <RotateCcw size={14} />
                    Tes Ulang
                </Button>
                <Button
                    variant="secondary"
                    onClick={handleShare}
                    className="w-full"
                >
                    <Share2 size={14} />
                    Share Skor
                </Button>
            </div>
        </div>
    );
}

// ── Main Assessment ──────────────────────────────────────────
export default function HealthScoreAssessment() {
    const [phase, setPhase] = useState("intro");
    const [dimIndex, setDimIndex] = useState(0);
    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const allQuestions = useMemo(
        () =>
            DIMENSIONS.flatMap((d) =>
                d.questions.map((q) => ({
                    ...q,
                    dimId: d.id,
                    dimLabel: d.label,
                    dimEmoji: d.emoji,
                })),
            ),
        [],
    );

    const totalQuestions = allQuestions.length;
    const currentFlatIndex = useMemo(() => {
        let i = 0;
        for (let d = 0; d < dimIndex; d++) i += DIMENSIONS[d].questions.length;
        return i + qIndex;
    }, [dimIndex, qIndex]);

    const currentDim = DIMENSIONS[dimIndex];
    const currentQ = currentDim?.questions[qIndex];
    const currentAnswer = currentQ ? answers[currentQ.id] : undefined;

    const handleAnswer = (value) => {
        if (!currentQ) return;
        setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
    };

    const handleNext = () => {
        if (currentAnswer === undefined) return;

        const nextQIndex = qIndex + 1;
        if (nextQIndex < currentDim.questions.length) {
            setQIndex(nextQIndex);
        } else {
            const nextDimIndex = dimIndex + 1;
            if (nextDimIndex < DIMENSIONS.length) {
                setDimIndex(nextDimIndex);
                setQIndex(0);
            } else {
                const score = calculateHealthScore(answers);
                setResult(score);
                setPhase("result");
            }
        }
    };

    const handleBack = () => {
        if (qIndex > 0) {
            setQIndex(qIndex - 1);
        } else if (dimIndex > 0) {
            const prevDim = DIMENSIONS[dimIndex - 1];
            setDimIndex(dimIndex - 1);
            setQIndex(prevDim.questions.length - 1);
        } else {
            setPhase("intro");
        }
    };

    const handleRetake = () => {
        setPhase("intro");
        setDimIndex(0);
        setQIndex(0);
        setAnswers({});
        setResult(null);
    };

    if (phase === "intro") {
        return (
            <div className="animate-slide-up">
                <div className="clinical-gradient-hero rounded-clinical-2xl p-8 mb-6 text-center shadow-clinical-sm">
                    <p className="font-display text-6xl mb-4">🩺</p>
                    <h2 className="font-display text-3xl font-bold text-clinical-text mb-3">
                        Health Score Check
                    </h2>
                    <p className="font-body text-clinical-text-secondary max-w-md mx-auto mb-6">
                        Jawab <strong>{totalQuestions} pertanyaan</strong>{" "}
                        tentang gaya hidupmu dan dapatkan skor kesehatan
                        personal dari <strong>6 dimensi</strong>. Estimasi
                        waktu: <strong>5-7 menit</strong>.
                    </p>
                    <div className="grid grid-cols-3 gap-3 mb-6 text-left">
                        {DIMENSIONS.map((d) => (
                            <div
                                key={d.id}
                                className="bg-white border border-clinical-border rounded-clinical-lg p-2.5 shadow-clinical-xs text-center"
                            >
                                <span className="text-2xl block mb-1">
                                    {d.emoji}
                                </span>
                                <span className="font-body text-xs font-semibold text-clinical-text">
                                    {d.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Button
                        variant="default"
                        size="lg"
                        onClick={() => setPhase("questions")}
                        className="w-full"
                    >
                        Mulai Sekarang →
                    </Button>
                </div>
            </div>
        );
    }

    if (phase === "result" && result) {
        return <HealthScoreResult result={result} onRetake={handleRetake} />;
    }

    // Questions phase
    return (
        <div className="animate-slide-up">
            {/* Progress */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{currentDim?.emoji}</span>
                        <span className="font-display text-sm font-semibold text-clinical-text-secondary">
                            {currentDim?.label}
                        </span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-clinical-muted">
                        {currentFlatIndex + 1} / {totalQuestions}
                    </span>
                </div>
                <ProgressBar
                    value={currentFlatIndex + 1}
                    max={totalQuestions}
                    color="blue"
                    showValue={false}
                />
            </div>

            {/* Dimension tabs */}
            <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 no-scrollbar">
                {DIMENSIONS.map((d, i) => {
                    const dimComplete = d.questions.every(
                        (q) => answers[q.id] !== undefined,
                    );
                    return (
                        <div
                            key={d.id}
                            className={cn(
                                "shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all",
                                i === dimIndex
                                    ? "bg-clinical-primary text-white"
                                    : dimComplete
                                        ? "bg-clinical-success text-white"
                                        : "bg-clinical-bg text-clinical-muted border border-clinical-border",
                            )}
                        >
                            {d.emoji} {d.label.split(" ")[0]}
                        </div>
                    );
                })}
            </div>

            {/* Question */}
            <Card className="mb-5 border border-clinical-border rounded-clinical-xl shadow-clinical-md">
                <CardHeader className="bg-clinical-bg">
                    <p className="font-body text-xs font-semibold uppercase tracking-wider text-clinical-muted">
                        {currentDim?.label} — Pertanyaan {qIndex + 1} dari{" "}
                        {currentDim?.questions.length}
                    </p>
                </CardHeader>
                <CardContent className="p-5">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-clinical-text mb-5 leading-tight">
                        {currentQ?.text}
                    </h3>
                    {currentQ && (
                        <QuestionStep
                            question={currentQ}
                            value={currentAnswer}
                            onChange={handleAnswer}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={dimIndex === 0 && qIndex === 0}
                >
                    <ChevronLeft size={14} />
                    Kembali
                </Button>
                <Button
                    variant={currentAnswer !== undefined ? "default" : "ghost"}
                    onClick={handleNext}
                    disabled={currentAnswer === undefined}
                    className="flex-1"
                >
                    {currentFlatIndex === totalQuestions - 1
                        ? "Lihat Hasil"
                        : "Lanjut"}
                    <ChevronRight size={14} />
                </Button>
            </div>
        </div>
    );
}
