<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\MutasiStok;
use App\Models\StokOpname;
use App\Models\StokOpnameDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StokOpnameController extends Controller
{
    public function selesaikan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nomor' => ['required', 'string', 'max:50'],
            'nama' => ['required', 'string', 'max:255'],
            'gudang' => ['required', 'string', 'max:255'],
            'catatan' => ['required', 'array', 'min:1'],
            'catatan.*.barang_id' => [
                'required',
                'integer',
                'distinct',
                'exists:barangs,id',
            ],
            'catatan.*.stok_sistem' => [
                'required',
                'integer',
                'min:0',
            ],
            'catatan.*.stok_fisik' => [
                'required',
                'integer',
                'min:0',
            ],
            'catatan.*.keterangan' => [
                'nullable',
                'string',
            ],
        ]);

        $opname = DB::transaction(function () use ($validated, $request) {
            // Buat data periode opname terlebih dahulu.
            $opname = StokOpname::create([
                'nomor' => $validated['nomor'],
                'nama' => $validated['nama'],
                'gudang' => $validated['gudang'],
                'user_id' => $request->user()->id,
                'dimulai_pada' => now(),
                'selesai_pada' => now(),
                'total_barang' => count($validated['catatan']),
                'jumlah_selisih' => 0,
            ]);

            $jumlahSelisih = 0;

            foreach ($validated['catatan'] as $baris) {
                $barang = Barang::whereKey($baris['barang_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                // Pastikan stok tidak berubah sejak data opname dimuat.
                if ((int) $barang->stok !== (int) $baris['stok_sistem']) {
                    throw ValidationException::withMessages([
                        'catatan' => [
                            "Stok {$barang->nama_barang} sudah berubah. Muat ulang data sebelum menyelesaikan opname.",
                        ],
                    ]);
                }

                $stokSebelum = (int) $barang->stok;
                $stokFisik = (int) $baris['stok_fisik'];
                $selisih = $stokFisik - $stokSebelum;

                if ($selisih !== 0) {
                    $barang->stok = $stokFisik;
                    $barang->save();

                    MutasiStok::create([
                        'barang_id' => $barang->id,
                        'user_id' => $request->user()->id,
                        'jenis_mutasi' => $selisih > 0 ? 'masuk' : 'keluar',
                        'jumlah' => abs($selisih),
                        'stok_sebelum' => $stokSebelum,
                        'stok_sesudah' => $stokFisik,
                        'keterangan' => sprintf(
                            'Penyesuaian stok opname %s (%s). %s',
                            $validated['nomor'],
                            $validated['nama'],
                            $baris['keterangan'] ?? 'Tanpa keterangan'
                        ),
                    ]);

                    $jumlahSelisih++;
                }

                // Simpan detail setiap barang, termasuk yang tidak memiliki selisih.
                StokOpnameDetail::create([
                    'stok_opname_id' => $opname->id,
                    'barang_id' => $barang->id,
                    'kode_barang' => $barang->kode_barang,
                    'nama_barang' => $barang->nama_barang,
                    'stok_sistem' => $stokSebelum,
                    'stok_fisik' => $stokFisik,
                    'selisih' => $selisih,
                    'keterangan' => $baris['keterangan'] ?? null,
                ]);
            }

            $opname->update([
                'jumlah_selisih' => $jumlahSelisih,
            ]);

            return $opname;
        });

        return response()->json([
            'message' => 'Stok opname berhasil diselesaikan dan riwayatnya telah disimpan.',
            'data' => $opname,
        ]);
    }

    public function riwayat(): JsonResponse
    {
        $riwayat = StokOpname::with('details')
            ->orderByDesc('selesai_pada')
            ->get();

        return response()->json([
            'data' => $riwayat,
        ]);
    }
}
