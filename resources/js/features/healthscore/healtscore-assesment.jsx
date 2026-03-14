import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIMENSIONS, calculateHealthScore } from "@/lib/healthScore";
import { storage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


import ProgressBar from "@/components/ui/progress-bar";
import QuestionStep from "./components/QuestionStep";
import HealthScoreResult from "./components/HealthScoreResult";


export default function HealthScoreAssessment() {
    
    const [phase, setPhase] = useState(() => {
        const saved = storage.get("medicheck_hs_progress");
        return saved ? saved.phase : "intro";
    });
    const [dimIndex, setDimIndex] = useState(() => {
        const saved = storage.get("medicheck_hs_progress");
        return saved ? saved.dimIndex : 0;
    });
    const [qIndex, setQIndex] = useState(() => {
        const saved = storage.get("medicheck_hs_progress");
        return saved ? saved.qIndex : 0;
    });
    const [answers, setAnswers] = useState(() => {
        const saved = storage.get("medicheck_hs_progress");
        return saved ? saved.answers : {};
    });
    const [result, setResult] = useState(null);

    
    useEffect(() => {
        if (phase === "questions" || phase === "intro") {
            
            storage.set("medicheck_hs_progress", {
                phase,
                dimIndex,
                qIndex,
                answers,
            });
        }
    }, [phase, dimIndex, qIndex, answers]);

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
        storage.remove("medicheck_hs_progress");

        
        const dateKey = new Date().toISOString().split("T")[0];
        storage.remove(`medicheck_habits_${dateKey}`);
    };

    const handleContinue = () => {
        setPhase("questions");
    };

    const handleStartNew = () => {
        setDimIndex(0);
        setQIndex(0);
        setAnswers({});
        setPhase("questions");
        storage.remove("medicheck_hs_progress");

        
        const dateKey = new Date().toISOString().split("T")[0];
        storage.remove(`medicheck_habits_${dateKey}`);
    };

    if (phase === "intro") {
        const hasSavedProgress = Object.keys(answers).length > 0;

        return (
            <div className="animate-slide-up">
                <div className="clinical-gradient-hero rounded-clinical-2xl p-8 mb-6 text-center shadow-clinical-sm">
                    <p
                        className="font-display text-6xl mb-4"
                        aria-hidden="true"
                    >
                        🩺
                    </p>
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
                                <span
                                    className="text-2xl block mb-1"
                                    aria-hidden="true"
                                >
                                    {d.emoji}
                                </span>
                                <span className="font-body text-xs font-semibold text-clinical-text">
                                    {d.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    {hasSavedProgress ? (
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleStartNew}
                                className="w-1/3"
                            >
                                Ulang Baru
                            </Button>
                            <Button
                                variant="default"
                                size="lg"
                                onClick={handleContinue}
                                className="w-2/3"
                            >
                                Lanjut Progres →
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="default"
                            size="lg"
                            onClick={() => setPhase("questions")}
                            className="w-full"
                        >
                            Mulai Sekarang →
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    if (phase === "result" && result) {
        return <HealthScoreResult result={result} onRetake={handleRetake} />;
    }

    
    return (
        <div className="animate-slide-up">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl" aria-hidden="true">
                            {currentDim?.emoji}
                        </span>
                        <span className="font-display text-sm font-semibold text-clinical-text-secondary">
                            {currentDim?.label}
                        </span>
                    </div>
                    <span
                        className="font-mono text-xs font-semibold text-clinical-muted"
                        aria-live="polite"
                    >
                        {currentFlatIndex + 1} / {totalQuestions}
                    </span>
                </div>
                <ProgressBar
                    value={currentFlatIndex + 1}
                    max={totalQuestions}
                    color="blue"
                    showValue={false}
                    aria-valuenow={currentFlatIndex + 1}
                    aria-valuemax={totalQuestions}
                />
            </div>

            <div
                className="flex gap-1.5 mb-5 overflow-x-auto pb-1 no-scrollbar"
                role="tablist"
            >
                {DIMENSIONS.map((d, i) => {
                    const dimComplete = d.questions.every(
                        (q) => answers[q.id] !== undefined,
                    );
                    return (
                        <div
                            key={d.id}
                            role="tab"
                            aria-selected={i === dimIndex}
                            className={cn(
                                "shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all",
                                i === dimIndex
                                    ? "bg-clinical-primary text-white"
                                    : dimComplete
                                      ? "bg-clinical-success text-white"
                                      : "bg-clinical-bg text-clinical-muted border border-clinical-border",
                            )}
                        >
                            <span aria-hidden="true">{d.emoji}</span>{" "}
                            {d.label.split(" ")[0]}
                        </div>
                    );
                })}
            </div>

            <Card
                className="mb-5 border border-clinical-border rounded-clinical-xl shadow-clinical-md"
                role="region"
                aria-live="polite"
            >
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

            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={dimIndex === 0 && qIndex === 0}
                    aria-label="Kembali ke pertanyaan sebelumnya"
                >
                    <ChevronLeft size={14} aria-hidden="true" />
                    Kembali
                </Button>
                <Button
                    variant={currentAnswer !== undefined ? "default" : "ghost"}
                    onClick={handleNext}
                    disabled={currentAnswer === undefined}
                    className="flex-1"
                    aria-label="Lanjut ke pertanyaan berikutnya"
                >
                    {currentFlatIndex === totalQuestions - 1
                        ? "Lihat Hasil"
                        : "Lanjut"}
                    <ChevronRight size={14} aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}
