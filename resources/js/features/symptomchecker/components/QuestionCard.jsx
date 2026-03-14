import { Loader2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StepProgress } from "@/components/ui/feedback";

export default function QuestionCard({ node, onAnswer, stepIndex, isLoading }) {
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

                    <div 
                        className="flex flex-col gap-3"
                        role="radiogroup" 
                        aria-label="Pilihan jawaban"
                    >
                        {node.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => onAnswer(opt)}
                                disabled={isLoading}
                                role="radio"
                                aria-checked="false"
                                aria-label={`Pilih opsi ${String.fromCharCode(65 + idx)}: ${opt.label}`}
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
                                <span 
                                    className="w-7 h-7 shrink-0 rounded-full border border-clinical-border bg-clinical-bg group-hover:bg-clinical-primary group-hover:text-white flex items-center justify-center font-display text-xs font-bold transition-all duration-200"
                                    aria-hidden="true"
                                >
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="flex-1">{opt.label}</span>
                                <ChevronRight
                                    size={16}
                                    className="shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-clinical-primary"
                                    aria-hidden="true"
                                />
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
