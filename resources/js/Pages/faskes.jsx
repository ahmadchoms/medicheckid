import { useState, useEffect, useRef } from "react";
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
    Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PublicLayout from "@/components/layouts/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/feedback";

const FASKES_TYPES = {
    rumah_sakit: { label: "Rumah Sakit", emoji: "🏥", color: "blue" },
    puskesmas: { label: "Puskesmas", emoji: "🩺", color: "green" },
};

function FaskesCard({ item }) {
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
        <div className="bg-white border border-clinical-border rounded-clinical-xl p-5 shadow-clinical-xs hover:shadow-clinical-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "w-10 h-10 rounded-clinical-lg flex items-center justify-center text-lg shrink-0",
                            item.type === "rumah_sakit"
                                ? "bg-clinical-primary-light"
                                : "bg-clinical-success-light",
                        )}
                    >
                        {typeInfo.emoji}
                    </div>
                    <div>
                        <h3 className="font-display text-base font-bold leading-tight line-clamp-2 text-clinical-text">
                            {item.unit_kerja}
                        </h3>
                        <p className="font-body text-xs text-clinical-muted mt-0.5">
                            {cityName}
                        </p>
                    </div>
                </div>
                {item.type === "rumah_sakit" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-clinical-danger-light text-clinical-danger font-body text-[10px] font-semibold rounded-full shrink-0">
                        <AlertTriangle size={10} /> IGD
                    </span>
                )}
            </div>

            <div className="space-y-1.5 mb-4 grow">
                <div className="flex items-start gap-2">
                    <MapPin
                        size={14}
                        className="text-clinical-muted shrink-0 mt-0.5"
                    />
                    <p className="font-body text-xs text-clinical-muted leading-relaxed line-clamp-1">
                        Kode Instansi: {item.kode_instansi}
                    </p>
                </div>

                {item.email && (
                    <div className="flex items-center gap-2">
                        <Mail
                            size={14}
                            className="text-clinical-muted shrink-0"
                        />
                        <p className="font-body text-xs text-clinical-muted truncate">
                            {item.email}
                        </p>
                    </div>
                )}

                {item.telp && (
                    <div className="flex items-center gap-2">
                        <Phone
                            size={14}
                            className="text-clinical-muted shrink-0"
                        />
                        <p className="font-body text-xs text-clinical-muted">
                            {item.telp}
                        </p>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-clinical-muted shrink-0" />
                    <p className="font-body text-xs text-clinical-muted">
                        {item.type === "rumah_sakit"
                            ? "Buka 24 Jam"
                            : "Senin-Sabtu, 08:00 - 14:00"}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mt-auto">
                <a
                    href={`tel:${item.telp || "119"}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-clinical-success text-white font-body font-semibold text-xs rounded-clinical-md shadow-clinical-sm hover:shadow-clinical-md transition-all"
                >
                    <Phone size={14} /> Hubungi
                </a>
                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-clinical-primary text-white font-body font-semibold text-xs rounded-clinical-md shadow-clinical-sm hover:shadow-clinical-md transition-all"
                >
                    <ExternalLink size={14} /> Maps
                </a>
            </div>
        </div>
    );
}

export default function Faskes({ facilities, filters, cities }) {
    const [search, setSearch] = useState(filters?.search || "");
    const [city, setCity] = useState(filters?.city || "");
    const [type, setType] = useState(filters?.type || "");

    const [isCityOpen, setIsCityOpen] = useState(false);
    const [citySearch, setCitySearch] = useState("");
    const dropdownRef = useRef(null);

    const hasActiveFilter = city || type || search;

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

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 bg-clinical-warning-light rounded-clinical-lg flex items-center justify-center">
                        <Building2
                            size={22}
                            className="text-clinical-warning"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-clinical-text">
                            Cari Faskes
                        </h1>
                        <p className="font-body text-sm text-clinical-muted">
                            Temukan RS atau Puskesmas di seluruh Indonesia
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6 space-y-3">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-clinical-muted"
                    />
                    <Input
                        type="text"
                        placeholder="Cari nama faskes (Contoh: RSUD...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 h-12 border border-clinical-border rounded-clinical-lg font-body text-sm shadow-clinical-xs focus:border-clinical-primary focus:ring-2 focus:ring-clinical-primary/20 transition-all"
                    />
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-1">
                        <Filter size={14} className="text-clinical-muted" />
                        <span className="font-body text-xs font-semibold text-clinical-muted">
                            Filter:
                        </span>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsCityOpen(!isCityOpen)}
                            className={cn(
                                "w-64 px-4 py-2.5 border border-clinical-border rounded-clinical-md font-body text-xs font-semibold bg-white shadow-clinical-xs flex justify-between items-center transition-all",
                                city &&
                                    "bg-clinical-primary-light border-clinical-primary text-clinical-primary",
                                isCityOpen &&
                                    "border-clinical-primary ring-2 ring-clinical-primary/20",
                            )}
                        >
                            <span className="truncate">
                                {city
                                    ? cities.find((c) => c.value === city)
                                          ?.label
                                    : "Semua Wilayah"}
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
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-clinical-border rounded-clinical-lg shadow-clinical-lg z-50">
                                <div className="p-2 border-b border-clinical-border">
                                    <div className="relative">
                                        <Search
                                            size={12}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 text-clinical-muted"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Ketik nama kota..."
                                            value={citySearch}
                                            onChange={(e) =>
                                                setCitySearch(e.target.value)
                                            }
                                            className="w-full pl-7 pr-2 py-1.5 text-xs border border-clinical-border rounded-clinical-sm focus:outline-none focus:border-clinical-primary font-body"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                    <button
                                        onClick={() => {
                                            setCity("");
                                            setIsCityOpen(false);
                                            setCitySearch("");
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-clinical-bg border-b border-clinical-border/50 transition-colors"
                                    >
                                        Tampilkan Semua
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
                                                    "w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-clinical-primary-light hover:text-clinical-primary transition-colors",
                                                    city === c.value &&
                                                        "bg-clinical-primary text-white",
                                                )}
                                            >
                                                {c.label}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center text-[10px] text-clinical-muted font-medium italic">
                                            Wilayah tidak ditemukan...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className={cn(
                            "px-4 py-2.5 border border-clinical-border rounded-clinical-md font-body text-xs font-semibold bg-white shadow-clinical-xs appearance-none cursor-pointer",
                            type &&
                                "bg-clinical-primary-light border-clinical-primary text-clinical-primary",
                        )}
                    >
                        <option value="">Semua Jenis</option>
                        <option value="rumah_sakit">🏥 Rumah Sakit</option>
                        <option value="puskesmas">🩺 Puskesmas</option>
                    </select>

                    {hasActiveFilter && (
                        <button
                            onClick={clearFilters}
                            className="px-2 py-2 font-body text-xs font-semibold text-clinical-danger hover:underline"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-4 flex items-center justify-between pl-3 border-l-2 border-clinical-primary">
                <p className="font-body text-sm text-clinical-text-secondary">
                    Ditemukan{" "}
                    <span className="font-bold text-clinical-text">
                        {facilities.total}
                    </span>{" "}
                    data fasilitas kesehatan.
                </p>
                {city && (
                    <Badge className="bg-clinical-primary-light text-clinical-primary text-xs font-semibold rounded-full">
                        Wilayah Aktif
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {facilities.data.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyState
                            emoji="🕵️‍♂️"
                            title="Tidak Ada Hasil"
                            description="Tidak menemukan faskes dengan kriteria tersebut. Coba cari kata kunci lain."
                            action={hasActiveFilter ? clearFilters : undefined}
                            actionLabel="Hapus Semua Filter"
                        />
                    </div>
                ) : (
                    facilities.data.map((item) => (
                        <FaskesCard
                            key={item.id || item.kode_instansi}
                            item={item}
                        />
                    ))
                )}
            </div>

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
                    >
                        <ChevronLeft size={18} className="mr-1" /> Prev
                    </Button>
                    <div className="font-body text-sm font-semibold text-clinical-text bg-clinical-bg border border-clinical-border rounded-clinical-md px-5 py-2">
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
                    >
                        Next <ChevronRight size={18} className="ml-1" />
                    </Button>
                </div>
            )}

            <div className="mt-12 bg-clinical-warning-light/50 border border-clinical-warning/20 rounded-clinical-xl p-5 flex items-start gap-4">
                <div className="w-11 h-11 bg-clinical-warning-light rounded-clinical-lg flex items-center justify-center shrink-0">
                    <Stethoscope size={22} className="text-clinical-warning" />
                </div>
                <div>
                    <h4 className="font-display font-bold text-sm text-clinical-text">
                        Informasi Penting
                    </h4>
                    <p className="font-body text-xs text-clinical-text-secondary leading-relaxed mt-1">
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
