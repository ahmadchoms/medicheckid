// resources/js/Pages/health-score.jsx
import { Head } from "@inertiajs/react";
import PublicLayout from "@/components/layouts/public-layout";
import HealthScoreAssessment from "@/features/healthscore/healtscore-assesment";

export default function HealthScorePage() {
    return (
        <PublicLayout>
            <Head title="Health Score — MediCheck ID" />

            <div className="py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="font-display text-4xl md:text-5xl text-brutal-black mb-2">
                        Health Score
                    </h1>
                    <p className="font-body text-brutal-muted max-w-xl">
                        Cek skor kesehatan kamu dari 6 dimensi gaya hidup.
                        Dapatkan insight personal dan rekomendasi untuk hidup
                        lebih sehat.
                    </p>
                </div>

                <HealthScoreAssessment />

                {/* Disclaimer */}
                <div className="mt-8 border-t-3 border-brutal-gray pt-4">
                    <p className="text-xs font-body text-brutal-muted">
                        ⚠️ <strong>Disclaimer:</strong> Health Score ini bukan
                        diagnosis medis. Skor dihitung berdasarkan self-report
                        dan hanya bersifat informatif. Untuk evaluasi kesehatan
                        menyeluruh, konsultasikan dengan tenaga medis
                        profesional.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
