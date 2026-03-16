import { useState } from "react";
import { cn } from "@/lib/utils";
import { SYMPTOM_AREAS } from "@/lib/symptomTree";

const BODY_PATHS = {
    head: {
        d: "M150,50 C180,45 205,65 205,95 C205,130 180,145 150,145 C120,145 95,130 95,95 C95,65 120,45 150,50 Z",
        label: "Kepala",
    },
    chest: {
        d: "M105,160 L195,160 L200,250 L100,250 Z",
        label: "Dada",
    },
    stomach: {
        d: "M100,255 L200,255 L195,330 L105,330 Z",
        label: "Perut",
    },
    leftArm: {
        d: "M95,165 L65,250 L55,250 L50,310 L60,312 L70,260 L90,190 Z",
        label: "Tangan Kiri",
    },
    rightArm: {
        d: "M205,165 L235,250 L245,250 L250,310 L240,312 L230,260 L210,190 Z",
        label: "Tangan Kanan",
    },
    leftLeg: {
        d: "M105,335 L120,335 L130,430 L135,480 L110,480 L105,430 Z",
        label: "Kaki Kiri",
    },
    rightLeg: {
        d: "M180,335 L195,335 L195,430 L190,480 L165,480 L170,430 Z",
        label: "Kaki Kanan",
    },
};

export default function BodyMap({ onAreaSelect, selectedArea }) {
    const [hoveredArea, setHoveredArea] = useState(null);

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative w-full max-w-70">
                <svg
                    viewBox="0 0 300 520"
                    className="w-full h-auto"
                    role="img"
                    aria-label="Pilih area tubuh"
                >
                    <defs>
                        <linearGradient
                            id="bodyGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                stopColor="var(--color-clinical-primary-light)"
                            />
                            <stop
                                offset="100%"
                                stopColor="var(--color-clinical-accent-light)"
                            />
                        </linearGradient>
                    </defs>

                    {Object.entries(BODY_PATHS).map(([key, body]) => {
                        const isHovered = hoveredArea === key;
                        const isSelected = selectedArea === key;

                        return (
                            <path
                                key={key}
                                d={body.d}
                                className={cn(
                                    "cursor-pointer transition-all duration-200",
                                    isSelected
                                        ? "fill-clinical-primary stroke-clinical-primary-dark"
                                        : isHovered
                                          ? "fill-clinical-primary-light stroke-clinical-primary"
                                          : "fill-clinical-bg stroke-clinical-border-strong",
                                )}
                                style={{
                                    strokeWidth: isSelected ? 2.5 : 1.5,
                                }}
                                onMouseEnter={() => setHoveredArea(key)}
                                onMouseLeave={() => setHoveredArea(null)}
                                onClick={() => onAreaSelect(key)}
                            />
                        );
                    })}
                </svg>

                {hoveredArea && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-clinical-text text-white font-body text-xs font-semibold rounded-full shadow-clinical-md animate-fade-in pointer-events-none">
                        {BODY_PATHS[hoveredArea]?.label}
                    </div>
                )}
            </div>

            <div className="w-full grid grid-cols-2 gap-2">
                {Object.entries(BODY_PATHS).map(([key, body]) => {
                    const areaInfo = SYMPTOM_AREAS[key];
                    const isSelected = selectedArea === key;
                    return (
                        <button
                            key={key}
                            onClick={() => onAreaSelect(key)}
                            onMouseEnter={() => setHoveredArea(key)}
                            onMouseLeave={() => setHoveredArea(null)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2.5 rounded-clinical-md border transition-all duration-200 text-left",
                                isSelected
                                    ? "bg-clinical-primary text-white border-clinical-primary shadow-clinical-sm"
                                    : "bg-white border-clinical-border hover:border-clinical-primary hover:bg-clinical-primary-light hover:shadow-clinical-xs",
                            )}
                        >
                            <span className="text-lg">
                                {areaInfo?.emoji || "🔵"}
                            </span>
                            <span className="font-body text-xs font-semibold leading-tight">
                                {body.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
