import { useEffect } from "react";
import { Sparkles, Loader2, Send, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { SYMPTOM_AREAS } from "@/lib/symptomTree";

export default function AIPromptCard({
    areaId,
    onAnalyze,
    isLoading,
    contextPath = [],
}) {
    const area = SYMPTOM_AREAS[areaId];
    const {
        text: symptomDesc,
        setText: setSymptomDesc,
        isListening,
        isSupported,
        start,
        stop,
    } = useSpeechRecognition({ lang: "id-ID" });

    
    useEffect(() => {
        if (contextPath.length > 0 && !symptomDesc) {
            const ctx = `Saya sebelumnya menjawab: ${contextPath.join(" → ")}. `;
            setSymptomDesc(ctx);
        }
    }, [contextPath, symptomDesc, setSymptomDesc]);

    const toggleListening = () => {
        if (!isSupported) {
            toast.error(
                "Browser Anda tidak mendukung fitur suara (Gunakan Chrome/Edge).",
            );
            return;
        }

        if (isListening) {
            stop();
        } else {
            start();
            toast.info("Mendengarkan... Silakan bicara.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!symptomDesc.trim()) {
            toast.error("Tolong ceritakan gejala Anda terlebih dahulu.");
            return;
        }

        if (isListening) stop();

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
                        <div className="relative">
                            <textarea
                                className="w-full min-h-[140px] pl-4 pr-12 py-4 border border-clinical-border rounded-clinical-md font-body text-sm resize-y focus:outline-none focus:border-clinical-primary focus:ring-2 focus:ring-clinical-primary/20 transition-all"
                                placeholder="Contoh: Saya merasa sakit kepala sebelah kiri berdenyut sejak kemarin sore..."
                                value={symptomDesc}
                                onChange={(e) => setSymptomDesc(e.target.value)}
                                disabled={isLoading}
                                aria-label="Deskripsi keluhan"
                            />

                            {isSupported && (
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    disabled={isLoading}
                                    className={cn(
                                        "absolute top-4 right-4 p-2 rounded-full transition-all",
                                        isListening
                                            ? "bg-clinical-danger text-white animate-pulse shadow-clinical-sm shadow-clinical-danger/30"
                                            : "bg-clinical-bg text-clinical-muted hover:bg-clinical-primary-light hover:text-clinical-primary",
                                    )}
                                    title={
                                        isListening
                                            ? "Hentikan mendengarkan"
                                            : "Mulai bicara"
                                    }
                                    aria-label={
                                        isListening
                                            ? "Hentikan mendengarkan"
                                            : "Mulai bicara menggunakan mikrofon"
                                    }
                                >
                                    {isListening ? (
                                        <Mic size={18} />
                                    ) : (
                                        <MicOff size={18} />
                                    )}
                                </button>
                            )}
                        </div>
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
