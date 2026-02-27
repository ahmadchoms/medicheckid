<?php

use App\Http\Controllers\Api\AiSymptomCheckerController;
use App\Http\Controllers\Api\EpidemiologyController;
use App\Http\Controllers\Api\HealthInsightController;
use Illuminate\Support\Facades\Route;

Route::post('/ai/symptom-check', [AiSymptomCheckerController::class, 'analyze'])
    ->middleware('throttle:10,1');

Route::prefix('epidemiology')->group(function () {
    Route::post('/log', [EpidemiologyController::class, 'store']);
    Route::get('/heatmap', [EpidemiologyController::class, 'getHeatmapData']);
});

Route::prefix('/health-insight')->group(function () {
    Route::post('/lab', [HealthInsightController::class, 'analyzeLab']);
    Route::post('/doc', [HealthInsightController::class, 'simplifyDoc']);
    Route::post('/term', [HealthInsightController::class, 'explainTerm']);
});
