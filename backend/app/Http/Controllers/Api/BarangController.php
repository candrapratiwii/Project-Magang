<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\MutasiStok;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class BarangController extends Controller
{
    /**
     * Menampilkan daftar barang beserta kategori.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $query = Barang::with('kategoriBarang');

        if (!empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($q) use ($search) {
                $q->where('kode_barang', 'like', "%{$search}%")
                    ->orWhere('nama_barang', 'like', "%{$search}%");
            });
        }

        $barangs = $query->orderBy('nama_barang')->get();

        return response()->json([
            'message' => 'Data barang berhasil diambil.',
            'data' => $barangs,
        ]);
    }

    /**
     * Menambahkan barang dan mencatat stok awal.
     *
     * Stok awal disimpan pada barang.
     * Mutasi awal dicatat sebagai riwayat, tanpa menambah stok
     * untuk kedua kalinya.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kode_barang' => [
                'required',
                'string',
                'max:255',
                'unique:barangs,kode_barang',
            ],
            'nama_barang' => [
                'required',
                'string',
                'max:255',
            ],
            'kategori_barang_id' => [
                'required',
                'integer',
                'exists:kategori_barangs,id',
            ],
            'satuan' => [
                'required',
                'string',
                'max:50',
            ],
            'lokasi' => [
                'required',
                'string',
                'max:255',
            ],
            'stok' => [
                'required',
                'integer',
                'min:0',
            ],
            'stok_minimum' => [
                'required',
                'integer',
                'min:0',
            ],
            'deskripsi' => [
                'nullable',
                'string',
            ],
        ]);

        $user = $request->user();

        $barang = DB::transaction(function () use (
            $validated,
            $user
        ) {
            $stokAwal = (int) $validated['stok'];

            // Buat barang dengan saldo stok awal.
            $barang = Barang::create($validated);

            // Catat saldo awal sebagai mutasi masuk.
            // Jangan menambah saldo barang lagi di sini,
            // karena stok sudah diisi saat barang dibuat.
            if ($stokAwal > 0) {
                MutasiStok::create([
                    'barang_id' => $barang->id,
                    'user_id' => $user->id,
                    'jenis_mutasi' => 'masuk',
                    'jumlah' => $stokAwal,
                    'stok_sebelum' => 0,
                    'stok_sesudah' => $stokAwal,
                    'keterangan' => 'Stok Awal',
                ]);
            }

            return $barang;
        });

        $barang->load('kategoriBarang');

        return response()->json([
            'message' => 'Barang dan stok awal berhasil ditambahkan.',
            'data' => $barang,
        ], 201);
    }

    /**
     * Menampilkan detail barang.
     */
    public function show(Barang $barang): JsonResponse
    {
        $barang->load('kategoriBarang');

        return response()->json([
            'message' => 'Data barang berhasil diambil.',
            'data' => $barang,
        ]);
    }

    /**
     * Memperbarui data master barang.
     * Perubahan stok harus melalui transaksi stok.
     */
    public function update(
        Request $request,
        Barang $barang
    ): JsonResponse {
        $validated = $request->validate([
            'kode_barang' => [
                'required',
                'string',
                'max:255',
                Rule::unique('barangs', 'kode_barang')
                    ->ignore($barang->id),
            ],
            'nama_barang' => [
                'required',
                'string',
                'max:255',
            ],
            'kategori_barang_id' => [
                'required',
                'integer',
                'exists:kategori_barangs,id',
            ],
            'satuan' => [
                'required',
                'string',
                'max:50',
            ],
            'lokasi' => [
                'required',
                'string',
                'max:255',
            ],
            'stok_minimum' => [
                'required',
                'integer',
                'min:0',
            ],
            'deskripsi' => [
                'nullable',
                'string',
            ],
        ]);

        DB::transaction(function () use ($barang, $validated) {
            $barang->update($validated);
        });

        $barang->refresh();
        $barang->load('kategoriBarang');

        return response()->json([
            'message' => 'Barang berhasil diperbarui.',
            'data' => $barang,
        ]);
    }

    /**
     * Menghapus barang.
     */
    public function destroy(Barang $barang): JsonResponse
    {
        $barang->delete();

        return response()->json([
            'message' => 'Barang berhasil dihapus.',
        ]);
    }
}
