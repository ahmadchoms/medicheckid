<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SymptomLog;
use Illuminate\Support\Facades\DB;

class EpidemiologyController extends Controller
{
    /**
     * Store a new symptom log (called after AI check)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'city' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'symptoms_summary' => 'required|string',
            'conditions' => 'nullable|string',
            'urgency' => 'nullable|string'
        ]);

        $log = SymptomLog::create($validated);

        return response()->json(['message' => 'Log saved successfully', 'data' => $log], 201);
    }

    /**
     * Get aggregated data for the heatmap
     */
    public function getHeatmapData()
    {
        // Aggregate by city (fallback for those without exact coords)
        $cityStats = SymptomLog::select('city', DB::raw('count(*) as count'))
            ->whereNotNull('city')
            ->groupBy('city')
            ->orderByDesc('count')
            ->get();

        // Optional: raw data for coordinate-based plotting if 'latitude' and 'longitude' exist
        $coordinateStats = [];
        if (Schema::hasColumn('symptom_logs', 'latitude')) {
             $coordinateStats = SymptomLog::whereNotNull('latitude')
                 ->whereNotNull('longitude')
                 ->select('latitude', 'longitude', 'urgency', 'conditions')
                 ->get();
        }

        return response()->json([
            'cityStats' => $cityStats,
            'coordinateStats' => $coordinateStats
        ]);
    }
}
