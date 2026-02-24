<?php

use App\Http\Controllers\Api\AiSymptomCheckerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
});

Route::get('/cek-gejala', function () {
    return Inertia::render('cek-gejala');
});

Route::get('/health-score', function () {
    return Inertia::render('health-score');
});

Route::get('/p3k', function () {
    return Inertia::render('p3k');
});

Route::get('/faskes', function () {
    return Inertia::render('faskes');
});

Route::post('/ai/symptom-check', [AiSymptomCheckerController::class, 'analyze']);