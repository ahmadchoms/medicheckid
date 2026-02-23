// resources/js/pages/Public/CekGejala.jsx
import { useState } from "react";
import { Activity, RotateCcw, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import PublicLayout from "@/components/layouts/public-layout";
import SymptomChecker from "@/features/symptomchecker/symptom-checker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SYMPTOM_AREAS } from "@/lib/symptomTree";
import BodyMap from "@/features/bodymap/body-map";

export default function CekGejala() {
    const [selectedArea, setSelectedArea] = useState(null);
    const [checkerKey, setCheckerKey] = useState(0); // force remount on area change

    const handleAreaSelect = (areaId) => {
        setSelectedArea(areaId);
        setCheckerKey((k) => k + 1);
        // Auto-scroll to checker on mobile
        setTimeout(() => {
            const el = document.getElementById("checker-panel");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
    };

    const handleReset = () => {
        setSelectedArea(null);
        setCheckerKey((k) => k + 1);
    };

    return (
        <PublicLayout>
            {/* Page Header */}
            <div className="mb-8 border-b-3 border-brutal-black pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-brutal-blue border-3 border-brutal-black shadow-brutal flex items-center justify-center">
                                <Activity
                                    size={20}
                                    className="text-brutal-white"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <h1 className="font-display text-3xl md:text-4xl">
                                Cek Gejala
                            </h1>
                        </div>
                        <p className="font-body text-brutal-muted max-w-xl">
                            Pilih area tubuh yang tidak nyaman, lalu jawab
                            beberapa pertanyaan untuk mendapatkan panduan yang
                            tepat.
                        </p>
                    </div>
                    {selectedArea && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            className="flex-shrink-0"
                        >
                            <RotateCcw size={14} />
                            Mulai Ulang
                        </Button>
                    )}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="border-3 border-brutal-yellow bg-brutal-yellow/10 p-3 mb-6 flex items-start gap-2">
                <Info
                    size={16}
                    className="text-brutal-orange flex-shrink-0 mt-0.5"
                />
                <p className="text-xs font-body text-brutal-black">
                    <strong>Penting:</strong> Alat ini bersifat edukatif dan
                    BUKAN pengganti diagnosis dokter. Untuk kondisi darurat,
                    segera hubungi{" "}
                    <a href="tel:119" className="font-bold underline">
                        119
                    </a>
                    .
                </p>
            </div>

            {/* Main Layout: Body Map (left) + Checker (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6 xl:gap-8">
                {/* Left: Body Map */}
                <div className="order-1">
                    <Card className="sticky top-[76px] border-3 border-brutal-black shadow-brutal-lg">
                        <CardHeader>
                            <h2 className="font-display text-xl">
                                Pilih Area Tubuh
                            </h2>
                            <p className="font-body text-xs text-brutal-muted mt-0.5">
                                Klik ilustrasi atau tombol di bawah
                            </p>
                        </CardHeader>
                        <CardContent>
                            <BodyMap
                                selectedArea={selectedArea}
                                onAreaSelect={handleAreaSelect}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Checker Panel */}
                <div className="order-2" id="checker-panel">
                    {!selectedArea ? (
                        // Empty state — guide the user
                        <div className="h-full">
                            <Card className="p-6 mb-6 border-3 border-brutal-black bg-brutal-gray shadow-brutal-sm">
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-4xl">👈</span>
                                        <div>
                                            <p className="font-display text-xl">
                                                Pilih area tubuh dulu
                                            </p>
                                            <p className="font-body text-sm text-brutal-muted">
                                                Klik bagian yang sakit di body
                                                map
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                                        {Object.values(SYMPTOM_AREAS).map(
                                            (area) => (
                                                <button
                                                    key={area.id}
                                                    onClick={() =>
                                                        handleAreaSelect(
                                                            area.id,
                                                        )
                                                    }
                                                    className={cn(
                                                        "flex flex-col items-center gap-1 p-3 border-3 border-brutal-black",
                                                        "font-body font-bold text-xs bg-brutal-white text-brutal-black",
                                                        "shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5",
                                                        "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                                                        "transition-all duration-150 hover:bg-brutal-yellow",
                                                    )}
                                                >
                                                    <span className="text-2xl">
                                                        {area.emoji}
                                                    </span>
                                                    <span className="leading-tight text-center">
                                                        {area.label}
                                                    </span>
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feature highlights */}
                            <div className="space-y-3">
                                {[
                                    {
                                        emoji: "🔬",
                                        title: "12 Kondisi Tercakup",
                                        desc: "Sakit kepala, diare, maag, infeksi, dan lebih banyak lagi",
                                    },
                                    {
                                        emoji: "⚡",
                                        title: "Hasil Instan",
                                        desc: "Panduan home care dan tanda bahaya dalam hitungan detik",
                                    },
                                    {
                                        emoji: "🏥",
                                        title: "Panduan ke Dokter",
                                        desc: "Tahu kapan harus ke puskesmas, klinik, atau IGD",
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 p-3 border-2 border-brutal-gray"
                                    >
                                        <span className="text-2xl flex-shrink-0">
                                            {item.emoji}
                                        </span>
                                        <div>
                                            <p className="font-body font-bold text-sm">
                                                {item.title}
                                            </p>
                                            <p className="font-body text-xs text-brutal-muted">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Active checker
                        <SymptomChecker
                            key={`${selectedArea}-${checkerKey}`}
                            areaId={selectedArea}
                            onReset={handleReset}
                        />
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
