import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { DIMENSIONS } from "@/lib/healthScore";

export default function ScoreRadarChart({ dimensionScores }) {
    const data = DIMENSIONS.map((d) => ({
        dimension: d.label.split(" ")[0],
        score: dimensionScores[d.id] || 0,
        fullMark: 100,
    }));

    return (
        <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={data}>
                <PolarGrid
                    stroke="#E2E8F0"
                    strokeWidth={1}
                    strokeDasharray="4 2"
                />
                <PolarAngleAxis
                    dataKey="dimension"
                    tick={{
                        fontSize: 11,
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fill: "#475569",
                    }}
                />
                <Radar
                    name="Skor Kamu"
                    dataKey="score"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fill="#2563EB"
                    fillOpacity={0.15}
                />
                <Tooltip
                    contentStyle={{
                        border: "1px solid #E2E8F0",
                        borderRadius: "0.5rem",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: 12,
                        boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.07)",
                    }}
                    formatter={(val) => [`${val}/100`, "Skor"]}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}
