<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KategoriBarang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KategoriBarangController extends Controller
{
    public function index(): JsonResponse
    {
        $kategori = KategoriBarang::withCount('barangs')
            ->orderBy('nama_kategori')
            ->get();

        return response()->json([
            'message' => 'Data kategori barang berhasil diambil.',
            'data' => $kategori,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_kategori' => [
                'required',
                'string',
                'max:255',
                'unique:kategori_barangs,nama_kategori',
            ],
            'deskripsi' => ['nullable', 'string'],
        ]);

        $kategori = KategoriBarang::create($validated);

        return response()->json([
            'message' => 'Kategori barang berhasil ditambahkan.',
            'data' => $kategori,
        ], 201);
    }

    public function show(KategoriBarang $kategoriBarang): JsonResponse
    {
        return response()->json([
            'message' => 'Data kategori barang berhasil diambil.',
            'data' => $kategoriBarang->loadCount('barangs'),
        ]);
    }

    public function update(
        Request $request,
        KategoriBarang $kategoriBarang
    ): JsonResponse {
        $validated = $request->validate([
            'nama_kategori' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kategori_barangs', 'nama_kategori')
                    ->ignore($kategoriBarang->id),
            ],
            'deskripsi' => ['nullable', 'string'],
        ]);

        $kategoriBarang->update($validated);

        return response()->json([
            'message' => 'Kategori barang berhasil diperbarui.',
            'data' => $kategoriBarang,
        ]);
    }

    public function destroy(
        KategoriBarang $kategoriBarang
    ): JsonResponse {
        if ($kategoriBarang->barangs()->exists()) {
            return response()->json([
                'message' => 'Kategori tidak dapat dihapus karena masih digunakan oleh barang.',
            ], 409);
        }

        $kategoriBarang->delete();

        return response()->json([
            'message' => 'Kategori barang berhasil dihapus.',
        ]);
    }
}
