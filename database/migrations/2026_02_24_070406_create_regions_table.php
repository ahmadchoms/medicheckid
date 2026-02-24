<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up()
{
    Schema::create('regions', function (Blueprint $table) {
        $table->id();
        $table->string('kode_prov')->nullable();
        $table->string('kode_kab')->nullable(); // Pastikan baris ini ada
        $table->string('kode_kec')->nullable();
        $table->string('nama_wilayah');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('regions');
    }
};
