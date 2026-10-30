<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Barang extends Model
{
    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'kategori_barang_id',
        'satuan',
        'lokasi',
        'stok',
        'stok_minimum',
        'deskripsi',
        'aktif',
    ];

    protected function casts(): array
    {
        return [
            'stok' => 'integer',
            'stok_minimum' => 'integer',
            'aktif' => 'boolean',
        ];
    }

    public function kategoriBarang(): BelongsTo
    {
        return $this->belongsTo(
            KategoriBarang::class,
            'kategori_barang_id'
        );
    }
}