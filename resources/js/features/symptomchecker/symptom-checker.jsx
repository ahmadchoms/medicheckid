import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, ListChecks, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { SYMPTOM_AREAS, SYMPTOM_TREE } from "@/lib/symptomTree";
import { toast } from "sonner";
import axios from "axios";
import BodyMap from "@/features/bodymap/body-map";


import QuestionCard from "./components/QuestionCard";
import AIPromptCard from "./components/AIPromptCard";
import ResultCard from "./components/ResultCard";


export default function SymptomChecker({ mode }) {
    
    const [areaId, setAreaId] = useState(null);

    const [inputMode, setInputMode] = useState(
        mode === "ai" ? "text" : "options",
    );
    const [currentNode, setCurrentNode] = useState(null);
    const [path, setPath] = useState([]);
    const [history, setHistory] = useState([]);
    const [stepIndex, setStepIndex] = useState(0);

    const [result, setResult] = useState(null);
    const [userQuery, setUserQuery] = useState("");

    
    const analysisMutation = useMutation({
        mutationFn: (payload) =>
            axios.post("/api/ai/symptom-check", payload).then((r) => r.data),
        onSuccess: (data) => {
            setResult(data);
            toast.success("Analisis selesai!");
            saveEpidemiologyLog(data);
        },
        onError: (error) => {
            const msg =
                error.response?.data?.message ||
                "Gagal terhubung ke layanan AI. Silakan coba lagi.";
            toast.error(msg);
        },
    });

    const isLoading = analysisMutation.isPending;

    
    const saveEpidemiologyLog = (analysisResult) => {
        const logData = {
            symptoms_summary: userQuery || path.join(" -> "),
            conditions: analysisResult.conditions?.join(", "),
            urgency: analysisResult.urgency,
        };

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    logData.latitude = position.coords.latitude;
                    logData.longitude = position.coords.longitude;
                    axios
                        .post("/api/epidemiology/log", logData)
                        .catch((e) =>
                            console.error("Gagal simpan log geoloc", e),
                        );
                },
                (error) => {
                    console.warn("Geolokasi ditolak atau gagal:", error);
                    
                    axios
                        .post("/api/epidemiology/log", logData)
                        .catch((e) =>
                            console.error("Gagal simpan log non-geoloc", e),
                        );
                },
                { enableHighAccuracy: false, timeout: 5000 },
            );
        } else {
            axios
                .post("/api/epidemiology/log", logData)
                .catch((e) =>
                    console.error("Gagal simpan log (Browser no geoloc)", e),
                );
        }
    };

    
    const handleAreaSelect = (id) => {
        setAreaId(id);
        const tree = SYMPTOM_TREE[id] || null;
        setCurrentNode(tree);
    };

    
    const handleAnalyze = (symptomsText, isFromOptions = false) => {
        if (!isFromOptions) {
            setUserQuery(symptomsText);
        }

        analysisMutation.mutate({
            area: SYMPTOM_AREAS[areaId].label,
            symptoms: symptomsText,
        });
    };

    
    const handleOptionSelect = (option) => {
        const newPath = [...path, option.label];

        if (option.analyze) {
            setPath(newPath);
            const compiledSymptoms = `Pengguna memilih gejala berikut secara berurutan: ${newPath.join(" ➔ ")}. Tolong berikan hasil analisisnya.`;
            handleAnalyze(compiledSymptoms, true);
        } else if (option.next) {
            setHistory((prev) => [...prev, { node: currentNode, path }]);
            setCurrentNode(option.next);
            setPath(newPath);
            setStepIndex((i) => i + 1);
        }
    };

    const handleBack = () => {
        if (history.length === 0) {
            
            setAreaId(null);
            setCurrentNode(null);
            return;
        }
        const prev = history[history.length - 1];
        setCurrentNode(prev.node);
        setPath(prev.path);
        setHistory((h) => h.slice(0, -1));
        setStepIndex((i) => Math.max(0, i - 1));
        setResult(null);
    };

    const handleReset = () => {
        setAreaId(null);
        setCurrentNode(null);
        setResult(null);
        setPath([]);
        setHistory([]);
        setStepIndex(0);
        setUserQuery("");
        analysisMutation.reset();
    };

    
    if (!areaId) {
        return (
            <div className="animate-slide-up">
                <div className="bg-white border border-clinical-border rounded-clinical-xl shadow-clinical-sm p-6 mb-4">
                    <h3 className="font-display text-xl font-bold text-clinical-text mb-2 text-center">
                        Pilih Area Tubuh
                    </h3>
                    <p className="font-body text-sm text-clinical-muted text-center mb-6">
                        Ketuk area tubuh yang terasa tidak nyaman
                    </p>
                    <BodyMap
                        onAreaSelect={handleAreaSelect}
                        selectedArea={areaId}
                    />
                </div>
            </div>
        );
    }

    
    return (
        <div>
            <div className="flex items-start justify-between mb-4">
                <div>
                    {(history.length > 0 || result || areaId) &&
                        !result?.urgency?.includes("emergency") && (
                            <button
                                onClick={result ? handleReset : handleBack}
                                className="flex items-center gap-1.5 text-sm font-body font-medium text-clinical-text-secondary hover:text-clinical-primary mb-2 transition-colors"
                            >
                                <ChevronLeft size={16} />{" "}
                                {result ? "Mulai Ulang" : "Kembali"}
                            </button>
                        )}

                    {!result && SYMPTOM_AREAS[areaId] && (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">
                                {SYMPTOM_AREAS[areaId].emoji}
                            </span>
                            <div>
                                <p className="font-body text-xs text-clinical-muted font-semibold uppercase tracking-wide">
                                    Area Dipilih
                                </p>
                                <p className="font-display text-lg font-bold leading-none text-clinical-text">
                                    {SYMPTOM_AREAS[areaId].label}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {!result && (
                    <div className="flex bg-clinical-bg border border-clinical-border p-1 rounded-clinical-lg">
                        <button
                            onClick={() => setInputMode("options")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-semibold rounded-clinical-md transition-all",
                                inputMode === "options"
                                    ? "bg-white shadow-clinical-sm text-clinical-text"
                                    : "text-clinical-muted hover:text-clinical-text",
                            )}
                        >
                            <ListChecks size={14} /> Opsi
                        </button>
                        <button
                            onClick={() => setInputMode("text")}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-body font-semibold rounded-clinical-md transition-all",
                                inputMode === "text"
                                    ? "bg-white shadow-clinical-sm text-clinical-text"
                                    : "text-clinical-muted hover:text-clinical-text",
                            )}
                        >
                            <MessageSquare size={14} /> Ketik
                        </button>
                    </div>
                )}
            </div>

            {result ? (
                <ResultCard
                    result={result}
                    userQuery={userQuery}
                    pathArr={path}
                    onReset={handleReset}
                    areaId={areaId}
                />
            ) : inputMode === "options" && currentNode ? (
                <QuestionCard
                    node={currentNode}
                    onAnswer={handleOptionSelect}
                    stepIndex={stepIndex}
                    isLoading={isLoading}
                />
            ) : (
                <AIPromptCard
                    areaId={areaId}
                    onAnalyze={(text) => handleAnalyze(text, false)}
                    isLoading={isLoading}
                    contextPath={path}
                />
            )}

            {inputMode === "options" && !currentNode && !result && (
                <div className="text-center py-8">
                    <p className="font-body text-clinical-text-secondary">
                        Tidak ada opsi panduan untuk area ini. Silakan gunakan
                        mode "Ketik".
                    </p>
                </div>
            )}
        </div>
    );
}
