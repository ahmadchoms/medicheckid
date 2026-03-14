<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiAiService
{
    /**
     * Analyze symptoms using Gemini AI model.
     *
     * @param string $area
     * @param string $symptoms
     * @return array
     */
    public function analyzeSymptoms(string $area, string $symptoms): array
    {
        $apiKey = config('services.gemini.cek_gejala_key');
        
        if (!$apiKey) {
            return [
                'success' => false,
                'status' => 500,
                'data' => ['message' => 'API Key belum dikonfigurasi.']
            ];
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";
        
        // Prepare the prompt from config
        $template = config('ai-prompts.symptom_checker.system_instruction');
        $systemInstruction = str_replace(
            [':area', ':symptoms'], 
            [$area, $symptoms], 
            $template
        );

        try {
            $response = Http::timeout(45)->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $systemInstruction]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.2, // Low temperature for more deterministic JSON output
                    'response_mime_type' => 'application/json',
                ]
            ]);

            if ($response->successful()) {
                $responseData = $response->json();
                $generatedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
                
                return $this->parseJsonSafely($generatedText);
            }

            Log::error("Error dari API AI (Symptom Checker): " . $response->body());
            return [
                'success' => false,
                'status' => 500,
                'data' => ['message' => 'Gagal memproses analisis gejala dengan AI.']
            ];

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error("Connection timeout ke Gemini API: " . $e->getMessage());
            return [
                'success' => false,
                'status' => 504,
                'data' => ['message' => 'Koneksi ke layanan AI timeout. Silakan coba lagi.']
            ];
        } catch (\Exception $e) {
            Log::error("Exception GeminiAiService (analyzeSymptoms): " . $e->getMessage());
            return [
                'success' => false,
                'status' => 500,
                'data' => ['message' => 'Terjadi kesalahan internal pada server.']
            ];
        }
    }

    /**
     * Safely parse JSON from AI response, with fallback strategies.
     *
     * @param string $generatedText
     * @return array
     */
    private function parseJsonSafely(string $generatedText): array
    {
        // Strategy 1: Direct Decode
        $jsonResult = json_decode($generatedText, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($jsonResult)) {
            return [
                'success' => true,
                'status' => 200,
                'data' => $jsonResult
            ];
        }

        // Strategy 2: Remove potential markdown blocks and try again
        $cleanText = preg_replace('/```json|```/i', '', $generatedText);
        $jsonResult = json_decode(trim($cleanText), true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($jsonResult)) {
            return [
                'success' => true,
                'status' => 200,
                'data' => $jsonResult
            ];
        }

        // Strategy 3: Regex extract outermost JSON object
        if (preg_match('/\{(?:[^{}]|(?R))*\}/s', $generatedText, $matches)) {
            $jsonResult = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($jsonResult)) {
                return [
                    'success' => true,
                    'status' => 200,
                    'data' => $jsonResult
                ];
            }
        }
        
        // Strategy 4 (Fallback pattern matching - from original implementation)
        if (preg_match('/\{.*\}/s', $generatedText, $matches)) {
            $jsonResult = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($jsonResult)) {
                return [
                    'success' => true,
                    'status' => 200,
                    'data' => $jsonResult
                ];
            }
        }

        // Exhausted parsing strategies
        Log::error("Format JSON dari AI tidak valid: " . $generatedText . " | JSON Error: " . json_last_error_msg());
        
        return [
            'success' => false,
            'status' => 502, // Bad Gateway (invalid response from upstream AI)
            'data' => ['message' => 'AI mengembalikan format yang tidak dikenali/rusak.']
        ];
    }
}
