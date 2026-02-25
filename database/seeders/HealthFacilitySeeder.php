<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HealthFacility;
use Illuminate\Support\Facades\File;

class HealthFacilitySeeder extends Seeder
{
    public function run(): void
    {
        // Import Rumah Sakit
        $this->importData('rumah_sakit_dummy.csv', 'rumah_sakit');
        
        // Import Puskesmas
        $this->importData('puskesmas_dummy.csv', 'puskesmas');
    }

    private function importData($filename, $type)
    {
        $filePath = database_path('seeders/data/' . $filename);
        
        if (!File::exists($filePath)) {
            $this->command->error("File {$filename} tidak ditemukan di database/seeders/data/");
            return;
        }

        $file = fopen($filePath, 'r');
        $header = fgetcsv($file); // Skip baris pertama (header)

        $data = [];
        $count = 0;

        while (($row = fgetcsv($file)) !== false) {
            $data[] = [
                'kode_kab'      => $row[0] ?? null,
                'kode_instansi' => $row[1] ?? null,
                'unit_kerja'    => $row[2] ?? null,
                'email'         => $row[3] ?? null,
                'telp'          => $row[4] ?? null,
                'type'          => $type,
                'created_at'    => now(),
                'updated_at'    => now(),
            ];

            // Insert per 500 baris agar memori tidak penuh
            if (count($data) >= 500) {
                HealthFacility::insert($data);
                $data = [];
            }
        }

        // Insert sisa data
        if (!empty($data)) {
            HealthFacility::insert($data);
        }

        fclose($file);
        $this->command->info("Data {$type} berhasil diimport!");
    }
}   