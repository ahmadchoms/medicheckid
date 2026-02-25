import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCcw, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── ErrorBoundary ────────────────────────────────────────
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("[ErrorBoundary]", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[300px] flex items-center justify-center p-8">
                    <div className="w-full max-w-md bg-white border border-clinical-border rounded-clinical-xl shadow-clinical-lg p-8 text-center">
                        <div className="w-16 h-16 bg-clinical-danger-light rounded-clinical-lg mx-auto mb-4 flex items-center justify-center">
                            <AlertTriangle size={28} className="text-clinical-danger" strokeWidth={2} />
                        </div>
                        <h2 className="font-display text-2xl font-bold text-clinical-text mb-2">
                            Oops! Terjadi Kesalahan
                        </h2>
                        <p className="font-body text-clinical-text-secondary text-sm mb-6 leading-relaxed">
                            Sepertinya ada yang salah. Silakan coba muat ulang halaman ini.
                        </p>
                        {this.state.error && (
                            <div className="bg-clinical-bg border border-clinical-border rounded-clinical-md p-3 mb-6 text-left">
                                <p className="font-mono text-xs text-clinical-muted break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}
                        <Button
                            variant="default"
                            onClick={this.handleReset}
                        >
                            <RefreshCcw size={16} />
                            Coba Lagi
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// ─── EmptyState ────────────────────────────────────────────
function EmptyState({
    icon: Icon = PackageOpen,
    emoji,
    title = "Tidak ada data",
    description = "Data yang kamu cari tidak ditemukan.",
    action,
    actionLabel,
    className,
}) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-16 px-6 text-center",
            className
        )}>
            {emoji ? (
                <span className="text-6xl mb-4">{emoji}</span>
            ) : (
                <div className="w-16 h-16 bg-clinical-bg border border-clinical-border rounded-clinical-lg mb-4 flex items-center justify-center">
                    <Icon size={28} className="text-clinical-muted" strokeWidth={2} />
                </div>
            )}
            <h3 className="font-display text-xl font-bold text-clinical-text mb-2">{title}</h3>
            <p className="font-body text-clinical-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            {action && actionLabel && (
                <Button
                    variant="default"
                    onClick={action}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

// ─── StepProgress ────────────────────────────────────────────
function StepProgress({
    steps = [],
    currentStep = 0,
    className,
}) {
    return (
        <div className={cn("flex items-center gap-1", className)}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;

                return (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200",
                                    isCompleted && "bg-clinical-success text-white",
                                    isActive && "bg-clinical-primary text-white",
                                    !isCompleted && !isActive && "bg-clinical-bg border border-clinical-border text-clinical-muted",
                                )}
                            >
                                <span className="font-display text-xs font-bold">
                                    {isCompleted ? "✓" : index + 1}
                                </span>
                            </div>
                            {step.label && (
                                <span className={cn(
                                    "font-body text-[10px] leading-tight text-center max-w-[60px]",
                                    isActive ? "text-clinical-text font-semibold" : "text-clinical-muted",
                                )}>
                                    {step.label}
                                </span>
                            )}
                        </div>

                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "flex-1 h-0.5 min-w-[16px] self-start mt-[14px] rounded-full",
                                    isCompleted ? "bg-clinical-success" : "bg-clinical-border",
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export { ErrorBoundary, EmptyState, StepProgress };
