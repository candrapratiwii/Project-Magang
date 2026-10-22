<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\KategoriBarangController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MutasiStokController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserManagementController;

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

    Route::middleware([
        'auth:sanctum',
        \App\Http\Middleware\EnsureUserIsActive::class,
    ])->group(function () {
    // Autentikasi
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Kategori barang: Admin dan Petugas Gudang dapat melihat
    Route::get('/kategori-barang', [
        KategoriBarangController::class,
        'index',
    ])->middleware('role:admin,petugas_gudang');

    Route::get('/kategori-barang/{kategoriBarang}', [
        KategoriBarangController::class,
        'show',
    ])->middleware('role:admin,petugas_gudang');

    // Pengelolaan kategori: khusus Admin
    Route::post('/kategori-barang', [
        KategoriBarangController::class,
        'store',
    ])->middleware('role:admin');

    Route::put('/kategori-barang/{kategoriBarang}', [
        KategoriBarangController::class,
        'update',
    ])->middleware('role:admin');

    Route::delete('/kategori-barang/{kategoriBarang}', [
        KategoriBarangController::class,
        'destroy',
    ])->middleware('role:admin');

    // Barang: Admin dan Petugas Gudang dapat melihat
    Route::get('/barang', [
        BarangController::class,
        'index',
    ])->middleware('role:admin,petugas_gudang');

    Route::get('/barang/{barang}', [
        BarangController::class,
        'show',
    ])->middleware('role:admin,petugas_gudang');

    // Pengelolaan data barang: khusus Admin
    Route::post('/barang', [
        BarangController::class,
        'store',
    ])->middleware('role:admin');

    Route::put('/barang/{barang}', [
        BarangController::class,
        'update',
    ])->middleware('role:admin');

    Route::delete('/barang/{barang}', [
        BarangController::class,
        'destroy',
    ])->middleware('role:admin');
    
    // Mutasi stok: Admin dan Petugas Gudang
    Route::get('/mutasi-stok', [
        MutasiStokController::class,
        'index',
    ])->middleware('role:admin,petugas_gudang');

    Route::post('/mutasi-stok', [
        MutasiStokController::class,
        'store',
    ])->middleware('role:admin,petugas_gudang');
    // Dashboard: Admin dan Petugas Gudang dapat melihat
    Route::get('/dashboard', [
        DashboardController::class,
        'index',
    ])->middleware('role:admin,petugas_gudang');
    
    // Manajemen pengguna: khusus Admin
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
