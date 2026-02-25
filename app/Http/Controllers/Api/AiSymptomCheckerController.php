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
        // 1. Validasi input dari React
        $request->validate([
            'area' => 'required|string',
            'symptoms' => 'required|string|max:1000',
        ]);

        $area = $request->input('area');
        $symptoms = $request->input('symptoms');

        // 2. Siapkan API Key dan URL
        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json(['message' => 'API Key belum dikonfigurasi.'], 500);
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        // 3. Prompt Sistem agar output 100% JSON sesuai format React
        $systemInstruction = "Anda adalah asisten dokter AI. Analisis gejala pengguna di area tubuh: '{$area}'. Keluhan pengguna: '{$symptoms}'. "
            . "PENTING: Jawab HANYA dalam format JSON. Jangan gunakan block markdown (```json). Gunakan struktur eksak berikut:\n"
            . "{\n"
            . '  "conditions": ["Nama Penyakit 1", "Penyakit 2"],'."\n"
            . '  "likelihood": "Sangat Tinggi / Tinggi / Sedang / Rendah",'."\n"
            . '  "urgency": "low",'."\n"
            . '  "homeCare": ["Langkah 1", "Langkah 2", "Langkah 3"],'."\n"
            . '  "whenToSeeDoctor": "Kapan harus menemui dokter",'."\n"
            . '  "redFlags": ["Tanda bahaya 1", "Tanda bahaya 2"],'."\n"
            . '  "explanation": "Penjelasan medis singkat dalam bahasa Indonesia yang mudah dipahami (maksimal 3 kalimat).",'."\n"
            . '  "disclaimer": "Ini adalah estimasi berbasis AI, BUKAN diagnosis medis."'."\n"
            . "}\n"
            . "Catatan Penting: Value untuk key 'urgency' HANYA boleh diisi dengan salah satu string ini: 'low', 'moderate', 'high', atau 'emergency'.";

        try {
            // 4. Request ke Gemini API
            $response = Http::timeout(15)->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $systemInstruction]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.2, // Rendah agar output stabil
                    'response_mime_type' => 'application/json', // Memaksa format JSON
                ]
            ]);

            // 5. Tangani Response
            if ($response->successful()) {
                $responseData = $response->json();
                
                // Ambil string dari response Gemini
                $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
                
                // Decode ke array untuk memastikan JSON tidak rusak
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

        } catch (\Exception $e) {
            Log::error("Exception AiSymptomChecker: " . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan pada server.'], 500);
        }
    }
}