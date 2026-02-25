import { useState, useEffect, useRef, useCallback } from "react";
import { Head, router } from "@inertiajs/react";
import {
    MapPin,
    Phone,
    Clock,
    Search,
    Filter,
    AlertTriangle,
    ExternalLink,
    Stethoscope,
    X,
    ChevronLeft,
    ChevronRight,
    Building2,
    ChevronDown,
    Copy,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PublicLayout from "@/components/layouts/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/feedback";

// ─── Data Konstanta ──────────────────────────────────────────
const FASKES_TYPES = {
    rumah_sakit: { label: "Rumah Sakit", emoji: "🏥", color: "blue" },
    puskesmas: { label: "Puskesmas", emoji: "🩺", color: "green" },
};

// ─── Sub-Komponen: FaskesCard ────────────────────────────────
function FaskesCard({ item }) {
    // Mengambil nama wilayah dari relasi 'regency' yang dikirim Backend
    const cityName = item.regency?.nama_wilayah || `Kode Kab: ${item.kode_kab}`;

    const typeInfo = FASKES_TYPES[item.type] || {
        label: "Faskes",
        emoji: "🏥",
        color: "gray",
    };

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        item.unit_kerja + " " + cityName,
    )}`;

    return (
        <div
            className={cn(
                "border-4 border-brutal-black bg-brutal-white p-5",
                "shadow-brutal transition-all duration-150",
                "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg",
            )}
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            "w-10 h-10 border-3 border-brutal-black flex items-center justify-center text-lg shrink-0",
                            item.type === "rumah_sakit"
                                ? "bg-brutal-blue text-white"
                                : "bg-brutal-green text-white",
                        )}
                    >
                        {typeInfo.emoji}
                    </div>
                    <div>
                        <h3 className="font-display text-lg leading-tight line-clamp-2 uppercase font-black">
                            {item.unit_kerja}
                        </h3>
                        <p className="font-body text-xs text-brutal-muted mt-0.5">
                            {cityName}
                        </p>
                    </div>
                </div>
                {item.type === "rumah_sakit" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-brutal-red text-white border-3 border-brutal-black font-display text-[10px] uppercase tracking-wider shrink-0 font-bold">
                        <AlertTriangle size={10} /> IGD
                    </span>
                )}
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                    <MapPin
                        size={14}
                        className="text-brutal-muted shrink-0 mt-0.5"
                    />
                    <p className="font-body text-xs text-brutal-muted leading-relaxed line-clamp-1">
                        Kode Instansi: {item.kode_instansi}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-brutal-muted shrink-0" />
                    <p className="font-body text-xs text-brutal-muted">
                        {item.type === "rumah_sakit"
                            ? "Buka 24 Jam"
                            : "Senin-Sabtu, 08:00 - 14:00"}
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleCopyPhone}
                    className={cn(
                        "flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 cursor-pointer",
                        copied
                            ? "bg-brutal-green/80 text-white border-3 border-brutal-green"
                            : "bg-brutal-green text-white border-3 border-brutal-black",
                        "font-body font-bold text-xs shadow-brutal-sm",
                        "hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5",
                        "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                        "transition-all duration-150",
                    )}
                <a
                    href="tel:119"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-brutal-green text-white border-3 border-brutal-black font-body font-bold text-xs shadow-brutal-sm hover:shadow-brutal transition-all"
                >
                    {copied ? (
                        <>
                            <Check size={14} />
                            Disalin!
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            {faskes.phone}
                        </>
                    )}
                </button>
                    <Phone size={14} /> Hubungi
                </a>
                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-brutal-blue text-white border-3 border-brutal-black font-body font-bold text-xs shadow-brutal-sm hover:shadow-brutal transition-all"
                >
                    <ExternalLink size={14} /> Maps
                </a>
            </div>
        </div>
    );
}

// ─── Main Page Component ─────────────────────────────────────
export default function Faskes({ facilities, filters, cities }) {
    // State Filter Dasar
    const [search, setSearch] = useState(filters?.search || "");
    const [city, setCity] = useState(filters?.city || "");
    const [type, setType] = useState(filters?.type || "");

    // State untuk Searchable Select (Combobox)
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [citySearch, setCitySearch] = useState("");
    const dropdownRef = useRef(null);

    const hasActiveFilter = city || type || search;

    // Menutup dropdown wilayah jika klik di luar area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsCityOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter list kota berdasarkan input user di dalam dropdown
    const filteredCities = cities.filter((c) =>
        c.label.toLowerCase().includes(citySearch.toLowerCase()),
    );

    const fetchFilteredData = (newFilters) => {
        router.get("/fasilitas-kesehatan", newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch("");
        setCity("");
        setType("");
        fetchFilteredData({});
    };

    // Debounce Logic untuk hit API
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (
                search !== (filters?.search || "") ||
                city !== (filters?.city || "") ||
                type !== (filters?.type || "")
            ) {
                fetchFilteredData({ search, city, type });
            }
        }, 400);

        return () => clearTimeout(delaySearch);
    }, [search, city, type]);

    return (
        <PublicLayout>
            <Head title="Cari Fasilitas Kesehatan" />

            {/* Page Header */}
            <div className="mb-8 border-b-3 border-brutal-black pb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-brutal-yellow border-3 border-brutal-black shadow-brutal flex items-center justify-center">
                        <MapPin
                            size={20}
                            className="text-brutal-black"
                            strokeWidth={2.5}
                        />
                        <Building2
                            size={20}
                            className="text-brutal-black"
                            strokeWidth={2.5}
                        />
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl">
                        Cari Faskes
                    </h1>
                    <h1 className="font-display text-3xl md:text-4xl font-black">
                        CARI FASKES
                    </h1>
                </div>
                <p className="font-body text-brutal-muted max-w-xl">
                    Temukan puskesmas, klinik, dan rumah sakit di sekitarmu.
                    Filter berdasarkan kota, jenis, atau ketersediaan IGD.
                    Cari dan temukan informasi RS atau Puskesmas di seluruh
                    Indonesia dengan mudah.
                </p>
            </div>

            {/* Search & Filters */}
            <div className="mb-6 space-y-3">
                {/* Search Bar Nama */}
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-brutal-muted"
                    />
                    <Input
                        type="text"
                        placeholder="Cari nama faskes (Contoh: RSUD...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 h-14 border-4 border-brutal-black font-body text-sm shadow-brutal focus:shadow-brutal-lg transition-all rounded-none uppercase font-bold"
                    />
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-1">
                        <Filter size={14} className="text-brutal-muted" />
                        <span className="font-body text-xs font-bold text-brutal-muted uppercase">
                            Filter:
                        </span>
                    </div>

                    {/* Searchable Wilayah Filter */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsCityOpen(!isCityOpen)}
                            className={cn(
                                "w-64 px-4 py-2.5 border-3 border-brutal-black font-body text-xs font-bold bg-brutal-white shadow-brutal-sm flex justify-between items-center transition-all",
                                city && "bg-brutal-yellow",
                                isCityOpen &&
                                    "translate-x-0.5 translate-y-0.5 shadow-none",
                            )}
                        >
                            <span className="truncate">
                                {city
                                    ? cities.find((c) => c.value === city)
                                          ?.label
                                    : "SEMUA WILAYAH"}
                            </span>
                            <ChevronDown
                                size={14}
                                className={cn(
                                    "transition-transform duration-200",
                                    isCityOpen && "rotate-180",
                                )}
                            />
                        </button>

                        {isCityOpen && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-brutal-white border-4 border-brutal-black shadow-brutal z-[50]">
                                {/* Input Pencarian di dalam Dropdown */}
                                <div className="p-2 border-b-2 border-brutal-black bg-brutal-gray">
                                    <div className="relative">
                                        <Search
                                            size={12}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 text-brutal-muted"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Ketik nama kota..."
                                            value={citySearch}
                                            onChange={(e) =>
                                                setCitySearch(e.target.value)
                                            }
                                            className="w-full pl-7 pr-2 py-1.5 text-xs border-2 border-brutal-black focus:outline-none font-body font-bold"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* List Wilayah */}
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                    <button
                                        onClick={() => {
                                            setCity("");
                                            setIsCityOpen(false);
                                            setCitySearch("");
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-brutal-yellow border-b border-brutal-black/10 transition-colors"
                                    >
                                        TAMPILKAN SEMUA
                                    </button>

                                    {filteredCities.length > 0 ? (
                                        filteredCities.map((c) => (
                                            <button
                                                key={c.value}
                                                onClick={() => {
                                                    setCity(c.value);
                                                    setIsCityOpen(false);
                                                    setCitySearch("");
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-brutal-blue hover:text-white transition-colors",
                                                    city === c.value &&
                                                        "bg-brutal-blue text-white",
                                                )}
                                            >
                                                {c.label}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center text-[10px] text-brutal-muted font-bold italic">
                                            Wilayah tidak ditemukan...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filter Jenis */}
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className={cn(
                            "px-4 py-2.5 border-3 border-brutal-black font-body text-xs font-bold bg-brutal-white shadow-brutal-sm appearance-none cursor-pointer",
                            type && "bg-brutal-blue text-white",
                        )}
                    >
                        <option value="">SEMUA JENIS</option>
                        <option value="rumah_sakit">🏥 RUMAH SAKIT</option>
                        <option value="puskesmas">🩺 PUSKESMAS</option>
                    </select>

                    {hasActiveFilter && (
                        <button
                            onClick={clearFilters}
                            className="px-2 py-2 font-body text-xs font-bold text-brutal-red hover:underline uppercase tracking-tighter"
                        >
                            [ Reset Filter ]
                        </button>
                    )}
                </div>
            </div>

            {/* Status Information */}
            <div className="mb-4 flex items-center justify-between border-l-4 border-brutal-black pl-3">
                <p className="font-body text-sm text-brutal-muted">
                    Ditemukan{" "}
                    <span className="font-black text-brutal-black">
                        {facilities.total}
                    </span>{" "}
                    data fasilitas kesehatan.
                </p>
                {city && (
                    <Badge className="bg-brutal-yellow text-brutal-black border-2 border-brutal-black rounded-none font-bold">
                        Wilayah Aktif
                    </Badge>
                )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {facilities.data.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyState
                            emoji="🕵️‍♂️"
                            title="TIDAK ADA HASIL"
                            description="Nothy tidak menemukan faskes dengan kriteria tersebut. Coba cari kata kunci lain."
                            action={hasActiveFilter ? clearFilters : undefined}
                            actionLabel="Hapus Semua Filter"
                        />
                    </div>
                ) : (
                    facilities.data.map((item) => (
                        <FaskesCard key={item.id} item={item} />
                    ))
                )}
            </div>

            {/* Pagination */}
            {facilities.last_page > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                    <Button
                        variant="outline"
                        disabled={!facilities.prev_page_url}
                        onClick={() =>
                            router.get(
                                facilities.prev_page_url,
                                {},
                                { preserveScroll: true },
                            )
                        }
                        className="border-4 border-brutal-black font-black shadow-brutal-sm hover:translate-y-0.5 hover:shadow-none transition-all rounded-none"
                    >
                        <ChevronLeft size={18} className="mr-1" /> PREV
                    </Button>
                    <div className="font-display text-sm font-black border-4 border-brutal-black px-6 py-2 bg-brutal-white shadow-brutal-sm">
                        {facilities.current_page} / {facilities.last_page}
                    </div>
                    <Button
                        variant="outline"
                        disabled={!facilities.next_page_url}
                        onClick={() =>
                            router.get(
                                facilities.next_page_url,
                                {},
                                { preserveScroll: true },
                            )
                        }
                        className="border-4 border-brutal-black font-black shadow-brutal-sm hover:translate-y-0.5 hover:shadow-none transition-all rounded-none"
                    >
                        NEXT <ChevronRight size={18} className="ml-1" />
                    </Button>
                </div>
            )}

            {/* Disclaimer Footer */}
            <div className="mt-12 border-4 border-brutal-yellow bg-brutal-yellow/5 p-5 flex items-start gap-4 shadow-brutal-sm">
                <div className="w-12 h-12 bg-brutal-yellow border-3 border-brutal-black flex items-center justify-center shrink-0">
                    <Stethoscope size={24} className="text-brutal-black" />
                </div>
                <div>
                    <h4 className="font-display font-black text-sm uppercase">
                        Informasi Penting
                    </h4>
                    <p className="font-body text-xs text-brutal-black leading-relaxed mt-1">
                        Data ini bersifat statis dan merupakan pemetaan resmi
                        Kemenkes. Jam operasional dan ketersediaan layanan IGD
                        dapat berubah sewaktu-waktu sesuai kebijakan instansi
                        terkait.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
