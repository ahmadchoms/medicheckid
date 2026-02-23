// resources/js/lib/symptomTree.js
// Decision tree untuk 12 kondisi kesehatan umum Indonesia
// Max depth: 5 levels | Medical content reviewed against WHO/Kemenkes guidelines

export const SYMPTOM_AREAS = {
    head: {
        id: "head",
        label: "Kepala & Wajah",
        emoji: "🧠",
        color: "blue",
        symptoms: [
            "Sakit kepala",
            "Pusing / vertigo",
            "Mata merah",
            "Telinga berdenging",
            "Hidung tersumbat",
            "Sakit gigi / gusi",
        ],
    },
    chest: {
        id: "chest",
        label: "Dada & Pernapasan",
        emoji: "🫁",
        color: "red",
        symptoms: [
            "Nyeri dada",
            "Sesak nafas",
            "Batuk",
            "Jantung berdebar",
            "Nyeri tulang rusuk",
        ],
    },
    abdomen: {
        id: "abdomen",
        label: "Perut & Pencernaan",
        emoji: "🫃",
        color: "yellow",
        symptoms: [
            "Mual / muntah",
            "Nyeri perut",
            "Diare",
            "Sembelit",
            "Kembung / begah",
            "Heartburn",
        ],
    },
    skin: {
        id: "skin",
        label: "Kulit",
        emoji: "🩹",
        color: "orange",
        symptoms: [
            "Ruam / bintik-bintik",
            "Gatal",
            "Bengkak",
            "Luka",
            "Kulit mengelupas",
        ],
    },
    limbs: {
        id: "limbs",
        label: "Anggota Gerak",
        emoji: "🦵",
        color: "green",
        symptoms: [
            "Nyeri sendi",
            "Kram otot",
            "Bengkak kaki",
            "Mati rasa / kesemutan",
            "Kelemahan otot",
        ],
    },
    general: {
        id: "general",
        label: "Umum / Seluruh Tubuh",
        emoji: "🌡️",
        color: "gray",
        symptoms: [
            "Demam",
            "Kelelahan ekstrem",
            "Penurunan berat badan",
            "Berkeringat malam",
            "Tidak nafsu makan",
        ],
    },
};

// Condition result templates
const CONDITIONS = {
    tension_headache: {
        conditions: ["Sakit Kepala Tegang (Tension Headache)"],
        likelihood: "Kemungkinan tinggi",
        urgency: "low",
        homeCare: [
            "Istirahat di ruangan gelap dan tenang",
            "Kompres dingin atau hangat di dahi/tengkuk",
            "Minum air putih yang cukup (minimal 8 gelas/hari)",
            "Paracetamol 500mg dapat membantu mengurangi nyeri",
            "Hindari layar HP/komputer untuk sementara",
        ],
        whenToSeeDoctor:
            "Jika nyeri tidak membaik dalam 24 jam, sangat hebat, atau disertai demam tinggi dan kaku leher.",
        redFlags: [
            'Nyeri kepala "thunderclap" (tiba-tiba sangat hebat)',
            "Kaku leher + demam",
            "Penglihatan ganda",
            "Kebingungan / sulit bicara",
        ],
        explanation:
            "Sakit kepala tegang adalah jenis sakit kepala yang paling umum. Biasanya terasa seperti tekanan di sekitar kepala, tidak berdenyut, dan tidak memburuk dengan aktivitas fisik.",
        disclaimer:
            "Ini adalah estimasi berdasarkan gejala yang kamu inputkan, BUKAN diagnosis medis. Selalu konsultasikan dengan dokter untuk kepastian.",
    },
    migraine: {
        conditions: ["Migrain"],
        likelihood: "Kemungkinan tinggi",
        urgency: "moderate",
        homeCare: [
            "Istirahat total di tempat yang gelap dan tenang",
            "Kompres dingin di dahi atau belakang leher",
            "Hindari pemicu: cahaya terang, suara keras, bau kuat",
            "Obat NSAID (ibuprofen) dapat membantu jika diminum di awal gejala",
            "Minum cukup air — dehidrasi dapat memperburuk migrain",
        ],
        whenToSeeDoctor:
            "Jika migrain terjadi > 3x seminggu, atau obat pereda nyeri biasa tidak efektif.",
        redFlags: [
            "Migrain pertama kali yang sangat parah",
            "Nyeri saat batuk/mengejan",
            "Gejala neurologis (kelemahan, gangguan bicara)",
        ],
        explanation:
            "Migrain adalah nyeri kepala berdenyut, biasanya di satu sisi, yang dapat berlangsung 4-72 jam. Sering disertai mual, muntah, dan sensitif terhadap cahaya/suara.",
        disclaimer:
            "Ini adalah estimasi berdasarkan gejala yang kamu inputkan, BUKAN diagnosis medis.",
    },
    gastritis: {
        conditions: ["Gastritis (Maag)", "GERD (Refluks Asam)"],
        likelihood: "Kemungkinan tinggi",
        urgency: "moderate",
        homeCare: [
            "Makan dalam porsi kecil tapi lebih sering (5-6x/hari)",
            "Hindari makanan pedas, asam, berlemak, dan berkarbonasi",
            "Hindari makan terlambat atau perut kosong terlalu lama",
            "Antasida (misalnya Mylanta, Promag) dapat meredakan gejala sementara",
            "Posisi tidur kepala lebih tinggi jika ada heartburn",
        ],
        whenToSeeDoctor:
            "Jika nyeri sangat hebat, tidak membaik dengan antasida, atau terjadi lebih dari 1 minggu.",
        redFlags: [
            "Muntah darah atau feses berwarna hitam",
            "Nyeri dada yang menjalar ke lengan kiri",
            "Penurunan berat badan signifikan tanpa alasan",
        ],
        explanation:
            "Gastritis adalah peradangan pada lapisan lambung. GERD terjadi saat asam lambung naik ke kerongkongan. Keduanya sangat umum di Indonesia dan berhubungan erat dengan pola makan.",
        disclaimer:
            "Ini adalah estimasi berdasarkan gejala yang kamu inputkan, BUKAN diagnosis medis.",
    },
    flu: {
        conditions: ["Influenza (Flu)", "Infeksi Virus Saluran Napas Atas"],
        likelihood: "Kemungkinan tinggi",
        urgency: "low",
        homeCare: [
            "Perbanyak istirahat dan tidur",
            "Minum banyak cairan (air putih, sup hangat, teh jahe)",
            "Paracetamol 500mg untuk demam dan nyeri",
            "Gunakan masker jika berdekatan dengan orang lain",
            "Cuci tangan sering dan hindari menyentuh wajah",
        ],
        whenToSeeDoctor:
            "Jika demam > 39°C tidak turun dalam 3 hari, atau ada sesak nafas, nyeri dada, atau kebingungan.",
        redFlags: [
            "Sesak nafas",
            "Nyeri dada",
            "Kebingungan atau sulit dibangunkan",
            "Bibir atau wajah membiru",
        ],
        explanation:
            "Flu disebabkan oleh virus influenza dan biasanya berlangsung 5-7 hari. Gejala utama: demam mendadak, sakit kepala, nyeri otot, batuk kering, dan kelelahan.",
        disclaimer:
            "Ini adalah estimasi berdasarkan gejala yang kamu inputkan, BUKAN diagnosis medis.",
    },
    diarrhea: {
        conditions: ["Diare Akut", "Gastroenteritis"],
        likelihood: "Kemungkinan tinggi",
        urgency: "moderate",
        homeCare: [
            "Minum banyak cairan untuk mencegah dehidrasi (air, oralit, air kelapa)",
            "Konsumsi oralit: 200-400ml setiap BAB cair",
            "Makan makanan lunak: bubur, pisang, roti tawar, apel kukus (BRAT diet)",
            "Hindari susu, makanan berlemak, dan pedas",
            "Cuci tangan sebelum makan dan setelah toilet",
        ],
        whenToSeeDoctor:
            "Jika diare > 2 hari, ada darah dalam feses, demam tinggi, atau tanda dehidrasi berat (jarang buang air kecil, pusing hebat).",
        redFlags: [
            "Darah dalam feses",
            "Demam > 39°C",
            "Tanda dehidrasi berat",
            "Nyeri perut hebat",
        ],
        explanation:
            "Diare akut adalah buang air besar cair > 3x sehari. Di Indonesia, penyebab paling umum adalah infeksi bakteri/virus dari makanan atau air yang terkontaminasi.",
        disclaimer:
            "Ini adalah estimasi berdasarkan gejala yang kamu inputkan, BUKAN diagnosis medis.",
    },
    chest_emergency: {
        conditions: ["Kemungkinan Kondisi Jantung / Paru Serius"],
        likelihood: "Perlu evaluasi segera",
        urgency: "emergency",
        homeCare: [
            "⚠️ JANGAN TUNDA — hubungi 119 atau minta diantar ke IGD sekarang",
            "Duduk atau berbaring dalam posisi paling nyaman",
            "Longgarkan pakaian yang ketat",
            "Jangan makan atau minum apapun",
            "Jika tersedia, konsumsi aspirin 80mg (jika tidak alergi) sambil menunggu ambulan",
        ],
        whenToSeeDoctor: "SEGERA — ini adalah potensi kedaruratan medis.",
        redFlags: [
            "Ini sendiri sudah merupakan red flag — segera cari pertolongan medis",
        ],
        explanation:
            "Nyeri dada yang disertai sesak nafas, berkeringat, atau menjalar ke lengan kiri/rahang bisa menjadi tanda serangan jantung atau kondisi serius lainnya yang memerlukan penanganan segera.",
        disclaimer:
            "DISCLAIMER PENTING: Platform ini TIDAK dapat mendiagnosis kondisi jantung. Jika kamu mengalami nyeri dada, SELALU anggap sebagai darurat dan segera cari bantuan medis.",
    },
    conjunctivitis: {
        conditions: ["Konjungtivitis (Mata Merah)", "Alergi Mata"],
        likelihood: "Kemungkinan sedang",
        urgency: "low",
        homeCare: [
            "Kompres mata dengan kain bersih yang dibasahi air hangat",
            "Cuci tangan sebelum dan sesudah menyentuh mata",
            "Hindari mengucek mata",
            "Jangan berbagi handuk, bantal, atau peralatan mandi",
            "Jika karena alergi: hindari pemicu (debu, serbuk bunga, dll)",
        ],
        whenToSeeDoctor:
            "Jika tidak membaik dalam 3-5 hari, ada gangguan penglihatan, nyeri hebat, atau keluarnya nanah yang banyak.",
        redFlags: [
            "Penurunan penglihatan mendadak",
            "Nyeri mata yang sangat hebat",
            "Benda asing yang tidak bisa dikeluarkan",
        ],
        explanation:
            "Mata merah (konjungtivitis) bisa disebabkan oleh infeksi bakteri, virus, atau alergi. Jenis yang infeksius sangat menular.",
        disclaimer:
            "Ini adalah estimasi berdasarkan gejala yang kamu inputkan, BUKAN diagnosis medis.",
    },
    uti: {
        conditions: ["Infeksi Saluran Kemih (ISK)", "Sistitis"],
        likelihood: "Kemungkinan sedang",
        urgency: "moderate",
        homeCare: [
            "Minum banyak air putih (minimal 2-3 liter/hari)",
            "Jangan menahan keinginan untuk buang air kecil",
            "Hindari kopi, alkohol, dan minuman berkarbonasi",
            "Kompres hangat di area perut bawah untuk mengurangi nyeri",
            "Jaga kebersihan area genital",
        ],
        whenToSeeDoctor:
            "Segera — ISK memerlukan antibiotik yang hanya bisa didapat dengan resep dokter. Jika ada demam tinggi, nyeri pinggang, atau darah dalam urin, perlu perhatian lebih cepat.",
        redFlags: [
            "Demam tinggi + nyeri pinggang (kemungkinan infeksi ginjal)",
            "Darah dalam urin",
            "Gejala pada pria (ISK jarang terjadi, perlu evaluasi lebih lanjut)",
        ],
        explanation:
            "ISK adalah infeksi pada sistem perkemihan, paling sering di kandung kemih. Lebih sering terjadi pada wanita. Gejala utama: rasa terbakar saat buang air kecil, sering BAK tapi sedikit, urin keruh.",
        disclaimer:
            "Ini adalah estimasi berdasarkan gejala yang kamu inputkan, BUKAN diagnosis medis.",
    },
    anxiety: {
        conditions: ["Kecemasan (Anxiety)", "Serangan Panik"],
        likelihood: "Kemungkinan sedang",
        urgency: "moderate",
        homeCare: [
            "Lakukan teknik pernapasan 4-7-8: hirup 4 detik, tahan 7 detik, hembuskan 8 detik",
            "Grounding technique: sebutkan 5 benda yang kamu lihat, 4 yang bisa kamu sentuh",
            "Hindari kafein dan alkohol",
            "Olahraga ringan secara rutin dapat membantu mengurangi kecemasan jangka panjang",
            "Pertimbangkan berbicara dengan orang yang dipercaya",
        ],
        whenToSeeDoctor:
            "Jika kecemasan mengganggu kehidupan sehari-hari, atau jika serangan panik terjadi sering. Psikolog atau psikiater dapat membantu.",
        redFlags: [
            "Pikiran menyakiti diri sendiri — segera hubungi 119 ext 8 (Into The Light Indonesia)",
            "Nyeri dada hebat yang mungkin bukan karena panik",
        ],
        explanation:
            "Serangan panik dan kecemasan adalah kondisi nyata yang mempengaruhi jutaan orang Indonesia. Gejalanya bisa sangat fisik (jantung berdebar, sesak nafas, gemetar) meskipun penyebabnya psikologis.",
        disclaimer:
            "Ini adalah estimasi berdasarkan gejala yang kamu inputkan, BUKAN diagnosis medis. Kesehatan mental sama pentingnya dengan kesehatan fisik.",
    },
};

// Decision tree structure
export const SYMPTOM_TREE = {
    head: {
        entryQuestion:
            "Di kepala atau wajah, gejala apa yang paling mengganggu kamu saat ini?",
        options: [
            {
                label: "Sakit kepala / kepala berat",
                next: {
                    question: "Sudah berapa lama sakit kepala ini berlangsung?",
                    options: [
                        {
                            label: "Baru muncul (< 24 jam)",
                            next: {
                                question: "Bagaimana sifat nyerinya?",
                                options: [
                                    {
                                        label: "Berdenyut, biasanya di satu sisi",
                                        next: {
                                            question:
                                                "Apakah disertai mual, muntah, atau sensitif terhadap cahaya/suara?",
                                            options: [
                                                {
                                                    label: "Ya, ada salah satunya",
                                                    result: CONDITIONS.migraine,
                                                },
                                                {
                                                    label: "Tidak ada",
                                                    result: CONDITIONS.tension_headache,
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        label: "Seperti tekanan/diikat di sekitar kepala",
                                        result: CONDITIONS.tension_headache,
                                    },
                                    {
                                        label: "Tiba-tiba sangat hebat (worst headache of my life)",
                                        result: {
                                            ...CONDITIONS.chest_emergency,
                                            conditions: [
                                                "Kemungkinan Kondisi Serius — Perlu Evaluasi Segera",
                                            ],
                                            explanation:
                                                'Sakit kepala "thunderclap" yang muncul tiba-tiba dan sangat hebat bisa menjadi tanda kondisi serius seperti perdarahan otak. Ini memerlukan evaluasi medis segera.',
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            label: "Sudah beberapa hari (1-3 hari)",
                            next: {
                                question:
                                    "Apakah ada demam atau gejala flu bersamaan?",
                                options: [
                                    {
                                        label: "Ya, ada demam/flu",
                                        result: CONDITIONS.flu,
                                    },
                                    {
                                        label: "Tidak ada",
                                        result: CONDITIONS.tension_headache,
                                    },
                                ],
                            },
                        },
                        {
                            label: "Sudah lebih dari 1 minggu berulang",
                            result: {
                                ...CONDITIONS.migraine,
                                urgency: "moderate",
                                whenToSeeDoctor:
                                    "Sakit kepala berulang > 1 minggu perlu evaluasi dokter untuk memastikan penyebabnya dan mendapatkan penanganan yang tepat.",
                            },
                        },
                    ],
                },
            },
            {
                label: "Mata merah / gatal / berair",
                result: CONDITIONS.conjunctivitis,
            },
            {
                label: "Hidung tersumbat / pilek / bersin-bersin",
                next: {
                    question: "Apakah disertai demam?",
                    options: [
                        { label: "Ya, ada demam", result: CONDITIONS.flu },
                        {
                            label: "Tidak ada demam",
                            result: {
                                ...CONDITIONS.conjunctivitis,
                                conditions: ["Rinitis Alergi", "Common Cold"],
                                explanation:
                                    "Hidung tersumbat tanpa demam sering disebabkan oleh alergi atau infeksi virus ringan (common cold). Biasanya akan membaik dalam 7-10 hari.",
                            },
                        },
                    ],
                },
            },
        ],
    },

    chest: {
        entryQuestion:
            "Gejala apa yang kamu rasakan di area dada atau pernapasan?",
        options: [
            {
                label: "Nyeri atau rasa tertekan di dada",
                next: {
                    question:
                        "Apakah nyeri dada disertai salah satu gejala berikut?",
                    options: [
                        {
                            label: "Sesak nafas + berkeringat / nyeri menjalar ke lengan/rahang",
                            result: CONDITIONS.chest_emergency,
                        },
                        {
                            label: "Jantung berdebar + gemetar + rasa panik mendadak",
                            result: CONDITIONS.anxiety,
                        },
                        {
                            label: "Nyeri memburuk saat makan atau berbaring",
                            result: CONDITIONS.gastritis,
                        },
                        {
                            label: "Nyeri saat batuk/bernafas dalam (bukan saat diam)",
                            result: {
                                conditions: [
                                    "Nyeri Muskuloskeletal Dada",
                                    "Pleuritis Ringan",
                                ],
                                likelihood: "Kemungkinan sedang",
                                urgency: "moderate",
                                homeCare: [
                                    "Istirahat dan hindari aktivitas berat",
                                    "Kompres hangat atau dingin",
                                    "Paracetamol/ibuprofen untuk nyeri",
                                ],
                                whenToSeeDoctor:
                                    "Jika nyeri sangat hebat, disertai demam tinggi, atau ada sesak nafas yang memburuk.",
                                redFlags: [
                                    "Sesak nafas progresif",
                                    "Demam tinggi + batuk berdarah",
                                ],
                                explanation:
                                    "Nyeri dada yang hanya muncul saat bergerak atau bernafas dalam biasanya berasal dari otot atau lapisan paru, bukan jantung.",
                                disclaimer:
                                    "Ini adalah estimasi, BUKAN diagnosis. Nyeri dada harus selalu dievaluasi oleh dokter.",
                            },
                        },
                    ],
                },
            },
            {
                label: "Batuk (kering atau berdahak)",
                next: {
                    question: "Sudah berapa lama batuk ini?",
                    options: [
                        {
                            label: "< 2 minggu",
                            result: CONDITIONS.flu,
                        },
                        {
                            label: "> 2 minggu, tidak membaik",
                            result: {
                                conditions: [
                                    "Kemungkinan Batuk Kronik — Perlu Evaluasi Dokter",
                                ],
                                likelihood: "Perlu pemeriksaan lebih lanjut",
                                urgency: "high",
                                homeCare: [
                                    "Minum banyak air",
                                    "Hindari asap rokok dan polusi",
                                    "Madu dan jahe hangat dapat membantu",
                                ],
                                whenToSeeDoctor:
                                    "Segera — batuk > 2 minggu yang tidak membaik harus dievaluasi untuk menyingkirkan TB paru dan kondisi serius lainnya.",
                                redFlags: [
                                    "Batuk berdarah",
                                    "Penurunan berat badan drastis",
                                    "Berkeringat malam",
                                ],
                                explanation:
                                    "Batuk kronik (> 2-3 minggu) yang tidak membaik memerlukan evaluasi dokter. Di Indonesia, TB paru harus selalu dipertimbangkan.",
                                disclaimer:
                                    "Ini adalah estimasi, BUKAN diagnosis. Segera konsultasikan ke dokter.",
                            },
                        },
                    ],
                },
            },
        ],
    },

    abdomen: {
        entryQuestion: "Gejala pencernaan apa yang paling mengganggu kamu?",
        options: [
            {
                label: "Mual dan/atau muntah",
                next: {
                    question: "Apakah disertai diare atau nyeri perut?",
                    options: [
                        { label: "Ya, ada diare", result: CONDITIONS.diarrhea },
                        {
                            label: "Ada nyeri ulu hati / perut atas",
                            result: CONDITIONS.gastritis,
                        },
                        {
                            label: "Hanya mual tanpa diare",
                            result: {
                                ...CONDITIONS.gastritis,
                                conditions: [
                                    "Mual (Nausea)",
                                    "Kemungkinan Gastritis Ringan",
                                ],
                                urgency: "low",
                            },
                        },
                    ],
                },
            },
            {
                label: "Nyeri perut",
                next: {
                    question: "Di mana lokasi nyerinya?",
                    options: [
                        {
                            label: "Ulu hati / perut atas",
                            result: CONDITIONS.gastritis,
                        },
                        {
                            label: "Perut kanan bawah (tiba-tiba dan memburuk)",
                            result: {
                                conditions: [
                                    "Kemungkinan Apendisitis (Usus Buntu)",
                                ],
                                likelihood: "Perlu evaluasi segera",
                                urgency: "emergency",
                                homeCare: [
                                    "JANGAN makan atau minum apapun",
                                    "Segera pergi ke IGD atau hubungi 119",
                                ],
                                whenToSeeDoctor:
                                    "SEGERA — kemungkinan apendisitis memerlukan tindakan bedah.",
                                redFlags: [
                                    "Ini sendiri adalah red flag — segera ke dokter",
                                ],
                                explanation:
                                    "Nyeri perut kanan bawah yang tiba-tiba dan semakin memburuk, terutama jika disertai demam dan mual, bisa jadi apendisitis yang memerlukan operasi segera.",
                                disclaimer:
                                    "DARURAT: Jangan tunda — segera cari pertolongan medis.",
                            },
                        },
                        {
                            label: "Perut tengah / bawah, disertai diare",
                            result: CONDITIONS.diarrhea,
                        },
                        {
                            label: "Perut kram saat menstruasi",
                            result: {
                                conditions: ["Dismenore (Nyeri Haid)"],
                                likelihood: "Kemungkinan tinggi",
                                urgency: "low",
                                homeCare: [
                                    "Kompres hangat di perut bawah",
                                    "Ibuprofen/asam mefenamat dapat membantu",
                                    "Olahraga ringan dan peregangan",
                                    "Istirahat cukup",
                                ],
                                whenToSeeDoctor:
                                    "Jika nyeri sangat hebat dan tidak membaik dengan obat, atau jika ada perdarahan abnormal.",
                                redFlags: [
                                    "Nyeri yang sangat hebat diluar kebiasaan",
                                    "Demam",
                                    "Keputihan berbau",
                                ],
                                explanation:
                                    "Nyeri haid (dismenore) sangat umum dan biasanya normal. Namun nyeri yang sangat berat bisa menjadi tanda endometriosis atau kondisi lain.",
                                disclaimer:
                                    "Ini adalah estimasi, BUKAN diagnosis.",
                            },
                        },
                    ],
                },
            },
            {
                label: "Diare / BAB cair",
                result: CONDITIONS.diarrhea,
            },
            {
                label: "Heartburn / sensasi terbakar di dada bawah",
                result: CONDITIONS.gastritis,
            },
        ],
    },

    general: {
        entryQuestion: "Gejala umum apa yang kamu rasakan di seluruh tubuh?",
        options: [
            {
                label: "Demam",
                next: {
                    question: "Sudah berapa lama demam ini?",
                    options: [
                        {
                            label: "< 3 hari, disertai gejala flu",
                            result: CONDITIONS.flu,
                        },
                        {
                            label: ">= 3 hari atau naik turun",
                            result: {
                                conditions: [
                                    "Demam Berkepanjangan — Perlu Evaluasi Dokter",
                                ],
                                likelihood: "Perlu pemeriksaan lebih lanjut",
                                urgency: "high",
                                homeCare: [
                                    "Perbanyak minum cairan",
                                    "Kompres hangat",
                                    "Paracetamol untuk menurunkan demam",
                                    "Pantau suhu setiap 4-6 jam",
                                ],
                                whenToSeeDoctor:
                                    "Segera — demam > 3 hari atau > 39°C yang tidak membaik memerlukan pemeriksaan darah untuk menyingkirkan demam berdarah, tifus, dan infeksi lainnya.",
                                redFlags: [
                                    "Bintik-bintik merah di kulit",
                                    "Mimisan",
                                    "Nyeri di belakang mata",
                                    "Penurunan kesadaran",
                                ],
                                explanation:
                                    "Demam berkepanjangan di Indonesia sering dikaitkan dengan demam berdarah dengue (DBD) atau demam tifoid, yang memerlukan pemeriksaan darah untuk diagnosis.",
                                disclaimer:
                                    "Ini adalah estimasi, BUKAN diagnosis. Segera ke dokter untuk pemeriksaan darah.",
                            },
                        },
                    ],
                },
            },
            {
                label: "Kelelahan ekstrem / lemas tidak bertenaga",
                result: {
                    conditions: [
                        "Kelelahan Fisik",
                        "Kemungkinan Anemia atau Gangguan Tiroid",
                    ],
                    likelihood: "Perlu evaluasi jika berkelanjutan",
                    urgency: "low",
                    homeCare: [
                        "Pastikan tidur 7-9 jam per malam",
                        "Makan makanan bergizi seimbang",
                        "Minum cukup air",
                        "Kurangi stres dan olahraga ringan secara rutin",
                    ],
                    whenToSeeDoctor:
                        "Jika kelelahan berlangsung > 2 minggu tanpa sebab yang jelas, atau disertai penurunan berat badan, pucat, atau sesak nafas.",
                    redFlags: [
                        "Kelelahan mendadak dengan nyeri dada",
                        "Pucat ekstrem",
                        "Sesak nafas saat istirahat",
                    ],
                    explanation:
                        "Kelelahan kronik bisa disebabkan oleh banyak hal: kurang tidur, anemia, hipotiroid, diabetes, atau kondisi lainnya. Pemeriksaan darah dapat membantu mengidentifikasi penyebabnya.",
                    disclaimer: "Ini adalah estimasi, BUKAN diagnosis.",
                },
            },
        ],
    },

    skin: {
        entryQuestion: "Masalah kulit apa yang kamu alami?",
        options: [
            {
                label: "Ruam merah atau bintik-bintik",
                next: {
                    question:
                        "Apakah disertai demam tinggi atau muncul tiba-tiba di banyak area?",
                    options: [
                        {
                            label: "Ya, ada demam + ruam muncul cepat",
                            result: {
                                conditions: [
                                    "Kemungkinan Reaksi Alergi Berat / Kondisi Serius",
                                ],
                                likelihood: "Perlu evaluasi segera",
                                urgency: "high",
                                homeCare: [
                                    "Segera ke dokter atau IGD jika ada sesak nafas atau ruam menyebar cepat",
                                ],
                                whenToSeeDoctor:
                                    "Segera — kombinasi demam + ruam tiba-tiba memerlukan evaluasi.",
                                redFlags: [
                                    "Ruam petekia (bintik merah yang tidak hilang saat ditekan) — bisa tanda DBD",
                                    "Sesak nafas + ruam (anafilaksis)",
                                ],
                                explanation:
                                    "Ruam yang muncul bersamaan dengan demam bisa menjadi tanda demam berdarah, campak, rubela, atau reaksi alergi yang memerlukan perhatian segera.",
                                disclaimer:
                                    "PERHATIAN: Segera cari bantuan medis jika ada sesak nafas atau ruam menyebar sangat cepat.",
                            },
                        },
                        {
                            label: "Tidak ada demam, gatal-gatal saja",
                            result: {
                                conditions: [
                                    "Urtikaria (Biduran)",
                                    "Dermatitis Kontak",
                                    "Alergi Kulit",
                                ],
                                likelihood: "Kemungkinan tinggi",
                                urgency: "low",
                                homeCare: [
                                    "Hindari garukan",
                                    "Identifikasi dan hindari pemicu (sabun baru, makanan, obat)",
                                    "Antihistamin OTC (cetirizine/loratadine) dapat meredakan gatal",
                                    "Kompres dingin untuk mengurangi gatal",
                                ],
                                whenToSeeDoctor:
                                    "Jika tidak membaik dalam 2-3 hari atau gatal sangat mengganggu aktivitas.",
                                redFlags: [
                                    "Bengkak di bibir atau tenggorokan",
                                    "Sesak nafas",
                                ],
                                explanation:
                                    "Biduran (urtikaria) adalah reaksi alergi kulit yang sangat umum, ditandai bentol merah yang gatal dan bisa muncul-hilang.",
                                disclaimer:
                                    "Ini adalah estimasi, BUKAN diagnosis.",
                            },
                        },
                    ],
                },
            },
            {
                label: "Luka atau lecet",
                result: {
                    conditions: ["Luka Terbuka / Lecet"],
                    likelihood: "Kondisi lokal",
                    urgency: "low",
                    homeCare: [
                        "Bersihkan luka dengan air mengalir dan sabun",
                        "Berikan antiseptik (betadine, alkohol 70%)",
                        "Tutup dengan perban bersih",
                        "Ganti perban setiap hari atau jika basah",
                    ],
                    whenToSeeDoctor:
                        "Jika luka dalam dan panjang (mungkin perlu jahitan), ada tanda infeksi (merah, hangat, bernanah, demam), atau luka akibat gigitan hewan.",
                    redFlags: [
                        "Perdarahan yang tidak berhenti setelah 10 menit tekanan",
                        "Luka akibat benda berkarat (risiko tetanus)",
                        "Gigitan hewan liar (risiko rabies)",
                    ],
                    explanation:
                        "Perawatan luka yang benar adalah kunci mencegah infeksi. Luka yang dalam, kotor, atau akibat gigitan hewan memerlukan evaluasi medis.",
                    disclaimer: "Ini adalah estimasi, BUKAN diagnosis.",
                },
            },
        ],
    },

    limbs: {
        entryQuestion: "Masalah apa yang kamu rasakan di anggota gerak?",
        options: [
            {
                label: "Nyeri sendi (lutut, pinggul, bahu, dll)",
                result: {
                    conditions: [
                        "Nyeri Sendi (Artralgia)",
                        "Kemungkinan Osteoartritis atau Asam Urat",
                    ],
                    likelihood: "Kemungkinan sedang",
                    urgency: "low",
                    homeCare: [
                        "Istirahatkan sendi yang sakit",
                        "Kompres es (nyeri akut) atau hangat (nyeri kronik)",
                        "Paracetamol atau ibuprofen untuk nyeri",
                        "Hindari aktivitas yang memperburuk nyeri",
                    ],
                    whenToSeeDoctor:
                        "Jika nyeri sangat hebat, sendi bengkak dan merah (kemungkinan asam urat), atau nyeri mengganggu aktivitas sehari-hari > 1 minggu.",
                    redFlags: [
                        "Sendi sangat merah, panas, bengkak tiba-tiba (asam urat akut)",
                        "Nyeri setelah trauma/cedera (kemungkinan fraktur atau robekan ligamen)",
                    ],
                    explanation:
                        "Nyeri sendi bisa disebabkan oleh banyak hal: asam urat (gout), osteoartritis, cedera, atau kondisi autoimun. Di Indonesia, asam urat sangat umum, terutama pada pria.",
                    disclaimer: "Ini adalah estimasi, BUKAN diagnosis.",
                },
            },
            {
                label: "Kram otot / pegal",
                result: {
                    conditions: ["Kram Otot", "Myalgia (Pegal Otot)"],
                    likelihood: "Kemungkinan tinggi",
                    urgency: "low",
                    homeCare: [
                        "Peregangan lembut pada otot yang kram",
                        "Kompres hangat",
                        "Minum cukup air dan elektrolit",
                        "Pijat lembut area yang kram",
                        "Pastikan asupan magnesium dan kalium cukup (pisang, kacang-kacangan)",
                    ],
                    whenToSeeDoctor:
                        "Jika kram sangat sering terjadi, sangat hebat, atau disertai bengkak dan kemerahan pada betis (risiko DVT).",
                    redFlags: [
                        "Betis merah, bengkak, dan nyeri saat ditekan (kemungkinan DVT — trombosis vena dalam)",
                        "Kelemahan otot progresif",
                    ],
                    explanation:
                        "Kram otot sering disebabkan oleh dehidrasi, kelelahan fisik, atau kekurangan elektrolit. Sangat umum dan biasanya tidak berbahaya.",
                    disclaimer: "Ini adalah estimasi, BUKAN diagnosis.",
                },
            },
        ],
    },
};

export default SYMPTOM_TREE;
