export const SYMPTOM_AREAS = {
    head: { id: "head", label: "Kepala & Wajah", emoji: "🧠", color: "blue" },
    chest: {
        id: "chest",
        label: "Dada & Pernapasan",
        emoji: "🫁",
        color: "red",
    },
    abdomen: {
        id: "abdomen",
        label: "Perut & Pencernaan",
        emoji: "🫃",
        color: "yellow",
    },
    skin: { id: "skin", label: "Kulit", emoji: "🩹", color: "orange" },
    limbs: { id: "limbs", label: "Anggota Gerak", emoji: "🦵", color: "green" },
    general: {
        id: "general",
        label: "Umum / Seluruh Tubuh",
        emoji: "🌡️",
        color: "gray",
    },
};


export const SYMPTOM_TREE = {
    head: {
        question:
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
                                        analyze: true,
                                    },
                                    {
                                        label: "Seperti tekanan/diikat di sekitar kepala",
                                        analyze: true,
                                    },
                                    {
                                        label: "Tiba-tiba sangat hebat (worst headache of my life)",
                                        analyze: true,
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
                                        analyze: true,
                                    },
                                    { label: "Tidak ada", analyze: true },
                                ],
                            },
                        },
                        {
                            label: "Sudah lebih dari 1 minggu berulang",
                            analyze: true,
                        },
                    ],
                },
            },
            { label: "Mata merah / gatal / berair", analyze: true },
            {
                label: "Hidung tersumbat / pilek / bersin-bersin",
                next: {
                    question: "Apakah disertai demam?",
                    options: [
                        { label: "Ya, ada demam", analyze: true },
                        { label: "Tidak ada demam", analyze: true },
                    ],
                },
            },
        ],
    },

    chest: {
        question: "Gejala apa yang kamu rasakan di area dada atau pernapasan?",
        options: [
            {
                label: "Nyeri atau rasa tertekan di dada",
                next: {
                    question:
                        "Apakah nyeri dada disertai salah satu gejala berikut?",
                    options: [
                        {
                            label: "Sesak nafas + berkeringat / nyeri menjalar ke lengan/rahang",
                            analyze: true,
                        },
                        {
                            label: "Jantung berdebar + gemetar + rasa panik mendadak",
                            analyze: true,
                        },
                        {
                            label: "Nyeri memburuk saat makan atau berbaring",
                            analyze: true,
                        },
                        {
                            label: "Nyeri saat batuk/bernafas dalam (bukan saat diam)",
                            analyze: true,
                        },
                    ],
                },
            },
            {
                label: "Batuk (kering atau berdahak)",
                next: {
                    question: "Sudah berapa lama batuk ini?",
                    options: [
                        { label: "< 2 minggu", analyze: true },
                        { label: "> 2 minggu, tidak membaik", analyze: true },
                    ],
                },
            },
        ],
    },

    abdomen: {
        question: "Gejala pencernaan apa yang paling mengganggu kamu?",
        options: [
            {
                label: "Mual dan/atau muntah",
                next: {
                    question: "Apakah disertai diare atau nyeri perut?",
                    options: [
                        { label: "Ya, ada diare", analyze: true },
                        {
                            label: "Ada nyeri ulu hati / perut atas",
                            analyze: true,
                        },
                        { label: "Hanya mual tanpa diare", analyze: true },
                    ],
                },
            },
            {
                label: "Nyeri perut",
                next: {
                    question: "Di mana lokasi nyerinya?",
                    options: [
                        { label: "Ulu hati / perut atas", analyze: true },
                        {
                            label: "Perut kanan bawah (tiba-tiba dan memburuk)",
                            analyze: true,
                        },
                        {
                            label: "Perut tengah / bawah, disertai diare",
                            analyze: true,
                        },
                        { label: "Perut kram saat menstruasi", analyze: true },
                    ],
                },
            },
            { label: "Diare / BAB cair", analyze: true },
            {
                label: "Heartburn / sensasi terbakar di dada bawah",
                analyze: true,
            },
        ],
    },

    general: {
        question: "Gejala umum apa yang kamu rasakan di seluruh tubuh?",
        options: [
            {
                label: "Demam",
                next: {
                    question: "Sudah berapa lama demam ini?",
                    options: [
                        {
                            label: "< 3 hari, disertai gejala flu",
                            analyze: true,
                        },
                        { label: ">= 3 hari atau naik turun", analyze: true },
                    ],
                },
            },
            {
                label: "Kelelahan ekstrem / lemas tidak bertenaga",
                analyze: true,
            },
        ],
    },

    skin: {
        question: "Masalah kulit apa yang kamu alami?",
        options: [
            {
                label: "Ruam merah atau bintik-bintik",
                next: {
                    question:
                        "Apakah disertai demam tinggi atau muncul tiba-tiba di banyak area?",
                    options: [
                        {
                            label: "Ya, ada demam + ruam muncul cepat",
                            analyze: true,
                        },
                        {
                            label: "Tidak ada demam, gatal-gatal saja",
                            analyze: true,
                        },
                    ],
                },
            },
            { label: "Luka atau lecet", analyze: true },
        ],
    },

    limbs: {
        question: "Masalah apa yang kamu rasakan di anggota gerak?",
        options: [
            { label: "Nyeri sendi (lutut, pinggul, bahu, dll)", analyze: true },
            { label: "Kram otot / pegal", analyze: true },
        ],
    },
};

export default SYMPTOM_TREE;
