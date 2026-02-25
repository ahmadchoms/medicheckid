import { useState } from "react";
import { cn } from "@/lib/utils";
import { SYMPTOM_AREAS } from "@/lib/symptomTree";

const AREA_COLOR_MAP = {
    blue: { fill: "#0047FF", hover: "#0035CC", light: "#E8F0FF" },
    red: { fill: "#FF2D20", hover: "#CC1F14", light: "#FFECEB" },
    yellow: { fill: "#FFE500", hover: "#CDB800", light: "#FFFDE0" },
    orange: { fill: "#FF6B00", hover: "#CC5500", light: "#FFF3E8" },
    green: { fill: "#00C851", hover: "#009940", light: "#E0F9EA" },
    gray: { fill: "#6B6B6B", hover: "#4A4A4A", light: "#F0F0F0" },
};

// Menggunakan koordinat path yang lebih realistis dan proporsional (menggantikan ellipse/rect)
const BODY_PARTS = [
    {
        id: "head",
        label: "Kepala & Wajah",
        cx: 100,
        cy: 35,
        // Path kepala, leher, dan bahu atas
        d: "M85 25 C85 10, 115 10, 115 25 C115 45, 108 55, 100 60 C92 55, 85 45, 85 25 Z M92 60 L92 75 L108 75 L108 60 Z",
    },
    {
        id: "chest",
        label: "Dada & Paru",
        cx: 100,
        cy: 110,
        // Path bahu bawah dan area dada
        d: "M60 90 C75 75, 125 75, 140 90 L135 150 C120 160, 80 160, 65 150 Z",
    },
    {
        id: "abdomen",
        label: "Perut",
        cx: 100,
        cy: 200,
        // Path area perut dan pinggul
        d: "M65 155 C80 165, 120 165, 135 155 L138 240 C115 255, 85 255, 62 240 Z",
    },
    {
        id: "limbs", // Lengan (Kiri & Kanan digabung dalam satu id)
        label: "Lengan & Tangan",
        cx: 35,
        cy: 150,
        // Path kedua lengan
        d: "M55 95 C40 100, 30 140, 35 190 L25 250 C20 265, 40 265, 45 250 L50 180 Z M145 95 C160 100, 170 140, 165 190 L175 250 C180 265, 160 265, 155 250 L150 180 Z",
    },
    {
        id: "limbs", // Kaki (Kiri & Kanan)
        label: "Kaki & Telapak",
        cx: 75,
        cy: 330,
        // Path kedua kaki
        d: "M63 245 L50 360 C45 385, 75 385, 70 360 L85 255 Z M137 245 L150 360 C155 385, 125 385, 130 360 L115 255 Z",
    },
];

export default function BodyMap({ onAreaSelect, selectedArea }) {
    const [hoveredArea, setHoveredArea] = useState(null);

    const handleAreaClick = (areaId) => {
        onAreaSelect?.(areaId);
    };

    // Ekstrak ID unik untuk tombol di bawah
    const uniqueAreas = [...new Set(BODY_PARTS.map((p) => p.id))].concat([
        "general",
    ]);

    return (
        <div className="flex flex-col items-center gap-6">
            {/* SVG Body Silhouette */}
            <div className="relative select-none drop-shadow-md">
                <svg
                    viewBox="0 0 200 400"
                    className="w-[180px] sm:w-[240px] h-auto overflow-visible"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Peta tubuh interaktif"
                >
                    {/* ── Body Paths ── */}
                    <g
                        stroke="#0A0A0A"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                    >
                        {BODY_PARTS.map((part, i) => {
                            const area = SYMPTOM_AREAS[part.id];
                            // Fallback warna abu-abu jika area tidak ditemukan
                            const colors = area
                                ? AREA_COLOR_MAP[area.color]
                                : AREA_COLOR_MAP.gray;
                            const isActive =
                                selectedArea === part.id ||
                                hoveredArea === part.id;
                            const isSelected = selectedArea === part.id;

                            return (
                                <path
                                    key={`${part.id}-${i}`}
                                    d={part.d}
                                    style={{
                                        fill: isSelected
                                            ? colors.fill
                                            : hoveredArea === part.id
                                                ? colors.light
                                                : "#F0F0F0",
                                        stroke: isActive
                                            ? colors.fill
                                            : "#0A0A0A",
                                        strokeWidth: isActive ? 3 : 2.5,
                                        transition:
                                            "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                        cursor: "pointer",
                                    }}
                                    className="hover:-translate-y-0.5"
                                    onMouseEnter={() => setHoveredArea(part.id)}
                                    onMouseLeave={() => setHoveredArea(null)}
                                    onClick={() => handleAreaClick(part.id)}
                                    aria-label={`Pilih area: ${part.label}`}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ")
                                            handleAreaClick(part.id);
                                    }}
                                />
                            );
                        })}
                    </g>

                    {/* ── Active Area Label (Floating) ── */}
                    {(selectedArea || hoveredArea) &&
                        (() => {
                            const activeId = selectedArea || hoveredArea;
                            const area = SYMPTOM_AREAS[activeId];
                            const partInfo = BODY_PARTS.find(
                                (p) => p.id === activeId,
                            );

                            if (!area || !partInfo) return null;
                            const colors = AREA_COLOR_MAP[area.color];

                            return (
                                <g className="animate-in fade-in zoom-in duration-200">
                                    <rect
                                        x="50"
                                        y={partInfo.cy - 12}
                                        width="100"
                                        height="24"
                                        rx="12"
                                        fill={colors.fill}
                                        stroke="#0A0A0A"
                                        strokeWidth="2"
                                        className="shadow-brutal-sm"
                                    />
                                    <text
                                        x="100"
                                        y={partInfo.cy + 4}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fontFamily="DM Sans, sans-serif"
                                        fontWeight="bold"
                                        fill="#FAFAFA"
                                    >
                                        {area.label || partInfo.label}
                                    </text>
                                </g>
                            );
                        })()}

                    {/* ── Hint text ── */}
                    {!selectedArea && !hoveredArea && (
                        <text
                            x="100"
                            y="390"
                            textAnchor="middle"
                            fontSize="9"
                            fontFamily="DM Sans, sans-serif"
                            fontWeight="600"
                            fill="#6B6B6B"
                        >
                            Ketuk area tubuh yang sakit
                        </text>
                    )}
                </svg>

                {/* Pulse indicator */}
                {selectedArea && (
                    <div className="absolute top-0 right-0">
                        <div className="w-3 h-3 bg-yellow-400 border-2 border-black rounded-full animate-pulse" />
                    </div>
                )}
            </div>

            {/* Area Buttons Grid */}
            <div className="w-full grid grid-cols-2 gap-3">
                {uniqueAreas.map((areaId) => {
                    const area = SYMPTOM_AREAS[areaId];
                    if (!area) return null;
                    const isSelected = selectedArea === areaId;
                    const colors =
                        AREA_COLOR_MAP[area.color] || AREA_COLOR_MAP.gray;

                    return (
                        <button
                            key={areaId}
                            onClick={() => handleAreaClick(areaId)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-3 border-2 border-black rounded-md",
                                "font-bold text-sm transition-all duration-150",
                                "shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5",
                                "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                                isSelected
                                    ? "text-white"
                                    : "bg-white text-black hover:bg-gray-50",
                            )}
                            style={
                                isSelected
                                    ? { backgroundColor: colors.fill }
                                    : {}
                            }
                        >
                            <span className="text-lg leading-none">
                                {area.emoji}
                            </span>
                            <span className="leading-tight text-left">
                                {area.label}
                            </span>
                            {isSelected && (
                                <span className="ml-auto text-sm">✓</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
