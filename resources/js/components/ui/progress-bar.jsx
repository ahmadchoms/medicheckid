import { cn } from "@/lib/utils";

export default function ProgressBar({ label, value, max = 100, color = "blue", showValue = true, className }) {
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
