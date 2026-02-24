<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Region;
use Illuminate\Support\Facades\File;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $this->importWilayah('wilayah_administratif.csv');
    }

    private function importWilayah($filename)
    {
        $filePath = database_path('seeders/data/' . $filename);
        
        if (!File::exists($filePath)) {
            $this->command->error("File {$filename} tidak ditemukan di database/seeders/data/");
            return;
        }

        $file = fopen($filePath, 'r');
        $header = fgetcsv($file); // Skip header

        $data = [];
        $batchSize = 500;
        $totalImported = 0;

        $this->command->info("Sedang mengimport data wilayah...");

        while (($row = fgetcsv($file)) !== false) {
            // Logika konversi string "NULL" menjadi null asli PHP
            $data[] = [
                'kode_prov'    => ($row[0] === 'NULL' || $row[0] === '') ? null : $row[0],
                'kode_kab'     => ($row[1] === 'NULL' || $row[1] === '') ? null : $row[1],
                'kode_kec'     => ($row[2] === 'NULL' || $row[2] === '') ? null : $row[2],
                'nama_wilayah' => $row[3] ?? null,
                'created_at'   => now(),
                'updated_at'   => now(),
            ];

            // Insert per batch agar hemat memori
            if (count($data) >= $batchSize) {
                Region::insert($data);
                $totalImported += count($data);
                $data = [];
            }
        }

        // Insert sisa data jika ada
        if (!empty($data)) {
            $totalImported += count($data);
            Region::insert($data);
        }

        fclose($file);
        $this->command->info("Total {$totalImported} data wilayah berhasil diimport!");
    }
}