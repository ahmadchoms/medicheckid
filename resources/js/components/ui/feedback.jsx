import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCcw, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";


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
                    <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-destructive/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <AlertTriangle
                                size={28}
                                className="text-destructive"
                                strokeWidth={2}
                            />
                        </div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                            Oops! Terjadi Kesalahan
                        </h2>
                        <p className="font-body text-muted-foreground text-sm mb-6 leading-relaxed">
                            Sepertinya ada yang salah. Silakan coba muat ulang
                            halaman ini.
                        </p>
                        {this.state.error && (
                            <div className="bg-background border border-border rounded-md p-3 mb-6 text-left">
                                <p className="font-mono text-xs text-muted break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}
                        <Button variant="default" onClick={this.handleReset}>
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
        <div
            className={cn(
                "flex flex-col items-center justify-center py-16 px-6 text-center",
                className,
            )}
        >
            {emoji ? (
                <span className="text-6xl mb-4">{emoji}</span>
            ) : (
                <div className="w-16 h-16 bg-background border border-border rounded-lg mb-4 flex items-center justify-center">
                    <Icon size={28} className="text-muted" strokeWidth={2} />
                </div>
            )}
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {title}
            </h3>
            <p className="font-body text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            {action && actionLabel && (
                <Button variant="default" onClick={action}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}


function StepProgress({ steps = [], currentStep = 0, className }) {
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
                                    isCompleted &&
                                        "bg-primary text-primary-foreground",
                                    isActive &&
                                        "bg-accent text-accent-foreground",
                                    !isCompleted &&
                                        !isActive &&
                                        "bg-background border border-border text-muted",
                                )}
                            >
                                <span className="font-display text-xs font-bold">
                                    {isCompleted ? "✓" : index + 1}
                                </span>
                            </div>
                            {step.label && (
                                <span
                                    className={cn(
                                        "font-body text-[10px] leading-tight text-center max-w-[60px]",
                                        isActive
                                            ? "text-foreground font-semibold"
                                            : "text-muted",
                                    )}
                                >
                                    {step.label}
                                </span>
                            )}
                        </div>

                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "flex-1 h-0.5 min-w-[16px] self-start mt-[14px] rounded-full",
                                    isCompleted ? "bg-primary" : "bg-border",
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
