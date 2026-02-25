<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('health_facilities', function (Blueprint $table) {
            $table->id();
            $table->string('kode_kab')->nullable();
            $table->string('kode_instansi')->nullable();
            $table->string('unit_kerja')->nullable();
            $table->string('type'); // 'rumah_sakit' atau 'puskesmas'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_facilities');
    }
};