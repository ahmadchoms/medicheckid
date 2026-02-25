import { Head } from "@inertiajs/react";
import PublicLayout from "@/components/layouts/public-layout";
import HealthScoreAssessment from "@/features/healthscore/healtscore-assesment";
import { ErrorBoundary } from "@/components/ui/feedback";
import { Heart } from "lucide-react";

export default function HealthScorePage() {
    return (
        <PublicLayout>
            <Head title="Health Score — MediCheck ID" />

            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 bg-clinical-accent-light rounded-clinical-lg flex items-center justify-center">
                        <Heart
                            size={22}
                            className="text-clinical-accent"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-clinical-text">
                            Health Score
                        </h1>
                        <p className="font-body text-sm text-clinical-muted">
                            Cek skor kesehatan dari 6 dimensi gaya hidupmu
                        </p>
                    </div>
                </div>

                <ErrorBoundary>
                    <HealthScoreAssessment />
                </ErrorBoundary>
            </div>
        </PublicLayout>
    );
}
