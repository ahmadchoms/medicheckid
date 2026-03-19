import { useRef, useState, useEffect, forwardRef } from "react";
import {
    AlertTriangle,
    Phone,
    RefreshCw,
    Share2,
    Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";
import EmergencyModal from "./EmergencyModal";
import PDFReportTemplate from "./PDFReportTemplate";

export default function ResultCard({ result, userQuery, onReset, pathArr }) {
    const pdfRef = useRef(null);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [refNumber] = useState(
        `MC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    );
    const [printDate] = useState(new Date());

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
            pdfLabel: "DARURAT",
        },
        high: {
            bg: "bg-clinical-warning",
            text: "text-white",
            icon: "⚠️",
            title: "PERLU PERHATIAN SEGERA",
            pdfLabel: "TINGGI",
        },
        moderate: {
            bg: "bg-clinical-warning-light",
            text: "text-clinical-text",
            icon: "⏰",
            title: "PERLU PERHATIAN",
            pdfLabel: "SEDANG",
        },
        low: {
            bg: "bg-clinical-success",
            text: "text-white",
            icon: "✅",
            title: "BISA DITANGANI MANDIRI",
            pdfLabel: "RENDAH",
        },
    };

    const urg = urgencyConfig[result.urgency] || urgencyConfig.low;

    const handlePrint = async () => {
        if (isGenerating) return;

        setIsGenerating(true);
        toast.info("Menyusun dokumen PDF...");

        try {
            const element = pdfRef.current;
            const opt = {
                margin: [10, 0, 10, 0],
                filename: `Laporan_Analisis_${refNumber}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: "#ffffff",
                },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };

            await html2pdf().set(opt).from(element).save();
            toast.success("Dokumen PDF berhasil diunduh!");
        } catch (err) {
            toast.error("Gagal membuat dokumen PDF.");
        } finally {
            setIsGenerating(false);
        }
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

    const formatDateTime = (date) => {
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <div className="relative">
            <div className="animate-slide-up space-y-4">
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
                        disabled={isGenerating}
                    >
                        <RefreshCw size={14} className="mr-2" /> Cek Ulang
                    </Button>
                    <Button
                        variant="default"
                        onClick={handlePrint}
                        className="w-full bg-clinical-primary hover:bg-clinical-primary-hover"
                        disabled={isGenerating}
                    >
                        <Download
                            size={14}
                            className={cn(
                                "mr-2",
                                isGenerating && "animate-bounce",
                            )}
                        />
                        {isGenerating ? "Memproses..." : "Unduh PDF"}
                    </Button>
                </div>
                <Button
                    variant="outline"
                    onClick={handleExportWA}
                    className="w-full mt-3 border-clinical-success text-clinical-success hover:bg-clinical-success hover:text-white transition-colors"
                >
                    <Share2 size={14} className="mr-2" /> Beri Tahu Keluarga
                </Button>
            </div>

            <PDFReportTemplate
                ref={pdfRef}
                refNumber={refNumber}
                printDate={printDate}
                result={result}
                userQuery={userQuery}
                pathArr={pathArr}
                formatDateTime={formatDateTime}
                urgLabel={urg.pdfLabel}
            />
        </div>
    );
}
