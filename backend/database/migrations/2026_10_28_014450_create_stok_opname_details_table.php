<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stok_opname_details', function (Blueprint $table) {
            $table->id();

            $table->foreignId('stok_opname_id')
                ->constrained('stok_opnames')
                ->cascadeOnDelete();

            $table->foreignId('barang_id')
                ->constrained('barangs')
                ->restrictOnDelete();

            $table->string('kode_barang');
            $table->string('nama_barang');
            $table->unsignedInteger('stok_sistem');
            $table->unsignedInteger('stok_fisik');
            $table->integer('selisih');
            $table->text('keterangan')->nullable();

            $table->timestamps();

            $table->unique(
                ['stok_opname_id', 'barang_id'],
                'stok_opname_barang_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stok_opname_details');
    }
};