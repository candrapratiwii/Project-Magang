<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\KategoriBarangController;
use App\Http\Controllers\Api\MutasiStokController;
use App\Http\Controllers\Api\StokOpnameController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Middleware\EnsureUserIsActive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Login
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

// Semua route di bawah ini membutuhkan autentikasi.
Route::middleware([
    'auth:sanctum',
    EnsureUserIsActive::class,
])->group(function () {

    // ==========================================
    // AUTENTIKASI
    // ==========================================

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    // ==========================================
    // KATEGORI BARANG
    // Admin dan Petugas Gudang: melihat
    // Admin: mengelola
    // ==========================================

    Route::middleware('role:admin,petugas_gudang')
        ->group(function () {
            Route::get('/kategori-barang', [
                KategoriBarangController::class,
                'index',
            ]);

            Route::get('/kategori-barang/{kategoriBarang}', [
                KategoriBarangController::class,
                'show',
            ]);
        });

    Route::middleware('role:admin')->group(function () {
        Route::post('/kategori-barang', [
            KategoriBarangController::class,
            'store',
        ]);

        Route::put('/kategori-barang/{kategoriBarang}', [
            KategoriBarangController::class,
            'update',
        ]);

        Route::delete('/kategori-barang/{kategoriBarang}', [
            KategoriBarangController::class,
            'destroy',
        ]);
    });


    // ==========================================
    // BARANG
    // Admin dan Petugas Gudang: melihat
    // Admin: mengelola
    // ==========================================

    Route::middleware('role:admin,petugas_gudang')
        ->group(function () {
            Route::get('/barang', [
                BarangController::class,
                'index',
            ]);

            Route::get('/barang/{barang}', [
                BarangController::class,
                'show',
            ]);
        });

    Route::middleware('role:admin')->group(function () {
        Route::post('/barang', [
            BarangController::class,
            'store',
        ]);

        Route::put('/barang/{barang}', [
            BarangController::class,
            'update',
        ]);

        Route::delete('/barang/{barang}', [
            BarangController::class,
            'destroy',
        ]);
    });


    // ==========================================
    // MUTASI STOK
    // Admin dan Petugas Gudang
    // ==========================================

    Route::middleware('role:admin,petugas_gudang')
        ->group(function () {
            Route::get('/mutasi-stok', [
                MutasiStokController::class,
                'index',
            ]);

            Route::post('/mutasi-stok', [
                MutasiStokController::class,
                'store',
            ]);
        });


    // ==========================================
    // STOK OPNAME
    // Admin dan Petugas Gudang
    // ==========================================

    Route::middleware('role:admin,petugas_gudang')
        ->group(function () {
            // Menyelesaikan opname dan menyimpan riwayat.
            Route::post('/stok-opname/selesaikan', [
                StokOpnameController::class,
                'selesaikan',
            ]);

            // Mengambil riwayat opname dari database.
            Route::get('/stok-opname/riwayat', [
                StokOpnameController::class,
                'riwayat',
            ]);
        });


    // ==========================================
    // DASHBOARD
    // Admin dan Petugas Gudang
    // ==========================================

    Route::get('/dashboard', [
        DashboardController::class,
        'index',
    ])->middleware('role:admin,petugas_gudang');


    // ==========================================
    // MANAJEMEN PENGGUNA
    // Khusus Admin
    // ==========================================

    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [
            UserManagementController::class,
            'index',
        ]);

        Route::post('/users', [
            UserManagementController::class,
            'store',
        ]);

        Route::get('/users/{user}', [
            UserManagementController::class,
            'show',
        ]);

        Route::put('/users/{user}', [
            UserManagementController::class,
            'update',
        ]);
    });
});
