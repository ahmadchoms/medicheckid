import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/components/layouts/public-layout";
import { motion } from "framer-motion";
import {
    Activity,
    BookOpen,
    MapPin,
    AlertTriangle,
    ArrowRight,
    Heart,
    Shield,
    Sparkles,
    Stethoscope,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};


const FEATURES = [
    {
        href: "/cek-gejala",
        icon: Activity,
        emoji: "🩺",
        title: "Cek Gejala AI",
        description:
            "Analisis keluhan kesehatanmu dengan kecerdasan buatan untuk mendapatkan rekomendasi penanganan awal yang komprehensif.",
        color: "primary",
        tag: "Populer",
    },
    {
        href: "/health-score",
        icon: BookOpen,
        emoji: "📊",
        title: "Kalkulator Health Score",
        description:
            "Ukur dan pantau skor kesehatan harianmu berdasarkan 6 dimensi gaya hidup utama secara real-time.",
        color: "accent",
        tag: "Holistik",
    },
    {
        href: "/p3k",
        icon: AlertTriangle,
        emoji: "🚑",
        title: "Panduan P3K Interaktif",
        description:
            "Instruksi pertolongan pertama selangkah demi selangkah yang dilengkapi timer darurat berstandar PMI & WHO.",
        color: "warning",
        tag: "Darurat",
    },
    {
        href: "/fasilitas-kesehatan",
        icon: MapPin,
        emoji: "📍",
        title: "Direktori Faskes",
        description:
            "Temukan Rumah Sakit, Klinik, dan Puskesmas terdekat di seluruh Indonesia lengkap dengan informasi IGD.",
        color: "success",
        tag: "Nasional",
    },
];

const colorMap = {
    primary: {
        bg: "bg-clinical-primary-light/50",
        icon: "text-clinical-primary",
        border: "border-clinical-primary/20",
        tag: "bg-clinical-primary-light text-clinical-primary",
    },
    accent: {
        bg: "bg-clinical-accent-light/50",
        icon: "text-clinical-accent",
        border: "border-clinical-accent/20",
        tag: "bg-clinical-accent-light text-clinical-accent",
    },
    warning: {
        bg: "bg-clinical-warning-light/50",
        icon: "text-clinical-warning",
        border: "border-clinical-warning/20",
        tag: "bg-clinical-warning-light text-amber-700",
    },
    success: {
        bg: "bg-clinical-success-light/50",
        icon: "text-clinical-success",
        border: "border-clinical-success/20",
        tag: "bg-clinical-success-light text-clinical-success",
    },
};


const STATS = [
    { emoji: "🩺", value: "15+", label: "Kondisi Medis" },
    { emoji: "📊", value: "6", label: "Dimensi Gaya Hidup" },
    { emoji: "🏥", value: "30K+", label: "Faskes Terdata" },
    { emoji: "🤖", value: "AI", label: "Triage Pintar" },
];


export default function Home() {
    return (
        <PublicLayout>
            <Head title="MediCheck ID — Platform Kesehatan Digital Modern" />

            <motion.section
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="relative overflow-hidden rounded-clinical-2xl bg-linear-to-br from-white via-clinical-primary-light/20 to-clinical-accent-light/30 border border-clinical-border mb-16 shadow-clinical-sm"
            >
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-clinical-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-clinical-success/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative px-6 py-20 md:py-28 lg:py-32 text-center max-w-4xl mx-auto z-10">
                    <motion.div
                        variants={fadeUp}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md border border-clinical-border rounded-full mb-6 shadow-clinical-xs"
                    >
                        <Sparkles
                            size={14}
                            className="text-clinical-primary animate-pulse"
                        />
                        <span className="font-body text-xs font-bold text-clinical-primary tracking-wide uppercase">
                            Platform Kesehatan Generasi Baru
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        className="font-display text-4xl md:text-5xl lg:text-7xl font-extrabold text-clinical-text leading-[1.15] mb-6 tracking-tight"
                    >
                        Literasi Kesehatan Anda,{" "}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-clinical-primary to-clinical-success">
                            Dalam Genggaman
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        className="font-body text-clinical-text-secondary text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Periksa gejala secara mandiri dengan bantuan kecerdasan
                        buatan, pantau gaya hidup, dan akses panduan pertolongan
                        pertama terpercaya dalam hitungan detik.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/cek-gejala"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-clinical-primary text-white font-body font-bold text-base rounded-clinical-xl shadow-clinical-md hover:shadow-clinical-lg hover:bg-clinical-primary-hover hover:-translate-y-1 transition-all duration-300"
                        >
                            <Activity size={18} />
                            Mulai Pemeriksaan AI
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/health-score"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-clinical-text font-body font-bold text-base rounded-clinical-xl border-2 border-clinical-border shadow-clinical-xs hover:border-clinical-primary/30 hover:bg-clinical-bg hover:-translate-y-1 transition-all duration-300"
                        >
                            <Heart size={18} className="text-clinical-danger" />
                            Kalkulator Health Score
                        </Link>
                        <Button
                            onClick={() =>
                                toast.success(
                                    "Fitur sedang dalam pengembangan.",
                                )
                            }
                            variant="outline"
                            size="sm"
                            className="hidden md:inline-flex"
                        >
                            <span>Pelajari Lebih Lanjut</span>
                            <ChevronRight size={16} />
                        </Button>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20"
            >
                {STATS.map((stat, i) => (
                    <motion.div
                        variants={fadeUp}
                        key={i}
                        className="bg-white border border-clinical-border rounded-clinical-xl p-6 text-center shadow-clinical-xs hover:shadow-clinical-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-clinical-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="text-3xl block mb-2 relative z-10">
                            {stat.emoji}
                        </span>
                        <span className="font-display text-3xl font-extrabold text-clinical-text relative z-10">
                            {stat.value}
                        </span>
                        <p className="font-body text-sm text-clinical-muted mt-1 font-medium relative z-10">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </motion.section>

            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="mb-20"
            >
                <div className="text-center mb-12">
                    <motion.h2
                        variants={fadeUp}
                        className="font-display text-3xl md:text-4xl font-extrabold text-clinical-text mb-4"
                    >
                        Fitur Unggulan Kami
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        className="font-body text-clinical-text-secondary text-base max-w-xl mx-auto"
                    >
                        Dirancang secara khusus dengan pendekatan medis modern
                        untuk membantu Anda membuat keputusan kesehatan yang
                        lebih baik.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FEATURES.map((feature, idx) => {
                        const colors = colorMap[feature.color];
                        const Icon = feature.icon;
                        return (
                            <motion.div variants={fadeUp} key={idx}>
                                <Link
                                    href={feature.href}
                                    className="group block bg-white border border-clinical-border rounded-clinical-2xl p-6 md:p-8 shadow-clinical-xs hover:shadow-clinical-lg hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div
                                        className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-transparent to-${feature.color}-500/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                                    />

                                    <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
                                        <div
                                            className={cn(
                                                "w-14 h-14 rounded-clinical-xl flex items-center justify-center shrink-0 border",
                                                colors.bg,
                                                colors.border,
                                            )}
                                        >
                                            <Icon
                                                size={26}
                                                className={colors.icon}
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-display text-xl font-bold text-clinical-text group-hover:text-clinical-primary transition-colors">
                                                    {feature.title}
                                                </h3>
                                                <span
                                                    className={cn(
                                                        "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                                                        colors.tag,
                                                    )}
                                                >
                                                    {feature.tag}
                                                </span>
                                            </div>
                                            <p className="font-body text-sm text-clinical-text-secondary leading-relaxed mb-4">
                                                {feature.description}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-clinical-primary font-body font-bold text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <span>Eksplorasi Fitur</span>
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section>

            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="mb-20"
            >
                <div className="bg-clinical-bg border border-clinical-border rounded-clinical-2xl p-8 md:p-10 text-center shadow-inner">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-clinical-xs mb-4">
                        <Shield size={24} className="text-clinical-accent" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-clinical-text mb-6">
                        Berbasis Sains & Referensi Terpercaya
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { emoji: "🌐", label: "WHO Guidelines" },
                            { emoji: "🏥", label: "Kemenkes RI" },
                            { emoji: "🚑", label: "Standar PMI" },
                            { emoji: "📚", label: "Jurnal Medis Terkini" },
                        ].map((source, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-clinical-border shadow-clinical-xs rounded-full"
                            >
                                <span className="text-xl">{source.emoji}</span>
                                <span className="font-body font-semibold text-sm text-clinical-text">
                                    {source.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="mb-8"
            >
                <div className="bg-linear-to-r from-clinical-primary to-clinical-primary-hover rounded-clinical-2xl p-10 md:p-14 text-center shadow-clinical-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-clinical-accent/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-6">
                            <Stethoscope size={32} className="text-white" />
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">
                            Satu Langkah Menuju Hidup Lebih Sehat
                        </h2>
                        <p className="font-body text-white/90 text-lg max-w-xl mx-auto mb-8 font-medium">
                            Bergabunglah dengan platform kesehatan digital yang
                            memberdayakan Anda dengan pengetahuan dan
                            rekomendasi taktis.
                        </p>
                        <Link
                            href="/cek-gejala"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-clinical-primary font-display font-bold text-base rounded-clinical-xl shadow-clinical-md hover:shadow-clinical-lg hover:scale-105 transition-all duration-300 group"
                        >
                            Mulai Cek Gejala Sekarang
                            <ArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </Link>
                    </div>
                </div>
            </motion.section>
        </PublicLayout>
    );
}
