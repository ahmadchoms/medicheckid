<?php

namespace Database\Factories;

use App\Models\SymptomLog;
use Illuminate\Database\Eloquent\Factories\Factory;

class SymptomLogFactory extends Factory
{
    protected $model = SymptomLog::class;

    public function definition(): array
    {
        $cities = [
            // Jawa & Bali
            ['name' => 'Jakarta', 'lat' => -6.2088, 'lng' => 106.8456],
            ['name' => 'Surabaya', 'lat' => -7.2504, 'lng' => 112.7688],
            ['name' => 'Bandung', 'lat' => -6.9175, 'lng' => 107.6191],
            ['name' => 'Semarang', 'lat' => -6.9932, 'lng' => 110.4203],
            ['name' => 'Yogyakarta', 'lat' => -7.7956, 'lng' => 110.3695],
            ['name' => 'Malang', 'lat' => -7.9797, 'lng' => 112.6304],
            ['name' => 'Bogor', 'lat' => -6.5971, 'lng' => 106.7900],
            ['name' => 'Surakarta', 'lat' => -7.5666, 'lng' => 110.8283],
            ['name' => 'Denpasar', 'lat' => -8.6500, 'lng' => 115.2167],
            
            // Sumatra
            ['name' => 'Medan', 'lat' => 3.5952, 'lng' => 98.6722],
            ['name' => 'Palembang', 'lat' => -2.9909, 'lng' => 104.7566],
            ['name' => 'Padang', 'lat' => -0.9492, 'lng' => 100.3543],
            ['name' => 'Pekanbaru', 'lat' => 0.5028, 'lng' => 101.4474],
            ['name' => 'Bandar Lampung', 'lat' => -5.4500, 'lng' => 105.2667],
            ['name' => 'Banda Aceh', 'lat' => 5.5483, 'lng' => 95.3238],

            // Kalimantan
            ['name' => 'Balikpapan', 'lat' => -1.2379, 'lng' => 116.8529],
            ['name' => 'Samarinda', 'lat' => -0.5022, 'lng' => 117.1536],
            ['name' => 'Banjarmasin', 'lat' => -3.3167, 'lng' => 114.5901],
            ['name' => 'Pontianak', 'lat' => -0.0227, 'lng' => 109.3333],
            ['name' => 'Palangkaraya', 'lat' => -2.2083, 'lng' => 113.9167],

            // Sulawesi
            ['name' => 'Makassar', 'lat' => -5.1476, 'lng' => 119.4327],
            ['name' => 'Manado', 'lat' => 1.4815, 'lng' => 124.8455],
            ['name' => 'Palu', 'lat' => -0.8917, 'lng' => 119.8707],
            ['name' => 'Kendari', 'lat' => -3.9985, 'lng' => 122.5127],

            // Nusa Tenggara, Maluku, Papua
            ['name' => 'Mataram', 'lat' => -8.5833, 'lng' => 116.1167],
            ['name' => 'Kupang', 'lat' => -10.1583, 'lng' => 123.5973],
            ['name' => 'Ambon', 'lat' => -3.6954, 'lng' => 128.1814],
            ['name' => 'Ternate', 'lat' => 0.8000, 'lng' => 127.4000],
            ['name' => 'Jayapura', 'lat' => -2.5337, 'lng' => 140.7186],
            ['name' => 'Sorong', 'lat' => -0.8761, 'lng' => 131.2556],
        ];

        // Memilih kota acak menggunakan native PHP
        $city = $cities[array_rand($cities)];

        // Menghasilkan koordinat acak
        $latitude = $city['lat'] + (mt_rand(-15000, 15000) / 100000);
        $longitude = $city['lng'] + (mt_rand(-15000, 15000) / 100000);

        $urgencies = ['low', 'moderate', 'high', 'emergency'];

        $conditionsList = [
            'Demam tinggi (DBD), Trombosit menurun, Nyeri sendi',
            'Gejala mirip COVID-19, Batuk kering, Anosmia, Kelelahan',
            'Infeksi Saluran Pernapasan Akut (ISPA), Sesak napas',
            'Diare berat, Muntah, Risiko dehidrasi tinggi (Muntaber)',
            'Tifus (Demam Tifoid), Demam naik turun lebih dari 3 hari',
            'Keracunan makanan, Mual, Kram perut hebat',
            'Asma akut, Kesulitan bernapas, Mengi',
            'Gejala Malaria, Menggigil, Berkeringat dingin di malam hari',
            'Ruam kulit menyebar, Demam ringan (Suspek Campak/Cacar)',
            'Mata menguning, Lemas, Nyeri perut kanan atas (Hepatitis)',
            'Demam mendadak, Nyeri betis, Riwayat kontak dengan genangan air (Leptospirosis)',
            'Gejala mirip Mpox, Lesi kulit berair, Pembengkakan kelenjar getah bening',
            'Gatal hebat di malam hari, Ruam sela jari (Scabies/Kudis)'
        ];

        // Daftar kata acak untuk ringkasan gejala
        $symptomsWords = ['demam', 'pusing', 'mual', 'batuk kering', 'sesak napas', 'nyeri sendi', 'lemas', 'kedinginan', 'sakit tenggorokan', 'hilang penciuman'];
        $randomKeys = array_rand($symptomsWords, mt_rand(3, 6));
        $selectedSymptoms = array_intersect_key($symptomsWords, array_flip((array) $randomKeys));
        $symptomsSummary = ucfirst(implode(', ', $selectedSymptoms)) . '.';

        // Random waktu untuk 3 bulan terakhir (sekitar 90 hari)
        $randomTimestamp = mt_rand(strtotime('-3 months'), time());

        return [
            'city' => $city['name'],
            'latitude' => $latitude,
            'longitude' => $longitude,
            'symptoms_summary' => $symptomsSummary,
            'conditions' => $conditionsList[array_rand($conditionsList)],
            'urgency' => $urgencies[array_rand($urgencies)],
            'created_at' => date('Y-m-d H:i:s', $randomTimestamp),
            'updated_at' => now(),
        ];
    }
}