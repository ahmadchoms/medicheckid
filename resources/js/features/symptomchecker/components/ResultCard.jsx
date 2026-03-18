import { useRef, useState, useEffect } from "react";
import { AlertTriangle, Phone, RefreshCw, Printer, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import EmergencyModal from "./EmergencyModal";

export default function ResultCard({ result, userQuery, onReset, pathArr }) {
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const isEmergency = result?.urgency === "emergency";

    useEffect(() => {
        if (isEmergency) {
            setShowEmergencyModal(true);
        }
    }, [isEmergency]);

    const urgencyConfig = {
        emergency: {
            bg: "bg-clinical-danger",
            text: "text-white",
            icon: "🚨",
            title: "DARURAT — Cari Bantuan Segera",
        },
        high: {
            bg: "bg-clinical-warning",
            text: "text-white",
            icon: "⚠️",
            title: "PERLU PERHATIAN SEGERA",
        },
        moderate: {
            bg: "bg-clinical-warning-light",
            text: "text-clinical-text",
            icon: "⏰",
            title: "PERLU PERHATIAN",
        },
        low: {
            bg: "bg-clinical-success",
            text: "text-white",
            icon: "✅",
            title: "BISA DITANGANI MANDIRI",
        },
    };

    const urg = urgencyConfig[result.urgency] || urgencyConfig.low;

    const handlePrint = () => {
        window.print();
        toast.success("Membuka dialog cetak dokumen...");
    };

    const handleExportWA = () => {
        const conditions = result.conditions?.join(", ") || "Tidak diketahui";
        const urgencyText = isEmergency
            ? "DARURAT 🔴"
            : result.urgency === "high"
              ? "Tinggi 🟠"
              : result.urgency === "moderate"
                ? "Sedang 🟡"
                : "Rendah 🟢";
        const homeCare = result.homeCare?.slice(0, 3).join(", ") || "-";

        const msg = `Halo, saya baru cek gejala di *MediCheck ID*.\n\n🩺 *Gejala:* ${userQuery || (pathArr && pathArr.join(" → ")) || "Tidak dituliskan"}\n🤔 *Kemungkinan:* ${conditions}\n⚠️ *Urgensi:* ${urgencyText}\n🏠 *Tindakan:* ${homeCare}\n\n_(Ini adalah estimasi AI, bukan diagnosis medis)_`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(msg)}`,
            "_blank",
            "noopener,noreferrer",
        );
    };

    return (
        <>
            <div className="animate-slide-up space-y-4 print:hidden">
                <EmergencyModal
                    isOpen={showEmergencyModal}
                    onOpenChange={setShowEmergencyModal}
                />

                <div
                    className={cn(
                        "rounded-clinical-xl p-4 shadow-clinical-md flex items-center gap-3",
                        urg.bg,
                    )}
                >
                    <span className="text-3xl">{urg.icon}</span>
                    <div>
                        <p
                            className={cn(
                                "font-display text-sm font-bold",
                                urg.text,
                            )}
                        >
                            {urg.title}
                        </p>
                        <p
                            className={cn(
                                "font-body text-xs mt-0.5 opacity-80",
                                urg.text,
                            )}
                        >
                            {result.likelihood}
                        </p>
                    </div>
                </div>

                {isEmergency && (
                    <div
                        className="flex items-center justify-center gap-3 w-full py-4 bg-clinical-danger rounded-clinical-xl shadow-clinical-lg cursor-pointer hover:bg-red-700 transition-colors"
                        onClick={() => (window.location.href = "tel:119")}
                    >
                        <Phone size={24} className="text-white" />
                        <div className="text-left">
                            <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm font-display text-2xl text-white font-bold rounded-full">
                                119
                            </span>
                            <p className="font-body text-white/80 text-xs mt-1">
                                Hubungi Ambulans Segera
                            </p>
                        </div>
                    </div>
                )}

                <Card className="border border-clinical-border rounded-clinical-xl shadow-clinical-sm">
                    <CardHeader>
                        <h3 className="font-display text-lg font-bold text-clinical-text">
                            🔍 Kemungkinan Kondisi
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {result.conditions?.map((c, i) => (
                                <Badge
                                    key={i}
                                    variant={i === 0 ? "default" : "secondary"}
                                    className="rounded-full"
                                >
                                    {c}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-sm font-body text-clinical-text-secondary italic border-l-2 border-clinical-warning pl-3 pr-2">
                            ⚠️ {result.disclaimer}
                        </p>
                    </CardContent>
                </Card>

                {result.homeCare?.length > 0 && (
                    <Card className="border border-clinical-border rounded-clinical-xl shadow-clinical-sm">
                        <CardHeader>
                            <h3 className="font-display text-lg font-bold text-clinical-text">
                                💊 Yang Bisa Dilakukan
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {result.homeCare.map((step, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2.5 text-sm font-body"
                                    >
                                        <span className="w-5 h-5 shrink-0 bg-clinical-primary text-white rounded-full flex items-center justify-center font-display text-xs mt-0.5">
                                            {i + 1}
                                        </span>
                                        <span className="text-clinical-text-secondary pr-2">
                                            {step}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {result.redFlags?.length > 0 && (
                    <Card className="border border-clinical-danger/30 rounded-clinical-xl shadow-clinical-sm">
                        <CardHeader className="bg-clinical-danger-light">
                            <h3 className="font-display text-lg font-bold flex items-center gap-2 text-clinical-danger">
                                <AlertTriangle
                                    size={18}
                                    className="text-clinical-danger"
                                />{" "}
                                Segera ke Dokter Jika Ada
                            </h3>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-1.5 pt-2">
                                {result.redFlags.map((flag, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm font-body"
                                    >
                                        <span className="text-clinical-danger font-bold shrink-0 mt-0.5">
                                            ⚡
                                        </span>
                                        <span className="font-semibold text-clinical-danger">
                                            {flag}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {result.whenToSeeDoctor && (
                    <Card className="border border-clinical-border rounded-clinical-xl bg-clinical-primary-light/30 shadow-clinical-sm">
                        <CardContent className="pt-5 flex flex-col gap-2">
                            <span className="font-display text-base font-bold text-clinical-text">
                                🏥 Kapan Harus ke Dokter?
                            </span>
                            <p className="font-body text-sm text-clinical-text leading-relaxed">
                                {result.whenToSeeDoctor}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {result.explanation && (
                    <Card className="border border-clinical-border rounded-clinical-xl bg-clinical-bg shadow-clinical-xs">
                        <CardContent className="pt-5 flex flex-col gap-2">
                            <span className="font-semibold text-clinical-text">
                                ℹ️ Penjelasan Singkat
                            </span>
                            <p className="font-body text-sm text-clinical-text-secondary leading-relaxed">
                                {result.explanation}
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="border-t border-clinical-border pt-4">
                    <p className="text-xs font-body text-clinical-muted font-semibold mb-2">
                        KELUHAN ANDA:
                    </p>
                    {pathArr && pathArr.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {pathArr.map((p, i) => (
                                <span
                                    key={i}
                                    className="text-xs bg-clinical-bg border border-clinical-border rounded-full px-2.5 py-0.5 font-body text-clinical-text-secondary wrap-break-words max-w-full"
                                >
                                    {i + 1}. {p}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm font-body italic text-clinical-text-secondary wrap-break-words">
                            "{userQuery}"
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={onReset}
                        className="w-full"
                    >
                        <RefreshCw size={14} className="mr-2" /> Cek Ulang
                    </Button>
                    <Button
                        variant="default"
                        onClick={handlePrint}
                        className="w-full"
                    >
                        <Printer size={14} className="mr-2" /> Cetak Hasil
                    </Button>
                </div>
                <Button
                    variant="outline"
                    onClick={handleExportWA}
                    className="w-full mt-3 border-clinical-success text-clinical-success hover:bg-clinical-success hover:text-white transition-colors"
                >
                    <Share2 size={14} className="mr-2" /> Beri Tahu Keluarga
                </Button>

                {!isEmergency && (
                    <div className="bg-clinical-bg border border-clinical-border rounded-clinical-lg p-4">
                        <p className="font-body text-xs font-semibold mb-3 text-clinical-text">
                            📞 Nomor Darurat Penting
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="text-center bg-white border border-clinical-border rounded-clinical-md py-2 px-1 flex flex-col items-center justify-center min-h-17.5">
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-clinical-danger-light font-body text-sm font-bold text-clinical-danger rounded-full break-all">
                                    119
                                </span>
                                <p className="text-[10px] sm:text-xs font-body text-clinical-muted mt-1.5 wrap-break-words">
                                    Ambulans
                                </p>
                            </div>
                            <div className="text-center bg-white border border-clinical-border rounded-clinical-md py-2 px-1 flex flex-col items-center justify-center min-h-17.5">
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-clinical-primary-light font-body text-[13px] font-bold text-clinical-primary rounded-full break-all">
                                    1500-567
                                </span>
                                <p className="text-[10px] sm:text-xs font-body text-clinical-muted mt-1.5 wrap-break-words">
                                    Hotline
                                </p>
                            </div>
                            <div className="text-center bg-white border border-clinical-border rounded-clinical-md py-2 px-1 flex flex-col items-center justify-center min-h-17.5">
                                <span className="inline-flex items-center px-1.5 py-0.5 bg-clinical-success-light font-body text-[13px] font-bold text-clinical-success rounded-full break-all">
                                    ext 8
                                </span>
                                <p className="text-[10px] sm:text-xs font-body text-clinical-muted mt-1.5 wrap-break-words">
                                    Mental
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="hidden print:block print:p-8 print:bg-white print:text-black">
                <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold font-display text-black">
                            MediCheck ID
                        </h1>
                        <p className="text-sm text-gray-600 font-body">
                            Laporan Hasil Analisis Gejala AI
                        </p>
                    </div>
                    <div className="text-right text-sm font-body">
                        <p>Tanggal: {new Date().toLocaleDateString("id-ID")}</p>
                        <p>
                            Tingkat Urgensi:{" "}
                            <span className="font-bold text-black uppercase">
                                {result.urgency || "Rendah"}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="space-y-6 font-body">
                    <section>
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1 text-black">
                            Keluhan Pasien
                        </h2>
                        <p className="text-sm text-black">
                            {pathArr?.length > 0
                                ? pathArr.join(" → ")
                                : userQuery}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1 text-black">
                            Kemungkinan Kondisi
                        </h2>
                        <ul className="list-disc pl-5 text-sm text-black space-y-1">
                            {result.conditions?.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </section>

                    {result.homeCare && result.homeCare.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1 text-black">
                                Rekomendasi Tindakan Mandiri
                            </h2>
                            <ul className="list-decimal pl-5 text-sm text-black space-y-1">
                                {result.homeCare.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {result.redFlags && result.redFlags.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1 text-black">
                                Tanda Bahaya (Segera ke Dokter)
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-black space-y-1">
                                {result.redFlags.map((flag, i) => (
                                    <li key={i}>{flag}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {result.explanation && (
                        <section>
                            <h2 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1 text-black">
                                Keterangan Tambahan
                            </h2>
                            <p className="text-sm text-black text-justify">
                                {result.explanation}
                            </p>
                        </section>
                    )}

                    <div className="mt-12 pt-4 border-t border-gray-400 text-xs text-gray-600 text-justify leading-relaxed">
                        *Disclaimer: Dokumen ini dihasilkan oleh Artificial
                        Intelligence (AI) untuk tujuan edukasi dan referensi
                        awal berdasarkan keluhan yang dimasukkan. Dokumen ini
                        BUKAN rekam medis resmi dan BUKAN pengganti diagnosis
                        dari dokter atau profesional kesehatan berlisensi. Harap
                        selalu konsultasikan kondisi kesehatan Anda kepada
                        fasilitas kesehatan terdekat jika gejala memburuk atau
                        tidak membaik.
                    </div>
                </div>
            </div>
        </>
    );
}
