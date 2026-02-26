<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HealthFacility;
use App\Models\Region; // Pastikan import model Region
use Illuminate\Http\Request;
use Inertia\Inertia;

class HealthFacilityController extends Controller
{
    public function index(Request $request)
    {
        // Eager load relasi regency agar nama wilayah muncul
        $query = HealthFacility::query()->with('regency');

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                // 1. Exact LIKE match (prioritas utama)
                $q->where('unit_kerja', 'like', '%' . $searchTerm . '%');
                
                // 2. SOUNDEX match untuk toleransi typo
                $words = preg_split('/\s+/', $searchTerm);
                foreach ($words as $word) {
                    if (strlen($word) >= 3) {
                        $q->orWhereRaw('SOUNDEX(unit_kerja) = SOUNDEX(?)', [$word]);
                    }
                }
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('city')) {
            $query->where('kode_kab', $request->city);
        }

        // Ambil daftar Kabupaten/Kota saja (kode_kec NULL) untuk filter di FE
        $cities = Region::whereNotNull('kode_kab')
            ->whereNull('kode_kec')
            ->orderBy('nama_wilayah', 'asc')
            ->get(['kode_kab as value', 'nama_wilayah as label']);

        return Inertia::render('faskes', [
            'facilities' => $query->paginate(20)->withQueryString(),
            'cities' => $cities, // Kirim daftar kota ke FE
            'filters' => $request->only(['search', 'type', 'city']),
        ]);
    }
}