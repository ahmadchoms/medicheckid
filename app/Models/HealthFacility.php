<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthFacility extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_kab',
        'kode_instansi',
        'unit_kerja',
        'type',
    ];

    public function regency()
    {
        return $this->hasOne(Region::class, 'kode_kab', 'kode_kab')
                    ->whereNull('kode_kec'); // Pastikan mengambil level Kabupaten, bukan Kecamatan
    }
}