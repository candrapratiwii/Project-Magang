<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\KategoriBarang;
use App\Models\MutasiStok;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalBarang = Barang::count();

        $totalKategori = KategoriBarang::count();

        $totalStok = (int) Barang::sum('stok');

        $stokMenipis = Barang::where('stok', '<=', 5)
            ->count();

        $totalBarangMasuk = (int) MutasiStok::where(
            'jenis_mutasi',
            'masuk'
        )->sum('jumlah');

        $totalBarangKeluar = (int) MutasiStok::where(
            'jenis_mutasi',
            'keluar'
        )->sum('jumlah');

        $mutasiTerbaru = MutasiStok::with([
            'barang',
            'user',
        ])
            ->latest()
            ->limit(5)
            ->get();

        $stokPerKategori = KategoriBarang::query()
            ->leftJoin(
                'barangs',
                'kategori_barangs.id',
                '=',
                'barangs.kategori_barang_id'
            )
            ->select(
                'kategori_barangs.id',
                'kategori_barangs.nama_kategori',
                DB::raw(
                    'COALESCE(SUM(barangs.stok), 0) as total_stok'
                )
            )
            ->groupBy(
                'kategori_barangs.id',
                'kategori_barangs.nama_kategori'
            )
            ->orderBy('kategori_barangs.nama_kategori')
            ->get()
            ->map(function ($kategori) {
                $kategori->total_stok = (int) $kategori->total_stok;

                return $kategori;
            });

        return response()->json([
            'message' => 'Data dashboard berhasil diambil.',
            'data' => [
                'total_barang' => $totalBarang,
                'total_kategori' => $totalKategori,
                'total_stok' => $totalStok,
                'jumlah_barang_stok_menipis' => $stokMenipis,
                'total_barang_masuk' => $totalBarangMasuk,
                'total_barang_keluar' => $totalBarangKeluar,
                'stok_per_kategori' => $stokPerKategori,
                'mutasi_terbaru' => $mutasiTerbaru,
            ],
        ]);
    }
}
