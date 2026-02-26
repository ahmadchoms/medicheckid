<?php

use App\Http\Controllers\Api\HealthFacilityController;
use App\Http\Controllers\Api\HealthInsightController;
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

Route::get('/fasilitas-kesehatan', [HealthFacilityController::class, 'index'])->name('faskes.index');

Route::get('/admin/epidemiology', function () {
    return Inertia::render('admin-epidemiology');
})->name('admin.epidemiology');

// Route untuk render halaman (di web.php)
Route::get('/health-insight', function () {
    return Inertia::render('health-insight');
})->name('health-insight.index');

// Routes untuk API (bisa di web.php atau api.php)
Route::post('/health-insight/lab', [HealthInsightController::class, 'analyzeLab']);
Route::post('/health-insight/doc', [HealthInsightController::class, 'simplifyDoc']);
Route::post('/health-insight/term', [HealthInsightController::class, 'explainTerm']);