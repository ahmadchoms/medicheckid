import { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    MapPin,
    Phone,
    Clock,
    Search,
    Filter,
    AlertTriangle,
    ExternalLink,
    Stethoscope,
    RefreshCcw,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PublicLayout from "@/components/layouts/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/feedback";
import { useFaskes } from "@/features/faskes/use-faskes";
import { FASKES_TYPES, CITIES } from "@/features/faskes/faskes-data";

// ─── FaskesCard ──────────────────────────────────────────────
function FaskesCard({ faskes }) {
    const typeInfo = FASKES_TYPES[faskes.type];
    const cityLabel = CITIES.find((c) => c.value === faskes.city)?.label ?? faskes.city;

    const typeColorMap = {
        green: "bg-brutal-green text-white",
        blue: "bg-brutal-blue text-white",
        red: "bg-brutal-red text-white",
    };

    return (
        <div
            className={cn(
                "border-4 border-brutal-black bg-brutal-white p-5",
                "shadow-brutal transition-all duration-150",
                "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg",
                "active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm",
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            "w-10 h-10 border-3 border-brutal-black flex items-center justify-center text-lg shrink-0",
                            typeColorMap[typeInfo.color],
                        )}
                    >
                        {typeInfo.emoji}
                    </div>
                    <div>
                        <h3 className="font-display text-lg leading-tight">
                            {faskes.name}
                        </h3>
                        <p className="font-body text-xs text-brutal-muted mt-0.5">
                            {cityLabel}
                        </p>
                    </div>
                </div>
                {faskes.hasIGD && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-brutal-red text-white border-3 border-brutal-black font-display text-[10px] uppercase tracking-wider shrink-0">
                        <AlertTriangle size={10} />
                        IGD
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-brutal-muted shrink-0 mt-0.5" />
                    <p className="font-body text-xs text-brutal-muted leading-relaxed">
                        {faskes.address}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-brutal-muted shrink-0" />
                    <p className="font-body text-xs text-brutal-muted">{faskes.hours}</p>
                </div>
            </div>

            {/* Services */}
            <div className="flex flex-wrap gap-1 mb-4">
                {faskes.services.slice(0, 4).map((s) => (
                    <span
                        key={s}
                        className="font-body text-[10px] font-bold px-2 py-0.5 bg-brutal-gray border-2 border-brutal-black"
                    >
                        {s}
                    </span>
                ))}
                {faskes.services.length > 4 && (
                    <span className="font-body text-[10px] text-brutal-muted py-0.5">
                        +{faskes.services.length - 4} lainnya
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <a
                    href={`tel:${faskes.phone.replace(/[^0-9]/g, "")}`}
                    className={cn(
                        "flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5",
                        "bg-brutal-green text-white border-3 border-brutal-black",
                        "font-body font-bold text-xs shadow-brutal-sm",
                        "hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5",
                        "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                        "transition-all duration-150",
                    )}
                >
                    <Phone size={14} />
                    {faskes.phone}
                </a>
                <a
                    href={faskes.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "inline-flex items-center justify-center gap-1.5 px-3 py-2.5",
                        "bg-brutal-blue text-white border-3 border-brutal-black",
                        "font-body font-bold text-xs shadow-brutal-sm",
                        "hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5",
                        "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                        "transition-all duration-150",
                    )}
                >
                    <ExternalLink size={14} />
                    Maps
                </a>
            </div>
        </div>
    );
}

// ─── Loading Skeleton ────────────────────────────────────────
function FaskesSkeleton() {
    return (
        <div className="border-4 border-brutal-black bg-brutal-white p-5 shadow-brutal">
            <div className="flex items-start gap-3 mb-4">
                <Skeleton className="w-10 h-10 border-3 border-brutal-black rounded-none" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 rounded-none" />
                    <Skeleton className="h-3 w-1/2 rounded-none" />
                </div>
            </div>
            <div className="space-y-2 mb-4">
                <Skeleton className="h-3 w-full rounded-none" />
                <Skeleton className="h-3 w-2/3 rounded-none" />
            </div>
            <div className="flex gap-1 mb-4">
                <Skeleton className="h-5 w-16 rounded-none" />
                <Skeleton className="h-5 w-20 rounded-none" />
                <Skeleton className="h-5 w-14 rounded-none" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="flex-1 h-10 rounded-none" />
                <Skeleton className="h-10 w-20 rounded-none" />
            </div>
        </div>
    );
}

// ─── Error State ─────────────────────────────────────────────
function FaskesError({ onRetry }) {
    return (
        <div className="border-4 border-brutal-red bg-brutal-red/5 p-8 text-center">
            <div className="w-14 h-14 bg-brutal-red border-3 border-brutal-black mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle size={24} className="text-white" />
            </div>
            <h3 className="font-display text-xl mb-2">Gagal Memuat Data</h3>
            <p className="font-body text-brutal-muted text-sm mb-6">
                Terjadi kesalahan saat memuat data fasilitas kesehatan.
            </p>
            <Button
                variant="default"
                onClick={onRetry}
                className="border-3 border-brutal-black shadow-brutal"
            >
                <RefreshCcw size={14} />
                Coba Lagi
            </Button>
        </div>
    );
}

// ─── Faskes Page ─────────────────────────────────────────────
export default function Faskes() {
    const [search, setSearch] = useState("");
    const [city, setCity] = useState("");
    const [type, setType] = useState("");
    const [igdOnly, setIgdOnly] = useState(false);

    const { data, isLoading, isError, refetch, totalCount } = useFaskes({
        search,
        city,
        type,
        igdOnly,
    });

    const hasActiveFilter = city || type || igdOnly || search;

    const clearFilters = () => {
        setSearch("");
        setCity("");
        setType("");
        setIgdOnly(false);
    };

    return (
        <PublicLayout>
            <Head title="Cari Faskes" />

            {/* Page Header */}
            <div className="mb-8 border-b-3 border-brutal-black pb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-brutal-yellow border-3 border-brutal-black shadow-brutal flex items-center justify-center">
                        <MapPin size={20} className="text-brutal-black" strokeWidth={2.5} />
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl">Cari Faskes</h1>
                </div>
                <p className="font-body text-brutal-muted max-w-xl">
                    Temukan puskesmas, klinik, dan rumah sakit di sekitarmu. Filter
                    berdasarkan kota, jenis, atau ketersediaan IGD.
                </p>
            </div>

            {/* Search & Filters */}
            <div className="mb-6 space-y-3">
                {/* Search Bar */}
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-brutal-muted pointer-events-none"
                    />
                    <Input
                        type="text"
                        placeholder="Cari nama atau alamat faskes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-12 border-3 border-brutal-black font-body shadow-brutal-sm focus:shadow-brutal transition-shadow rounded-none"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-brutal-muted hover:text-brutal-black"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filter Row */}
                <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-1 mr-1">
                        <Filter size={14} className="text-brutal-muted" />
                        <span className="font-body text-xs font-bold text-brutal-muted uppercase tracking-wider">
                            Filter:
                        </span>
                    </div>

                    {/* City filter */}
                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={cn(
                            "px-3 py-2 border-3 border-brutal-black font-body text-xs font-bold",
                            "bg-brutal-white shadow-brutal-sm cursor-pointer appearance-none",
                            "hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5",
                            "transition-all duration-150 rounded-none",
                            city && "bg-brutal-yellow",
                        )}
                    >
                        <option value="">Semua Kota</option>
                        {CITIES.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>

                    {/* Type filter */}
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className={cn(
                            "px-3 py-2 border-3 border-brutal-black font-body text-xs font-bold",
                            "bg-brutal-white shadow-brutal-sm cursor-pointer appearance-none",
                            "hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5",
                            "transition-all duration-150 rounded-none",
                            type && "bg-brutal-blue text-white",
                        )}
                    >
                        <option value="">Semua Jenis</option>
                        {Object.entries(FASKES_TYPES).map(([key, val]) => (
                            <option key={key} value={key}>
                                {val.emoji} {val.label}
                            </option>
                        ))}
                    </select>

                    {/* IGD Toggle */}
                    <button
                        onClick={() => setIgdOnly(!igdOnly)}
                        className={cn(
                            "px-3 py-2 border-3 border-brutal-black font-body text-xs font-bold",
                            "shadow-brutal-sm transition-all duration-150 rounded-none",
                            "hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5",
                            igdOnly
                                ? "bg-brutal-red text-white"
                                : "bg-brutal-white text-brutal-black",
                        )}
                    >
                        🚨 IGD Saja
                    </button>

                    {/* Clear filters */}
                    {hasActiveFilter && (
                        <button
                            onClick={clearFilters}
                            className="px-2 py-2 font-body text-xs text-brutal-muted hover:text-brutal-red transition-colors underline"
                        >
                            Reset filter
                        </button>
                    )}
                </div>
            </div>

            {/* Result count */}
            {!isLoading && !isError && (
                <div className="mb-4 flex items-center justify-between">
                    <p className="font-body text-sm text-brutal-muted">
                        Menampilkan{" "}
                        <span className="font-bold text-brutal-black">{data.length}</span>{" "}
                        dari{" "}
                        <span className="font-bold text-brutal-black">{totalCount}</span>{" "}
                        faskes
                    </p>
                    {hasActiveFilter && (
                        <Badge variant="secondary" className="border-2 border-brutal-black rounded-none">
                            {data.length} hasil filter
                        </Badge>
                    )}
                </div>
            )}

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <FaskesSkeleton key={i} />
                    ))}
                </div>
            ) : isError ? (
                <FaskesError onRetry={refetch} />
            ) : data.length === 0 ? (
                <EmptyState
                    emoji="🔍"
                    title="Tidak Ada Faskes Ditemukan"
                    description={
                        hasActiveFilter
                            ? "Coba ubah kata kunci atau filter pencarian untuk hasil yang berbeda."
                            : "Data fasilitas kesehatan belum tersedia."
                    }
                    action={hasActiveFilter ? clearFilters : undefined}
                    actionLabel={hasActiveFilter ? "Reset Semua Filter" : undefined}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.map((faskes) => (
                        <FaskesCard key={faskes.id} faskes={faskes} />
                    ))}
                </div>
            )}

            {/* Disclaimer */}
            <div className="mt-8 border-3 border-brutal-yellow bg-brutal-yellow/10 p-4">
                <div className="flex items-start gap-2">
                    <Stethoscope size={16} className="text-brutal-orange shrink-0 mt-0.5" />
                    <div>
                        <p className="font-body text-xs text-brutal-black">
                            <strong>Info:</strong> Data faskes bersifat statis dan mungkin
                            tidak mencakup semua fasilitas terbaru. Untuk informasi
                            terkini, hubungi faskes secara langsung atau kunjungi{" "}
                            <a
                                href="https://yankes.kemkes.go.id/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold underline text-brutal-blue"
                            >
                                yankes.kemkes.go.id
                            </a>
                            .
                        </p>
                        <p className="font-body text-xs text-brutal-muted mt-1">
                            Untuk kondisi darurat, segera hubungi{" "}
                            <a href="tel:119" className="font-bold text-brutal-red">
                                119
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
