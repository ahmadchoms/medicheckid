// resources/js/lib/healthScore.js
// ── Health Score Dimensions & Calculation ────────────────

export const DIMENSIONS = [
    {
        id: "sleep",
        label: "Tidur & Istirahat",
        emoji: "🌙",
        color: "blue",
        weight: 0.2,
        questions: [
            {
                id: "sleep_duration",
                text: "Berapa jam rata-rata kamu tidur per malam?",
                type: "choice",
                options: [
                    { label: "Kurang dari 5 jam", value: 20 },
                    { label: "5–6 jam", value: 50 },
                    { label: "6–7 jam", value: 75 },
                    { label: "7–8 jam", value: 100 },
                    { label: "Lebih dari 9 jam", value: 70 },
                ],
            },
            {
                id: "sleep_quality",
                text: "Bagaimana kualitas tidur kamu secara umum?",
                type: "choice",
                options: [
                    { label: "Sangat buruk — sering terbangun", value: 20 },
                    { label: "Kurang baik — tidak nyenyak", value: 40 },
                    { label: "Biasa saja", value: 60 },
                    { label: "Baik — cukup nyenyak", value: 80 },
                    { label: "Sangat baik — langsung pulas", value: 100 },
                ],
            },
        ],
    },
    {
        id: "activity",
        label: "Aktivitas Fisik",
        emoji: "🏃",
        color: "green",
        weight: 0.2,
        questions: [
            {
                id: "exercise_freq",
                text: "Berapa kali kamu berolahraga dalam seminggu?",
                type: "choice",
                options: [
                    { label: "Tidak pernah", value: 10 },
                    { label: "1–2 kali", value: 40 },
                    { label: "3–4 kali", value: 75 },
                    { label: "5+ kali", value: 100 },
                ],
            },
            {
                id: "exercise_duration",
                text: "Berapa lama tiap sesi olahraga kamu?",
                type: "choice",
                options: [
                    { label: "Kurang dari 15 menit", value: 25 },
                    { label: "15–30 menit", value: 50 },
                    { label: "30–60 menit", value: 85 },
                    { label: "Lebih dari 60 menit", value: 100 },
                ],
            },
        ],
    },
    {
        id: "nutrition",
        label: "Nutrisi & Makan",
        emoji: "🥗",
        color: "yellow",
        weight: 0.2,
        questions: [
            {
                id: "fruit_veg",
                text: "Berapa porsi buah/sayur yang kamu konsumsi sehari?",
                type: "choice",
                options: [
                    { label: "Hampir tidak pernah", value: 15 },
                    { label: "1–2 porsi", value: 45 },
                    { label: "3–4 porsi", value: 75 },
                    { label: "5+ porsi", value: 100 },
                ],
            },
            {
                id: "processed_food",
                text: "Seberapa sering kamu makan makanan olahan/fast food?",
                type: "choice",
                options: [
                    { label: "Hampir setiap hari", value: 15 },
                    { label: "3–4 kali seminggu", value: 40 },
                    { label: "1–2 kali seminggu", value: 70 },
                    { label: "Jarang / tidak pernah", value: 100 },
                ],
            },
        ],
    },
    {
        id: "hydration",
        label: "Hidrasi",
        emoji: "💧",
        color: "blue",
        weight: 0.1,
        questions: [
            {
                id: "water_intake",
                text: "Berapa gelas air putih yang kamu minum per hari?",
                type: "choice",
                options: [
                    { label: "Kurang dari 4 gelas", value: 20 },
                    { label: "4–6 gelas", value: 50 },
                    { label: "6–8 gelas", value: 80 },
                    { label: "8+ gelas", value: 100 },
                ],
            },
        ],
    },
    {
        id: "stress",
        label: "Stres & Mental",
        emoji: "🧠",
        color: "orange",
        weight: 0.2,
        questions: [
            {
                id: "stress_level",
                text: "Seberapa tinggi tingkat stres kamu dalam sebulan terakhir?",
                type: "range",
                min: 1,
                max: 10,
            },
            {
                id: "mental_wellbeing",
                text: "Seberapa sering kamu merasa cemas, sedih, atau kewalahan?",
                type: "choice",
                options: [
                    { label: "Setiap hari", value: 15 },
                    { label: "Beberapa kali seminggu", value: 35 },
                    { label: "Kadang-kadang", value: 60 },
                    { label: "Jarang", value: 85 },
                    { label: "Hampir tidak pernah", value: 100 },
                ],
            },
        ],
    },
    {
        id: "social",
        label: "Sosial & Komunitas",
        emoji: "👥",
        color: "green",
        weight: 0.1,
        questions: [
            {
                id: "social_connection",
                text: "Seberapa sering kamu menghabiskan waktu berkualitas dengan keluarga/teman?",
                type: "choice",
                options: [
                    { label: "Hampir tidak pernah", value: 15 },
                    { label: "Beberapa kali sebulan", value: 40 },
                    { label: "1–2 kali seminggu", value: 70 },
                    { label: "Hampir setiap hari", value: 100 },
                ],
            },
        ],
    },
];

/**
 * Calculate health score from user answers.
 * @param {Object} answers - { questionId: value }
 * @returns {{ aggregate: number, dimensions: { [dimId]: number } }}
 */
export function calculateHealthScore(answers) {
    const dimensions = {};

    for (const dim of DIMENSIONS) {
        const questionScores = dim.questions.map((q) => {
            const val = answers[q.id];
            if (val === undefined) return 50; // default
            if (q.type === "range") {
                // For stress, invert the scale (high stress = low score)
                if (q.id.includes("stress")) {
                    return Math.round(((q.max - val) / (q.max - q.min)) * 100);
                }
                return Math.round(((val - q.min) / (q.max - q.min)) * 100);
            }
            return val;
        });
        const dimScore = Math.round(
            questionScores.reduce((a, b) => a + b, 0) / questionScores.length,
        );
        dimensions[dim.id] = dimScore;
    }

    // Weighted aggregate
    const aggregate = Math.round(
        DIMENSIONS.reduce((sum, dim) => {
            return sum + (dimensions[dim.id] || 0) * dim.weight;
        }, 0),
    );

    return { aggregate, dimensions };
}

/**
 * Get grade based on aggregate score.
 */
export function getScoreGrade(score) {
    if (score >= 85) {
        return {
            grade: "A",
            label: "Sangat Baik",
            color: "green",
            message:
                "Gaya hidup kamu sangat sehat! Pertahankan kebiasaan baik ini.",
        };
    }
    if (score >= 70) {
        return {
            grade: "B",
            label: "Baik",
            color: "blue",
            message:
                "Kesehatan kamu sudah baik. Ada beberapa area yang bisa ditingkatkan.",
        };
    }
    if (score >= 55) {
        return {
            grade: "C",
            label: "Cukup",
            color: "yellow",
            message:
                "Ada ruang untuk perbaikan. Fokus pada area yang paling lemah.",
        };
    }
    if (score >= 35) {
        return {
            grade: "D",
            label: "Perlu Perbaikan",
            color: "orange",
            message:
                "Gaya hidup kamu membutuhkan perhatian serius di beberapa area.",
        };
    }
    return {
        grade: "F",
        label: "Kritis",
        color: "red",
        message:
            "Perlu perubahan signifikan. Pertimbangkan untuk berkonsultasi dengan profesional kesehatan.",
    };
}

/**
 * Get the N weakest dimensions.
 */
export function getWeakestDimensions(dimensionScores, n = 2) {
    return DIMENSIONS.map((d) => ({
        ...d,
        score: dimensionScores[d.id] || 0,
    }))
        .sort((a, b) => a.score - b.score)
        .slice(0, n);
}
