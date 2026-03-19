import { forwardRef } from "react";

const PDFReportTemplate = forwardRef(
    (
        {
            refNumber,
            printDate,
            result,
            userQuery,
            pathArr,
            formatDateTime,
            urgLabel,
        },
        ref,
    ) => {
        return (
            <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0">
                <div
                    ref={ref}
                    className="w-[190mm] bg-[#ffffff] text-[#000000] font-sans p-[10mm]"
                >
                    <div className="flex justify-between items-end border-b-4 border-[#000000] pb-4 mb-6 break-inside-avoid">
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight m-0 text-[#000000]">
                                MediCheck ID
                            </h1>
                            <p className="text-sm text-[#000000] font-medium m-0 mt-1">
                                Laporan Analisis Kesehatan AI
                            </p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-[#000000]">
                                Dokumen Hasil
                            </h2>
                            <p className="text-sm font-medium text-[#000000] mt-1">
                                REF:{" "}
                                <span className="font-mono font-bold">
                                    {refNumber}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between mb-8 border-2 border-[#000000] p-4 break-inside-avoid">
                        <div>
                            <p className="text-xs uppercase font-bold mb-1 tracking-wider text-[#000000]">
                                Identitas Pasien
                            </p>
                            <p className="text-base font-bold text-[#000000]">
                                Pengguna Mandiri (Anonim)
                            </p>
                            <p className="text-sm text-[#000000] mt-0.5">
                                Metode: Penilaian Gejala Interaktif
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase font-bold mb-1 tracking-wider text-[#000000]">
                                Waktu Pemeriksaan
                            </p>
                            <p className="text-sm font-bold text-[#000000]">
                                {formatDateTime(printDate)}
                            </p>
                        </div>
                    </div>

                    <div className="mb-8 p-5 text-center border-4 border-[#000000] break-inside-avoid">
                        <p className="text-xs uppercase font-bold tracking-widest mb-1 text-[#000000]">
                            Tingkat Urgensi
                        </p>
                        <h3 className="text-2xl font-black uppercase tracking-widest text-[#000000]">
                            {urgLabel}
                        </h3>
                        <p className="text-sm mt-1.5 font-medium text-[#000000]">
                            {result.likelihood}
                        </p>
                    </div>

                    <div className="mb-6 break-inside-avoid">
                        <div className="bg-[#000000] text-[#ffffff] px-3 py-1.5 inline-block font-bold text-sm">
                            I. ANAMNESIS KELUHAN
                        </div>
                        <div className="border-2 border-[#000000] p-4">
                            <p className="text-sm leading-relaxed font-medium text-[#000000]">
                                {pathArr?.length > 0
                                    ? pathArr.join(" ➔ ")
                                    : userQuery}
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 break-inside-avoid">
                        <div className="bg-[#000000] text-[#ffffff] px-3 py-1.5 inline-block font-bold text-sm">
                            II. KEMUNGKINAN KONDISI (AI ESTIMATION)
                        </div>
                        <div className="border-2 border-[#000000] p-4 flex flex-col gap-4">
                            <div>
                                <ul className="list-disc pl-5 text-sm font-bold space-y-1 text-[#000000]">
                                    {result.conditions?.map((c, i) => (
                                        <li key={i}>{c}</li>
                                    ))}
                                </ul>
                            </div>
                            {result.explanation && (
                                <div className="border-t-2 border-[#000000] pt-3 mt-1">
                                    <p className="text-xs uppercase font-bold mb-1 text-[#000000]">
                                        Keterangan Tambahan
                                    </p>
                                    <p className="text-sm text-justify text-[#000000]">
                                        {result.explanation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-8 break-inside-avoid">
                        <div className="bg-[#000000] text-[#ffffff] px-3 py-1.5 inline-block font-bold text-sm">
                            III. REKOMENDASI TINDAK LANJUT
                        </div>
                        <div className="border-2 border-[#000000] p-4 space-y-4">
                            {result.homeCare && result.homeCare.length > 0 && (
                                <div>
                                    <p className="text-sm font-bold mb-2 text-[#000000]">
                                        Tindakan Perawatan Mandiri Awal:
                                    </p>
                                    <ul className="list-decimal pl-5 text-sm space-y-1 text-[#000000]">
                                        {result.homeCare.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {result.redFlags && result.redFlags.length > 0 && (
                                <div className="border-2 border-[#000000] p-3 break-inside-avoid">
                                    <p className="text-sm font-bold mb-1 flex items-center gap-2 text-[#000000]">
                                        TANDA BAHAYA (Segera Cari Bantuan
                                        Medis):
                                    </p>
                                    <ul className="list-disc pl-5 text-sm space-y-1 font-medium text-[#000000]">
                                        {result.redFlags.map((flag, i) => (
                                            <li key={i}>{flag}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {result.whenToSeeDoctor && (
                                <div className="border-2 border-[#000000] p-3 mt-3 break-inside-avoid">
                                    <p className="text-sm font-bold mb-1 text-[#000000]">
                                        Kapan Harus ke Dokter?
                                    </p>
                                    <p className="text-sm text-[#000000]">
                                        {result.whenToSeeDoctor}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t-4 border-[#000000] grid grid-cols-12 gap-6 break-inside-avoid">
                        <div className="col-span-9 text-[11px] text-justify leading-relaxed pr-6 text-[#000000]">
                            <p className="font-bold mb-1 uppercase tracking-wider">
                                Pemberitahuan Penting (Disclaimer)
                            </p>
                            Dokumen ini dihasilkan secara otomatis oleh
                            Artificial Intelligence (AI) berdasarkan data
                            keluhan yang dimasukkan pengguna secara mandiri.
                            Dokumen ini{" "}
                            <strong>
                                BUKAN merupakan rekam medis resmi, BUKAN
                                diagnosis medis mutlak
                            </strong>
                            , dan TIDAK dapat menggantikan evaluasi dari dokter.
                            Selalu konsultasikan kondisi Anda dengan fasilitas
                            kesehatan profesional.
                        </div>
                        <div className="col-span-3 border-l-2 border-[#000000] pl-4 text-xs flex flex-col justify-center text-[#000000]">
                            <p className="font-bold mb-1.5 uppercase">
                                Kontak Darurat
                            </p>
                            <p className="mb-1">
                                <span className="font-semibold">Ambulans:</span>{" "}
                                119
                            </p>
                            <p className="mb-1">
                                <span className="font-semibold">Kemenkes:</span>{" "}
                                1500-567
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
);

PDFReportTemplate.displayName = "PDFReportTemplate";

export default PDFReportTemplate;
