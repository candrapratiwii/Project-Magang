<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('barangs', function (Blueprint $table) {
            $table->string('lokasi')
                ->default('Tempat Penyimpanan')
                ->after('satuan');

            $table->unsignedInteger('stok_minimum')
                ->default(0)
                ->after('stok');
        });
    }

    public function down(): void
    {
        Schema::table('barangs', function (Blueprint $table) {
            $table->dropColumn(['lokasi', 'stok_minimum']);
        });
    }
};