// resources/js/Pages/p3k.jsx
import { Head } from "@inertiajs/react";
import PublicLayout from "@/components/layouts/public-layout";
import P3KGuide from "@/features/P3K/p3k-guide";

export default function P3KPage() {
    return (
        <PublicLayout>
            <Head title="Panduan P3K — MediCheck ID" />

            <div className="py-8">
                <P3KGuide />

                {/* Disclaimer */}
                <div className="mt-8 border-t-3 border-brutal-gray pt-4">
                    <p className="text-xs font-body text-brutal-muted">
                        ⚠️ <strong>Disclaimer:</strong> Panduan pertolongan
                        pertama ini bersifat informatif berdasarkan standar PMI
                        dan WHO. Dalam keadaan darurat, selalu hubungi{" "}
                        <strong>119</strong> terlebih dahulu. Ikuti pelatihan
                        P3K resmi untuk penanganan yang lebih tepat.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
