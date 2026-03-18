import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    BookOpen,
    MapPin,
    AlertTriangle,
    Home,
    X,
    Heart,
    PhoneCall,
    Info,
    Phone,
    Users,
    Menu as MenuIcon,
} from "lucide-react";

// ==========================================
// 1. DATA REFERENSI (TIDAK ADA HALAMAN BARU)
// ==========================================
const NAV_LINKS = [
    { href: "/", label: "Beranda", icon: Home, emoji: "🏠" },
    { href: "/cek-gejala", label: "Cek Gejala", icon: Activity, emoji: "🩺" },
    {
        href: "/health-score",
        label: "Health Score",
        icon: BookOpen,
        emoji: "📊",
    },
    {
        href: "/health-insight",
        label: "Health Insight",
        icon: Info,
        emoji: "📚",
    },
    { href: "/p3k", label: "P3K", icon: AlertTriangle, emoji: "🚨" },
    {
        href: "/fasilitas-kesehatan",
        label: "Faskes",
        icon: MapPin,
        emoji: "📍",
    },
    { href: "/epidemiology", label: "Epidemiology", icon: Users, emoji: "🦠" },
];

// Helper untuk mengecek active route
const checkIsActive = (currentUrl, targetUrl) => {
    return (
        currentUrl === targetUrl ||
        (targetUrl !== "/" && currentUrl.startsWith(targetUrl))
    );
};

// ==========================================
// 2. KOMPONEN EMERGENCY & PANIC
// ==========================================
function EmergencyBanner() {
    return (
        <div className="bg-clinical-danger relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 relative z-10"
            >
                <Phone size={14} className="text-white animate-pulse" />
                <span className="font-body text-xs text-white font-medium">
                    Darurat? Hubungi
                </span>
                <span className="inline-flex items-center px-2 py-0.5 bg-white/20 backdrop-blur-sm font-display text-sm text-white font-bold rounded-full">
                    119
                </span>
                <span className="font-body text-xs text-white/80 hidden sm:inline">
                    (gratis 24 jam)
                </span>
            </motion.div>
        </div>
    );
}

function PanicMode() {
    const [isOpen, setIsOpen] = useState(false);

    // Mengunci scroll body saat panic mode aktif
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-50 w-16 h-16 md:w-20 md:h-20 bg-clinical-danger rounded-full shadow-clinical-lg shadow-clinical-danger/30 flex flex-col items-center justify-center border-[3px] border-white text-white group"
            >
                <div className="absolute inset-0 rounded-full animate-ping bg-clinical-danger/40" />
                <AlertTriangle className="w-7 h-7 md:w-8 md:h-8 mb-0.5 group-hover:scale-110 transition-transform" />
                <span className="font-display font-bold text-[10px] md:text-xs tracking-wider">
                    PANIC
                </span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-clinical-danger flex flex-col items-center justify-center p-6 text-white overflow-y-auto"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-md"
                        >
                            <X size={28} />
                        </button>
                        <div className="text-center mb-8 mt-12 w-full max-w-xl">
                            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 uppercase tracking-widest text-white/90">
                                DARURAT MEDIS
                            </h2>
                            <p className="font-body text-base md:text-lg opacity-90 mb-6">
                                Segera hubungi ambulans / layanan gawat darurat:
                            </p>
                            <a
                                href="tel:119"
                                className="inline-flex items-center justify-center gap-4 bg-white text-clinical-danger w-full py-6 rounded-clinical-2xl shadow-clinical-xl hover:scale-[1.02] active:scale-[0.98] transition-all mb-8"
                            >
                                <PhoneCall className="w-10 h-10 md:w-12 md:h-12 animate-pulse" />
                                <span className="font-display text-5xl md:text-7xl font-black tracking-tight">
                                    119
                                </span>
                            </a>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                <div className="bg-black/20 backdrop-blur-sm p-5 rounded-clinical-xl border border-white/20">
                                    <h3 className="font-display text-lg font-bold flex items-center gap-2 mb-3 text-white">
                                        <Activity size={18} /> Panduan CPR
                                    </h3>
                                    <ul className="space-y-2 font-body text-xs md:text-sm text-white/90">
                                        <li>
                                            1. Pastikan area aman, cek respon.
                                        </li>
                                        <li>
                                            2. Minta orang lain telepon 119.
                                        </li>
                                        <li>
                                            3. Tekan dada cepat & keras
                                            (100-120x/mnt).
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-black/20 backdrop-blur-sm p-5 rounded-clinical-xl border border-white/20">
                                    <h3 className="font-display text-lg font-bold flex items-center gap-2 mb-3 text-white">
                                        <Info size={18} /> Tersedak
                                    </h3>
                                    <ul className="space-y-2 font-body text-xs md:text-sm text-white/90">
                                        <li>1. Berdiri di belakang korban.</li>
                                        <li>2. Lingkarkan tangan ke perut.</li>
                                        <li>
                                            3. Tarik kepalan kuat ke atas
                                            (Heimlich).
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// ==========================================
// 3. DESKTOP HEADER (Clean Header)
// ==========================================
function DesktopHeader() {
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-40 transition-all duration-300 hidden lg:block",
                scrolled
                    ? "bg-white/90 backdrop-blur-md border-b border-clinical-border shadow-clinical-sm"
                    : "bg-white/50 backdrop-blur-sm border-transparent",
            )}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.05 }}
                            className="w-10 h-10 bg-clinical-primary rounded-clinical-lg flex items-center justify-center shadow-clinical-sm transition-all"
                        >
                            <span className="font-display text-lg text-white font-bold">
                                M
                            </span>
                        </motion.div>
                        <div>
                            <span className="font-display text-xl font-bold text-clinical-text">
                                MediCheck
                            </span>
                            <span className="font-display text-xl font-bold text-clinical-primary">
                                {" "}
                                ID
                            </span>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-1.5 bg-clinical-bg/50 p-1 rounded-clinical-lg border border-clinical-border/50">
                        {NAV_LINKS.map((link) => {
                            const isActive = checkIsActive(url, link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative px-4 py-2 font-body text-sm rounded-clinical-md transition-all duration-300 z-10",
                                        isActive
                                            ? "text-clinical-primary font-bold"
                                            : "text-clinical-text-secondary hover:text-clinical-text font-medium",
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-clinical-primary-light rounded-clinical-md -z-10"
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <Link
                        href="/cek-gejala"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-clinical-primary text-white font-body font-semibold text-sm rounded-clinical-lg shadow-clinical-sm hover:bg-clinical-primary-hover hover:-translate-y-0.5 transition-all"
                    >
                        <Activity size={16} /> Mulai Cek
                    </Link>
                </div>
            </div>
        </header>
    );
}

// ==========================================
// 4. MOBILE HEADER & NAVIGATION (Hub & Spoke Drawer)
// ==========================================
function MobileNavigation() {
    const { url } = usePage();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isDrawerOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isDrawerOpen]);

    // Memisahkan Navigasi tanpa merubah jumlah rute (3 Utama, Sisanya di Drawer)
    const primaryNav = [NAV_LINKS[0], NAV_LINKS[1], NAV_LINKS[5]]; // Home, Cek Gejala, Faskes
    const secondaryNav = [
        NAV_LINKS[2],
        NAV_LINKS[3],
        NAV_LINKS[4],
        NAV_LINKS[6],
    ]; // Health Score, Insight, P3K, Epidemiology

    return (
        <div className="lg:hidden">
            {/* Mobile Header - Sangat Bersih */}
            <header
                className={cn(
                    "sticky top-0 z-40 transition-all duration-300",
                    scrolled
                        ? "bg-white/90 backdrop-blur-md border-b border-clinical-border shadow-clinical-sm"
                        : "bg-white/90 backdrop-blur-sm",
                )}
            >
                <div className="px-4 flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-clinical-primary rounded-lg flex items-center justify-center shadow-clinical-sm">
                            <span className="font-display text-sm text-white font-bold">
                                M
                            </span>
                        </div>
                        <span className="font-display text-lg font-bold text-clinical-text">
                            MediCheck
                            <span className="text-clinical-primary"> ID</span>
                        </span>
                    </Link>
                </div>
            </header>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-clinical-border pb-safe">
                <div className="flex items-center justify-around h-16 px-2">
                    {primaryNav.map((link) => {
                        const Icon = link.icon;
                        const isActive = checkIsActive(url, link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative flex flex-col items-center justify-center w-full h-full gap-1"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-mobile"
                                        className="absolute inset-x-4 inset-y-1 bg-clinical-primary-light rounded-clinical-lg -z-10"
                                    />
                                )}
                                <Icon
                                    size={20}
                                    className={cn(
                                        "transition-colors",
                                        isActive
                                            ? "text-clinical-primary"
                                            : "text-clinical-muted",
                                    )}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span
                                    className={cn(
                                        "font-body text-[10px] leading-none transition-colors",
                                        isActive
                                            ? "font-bold text-clinical-primary"
                                            : "font-medium text-clinical-muted",
                                    )}
                                >
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                    {/* Trigger Menu Drawer */}
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="relative flex flex-col items-center justify-center w-full h-full gap-1 group"
                    >
                        <MenuIcon
                            size={20}
                            className="text-clinical-muted group-hover:text-clinical-primary transition-colors"
                        />
                        <span className="font-body text-[10px] leading-none font-medium text-clinical-muted group-hover:text-clinical-primary transition-colors">
                            Menu
                        </span>
                    </button>
                </div>
            </nav>

            {/* Mobile Bottom Drawer / Sheet */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    isDrawerOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none",
                )}
                onClick={() => setIsDrawerOpen(false)}
            >
                <div
                    className={cn(
                        "absolute bottom-0 left-0 w-full bg-clinical-bg rounded-t-3xl transition-transform duration-300 ease-out flex flex-col max-h-[85vh]",
                        isDrawerOpen ? "translate-y-0" : "translate-y-full",
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-5 border-b border-clinical-border bg-white rounded-t-3xl">
                        <h2 className="font-display font-bold text-lg text-clinical-text">
                            Eksplorasi Fitur
                        </h2>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="p-2 bg-clinical-bg hover:bg-clinical-border rounded-full text-clinical-text transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-5 overflow-y-auto space-y-3 pb-safe">
                        {secondaryNav.map((link) => {
                            const isActive = checkIsActive(url, link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsDrawerOpen(false)}
                                    className={cn(
                                        "flex items-center p-4 rounded-xl border transition-all",
                                        isActive
                                            ? "bg-clinical-primary-light/50 border-clinical-primary"
                                            : "bg-white border-clinical-border shadow-clinical-xs hover:border-clinical-primary",
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-clinical-primary-light flex items-center justify-center mr-4 shrink-0 text-xl">
                                        {link.emoji}
                                    </div>
                                    <span
                                        className={cn(
                                            "font-body text-sm",
                                            isActive
                                                ? "font-bold text-clinical-primary"
                                                : "font-semibold text-clinical-text",
                                        )}
                                    >
                                        {link.label}
                                    </span>
                                </Link>
                            );
                        })}

                        <div className="mt-6 pt-4 border-t border-clinical-border flex items-center justify-center gap-2 p-3 bg-clinical-danger/10 border border-clinical-danger/20 text-clinical-danger rounded-xl font-body font-bold text-sm">
                            <Phone size={16} /> Darurat Nasional:{" "}
                            <span className="bg-clinical-danger text-white px-3 py-1 font-display rounded-full shadow-sm">
                                119
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 5. FOOTER
// ==========================================
function Footer() {
    return (
        <footer className="bg-white border-t border-clinical-border mt-auto relative overflow-hidden pb-16 lg:pb-0">
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-clinical-primary-light/20 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-clinical-primary rounded-clinical-lg flex items-center justify-center shadow-clinical-sm">
                                <span className="font-display text-lg text-white font-bold">
                                    M
                                </span>
                            </div>
                            <span className="font-display text-xl text-clinical-text font-extrabold tracking-tight">
                                MediCheck{" "}
                                <span className="text-clinical-primary">
                                    ID
                                </span>
                            </span>
                        </div>
                        <p className="font-body text-sm text-clinical-text-secondary leading-relaxed max-w-sm">
                            Platform literasi kesehatan digital interaktif untuk
                            masyarakat Indonesia. Kenali gejala, temukan solusi,
                            dan akses bantuan medis dengan lebih cerdas.
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="font-display text-sm text-clinical-text font-bold mb-4 uppercase tracking-wider">
                            Jelajahi Fitur
                        </h4>
                        <nav className="flex flex-col gap-2.5">
                            {NAV_LINKS.slice(1).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="font-body text-sm text-clinical-text-secondary hover:text-clinical-primary transition-all flex items-center gap-2 w-fit"
                                >
                                    <span>{link.emoji}</span> {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="md:col-span-4">
                        <h4 className="font-display text-sm text-clinical-text font-bold mb-4 uppercase tracking-wider">
                            Referensi
                        </h4>
                        <div className="flex flex-col gap-2.5 font-body text-sm text-clinical-text-secondary">
                            <span className="flex items-center gap-2">
                                📋 World Health Organization
                            </span>
                            <span className="flex items-center gap-2">
                                🏥 Kementerian Kesehatan RI
                            </span>
                            <span className="flex items-center gap-2">
                                🩺 Palang Merah Indonesia
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-clinical-border pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="font-body text-sm text-clinical-muted font-medium">
                            © {new Date().getFullYear()} MediCheck ID. All
                            rights reserved.
                        </p>
                        <p className="font-body text-sm text-clinical-muted flex items-center gap-1.5">
                            Dibuat dengan{" "}
                            <Heart
                                size={14}
                                className="text-clinical-danger fill-clinical-danger"
                            />{" "}
                            di Indonesia
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// ==========================================
// 6. MAIN LAYOUT WRAPPER
// ==========================================
export default function PublicLayout({ children, fullWidth = false }) {
    return (
        <div className="min-h-screen flex flex-col bg-clinical-bg selection:bg-clinical-primary-light selection:text-clinical-primary">
            <EmergencyBanner />
            <DesktopHeader />
            <MobileNavigation />

            <main
                className={cn(
                    "flex-1 w-full",
                    !fullWidth &&
                        "max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12",
                )}
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {children}
                </motion.div>
            </main>

            <PanicMode />
            <Footer />
        </div>
    );
}
