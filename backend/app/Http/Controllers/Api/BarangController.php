<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BarangController extends Controller
{
    public function index(): JsonResponse
    {
        $barangs = Barang::with('kategoriBarang')
            ->orderBy('nama_barang')
            ->get();

        return response()->json([
            'message' => 'Data barang berhasil diambil.',
            'data' => $barangs,
        ]);
    }

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
            'deskripsi' => [
                'nullable',
                'string',
            ],
        ]);

        $barang = Barang::create($validated);
        $barang->load('kategoriBarang');

        return response()->json([
            'message' => 'Barang berhasil ditambahkan.',
            'data' => $barang,
        ], 201);
    }

    public function show(Barang $barang): JsonResponse
    {
        return response()->json([
            'message' => 'Data barang berhasil diambil.',
            'data' => $barang->load('kategoriBarang'),
        ]);
    }

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
            'deskripsi' => [
                'nullable',
                'string',
            ],
        ]);

        $barang->update($validated);
        $barang->load('kategoriBarang');

        return response()->json([
            'message' => 'Barang berhasil diperbarui.',
            'data' => $barang,
        ]);
    }

    public function destroy(Barang $barang): JsonResponse
    {
        $barang->delete();

        return response()->json([
            'message' => 'Barang berhasil dihapus.',
        ]);
    }
}
