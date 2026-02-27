<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HealthInsightController extends Controller
{
    /**
     * Fitur 1: Lab Result Explainer (Input Manual Dinamis)
     */
    public function analyzeLab(Request $request)
    {
        set_time_limit(120);

        $request->validate([
            'indicators' => 'required|array|min:1',
            'indicators.*.indicator' => 'required|string|max:100',
            'indicators.*.value' => 'required|string|max:100',
            'other_notes' => 'nullable|string|max:1000',
        ]);

        $indicators = $request->input('indicators');
        $otherNotes = $request->input('other_notes', '');

        $dataToAnalyze = [
            'hasil_laboratorium' => $indicators,
            'catatan_tambahan' => $otherNotes
        ];

        $systemInstruction = "Anda adalah asisten penjelas kesehatan AI. Analisis hasil lab berikut: " . json_encode($dataToAnalyze) . ". \n"
            . "PENTING: Jawab HANYA dalam format JSON. Jangan berikan diagnosis medis. Gunakan struktur eksak berikut:\n"
            . "{\n"
            . '  "disclaimer": "Ini adalah penjelasan berbasis AI untuk edukasi, BUKAN diagnosis medis.",' . "\n"
            . '  "summary": "Ringkasan kondisi umum berdasarkan angka lab tersebut dalam bahasa awam.",' . "\n"
            . '  "details": [{"indikator": "Nama Indikator", "penjelasan": "Penjelasan apakah angka normal/tinggi/rendah dan apa maknanya"}],' . "\n"
            . '  "identified_terms": ["Istilah Medis 1", "Istilah Medis 2"]' . "\n"
            . "}\n";

        return $this->callGeminiApi($systemInstruction);
    }

    /**
     * Fitur 2: Document Explainer (Upload File)
     */
    public function simplifyDoc(Request $request)
    {
        set_time_limit(120);

        $request->validate([
            'document_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $file = $request->file('document_file');

        $systemInstruction = "Anda adalah asisten dokter AI spesialis pembaca dokumen medis. Saya melampirkan file dokumen hasil laboratorium / medis. "
            . "Tugas Anda secara berurutan:\n"
            . "1. Identifikasi JENIS dokumen/tes apa ini.\n"
            . "2. Ekstrak nilai-nilai yang ada beserta statusnya.\n"
            . "3. Jelaskan arti hasil tersebut SESUAI dengan konteks jenis tesnya dalam bahasa awam.\n"
            . "PENTING: Jawab HANYA dalam format JSON. Jangan berikan diagnosis. Gunakan struktur eksak berikut:\n"
            . "{\n"
            . '  "disclaimer": "Analisis file ini dihasilkan oleh AI untuk edukasi, BUKAN pengganti diagnosis dokter.",' . "\n"
            . '  "document_type": "Jenis Dokumen (misal: Laporan Tes Darah Rutin)",' . "\n"
            . '  "summary": "Ringkasan keseluruhan hasil dokumen ini dalam 2-3 paragraf pendek.",' . "\n"
            . '  "indicators": [{"nama": "Nama Indikator", "nilai": "Nilai / Hasil pasien", "status": "Normal / Tinggi / Rendah / Abnormal", "penjelasan": "Penjelasan singkat indikator ini"}],' . "\n"
            . '  "key_points": ["Kesimpulan penting 1", "Kesimpulan penting 2"],' . "\n"
            . '  "identified_terms": ["Istilah Medis 1", "Istilah Medis 2"]' . "\n"
            . "}\n"
            . "Catatan: Jika dokumen berupa narasi, kosongkan array 'indicators' dan fokus pada 'key_points'.";

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
     * Helper Method: Pemanggilan AI yang Diperkuat
     */
    private function callGeminiApi(string $systemInstruction, $file = null)
    {
        $apiKey = config('services.gemini.health_insight_key');
        if (!$apiKey) return response()->json(['message' => 'API Key belum dikonfigurasi.'], 500);

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";
        $parts = [['text' => $systemInstruction]];

        if ($file) {
            $parts[] = [
                'inline_data' => [
                    'mime_type' => $file->getMimeType(),
                    'data' => base64_encode(file_get_contents($file->getPathname()))
                ]
            ];
            $parts[] = ['text' => "\n\nIni adalah file dokumen/hasil labnya. Tolong analisis dan keluarkan dalam format JSON."];
        }

        try {
            $response = Http::timeout(60)->post($url, [
                'contents' => [['parts' => $parts]],
                'generationConfig' => [
                    'temperature' => 0.1,
                    'response_mime_type' => 'application/json',
                ]
            ]);

            if ($response->successful()) {
                $generatedText = $response->json('candidates.0.content.parts.0.text') ?? '{}';

                $generatedText = preg_replace('/```json|```/', '', $generatedText);
                if (preg_match('/\{.*\}/s', $generatedText, $matches)) {
                    $generatedText = $matches[0];
                }

                $jsonResult = json_decode($generatedText, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    return response()->json($jsonResult);
                }

                Log::error("Format JSON dari AI rusak: " . $generatedText);
                return response()->json(['message' => 'AI mengembalikan format yang tidak valid.'], 500);
            }

            Log::error("Error dari API AI: " . $response->body());
            return response()->json(['message' => 'Gagal memproses data dengan AI.'], 500);
        } catch (\Exception $e) {
            Log::error("Exception HealthInsightApiController: " . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan server saat menghubungi AI.'], 500);
        }
    }
}
