<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mutasi_stoks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('barang_id')
                ->constrained('barangs')
                ->restrictOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->enum('jenis_mutasi', ['masuk', 'keluar']);
            $table->unsignedInteger('jumlah');
            $table->unsignedInteger('stok_sebelum');
            $table->unsignedInteger('stok_sesudah');
            $table->text('keterangan')->nullable();

            $table->timestamps();

            $table->index(['barang_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mutasi_stoks');
    }
};
