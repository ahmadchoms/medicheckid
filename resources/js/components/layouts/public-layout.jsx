import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import {
    Activity,
    BookOpen,
    MapPin,
    AlertTriangle,
    Home,
    Phone,
    Menu,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Navigation Data ─────────────────────────────────────────
const NAV_LINKS = [
    { href: "/", label: "Beranda", icon: Home, emoji: "🏠" },
    { href: "/cek-gejala", label: "Cek Gejala", icon: Activity, emoji: "🩺" },
    { href: "/health-score", label: "Health Score", icon: BookOpen, emoji: "📊" },
    { href: "/p3k", label: "P3K", icon: AlertTriangle, emoji: "🚨" },
    { href: "/faskes", label: "Faskes", icon: MapPin, emoji: "📍" },
];

// ─── Emergency Banner ────────────────────────────────────────
function EmergencyBanner() {
    return (
        <div className="bg-brutal-red border-b-3 border-brutal-black">
            <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2">
                <Phone size={14} className="text-white" />
                <span className="font-body text-xs text-white font-bold">
                    Darurat? Hubungi
                </span>
                <a
                    href="tel:119"
                    className="font-display text-sm text-brutal-yellow underline hover:no-underline"
                >
                    119
                </a>
                <span className="font-body text-xs text-white/70">
                    (gratis 24 jam)
                </span>
            </div>
        </div>
    );
}

// ─── Header ──────────────────────────────────────────────────
function Header() {
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-brutal-white border-b-4 border-brutal-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-brutal-yellow border-3 border-brutal-black shadow-brutal-sm flex items-center justify-center group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                            <span className="font-display text-sm">M</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-display text-lg leading-none">
                                MediCheck
                            </span>
                            <span className="font-display text-lg text-brutal-blue leading-none">
                                {" "}ID
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_LINKS.map((link) => {
                            const isActive = url === link.href || (link.href !== "/" && url.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-3 py-2 font-body text-sm font-bold transition-all duration-150",
                                        "border-3 border-transparent hover:border-brutal-black hover:shadow-brutal-sm",
                                        "hover:-translate-x-0.5 hover:-translate-y-0.5",
                                        isActive && "border-brutal-black bg-brutal-yellow shadow-brutal-sm",
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Emergency + Mobile toggle */}
                    <div className="flex items-center gap-2">
                        <a
                            href="tel:119"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-brutal-red text-white border-3 border-brutal-black font-body font-bold text-xs shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                        >
                            <Phone size={12} />
                            119
                        </a>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden w-10 h-10 border-3 border-brutal-black flex items-center justify-center bg-brutal-white shadow-brutal-sm hover:bg-brutal-yellow transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileOpen && (
                    <div className="lg:hidden border-t-3 border-brutal-black pb-4 animate-slide-up">
                        <nav className="flex flex-col gap-1 pt-3">
                            {NAV_LINKS.map((link) => {
                                const isActive = url === link.href || (link.href !== "/" && url.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-3 font-body font-bold text-sm",
                                            "border-3 border-transparent transition-all",
                                            "hover:border-brutal-black hover:bg-brutal-yellow hover:shadow-brutal-sm",
                                            isActive && "border-brutal-black bg-brutal-yellow shadow-brutal-sm",
                                        )}
                                    >
                                        <span className="text-lg">{link.emoji}</span>
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <a
                            href="tel:119"
                            className="mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-brutal-red text-white border-3 border-brutal-black font-body font-bold text-sm shadow-brutal"
                        >
                            <Phone size={16} />
                            Darurat: 119
                        </a>
                    </div>
                )}
            </div>
        </header>
    );
}

// ─── Footer ──────────────────────────────────────────────────
function Footer() {
    return (
        <footer className="bg-brutal-black border-t-4 border-brutal-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-brutal-yellow border-3 border-brutal-white/20 flex items-center justify-center">
                                <span className="font-display text-xs text-brutal-black">M</span>
                            </div>
                            <span className="font-display text-lg text-brutal-white">
                                MediCheck <span className="text-brutal-yellow">ID</span>
                            </span>
                        </div>
                        <p className="font-body text-xs text-brutal-white/60 leading-relaxed">
                            Platform literasi kesehatan interaktif untuk masyarakat Indonesia.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-display text-sm text-brutal-yellow mb-3 uppercase tracking-wider">
                            Fitur
                        </h4>
                        <nav className="flex flex-col gap-1.5">
                            {NAV_LINKS.slice(1).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="font-body text-sm text-brutal-white/60 hover:text-brutal-yellow transition-colors"
                                >
                                    {link.emoji} {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Sources */}
                    <div>
                        <h4 className="font-display text-sm text-brutal-yellow mb-3 uppercase tracking-wider">
                            Sumber Terpercaya
                        </h4>
                        <div className="flex flex-col gap-1.5 font-body text-xs text-brutal-white/60">
                            <span>📋 World Health Organization (WHO)</span>
                            <span>🏥 Kementerian Kesehatan RI</span>
                            <span>🩺 Palang Merah Indonesia (PMI)</span>
                            <span>📖 IDAI & Permenkes 2019</span>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="border-t-3 border-brutal-white/10 pt-6">
                    <div className="border-3 border-brutal-yellow/30 bg-brutal-yellow/5 p-3 mb-4">
                        <p className="font-body text-xs text-brutal-white/70 leading-relaxed">
                            ⚠️ <strong className="text-brutal-yellow">Disclaimer:</strong>{" "}
                            MediCheck ID adalah platform edukasi kesehatan dan BUKAN
                            pengganti diagnosis dokter. Untuk kondisi darurat, segera
                            hubungi <strong className="text-brutal-yellow">119</strong>.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                        <p className="font-body text-xs text-brutal-white/40">
                            © 2026 MediCheck ID — SOFTCOMPT TECHSOFT 2026
                        </p>
                        <p className="font-body text-xs text-brutal-white/40">
                            HIMA-RPL Politeknik Negeri Indramayu
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// ─── Bottom Navigation (Mobile Only) ─────────────────────────
function BottomNav() {
    const { url } = usePage();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-brutal-white border-t-4 border-brutal-black">
            <div className="flex items-center justify-around h-16">
                {NAV_LINKS.map((link) => {
                    const Icon = link.icon;
                    const isActive = url === link.href || (link.href !== "/" && url.startsWith(link.href));
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center gap-0.5 px-2 py-1 transition-colors",
                                isActive ? "text-brutal-blue" : "text-brutal-muted",
                            )}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className={cn(
                                "font-body text-[10px] leading-tight",
                                isActive && "font-bold",
                            )}>
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

// ─── PublicLayout ────────────────────────────────────────────
// Main layout wrapper used by all public pages.
// fullWidth: removes max-width constraint on the content area.

export default function PublicLayout({ children, fullWidth = false }) {
    return (
        <div className="min-h-screen flex flex-col">
            <EmergencyBanner />
            <Header />

            <main className={cn(
                "flex-1 pb-20 lg:pb-0",
                !fullWidth && "max-w-7xl mx-auto w-full px-4 sm:px-6 py-8",
            )}>
                {children}
            </main>

            <Footer />
            <BottomNav />
        </div>
    );
}
