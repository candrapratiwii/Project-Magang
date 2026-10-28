<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StokOpname extends Model
{
    protected $fillable = [
        'nomor',
        'nama',
        'gudang',
        'user_id',
        'dimulai_pada',
        'selesai_pada',
        'total_barang',
        'jumlah_selisih',
    ];

    protected function casts(): array
    {
        return [
            'dimulai_pada' => 'datetime',
            'selesai_pada' => 'datetime',
            'total_barang' => 'integer',
            'jumlah_selisih' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(StokOpnameDetail::class);
    }
}
