<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SymptomLog;

class SymptomLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        SymptomLog::factory()->count(1253)->create();
    }
}