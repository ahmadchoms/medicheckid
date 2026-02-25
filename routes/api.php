<?php

use App\Http\Controllers\Api\AiSymptomCheckerController;
use Illuminate\Support\Facades\Route;

Route::post('/ai/symptom-check', [AiSymptomCheckerController::class, 'analyze'])
    ->middleware('throttle:10,1');
