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
    /**
     * Membuat periode stok opname baru.
     */
    public function mulai(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'gudang' => ['required', 'string', 'max:255'],
        ]);

        $tahun = now()->format('Y');
        $lockName = 'stok-opname-nomor-' . $tahun;

        // Mencegah dua proses membuat nomor yang sama secara bersamaan.
        $lock = DB::selectOne(
            'SELECT GET_LOCK(?, 10) AS lock_status',
            [$lockName]
        );

        if (!$lock || (int) $lock->lock_status !== 1) {
            return response()->json([
                'message' => 'Sistem sedang memproses pembuatan nomor opname. Silakan coba kembali.',
            ], 409);
        }

        try {
            $opname = DB::transaction(function () use ($validated, $request, $tahun) {

                // Satu gudang hanya boleh memiliki satu periode aktif.
                $opnameAktif = StokOpname::where(
                    'gudang',
                    $validated['gudang']
                )
                    ->where('status', 'berlangsung')
                    ->lockForUpdate()
                    ->first();

                if ($opnameAktif) {
                    throw ValidationException::withMessages([
                        'gudang' => [
                            'Masih terdapat periode stok opname yang berlangsung pada gudang ini.',
                        ],
                    ]);
                }

                // Ambil nomor terakhir pada tahun berjalan.
                $nomorTerakhir = StokOpname::where(
                    'nomor',
                    'like',
                    "SO-{$tahun}-%"
                )
                    ->orderByDesc('id')
                    ->lockForUpdate()
                    ->first();

                $angkaTerakhir = 0;

                if ($nomorTerakhir) {
                    $bagianNomor = explode('-', $nomorTerakhir->nomor);
                    $angkaTerakhir = (int) end($bagianNomor);
                }

                $nomorBaru = sprintf(
                    'SO-%s-%04d',
                    $tahun,
                    $angkaTerakhir + 1
                );

                // Simpan periode opname sejak tombol mulai ditekan.
                return StokOpname::create([
                    'nomor' => $nomorBaru,
                    'nama' => $validated['nama'],
                    'gudang' => $validated['gudang'],
                    'user_id' => $request->user()->id,
                    'dimulai_pada' => now(),
                    'selesai_pada' => null,
                    'status' => 'berlangsung',
                    'total_barang' => 0,
                    'jumlah_selisih' => 0,
                ]);
            });

            return response()->json([
                'message' => 'Periode stok opname berhasil dimulai.',
                'data' => $opname,
            ], 201);

        } finally {
            DB::selectOne(
                'SELECT RELEASE_LOCK(?)',
                [$lockName]
            );
        }
    }

    /**
     * Mengambil periode opname yang masih berlangsung.
     */
    public function aktif(Request $request): JsonResponse
    {
        $gudang = $request->query('gudang');

        $query = StokOpname::with(['details', 'user'])
            ->where('status', 'berlangsung');

        if ($gudang) {
            $query->where('gudang', $gudang);
        }

        $opname = $query
            ->orderByDesc('dimulai_pada')
            ->first();

        return response()->json([
            'data' => $opname,
        ]);
    }

    /**
     * Menyelesaikan periode opname yang sudah dimulai.
     */
    public function selesaikan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'opname_id' => ['required', 'integer', 'exists:stok_opnames,id'],
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

            // Kunci periode agar tidak diselesaikan dua kali.
            $opname = StokOpname::whereKey($validated['opname_id'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($opname->status !== 'berlangsung') {
                throw ValidationException::withMessages([
                    'opname_id' => [
                        'Periode stok opname ini sudah selesai atau tidak dapat diproses.',
                    ],
                ]);
            }

            $jumlahSelisih = 0;

            foreach ($validated['catatan'] as $baris) {

                $barang = Barang::whereKey($baris['barang_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if (!$barang->aktif) {
                    throw ValidationException::withMessages([
                        'catatan' => [
                            "Barang {$barang->nama_barang} sudah diarsipkan dan tidak dapat digunakan dalam stok opname.",
                        ],
                    ]);
                }

                // Pastikan stok belum berubah sejak data dimuat.
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
                            $opname->nomor,
                            $opname->nama,
                            $baris['keterangan'] ?? 'Tanpa keterangan'
                        ),
                    ]);

                    $jumlahSelisih++;
                }

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

            // Tandai periode sebagai selesai setelah seluruh detail tersimpan.
            $opname->update([
                'selesai_pada' => now(),
                'status' => 'selesai',
                'total_barang' => count($validated['catatan']),
                'jumlah_selisih' => $jumlahSelisih,
            ]);

            return $opname->load(['details', 'user']);
        });

        return response()->json([
            'message' => 'Stok opname berhasil diselesaikan dan riwayatnya telah disimpan.',
            'data' => $opname,
        ]);
    }

    /**
     * Mengambil seluruh riwayat stok opname.
     */
    public function riwayat(): JsonResponse
    {
        $riwayat = StokOpname::with(['details', 'user'])
            ->where('status', 'selesai')
            ->orderByDesc('selesai_pada')
            ->get();

        return response()->json([
            'data' => $riwayat,
        ]);
    }
}
