<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\GeminiAiService;

class AiSymptomCheckerController extends Controller
{
    /**
     * @var GeminiAiService
     */
    protected $aiService;

    public function __construct(GeminiAiService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function analyze(Request $request)
    {
        $request->validate([
            'area' => 'required|string',
            'symptoms' => 'required|string|max:1000',
        ]);

        $area = $request->input('area');
        $symptoms = $request->input('symptoms');

        $result = $this->aiService->analyzeSymptoms($area, $symptoms);

        if ($result['success']) {
            return response()->json($result['data'], $result['status']);
        } else {
            return response()->json($result['data'], $result['status']);
        }
    }
}
