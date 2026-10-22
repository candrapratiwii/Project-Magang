<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\MutasiStok;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MutasiStokController extends Controller
{
    public function index(): JsonResponse
    {
        $mutasi = MutasiStok::with(['barang', 'user'])
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Riwayat mutasi stok berhasil diambil.',
            'data' => $mutasi,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'barang_id' => [
                'required',
                'integer',
                'exists:barangs,id',
            ],
            'jenis_mutasi' => [
                'required',
                'in:masuk,keluar',
            ],
            'jumlah' => [
                'required',
                'integer',
                'min:1',
            ],
            'keterangan' => [
                'nullable',
                'string',
            ],
        ]);

        $mutasi = DB::transaction(function () use (
            $validated,
            $request
        ) {
            $barang = Barang::whereKey($validated['barang_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $stokSebelum = $barang->stok;
            $jumlah = $validated['jumlah'];

            if (
                $validated['jenis_mutasi'] === 'keluar'
                && $jumlah > $stokSebelum
            ) {
                throw ValidationException::withMessages([
                    'jumlah' => [
                        'Stok tidak mencukupi untuk transaksi barang keluar.',
                    ],
                ]);
            }

            $stokSesudah = $validated['jenis_mutasi'] === 'masuk'
                ? $stokSebelum + $jumlah
                : $stokSebelum - $jumlah;

            $barang->stok = $stokSesudah;
            $barang->save();

            return MutasiStok::create([
                'barang_id' => $barang->id,
                'user_id' => $request->user()->id,
                'jenis_mutasi' => $validated['jenis_mutasi'],
                'jumlah' => $jumlah,
                'stok_sebelum' => $stokSebelum,
                'stok_sesudah' => $stokSesudah,
                'keterangan' => $validated['keterangan'] ?? null,
            ]);
        });

        return response()->json([
            'message' => 'Mutasi stok berhasil dicatat.',
            'data' => $mutasi->load(['barang', 'user']),
        ], 201);
    }
}
