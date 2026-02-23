import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCcw, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── ErrorBoundary ────────────────────────────────────────
// React class component that catches render errors and displays
// a Neo-Brutalism styled fallback UI with retry capability.

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
                    <div className="w-full max-w-md border-4 border-brutal-black bg-brutal-white shadow-brutal-xl p-8 text-center">
                        <div className="w-16 h-16 bg-brutal-red border-3 border-brutal-black mx-auto mb-4 flex items-center justify-center">
                            <AlertTriangle size={28} className="text-white" strokeWidth={2.5} />
                        </div>
                        <h2 className="font-display text-2xl mb-2">
                            Oops! Terjadi Kesalahan
                        </h2>
                        <p className="font-body text-brutal-muted text-sm mb-6 leading-relaxed">
                            Sepertinya ada yang salah. Silakan coba muat ulang halaman ini.
                        </p>
                        {this.state.error && (
                            <div className="border-3 border-brutal-black bg-brutal-gray p-3 mb-6 text-left">
                                <p className="font-mono text-xs text-brutal-muted break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}
                        <Button
                            variant="default"
                            onClick={this.handleReset}
                            className="border-3 border-brutal-black shadow-brutal"
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
// Reusable empty state component for lists, search results, etc.

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
                <div className="w-16 h-16 bg-brutal-gray border-3 border-brutal-black mb-4 flex items-center justify-center">
                    <Icon size={28} className="text-brutal-muted" strokeWidth={2} />
                </div>
            )}
            <h3 className="font-display text-xl mb-2">{title}</h3>
            <p className="font-body text-brutal-muted text-sm max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            {action && actionLabel && (
                <Button
                    variant="default"
                    onClick={action}
                    className="border-3 border-brutal-black shadow-brutal"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

// ─── StepProgress ────────────────────────────────────────────
// Step indicator showing numbered steps with active/completed states.
// Used in decision tree navigation and multi-step forms.

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
                        {/* Step circle */}
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={cn(
                                    "w-8 h-8 border-3 border-brutal-black flex items-center justify-center transition-colors duration-150",
                                    isCompleted && "bg-brutal-green text-white",
                                    isActive && "bg-brutal-yellow text-brutal-black",
                                    !isCompleted && !isActive && "bg-brutal-white text-brutal-muted",
                                )}
                            >
                                <span className="font-display text-xs">
                                    {isCompleted ? "✓" : index + 1}
                                </span>
                            </div>
                            {step.label && (
                                <span className={cn(
                                    "font-body text-[10px] leading-tight text-center max-w-[60px]",
                                    isActive ? "text-brutal-black font-bold" : "text-brutal-muted",
                                )}>
                                    {step.label}
                                </span>
                            )}
                        </div>

                        {/* Connector line between steps */}
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "flex-1 h-[3px] min-w-[16px] self-start mt-[14px]",
                                    isCompleted ? "bg-brutal-green" : "bg-brutal-gray",
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
