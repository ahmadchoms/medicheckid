import { useState, useRef } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import {
    Activity,
    FileText,
    ArrowRight,
    AlertTriangle,
    Sparkles,
    Loader2,
    Info,
    FlaskConical,
    UploadCloud,
    X,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PublicLayout from "@/components/layouts/public-layout";

const MODES = [
    {
        id: "lab",
        icon: FlaskConical,
        title: "Input Manual Lab",
        description:
            "Masukkan angka hasil tes laboratorium kamu secara manual untuk dianalisis.",
        tag: "Data Numerik",
    },
    {
        id: "doc",
        icon: FileText,
        title: "Upload Dokumen Lab",
        description:
            "Unggah foto kertas hasil lab atau file PDF agar AI membaca dan menjelaskannya.",
        tag: "AI Scanner",
    },
];

const HighlightedText = ({ text, terms, onTermClick }) => {
    if (!terms || terms.length === 0 || !text) return <span>{text}</span>;
    const regex = new RegExp(`(${terms.join("|")})`, "gi");
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) => {
                const isTerm = terms.find(
                    (t) => t.toLowerCase() === part.toLowerCase(),
                );
                if (isTerm) {
                    return (
                        <span
                            key={i}
                            onClick={() => onTermClick(part)}
                            className="bg-clinical-primary-light text-clinical-primary font-semibold px-1.5 py-0.5 rounded cursor-pointer hover:bg-clinical-primary hover:text-white transition-colors"
                            title="Klik untuk penjelasan"
                        >
                            {part}
                        </span>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};

function HealthInsightFeature({ mode }) {
    const [labData, setLabData] = useState({
        hba1c: "",
        ldl: "",
        blood_pressure: "",
        other_notes: "",
    });
    const [docFile, setDocFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [activeTerm, setActiveTerm] = useState(null);
    const [termExplanation, setTermExplanation] = useState("");
    const [isTermLoading, setIsTermLoading] = useState(false);

    const handleLabSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        try {
            const res = await axios.post("/health-insight/lab", labData);
            setResult({ type: "lab", data: res.data });
        } catch (error) {
            alert(error.response?.data?.message || "Terjadi kesalahan.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDocSubmit = async (e) => {
        e.preventDefault();
        if (!docFile) {
            alert("Pilih file dokumen terlebih dahulu!");
            return;
        }
        setIsLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append("document_file", docFile);

        try {
            const res = await axios.post("/health-insight/doc", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult({ type: "doc", data: res.data });
        } catch (error) {
            alert(error.response?.data?.message || "Gagal memproses file.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTermClick = async (term) => {
        setActiveTerm(term);
        setTermExplanation("");
        setIsTermLoading(true);
        try {
            const res = await axios.post("/health-insight/term", { term });
            setTermExplanation(res.data.explanation);
        } catch (error) {
            setTermExplanation("Gagal memuat penjelasan istilah.");
        } finally {
            setIsTermLoading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            const validTypes = ["image/jpeg", "image/png", "application/pdf"];
            if (validTypes.includes(droppedFile.type)) {
                setDocFile(droppedFile);
            } else {
                alert(
                    "Format file tidak didukung. Harap unggah JPG, PNG, atau PDF.",
                );
            }
        }
    };
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) setDocFile(e.target.files[0]);
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 space-y-8">
            {/* Area Input (Bagian Atas) */}
            <div className="bg-white p-6 md:p-8 rounded-clinical-xl shadow-clinical-sm border border-clinical-border">
                {mode === "lab" ? (
                    <form onSubmit={handleLabSubmit} className="space-y-4">
                        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-clinical-border">
                            <FlaskConical
                                size={24}
                                className="text-clinical-primary"
                            />
                            <div>
                                <h2 className="text-xl font-display font-bold text-clinical-text">
                                    Input Data Manual
                                </h2>
                                <p className="font-body text-xs text-clinical-muted mt-1">
                                    Isi angka hasil laboratorium Anda pada kolom
                                    di bawah ini.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-body text-sm font-semibold text-clinical-text mb-1.5">
                                    HbA1c (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full h-11 px-4 rounded-clinical-md border border-clinical-border focus:border-clinical-primary focus:ring-1 focus:ring-clinical-primary text-sm font-body"
                                    value={labData.hba1c}
                                    onChange={(e) =>
                                        setLabData({
                                            ...labData,
                                            hba1c: e.target.value,
                                        })
                                    }
                                    placeholder="Contoh: 5.7"
                                />
                            </div>
                            <div>
                                <label className="block font-body text-sm font-semibold text-clinical-text mb-1.5">
                                    LDL Kolesterol (mg/dL)
                                </label>
                                <input
                                    type="number"
                                    className="w-full h-11 px-4 rounded-clinical-md border border-clinical-border focus:border-clinical-primary focus:ring-1 focus:ring-clinical-primary text-sm font-body"
                                    value={labData.ldl}
                                    onChange={(e) =>
                                        setLabData({
                                            ...labData,
                                            ldl: e.target.value,
                                        })
                                    }
                                    placeholder="Contoh: 120"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-body text-sm font-semibold text-clinical-text mb-1.5">
                                    Tekanan Darah (mmHg)
                                </label>
                                <input
                                    type="text"
                                    className="w-full h-11 px-4 rounded-clinical-md border border-clinical-border focus:border-clinical-primary focus:ring-1 focus:ring-clinical-primary text-sm font-body"
                                    value={labData.blood_pressure}
                                    onChange={(e) =>
                                        setLabData({
                                            ...labData,
                                            blood_pressure: e.target.value,
                                        })
                                    }
                                    placeholder="Contoh: 120/80"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-body text-sm font-semibold text-clinical-text mb-1.5">
                                    Catatan Tambahan (Opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full p-4 rounded-clinical-md border border-clinical-border focus:border-clinical-primary focus:ring-1 focus:ring-clinical-primary text-sm font-body transition-all resize-none"
                                    value={labData.other_notes}
                                    onChange={(e) =>
                                        setLabData({
                                            ...labData,
                                            other_notes: e.target.value,
                                        })
                                    }
                                    placeholder="Masukkan hasil lab lainnya (misal: Asam Urat 7.0)..."
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 h-12 bg-clinical-primary text-white font-body font-bold text-sm rounded-clinical-md hover:shadow-clinical-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                "Analisis Data Lab"
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleDocSubmit} className="space-y-4">
                        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-clinical-border">
                            <FileText
                                size={24}
                                className="text-clinical-primary"
                            />
                            <div>
                                <h2 className="text-xl font-display font-bold text-clinical-text">
                                    Upload Dokumen
                                </h2>
                                <p className="font-body text-xs text-clinical-muted mt-1">
                                    Format yang didukung: JPG, PNG, atau PDF
                                    (Maks. 5MB).
                                </p>
                            </div>
                        </div>

                        {!docFile ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={cn(
                                    "border-2 border-dashed rounded-clinical-xl p-10 text-center cursor-pointer transition-all group",
                                    isDragging
                                        ? "border-clinical-primary bg-clinical-primary-light/50"
                                        : "border-clinical-border hover:bg-clinical-bg hover:border-clinical-primary",
                                )}
                            >
                                <UploadCloud
                                    className={cn(
                                        "w-12 h-12 mx-auto mb-4 transition-colors",
                                        isDragging
                                            ? "text-clinical-primary"
                                            : "text-clinical-muted group-hover:text-clinical-primary",
                                    )}
                                />
                                <span className="font-body text-base font-semibold text-clinical-text block">
                                    {isDragging
                                        ? "Lepaskan file di sini"
                                        : "Klik untuk memilih file"}
                                </span>
                                <span className="font-body text-sm text-clinical-muted mt-2 block">
                                    Atau tarik (drag) dokumen Anda ke area ini
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={handleFileChange}
                                />
                            </div>
                        ) : (
                            <div className="border border-clinical-border rounded-clinical-lg p-5 flex items-center justify-between bg-clinical-bg">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="w-12 h-12 bg-clinical-primary-light rounded-clinical-md flex items-center justify-center shrink-0">
                                        <FileText
                                            className="text-clinical-primary"
                                            size={24}
                                        />
                                    </div>
                                    <div className="truncate">
                                        <p className="font-body text-base font-semibold text-clinical-text truncate">
                                            {docFile.name}
                                        </p>
                                        <p className="font-body text-sm text-clinical-muted">
                                            {(
                                                docFile.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{" "}
                                            MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDocFile(null)}
                                    className="p-2 hover:bg-white rounded-full text-clinical-muted hover:text-clinical-danger transition-colors"
                                    title="Hapus File"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !docFile}
                            className="w-full mt-6 h-12 bg-clinical-primary text-white font-body font-bold text-sm rounded-clinical-md hover:shadow-clinical-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                "Pindai & Analisis File"
                            )}
                        </button>
                    </form>
                )}
            </div>

            {/* Area Output (Bagian Bawah) */}
            <div className="bg-clinical-bg p-6 md:p-8 rounded-clinical-xl border border-clinical-border relative overflow-hidden min-h-[300px] flex flex-col">
                {isLoading ? (
                    <div className="m-auto flex flex-col items-center justify-center text-clinical-muted py-12">
                        <Loader2
                            size={48}
                            className="animate-spin mb-4 text-clinical-primary"
                        />
                        <p className="font-body text-base font-semibold text-clinical-text">
                            AI sedang memproses dokumen Anda...
                        </p>
                        <p className="font-body text-sm mt-2">
                            Mohon tunggu sebentar, AI sedang mengidentifikasi
                            indikator klinis.
                        </p>
                    </div>
                ) : result ? (
                    <div className="space-y-8">
                        <div className="bg-clinical-warning-light/50 border border-clinical-warning/20 rounded-clinical-lg p-5 flex gap-3">
                            <AlertTriangle className="w-6 h-6 text-clinical-warning shrink-0" />
                            <p className="font-body text-sm font-medium text-clinical-text-secondary leading-relaxed">
                                {result.data.disclaimer}
                            </p>
                        </div>

                        <div>
                            {result.data.document_type && (
                                <span className="inline-block px-4 py-1.5 bg-clinical-primary-light text-clinical-primary font-bold text-xs rounded-full uppercase tracking-wider mb-4">
                                    {result.data.document_type}
                                </span>
                            )}
                            <h3 className="font-display text-2xl font-bold text-clinical-text mb-3">
                                Ringkasan Analisis
                            </h3>
                            <p className="font-body text-base text-clinical-text-secondary leading-relaxed">
                                <HighlightedText
                                    text={result.data.summary}
                                    terms={result.data.identified_terms}
                                    onTermClick={handleTermClick}
                                />
                            </p>
                        </div>

                        {/* Rendering Indikator Fitur Upload */}
                        {result.type === "doc" &&
                            result.data.indicators &&
                            result.data.indicators.length > 0 && (
                                <div>
                                    <h3 className="font-display text-xl font-bold text-clinical-text mb-4">
                                        Rincian Indikator
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {result.data.indicators.map(
                                            (ind, idx) => {
                                                const isNormal =
                                                    ind.status?.toLowerCase() ===
                                                    "normal";
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="bg-white p-5 rounded-clinical-lg border border-clinical-border shadow-clinical-xs"
                                                    >
                                                        <div className="flex flex-col gap-2 mb-3 pb-3 border-b border-clinical-border/50">
                                                            <span className="font-display font-bold text-clinical-text text-lg">
                                                                {ind.nama}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-body text-base font-bold text-clinical-text">
                                                                    {ind.nilai}
                                                                </span>
                                                                <span
                                                                    className={cn(
                                                                        "text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5",
                                                                        isNormal
                                                                            ? "bg-clinical-success-light text-clinical-success"
                                                                            : "bg-clinical-danger-light text-clinical-danger",
                                                                    )}
                                                                >
                                                                    {isNormal ? (
                                                                        <CheckCircle2
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <XCircle
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    )}
                                                                    {ind.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="font-body text-sm text-clinical-text-secondary leading-relaxed">
                                                            <HighlightedText
                                                                text={
                                                                    ind.penjelasan
                                                                }
                                                                terms={
                                                                    result.data
                                                                        .identified_terms
                                                                }
                                                                onTermClick={
                                                                    handleTermClick
                                                                }
                                                            />
                                                        </p>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Rendering Details Fitur Manual Lab */}
                        {result.type === "lab" && result.data.details && (
                            <div>
                                <h3 className="font-display text-xl font-bold text-clinical-text mb-4">
                                    Detail Indikator
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {result.data.details.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white p-5 rounded-clinical-lg border border-clinical-border shadow-clinical-xs"
                                        >
                                            <span className="font-display font-bold text-clinical-primary text-lg block mb-2">
                                                {item.indikator}
                                            </span>
                                            <p className="font-body text-sm text-clinical-text-secondary leading-relaxed">
                                                <HighlightedText
                                                    text={item.penjelasan}
                                                    terms={
                                                        result.data
                                                            .identified_terms
                                                    }
                                                    onTermClick={
                                                        handleTermClick
                                                    }
                                                />
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rendering Key Points */}
                        {result.data.key_points &&
                            result.data.key_points.length > 0 && (
                                <div>
                                    <h3 className="font-display text-xl font-bold text-clinical-text mb-4">
                                        Poin Penting Keseluruhan
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.data.key_points.map(
                                            (point, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex gap-3 font-body text-base text-clinical-text-secondary bg-white p-4 rounded-clinical-md border border-clinical-border"
                                                >
                                                    <span className="text-clinical-primary font-bold text-xl mt-[-2px]">
                                                        •
                                                    </span>
                                                    <span>
                                                        <HighlightedText
                                                            text={point}
                                                            terms={
                                                                result.data
                                                                    .identified_terms
                                                            }
                                                            onTermClick={
                                                                handleTermClick
                                                            }
                                                        />
                                                    </span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                    </div>
                ) : (
                    <div className="m-auto flex flex-col items-center justify-center text-clinical-muted py-12">
                        <Activity
                            size={56}
                            className="mb-4 text-clinical-primary/20"
                        />
                        <h4 className="font-display text-lg font-bold text-clinical-text mb-2">
                            Menunggu Input Data
                        </h4>
                        <p className="font-body text-sm text-center max-w-md">
                            Silakan isi form atau unggah dokumen di atas
                            terlebih dahulu. Hasil analisis dari AI akan
                            ditampilkan di area ini.
                        </p>
                    </div>
                )}

                {/* Tooltip Modal Istilah Medis (Lebih besar posisinya jika di bawah) */}
                {activeTerm && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-clinical-text p-5 rounded-clinical-xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-8">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-display font-bold text-white flex items-center gap-2">
                                <Info
                                    size={18}
                                    className="text-clinical-primary-light"
                                />{" "}
                                {activeTerm}
                            </h4>
                            <button
                                onClick={() => setActiveTerm(null)}
                                className="text-clinical-muted hover:text-white transition-colors p-1"
                            >
                                ✕
                            </button>
                        </div>
                        {isTermLoading ? (
                            <div className="flex items-center gap-2 text-sm text-clinical-muted font-body">
                                <Loader2 size={16} className="animate-spin" />{" "}
                                Memuat penjelasan...
                            </div>
                        ) : (
                            <p className="font-body text-sm text-clinical-bg leading-relaxed">
                                {termExplanation}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function HealthInsight() {
    const [selectedMode, setSelectedMode] = useState(null);

    if (selectedMode) {
        return (
            <PublicLayout>
                <Head title="Health Insight — MediCheck ID" />
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => setSelectedMode(null)}
                        className="font-body text-sm font-semibold text-clinical-text-secondary hover:text-clinical-primary transition-colors mb-2 inline-flex items-center gap-2"
                    >
                        <ArrowRight className="rotate-180" size={16} /> Kembali
                        ke pilihan mode
                    </button>
                </div>
                <HealthInsightFeature mode={selectedMode} />
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title="Health Insight — MediCheck ID" />
            <div className="mb-10 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-clinical-primary-light rounded-clinical-xl flex items-center justify-center shadow-clinical-xs">
                        <Activity
                            size={28}
                            className="text-clinical-primary"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-clinical-text">
                            Health Insight AI
                        </h1>
                        <p className="font-body text-base text-clinical-muted mt-1">
                            Pahami hasil lab Anda dari angka atau unggahan
                            dokumen secara otomatis.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
                {MODES.map((mode) => {
                    const Icon = mode.icon;
                    return (
                        <button
                            key={mode.id}
                            onClick={() => setSelectedMode(mode.id)}
                            className="group text-left bg-white border border-clinical-border rounded-clinical-2xl p-8 hover:border-clinical-primary hover:shadow-clinical-md transition-all duration-300"
                        >
                            <div className="flex items-start gap-5">
                                <div className="w-14 h-14 bg-clinical-bg rounded-clinical-xl flex items-center justify-center shrink-0 group-hover:bg-clinical-primary transition-colors duration-300">
                                    <Icon
                                        size={26}
                                        className="text-clinical-primary group-hover:text-white transition-colors duration-300"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col gap-2 mb-2">
                                        <span className="w-fit text-[10px] font-bold px-2.5 py-1 rounded-full bg-clinical-primary-light text-clinical-primary uppercase tracking-wider">
                                            {mode.tag}
                                        </span>
                                        <h3 className="font-display text-xl font-bold text-clinical-text">
                                            {mode.title}
                                        </h3>
                                    </div>
                                    <p className="font-body text-sm text-clinical-text-secondary leading-relaxed">
                                        {mode.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </PublicLayout>
    );
}
