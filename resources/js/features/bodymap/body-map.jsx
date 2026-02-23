// resources/js/components/features/bodymap/BodyMap.jsx
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

// SVG hotspot definitions (cx, cy, rx, ry as % of viewBox 200x480)
const HOTSPOTS = [
    { id: "head", cx: 100, cy: 42, rx: 36, ry: 38, label: "Kepala & Wajah" },
    { id: "chest", cx: 100, cy: 145, rx: 52, ry: 50, label: "Dada & Paru" },
    { id: "abdomen", cx: 100, cy: 238, rx: 48, ry: 52, label: "Perut" },
    { id: "limbs", cx: 48, cy: 310, rx: 28, ry: 90, label: "Lengan Kiri" },
    { id: "limbs", cx: 152, cy: 310, rx: 28, ry: 90, label: "Lengan Kanan" },
    { id: "limbs", cx: 72, cy: 415, rx: 26, ry: 60, label: "Kaki Kiri" },
    { id: "limbs", cx: 128, cy: 415, rx: 26, ry: 60, label: "Kaki Kanan" },
    { id: "general", cx: 100, cy: 180, rx: 15, ry: 15, label: "Umum" },
];

export default function BodyMap({ onAreaSelect, selectedArea }) {
    const [hoveredArea, setHoveredArea] = useState(null);

    const handleAreaClick = (areaId) => {
        onAreaSelect?.(areaId);
    };

    const getAreaStyle = (areaId) => {
        const area = SYMPTOM_AREAS[areaId];
        if (!area) return {};
        const colors = AREA_COLOR_MAP[area.color];
        const isSelected = selectedArea === areaId;
        const isHovered = hoveredArea === areaId;

        return {
            fill: isSelected
                ? colors.fill
                : isHovered
                  ? colors.light
                  : "transparent",
            stroke: isSelected || isHovered ? colors.fill : "transparent",
            strokeWidth: isSelected ? 3 : 2,
            transition: "all 0.2s ease",
            cursor: "pointer",
            opacity: isSelected ? 0.85 : isHovered ? 0.7 : 0.4,
        };
    };

    // Deduplicate hotspots by id for area selection
    const uniqueAreas = [...new Set(HOTSPOTS.map((h) => h.id))];

    return (
        <div className="flex flex-col items-center gap-4">
            {/* SVG Body Silhouette */}
            <div className="relative select-none">
                <svg
                    viewBox="0 0 200 480"
                    className="w-[180px] sm:w-[220px] h-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Peta tubuh interaktif - klik area untuk memilih gejala"
                >
                    {/* ── Body Silhouette ── */}
                    <g fill="#F0F0F0" stroke="#0A0A0A" strokeWidth="2.5">
                        {/* Head */}
                        <ellipse cx="100" cy="42" rx="34" ry="36" />
                        {/* Neck */}
                        <rect x="88" y="75" width="24" height="20" rx="4" />
                        {/* Torso */}
                        <path d="M52 95 C45 100 40 120 42 160 L42 280 L158 280 L158 160 C160 120 155 100 148 95 Z" />
                        {/* Left Arm */}
                        <path
                            d="M42 100 C36 105 28 120 26 165 L34 255 L58 255 L60 165 Z"
                            rx="8"
                        />
                        {/* Right Arm */}
                        <path
                            d="M158 100 C164 105 172 120 174 165 L166 255 L142 255 L140 165 Z"
                            rx="8"
                        />
                        {/* Left Hand */}
                        <ellipse cx="36" cy="265" rx="14" ry="16" />
                        {/* Right Hand */}
                        <ellipse cx="164" cy="265" rx="14" ry="16" />
                        {/* Left Leg */}
                        <path d="M64 278 L58 400 L86 400 L92 278 Z" rx="6" />
                        {/* Right Leg */}
                        <path
                            d="M136 278 L114 278 L108 400 L142 400 Z"
                            rx="6"
                        />
                        {/* Left Foot */}
                        <ellipse cx="72" cy="410" rx="16" ry="22" />
                        {/* Right Foot */}
                        <ellipse cx="128" cy="410" rx="16" ry="22" />
                    </g>

                    {/* ── Hotspot Overlays ── */}
                    {HOTSPOTS.map((spot, i) => {
                        const area = SYMPTOM_AREAS[spot.id];
                        if (!area) return null;
                        const colors = AREA_COLOR_MAP[area.color];
                        const isActive =
                            selectedArea === spot.id || hoveredArea === spot.id;

                        return (
                            <ellipse
                                key={`${spot.id}-${i}`}
                                cx={spot.cx}
                                cy={spot.cy}
                                rx={spot.rx}
                                ry={spot.ry}
                                style={{
                                    fill:
                                        selectedArea === spot.id
                                            ? colors.fill
                                            : hoveredArea === spot.id
                                              ? colors.light
                                              : "transparent",
                                    stroke: isActive
                                        ? colors.fill
                                        : "transparent",
                                    strokeWidth:
                                        selectedArea === spot.id ? 3 : 2,
                                    strokeDasharray:
                                        hoveredArea === spot.id &&
                                        selectedArea !== spot.id
                                            ? "4 3"
                                            : "none",
                                    transition: "all 0.2s ease",
                                    cursor: "pointer",
                                    opacity:
                                        selectedArea === spot.id
                                            ? 0.75
                                            : hoveredArea === spot.id
                                              ? 0.55
                                              : 0,
                                }}
                                className="body-hotspot"
                                onMouseEnter={() => setHoveredArea(spot.id)}
                                onMouseLeave={() => setHoveredArea(null)}
                                onClick={() => handleAreaClick(spot.id)}
                                aria-label={`Pilih area: ${spot.label}`}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ")
                                        handleAreaClick(spot.id);
                                }}
                            />
                        );
                    })}

                    {/* ── Active Area Label ── */}
                    {(selectedArea || hoveredArea) &&
                        (() => {
                            const activeId = selectedArea || hoveredArea;
                            const area = SYMPTOM_AREAS[activeId];
                            const spot = HOTSPOTS.find(
                                (h) => h.id === activeId,
                            );
                            if (!area || !spot) return null;
                            const colors = AREA_COLOR_MAP[area.color];
                            const labelY = spot.cy - spot.ry - 10;
                            const clampedY = Math.max(14, labelY);

                            return (
                                <g>
                                    <rect
                                        x={spot.cx - 50}
                                        y={clampedY - 10}
                                        width="100"
                                        height="18"
                                        fill={colors.fill}
                                        stroke="#0A0A0A"
                                        strokeWidth="2"
                                    />
                                    <text
                                        x={spot.cx}
                                        y={clampedY + 3}
                                        textAnchor="middle"
                                        fontSize="8"
                                        fontFamily="DM Sans, sans-serif"
                                        fontWeight="700"
                                        fill={
                                            activeId === "abdomen" ||
                                            activeId === "general"
                                                ? "#0A0A0A"
                                                : "#FAFAFA"
                                        }
                                    >
                                        {area.label}
                                    </text>
                                </g>
                            );
                        })()}

                    {/* ── Hint text when nothing selected ── */}
                    {!selectedArea && !hoveredArea && (
                        <text
                            x="100"
                            y="468"
                            textAnchor="middle"
                            fontSize="7.5"
                            fontFamily="DM Sans, sans-serif"
                            fontWeight="600"
                            fill="#6B6B6B"
                        >
                            Ketuk area yang sakit
                        </text>
                    )}
                </svg>

                {/* Pulse indicator on selected area */}
                {selectedArea && (
                    <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-brutal-yellow border-2 border-brutal-black rounded-full animate-pulse" />
                    </div>
                )}
            </div>

            {/* Area Buttons Grid (mobile-friendly tap targets) */}
            <div className="w-full grid grid-cols-2 gap-2">
                {uniqueAreas.map((areaId) => {
                    const area = SYMPTOM_AREAS[areaId];
                    if (!area) return null;
                    const isSelected = selectedArea === areaId;
                    const colors = AREA_COLOR_MAP[area.color];

                    return (
                        <button
                            key={areaId}
                            onClick={() => handleAreaClick(areaId)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2.5 border-3 border-brutal-black",
                                "font-body font-bold text-xs transition-all duration-150",
                                "shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5",
                                "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                                isSelected
                                    ? "text-brutal-white"
                                    : "bg-brutal-white text-brutal-black hover:bg-brutal-gray",
                            )}
                            style={
                                isSelected
                                    ? { backgroundColor: colors.fill }
                                    : {}
                            }
                        >
                            <span className="text-base leading-none">
                                {area.emoji}
                            </span>
                            <span className="leading-tight">{area.label}</span>
                            {isSelected && (
                                <span className="ml-auto text-xs">✓</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
