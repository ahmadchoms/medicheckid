<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HealthInsightController extends Controller
{
    /**
     * Fitur 1: Lab Result Explainer (Input Manual)
     */
    public function analyzeLab(Request $request)
    {
        set_time_limit(120);
        $request->validate([
            'hba1c' => 'nullable|numeric',
            'ldl' => 'nullable|numeric',
            'blood_pressure' => 'nullable|string|max:20',
            'other_notes' => 'nullable|string|max:500',
        ]);

        $data = $request->only(['hba1c', 'ldl', 'blood_pressure', 'other_notes']);
        if (empty(array_filter($data))) {
            return response()->json(['message' => 'Silakan isi setidaknya satu data laboratorium.'], 400);
        }

        $systemInstruction = "Anda adalah asisten penjelas kesehatan AI. Analisis hasil lab berikut: " . json_encode($data) . ". "
            . "PENTING: Jawab HANYA dalam format JSON. Jangan berikan diagnosis medis. Gunakan struktur eksak berikut:\n"
            . "{\n"
            . '  "disclaimer": "Ini adalah penjelasan berbasis AI untuk edukasi, BUKAN diagnosis medis.",' . "\n"
            . '  "summary": "Ringkasan kondisi umum berdasarkan angka lab tersebut dalam bahasa awam.",' . "\n"
            . '  "details": [{"indikator": "Nama Indikator", "penjelasan": "Penjelasan apakah angka normal/tinggi/rendah"}],' . "\n"
            . '  "identified_terms": ["Istilah Medis 1", "Istilah Medis 2"]' . "\n"
            . "}\n";

        return $this->callGeminiApi($systemInstruction);
    }

    /**
     * Fitur 2: Document Explainer (Upload File Hasil Lab yang Kontekstual)
     */
    public function simplifyDoc(Request $request)
    {
        set_time_limit(120);

        $request->validate([
            'document_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $file = $request->file('document_file');

        // PROMPT BARU: Memaksa AI memahami konteks dokumen terlebih dahulu
        $systemInstruction = "Anda adalah asisten dokter AI spesialis pembaca dokumen medis. Saya melampirkan file dokumen hasil laboratorium / medis. "
            . "Tugas Anda secara berurutan:\n"
            . "1. Identifikasi JENIS dokumen/tes apa ini (misal: Tes Darah Rutin, Profil Kolesterol, Urinalisis, Hasil Rontgen, dll).\n"
            . "2. Ekstrak nilai-nilai yang ada beserta statusnya (apakah normal, tinggi, rendah, atau abnormal).\n"
            . "3. Jelaskan apa arti hasil tersebut SESUAI dengan konteks jenis tesnya dalam bahasa awam yang sangat sederhana.\n"
            . "PENTING: Jawab HANYA dalam format JSON. Jangan berikan diagnosis atau resep obat. Gunakan struktur eksak berikut:\n"
            . "{\n"
            . '  "disclaimer": "Analisis file ini dihasilkan oleh AI untuk edukasi, BUKAN pengganti diagnosis dokter.",' . "\n"
            . '  "document_type": "Jenis Dokumen (misal: Laporan Tes Darah Rutin)",' . "\n"
            . '  "summary": "Ringkasan keseluruhan hasil dokumen ini dalam 2-3 paragraf pendek.",' . "\n"
            . '  "indicators": [{"nama": "Nama Indikator", "nilai": "Nilai / Hasil pasien", "status": "Normal / Tinggi / Rendah / Abnormal", "penjelasan": "Penjelasan singkat indikator ini"}],' . "\n"
            . '  "key_points": ["Kesimpulan penting 1", "Kesimpulan penting 2"],' . "\n"
            . '  "identified_terms": ["Istilah Medis 1", "Istilah Medis 2"]' . "\n"
            . "}\n"
            . "Catatan: Jika dokumen berupa narasi (seperti hasil rontgen) dan tidak ada angka/indikator spesifik, kosongkan array 'indicators' dan fokus pada 'key_points'.";

        return $this->callGeminiApi($systemInstruction, $file);
    }

    /**
     * Fitur 3: Health Literacy Booster (Term Explainer)
     */
    public function explainTerm(Request $request)
    {
        set_time_limit(60);
        $request->validate(['term' => 'required|string|max:100']);
        $term = $request->input('term');

        $systemInstruction = "Anda adalah kamus istilah medis AI. Jelaskan istilah medis berikut: '{$term}'. "
            . "PENTING: Jawab HANYA dalam format JSON. Gunakan struktur eksak berikut:\n"
            . "{\n"
            . '  "term": "' . $term . '",' . "\n"
            . '  "explanation": "Penjelasan istilah tersebut dalam 2-3 kalimat sederhana."' . "\n"
            . "}\n";

        return $this->callGeminiApi($systemInstruction);
    }

    /**
     * Helper Method untuk request ke Gemini API (Mendukung Teks & File)
     */
    private function callGeminiApi(string $systemInstruction, $file = null)
    {
        $apiKey = config('services.gemini.key');
        if (!$apiKey) return response()->json(['message' => 'API Key belum dikonfigurasi.'], 500);

         $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        $parts = [['text' => $systemInstruction]];

        if ($file) {
            $mimeType = $file->getMimeType();
            $base64Data = base64_encode(file_get_contents($file->getPathname()));
            
            array_push($parts, [
                'inline_data' => [
                    'mime_type' => $mimeType,
                    'data' => $base64Data
                ]
            ]);
            array_push($parts, ['text' => "\n\nIni adalah file dokumen/hasil labnya. Tolong analisis dan keluarkan dalam format JSON yang diminta."]);
        }

        try {
            $response = Http::timeout(45)->post($url, [
                'contents' => [['parts' => $parts]],
                'generationConfig' => [
                    'temperature' => 0.2, // Rendah agar analisis lab akurat dan tidak melenceng
                    'response_mime_type' => 'application/json',
                ]
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '{}';

                if (preg_match('/\{.*\}/s', $generatedText, $matches)) {
                    $generatedText = $matches[0];
                }

                $jsonResult = json_decode($generatedText, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    return response()->json($jsonResult);
                } else {
                    Log::error("Format JSON dari AI tidak valid: " . $generatedText);
                    return response()->json(['message' => 'AI mengembalikan format yang tidak dikenali.'], 500);
                }
            }
            Log::error("Error dari API AI: " . $response->body());
            return response()->json(['message' => 'Gagal memproses data dengan AI.'], 500);

        } catch (\Exception $e) {
            Log::error("Exception HealthInsightApiController: " . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan pada server saat menghubungi AI.'], 500);
        }
    }
}