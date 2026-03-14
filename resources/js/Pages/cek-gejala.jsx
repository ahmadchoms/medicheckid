import { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Bot,
    ArrowRight,
    Stethoscope,
    AlertTriangle,
    Sparkles,
    Hand,
} from "lucide-react";
import PublicLayout from "@/components/layouts/public-layout";
import SymptomChecker from "@/features/symptomchecker/symptom-checker";

const MODES = [
    {
        id: "interactive",
        icon: Hand,
        emoji: "🖐️",
        title: "Mode Interaktif",
        description:
            "Pilih area tubuh yang sakit, lalu pilih dari daftar gejala yang sudah disediakan",
        tag: "Mudah",
    },
    {
        id: "ai",
        icon: Bot,
        emoji: "🤖",
        title: "Mode AI Chat",
        description:
            "Deskripsikan gejala kamu secara bebas dan AI akan menganalisisnya",
        tag: "AI-Powered",
    },
];

export default function CekGejala() {
    const [selectedMode, setSelectedMode] = useState(null);

    if (selectedMode) {
        return (
            <PublicLayout>
                <Head title="Cek Gejala — MediCheck ID" />

                <button
                    onClick={() => setSelectedMode(null)}
                    className="font-body text-sm text-clinical-text-secondary hover:text-clinical-primary transition-colors mb-4 inline-flex items-center gap-1"
                >
                    ← Kembali ke pilihan mode
                </button>

                <SymptomChecker mode={selectedMode} />
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title="Cek Gejala — MediCheck ID" />

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 bg-clinical-primary-light rounded-clinical-lg flex items-center justify-center">
                        <Stethoscope
                            size={22}
                            className="text-clinical-primary"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-clinical-text">
                            Cek Gejala
                        </h1>
                        <p className="font-body text-sm text-clinical-muted">
                            Pilih metode pemeriksaan yang kamu inginkan
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {MODES.map((mode) => {
                    const Icon = mode.icon;
                    return (
                        <button
                            key={mode.id}
                            onClick={() => setSelectedMode(mode.id)}
                            className="group text-left bg-white border border-clinical-border rounded-clinical-xl p-6 shadow-clinical-xs hover:shadow-clinical-lg hover:-translate-y-1 hover:border-clinical-primary/30 transition-all duration-300"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-clinical-primary-light rounded-clinical-lg flex items-center justify-center shrink-0 group-hover:bg-clinical-primary group-hover:text-white transition-colors">
                                    <Icon
                                        size={22}
                                        className="text-clinical-primary group-hover:text-white transition-colors"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-display text-lg font-bold text-clinical-text">
                                            {mode.title}
                                        </h3>
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-clinical-primary-light text-clinical-primary">
                                            {mode.tag}
                                        </span>
                                    </div>
                                    <p className="font-body text-sm text-clinical-text-secondary leading-relaxed">
                                        {mode.description}
                                    </p>
                                    <div className="flex items-center gap-1 mt-3 text-clinical-primary font-body font-semibold text-sm">
                                        <span>Mulai Sekarang</span>
                                        <ArrowRight
                                            size={14}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="bg-white border border-clinical-border rounded-clinical-xl p-6 shadow-clinical-xs mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} className="text-clinical-primary" />
                    <h3 className="font-display text-lg font-bold text-clinical-text">
                        Bagaimana Cara Kerjanya?
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            step: "1",
                            title: "Pilih Mode",
                            desc: "Pilih mode interaktif atau AI sesuai preferensi kamu.",
                        },
                        {
                            step: "2",
                            title: "Deskripsikan Gejala",
                            desc: "Pilih gejala dari daftar atau deskripsikan secara bebas.",
                        },
                        {
                            step: "3",
                            title: "Dapatkan Analisis",
                            desc: "AI akan memberikan analisis awal dan rekomendasi tindakan.",
                        },
                    ].map((item) => (
                        <div
                            key={item.step}
                            className="flex items-start gap-3 p-3 bg-clinical-bg rounded-clinical-md"
                        >
                            <div className="w-8 h-8 bg-clinical-primary rounded-full flex items-center justify-center shrink-0">
                                <span className="font-display text-xs text-white font-bold">
                                    {item.step}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-body text-sm font-bold text-clinical-text">
                                    {item.title}
                                </h4>
                                <p className="font-body text-xs text-clinical-muted leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-clinical-warning-light/50 border border-clinical-warning/20 rounded-clinical-xl p-5">
                <div className="flex items-start gap-3">
                    <AlertTriangle
                        size={18}
                        className="text-clinical-warning shrink-0 mt-0.5"
                    />
                    <div>
                        <h4 className="font-display font-bold text-sm text-clinical-text mb-1">
                            Disclaimer
                        </h4>
                        <p className="font-body text-xs text-clinical-text-secondary leading-relaxed">
                            Fitur ini bersifat edukasi dan BUKAN pengganti
                            diagnosis dokter profesional. Dalam keadaan darurat,
                            segera hubungi{" "}
                            <strong className="text-clinical-danger">
                                119
                            </strong>{" "}
                            atau kunjungi IGD terdekat.
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
