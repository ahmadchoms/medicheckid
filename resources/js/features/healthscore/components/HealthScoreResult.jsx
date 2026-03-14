import { useState } from "react";
import { RotateCcw, Share2, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DIMENSIONS,
    getScoreGrade,
    getWeakestDimensions,
    generateDailyHabits,
} from "@/lib/healthScore";
import { storage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ProgressBar from "@/components/ui/progress-bar";
import ScoreRadarChart from "./ScoreRadarChart";

export default function HealthScoreResult({ result, onRetake }) {
    const grade = getScoreGrade(result.aggregate);
    const weakest = getWeakestDimensions(result.dimensions, 2);

    
    const [habits, setHabits] = useState(() => {
        const dateKey = new Date().toISOString().split("T")[0]; 
        const saved = storage.get(`medicheck_habits_${dateKey}`);
        if (saved) return saved;
        return generateDailyHabits(weakest);
    });

    const [animatingHabitId, setAnimatingHabitId] = useState(null);

    
    const toggleHabit = (id) => {
        const habitToToggle = habits.find((h) => h.id === id);
        const willBeDone = !habitToToggle.done;

        const newHabits = habits.map((h) =>
            h.id === id ? { ...h, done: willBeDone } : h,
        );
        setHabits(newHabits);

        const dateKey = new Date().toISOString().split("T")[0];
        storage.set(`medicheck_habits_${dateKey}`, newHabits);

        if (willBeDone) {
            setAnimatingHabitId(id);
            toast.success("Misi selesai! 🎉");
            setTimeout(() => setAnimatingHabitId(null), 1000); 
        } else {
            toast.info("Misi dibatalkan.");
        }
    };

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

    
    

    return (
        <div className="space-y-6 animate-slide-up">
            <div
                className={cn(
                    "rounded-clinical-2xl p-8 text-center shadow-clinical-lg relative overflow-hidden",
                    gc.bg,
                )}
            >
                <p
                    className={cn(
                        "font-body text-sm font-semibold uppercase tracking-widest mb-2 relative z-10",
                        gc.text,
                    )}
                >
                    HEALTH SCORE KAMU
                </p>
                <div className="flex items-end justify-center gap-3 mb-2 relative z-10">
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
                        "inline-block border border-current/30 rounded-full px-5 py-1.5 font-display text-lg font-bold relative z-10",
                        gc.text,
                    )}
                >
                    Grade {grade.grade} — {grade.label}
                </div>
                <p
                    className={cn(
                        "font-body text-sm mt-3 max-w-xs mx-auto opacity-80 relative z-10",
                        gc.text,
                    )}
                >
                    {grade.message}
                </p>
            </div>

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

            <Card className="border border-clinical-border rounded-clinical-xl shadow-clinical-sm">
                <CardHeader>
                    <h3 className="font-display text-lg font-bold text-clinical-text">
                        Skor Per Dimensi
                    </h3>
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

            <Card className="border border-clinical-border rounded-clinical-xl shadow-clinical-sm bg-gradient-to-br from-white to-clinical-success-light/30 relative overflow-hidden">
                <CardHeader className="pb-3 border-b border-clinical-border relative z-10">
                    <div className="flex justify-between items-center">
                        <h3 className="font-display text-lg font-bold text-clinical-text flex items-center gap-2">
                            <span>🌱</span> Misi Harian Kamu
                        </h3>
                        <span className="text-xs font-semibold bg-clinical-success text-white px-2 py-0.5 rounded-full">
                            {habits.filter((h) => h.done).length}/3 Selesai
                        </span>
                    </div>
                    <p className="font-body text-xs text-clinical-text-secondary mt-1">
                        Dibuat khusus (AI) berdasarkan dimensi terlemahmu
                    </p>
                </CardHeader>
                <CardContent className="pt-4 relative z-10">
                    <div className="space-y-3">
                        {habits.map((habit) => (
                            <label
                                key={habit.id}
                                className={cn(
                                    "flex items-start gap-3 p-3 rounded-clinical-lg border cursor-pointer transition-all duration-300 relative",
                                    habit.done
                                        ? "bg-clinical-success/10 border-clinical-success shadow-none"
                                        : "bg-white border-clinical-border hover:border-clinical-primary shadow-clinical-xs",
                                    animatingHabitId === habit.id
                                        ? "scale-[1.02] bg-clinical-success/20 ring-2 ring-clinical-success ring-offset-1"
                                        : "",
                                )}
                            >
                                <div className="mt-0.5 shrink-0 relative">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-clinical-border text-clinical-primary focus:ring-clinical-primary cursor-pointer transition-all"
                                        checked={habit.done}
                                        onChange={() => toggleHabit(habit.id)}
                                        aria-label={`Tandai selesai: ${habit.text}`}
                                    />
                                    {animatingHabitId === habit.id && (
                                        <div
                                            className="absolute -top-3 -right-3 text-lg animate-bounce-slow"
                                            aria-hidden="true"
                                        >
                                            ✨
                                        </div>
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "font-body text-sm font-medium transition-all duration-300",
                                        habit.done
                                            ? "text-clinical-success/70 line-through"
                                            : "text-clinical-text",
                                    )}
                                >
                                    {habit.text}
                                </span>
                            </label>
                        ))}
                    </div>
                </CardContent>

                {habits.filter((h) => h.done).length === habits.length && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-clinical-success/20 blur-3xl rounded-full z-0 pointer-events-none" />
                )}
            </Card>

            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={onRetake} className="w-full">
                    <RotateCcw size={14} className="mr-2" />
                    Tes Ulang
                </Button>
                <Button
                    variant="secondary"
                    onClick={handleShare}
                    className="w-full"
                >
                    <Share2 size={14} className="mr-2" />
                    Share Skor
                </Button>
            </div>
        </div>
    );
}
