<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $fillable = ['kode_prov', 'kode_kab', 'kode_kec', 'nama_wilayah'];
}