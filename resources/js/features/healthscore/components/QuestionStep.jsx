import { cn } from "@/lib/utils";
import RangeSlider from "@/components/ui/range-slider";

export default function QuestionStep({ question, value, onChange }) {
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
        <div 
            className="flex flex-col gap-2.5 py-2"
            role="radiogroup"
            aria-label="Pilihan jawaban"
        >
            {question.options.map((opt, i) => {
                const isSelected = value === opt.value;
                return (
                    <button
                        key={i}
                        onClick={() => onChange(opt.value)}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`Opsi ${String.fromCharCode(65 + i)}: ${opt.label}`}
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
                            aria-hidden="true"
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
