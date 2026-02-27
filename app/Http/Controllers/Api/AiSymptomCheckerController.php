<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiSymptomCheckerController extends Controller
{
    public function analyze(Request $request)
    {
        set_time_limit(120);

        $request->validate([
            'area' => 'required|string',
            'symptoms' => 'required|string|max:1000',
        ]);

        $area = $request->input('area');
        $symptoms = $request->input('symptoms');

        $apiKey = config('services.gemini.cek_gejala_key');
        if (!$apiKey) {
            return response()->json(['message' => 'API Key belum dikonfigurasi.'], 500);
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        $systemInstruction = "Anda adalah asisten dokter AI. Analisis gejala pengguna di area tubuh: '{$area}'. Keluhan pengguna: '{$symptoms}'. "
            . "PENTING: Jawab HANYA dalam format JSON. Jangan gunakan block markdown (```json). Gunakan struktur eksak berikut:\n"
            . "{\n"
            . '  "conditions": ["Nama Penyakit 1", "Penyakit 2"],' . "\n"
            . '  "likelihood": "Sangat Tinggi / Tinggi / Sedang / Rendah",' . "\n"
            . '  "urgency": "low",' . "\n"
            . '  "homeCare": ["Langkah 1", "Langkah 2", "Langkah 3"],' . "\n"
            . '  "whenToSeeDoctor": "Kapan harus menemui dokter",' . "\n"
            . '  "redFlags": ["Tanda bahaya 1", "Tanda bahaya 2"],' . "\n"
            . '  "explanation": "Penjelasan medis singkat dalam bahasa Indonesia yang mudah dipahami (maksimal 3 kalimat).",' . "\n"
            . '  "localLanguageNote": "Jika input terdeteksi bahasa daerah (misal Sunda, Jawa dll), isikan penjelasan ramah dan simpatik pendek terjemahannya di sini. Jika tidak ada bahasa daerah, kosongkan / isi string kosong.",' . "\n"
            . '  "disclaimer": "Ini adalah estimasi berbasis AI, BUKAN diagnosis medis."' . "\n"
            . "}\n"
            . "Catatan Penting: Value untuk key 'urgency' HANYA boleh diisi dengan salah satu string ini: 'low', 'moderate', 'high', atau 'emergency'.";

        try {
            $response = Http::timeout(30)->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $systemInstruction]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.2,
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
            return response()->json(['message' => 'Gagal memproses analisis gejala dengan AI.'], 500);
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error("Connection timeout ke Gemini API: " . $e->getMessage());
            return response()->json(['message' => 'Koneksi ke layanan AI timeout. Silakan coba lagi.'], 504);
        } catch (\Exception $e) {
            Log::error("Exception AiSymptomChecker: " . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan pada server.'], 500);
        }
    }
}
