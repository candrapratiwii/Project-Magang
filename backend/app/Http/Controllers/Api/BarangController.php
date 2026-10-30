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
     * Menampilkan daftar barang dengan filter status.
     * Admin dapat melihat aktif, arsip, dan semua.
     * Petugas Gudang hanya dapat melihat barang aktif.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'nullable', Rule::in(['aktif', 'arsip', 'semua'])],
        ]);

        $status = $validated['status'] ?? 'aktif';

        if (
            $request->user()->role !== 'admin'
            && $status !== 'aktif'
        ) {
            return response()->json([
                'message' => 'Anda tidak memiliki akses untuk melihat barang yang diarsipkan.',
            ], 403);
        }

        $query = Barang::with('kategoriBarang');

        if ($status === 'aktif') {
            $query->where('aktif', true);
        } elseif ($status === 'arsip') {
            $query->where('aktif', false);
        }

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
            'nama_barang' => ['required', 'string', 'max:255'],
            'kategori_barang_id' => [
                'required',
                'integer',
                'exists:kategori_barangs,id',
            ],
            'satuan' => ['required', 'string', 'max:50'],
            'lokasi' => ['required', 'string', 'max:255'],
            'stok' => ['required', 'integer', 'min:0'],
            'stok_minimum' => ['required', 'integer', 'min:0'],
            'deskripsi' => ['nullable', 'string'],
        ]);

        $user = $request->user();

        $barang = DB::transaction(function () use ($validated, $user) {
            $stokAwal = (int) $validated['stok'];

            $barang = Barang::create([
                ...$validated,
                'aktif' => true,
            ]);

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
     * Barang arsip tidak dapat diedit.
     */
    public function update(
        Request $request,
        Barang $barang
    ): JsonResponse {
        if (!$barang->aktif) {
            return response()->json([
                'message' => 'Barang diarsipkan. Aktifkan kembali sebelum mengedit.',
            ], 422);
        }

        $validated = $request->validate([
            'kode_barang' => [
                'required',
                'string',
                'max:255',
                Rule::unique('barangs', 'kode_barang')->ignore($barang->id),
            ],
            'nama_barang' => ['required', 'string', 'max:255'],
            'kategori_barang_id' => [
                'required',
                'integer',
                'exists:kategori_barangs,id',
            ],
            'satuan' => ['required', 'string', 'max:50'],
            'lokasi' => ['required', 'string', 'max:255'],
            'stok_minimum' => ['required', 'integer', 'min:0'],
            'deskripsi' => ['nullable', 'string'],
        ]);

        $barang->update($validated);
        $barang->refresh();
        $barang->load('kategoriBarang');

        return response()->json([
            'message' => 'Barang berhasil diperbarui.',
            'data' => $barang,
        ]);
    }

    /**
     * Mengarsipkan barang tanpa menghapus riwayat transaksi.
     */
    public function destroy(Barang $barang): JsonResponse
    {
        if (!$barang->aktif) {
            return response()->json([
                'message' => 'Barang sudah diarsipkan.',
            ], 422);
        }

        $barang->aktif = false;
        $barang->save();

        return response()->json([
            'message' => 'Barang berhasil diarsipkan.',
            'data' => $barang,
        ]);
    }

    /**
     * Mengaktifkan kembali barang yang diarsipkan.
     */
    public function restore(Barang $barang): JsonResponse
    {
        if ($barang->aktif) {
            return response()->json([
                'message' => 'Barang sudah dalam status aktif.',
            ], 422);
        }

        $barang->aktif = true;
        $barang->save();
        $barang->load('kategoriBarang');

        return response()->json([
            'message' => 'Barang berhasil diaktifkan kembali.',
            'data' => $barang,
        ]);
    }
}