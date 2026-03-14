import { useEffect, useState } from "react";
import axios from "axios";
import { Head } from "@inertiajs/react";
import {
    Activity,
    AlertTriangle,
    MapPin,
    Users,
    TrendingUp,
    ShieldAlert,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function StatCard({ title, value, icon: Icon, colorClass, trend }) {
    return (
        <div className="bg-white p-6 rounded-clinical-xl border border-clinical-border shadow-clinical-sm flex items-start gap-4 hover:shadow-clinical-md transition-shadow">
            <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
            >
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <p className="font-body text-sm text-clinical-text-secondary font-medium tracking-wide">
                    {title}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="font-display text-3xl font-black text-clinical-text">
                        {value}
                    </h3>
                    {trend && (
                        <span className="text-xs font-body font-bold text-clinical-success flex items-center">
                            <TrendingUp size={12} className="mr-0.5" />
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminEpidemiology() {
    const [data, setData] = useState({ cityStats: [], coordinateStats: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/epidemiology/heatmap")
            .then((res) => {
                setData(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load epidemiology data", err);
                setIsLoading(false);
            });
    }, []);

    const totalCases = data.coordinateStats.length;
    const emergencyCases = data.coordinateStats.filter(
        (c) => c.urgency === "emergency" || c.urgency === "high",
    ).length;
    const activeCities = data.cityStats.length;

    const getUrgencyColor = (urgency) => {
        if (urgency === "emergency") return "#ef4444";
        if (urgency === "high") return "#f59e0b";
        if (urgency === "moderate") return "#fbbf24";
        return "#10b981";
    };

    return (
        <div className="min-h-screen bg-clinical-bg font-body p-4 md:p-8">
            <Head title="Peta Epidemiologi - Admin" />

            <header className="mb-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-clinical-primary text-white rounded-xl flex items-center justify-center shadow-clinical-md shadow-clinical-primary/30">
                    <Activity size={28} />
                </div>
                <div>
                    <h1 className="font-display text-3xl font-black text-clinical-text tracking-tight uppercase">
                        Radar{" "}
                        <span className="text-clinical-primary">
                            Epidemiologi
                        </span>
                    </h1>
                    <p className="text-clinical-text-secondary mt-1">
                        Pemantauan Sebaran Penyakit & Gejala Secara Real-Time
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="TOTAL LAPORAN GEJALA"
                    value={isLoading ? "..." : totalCases}
                    icon={Users}
                    colorClass="bg-clinical-primary shadow-lg shadow-clinical-primary/40"
                    trend="+12% bulan ini"
                />
                <StatCard
                    title="KONDISI DARURAT / TINGGI"
                    value={isLoading ? "..." : emergencyCases}
                    icon={AlertTriangle}
                    colorClass="bg-clinical-danger shadow-lg shadow-clinical-danger/40"
                />
                <StatCard
                    title="KOTA TERDAMPAK"
                    value={isLoading ? "..." : activeCities}
                    icon={MapPin}
                    colorClass="bg-clinical-warning shadow-lg shadow-clinical-secondary/40"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-clinical-2xl border border-clinical-border shadow-clinical-md overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-clinical-border bg-clinical-bg/50 backdrop-blur-sm flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ShieldAlert
                                size={20}
                                className="text-clinical-danger"
                            />
                            <h2 className="font-display text-lg font-bold text-clinical-text">
                                Peta Persebaran Spasial Real-Time
                            </h2>
                        </div>
                    </div>
                    <div className="h-125 w-full bg-slate-100 relative">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity className="w-10 h-10 text-clinical-primary animate-pulse" />
                            </div>
                        ) : (
                            <MapContainer
                                center={[-2.5489, 118.0149]}
                                zoom={5}
                                scrollWheelZoom={false}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                />

                                {data.coordinateStats.map((stat, idx) => (
                                    <CircleMarker
                                        key={idx}
                                        center={[stat.latitude, stat.longitude]}
                                        radius={
                                            stat.urgency === "emergency"
                                                ? 12
                                                : 8
                                        }
                                        fillColor={getUrgencyColor(
                                            stat.urgency,
                                        )}
                                        color={getUrgencyColor(stat.urgency)}
                                        weight={1}
                                        opacity={0.8}
                                        fillOpacity={0.6}
                                    >
                                        <Popup className="font-body">
                                            <div className="p-1">
                                                <p className="font-bold text-sm mb-1 capitalize border-b pb-1">
                                                    Status: {stat.urgency}
                                                </p>
                                                <p className="text-xs text-slate-600 line-clamp-3">
                                                    {stat.conditions ||
                                                        "Tidak spesifik"}
                                                </p>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                ))}
                            </MapContainer>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-clinical-2xl border border-clinical-border shadow-clinical-md flex flex-col">
                    <div className="p-5 border-b border-clinical-border">
                        <h2 className="font-display text-lg font-bold text-clinical-text">
                            Tren Kota Tertinggi
                        </h2>
                        <p className="text-sm text-clinical-text-secondary mt-1">
                            Agregasi laporan per wilayah.
                        </p>
                    </div>
                    <div className="p-5 flex-1 min-h-75">
                        {!isLoading && data.cityStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart
                                    data={data.cityStats.slice(0, 7)}
                                    layout="vertical"
                                    margin={{ left: 10, right: 20 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        horizontal={false}
                                        stroke="#e2e8f0"
                                    />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="city"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#64748b", fontSize: 12 }}
                                        width={100}
                                    />
                                    <Tooltip
                                        cursor={{ fill: "#f1f5f9" }}
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow:
                                                "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                        }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="#0284c7"
                                        radius={[0, 4, 4, 0]}
                                        barSize={24}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-clinical-muted text-sm">
                                Data belum mencukupi.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
