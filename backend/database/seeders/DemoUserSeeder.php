<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            throw new RuntimeException(
                'DemoUserSeeder hanya boleh dijalankan di environment local.'
            );
        }

        $users = [
            [
                'name' => 'Pratiwi',
                'username' => 'pratiwi',
                'role' => 'admin',
            ],
            [
                'name' => 'Kertika',
                'username' => 'kertika',
                'role' => 'petugas_gudang',
            ],
            [
                'name' => 'Desy',
                'username' => 'desy',
                'role' => 'petugas_gudang',
            ],
        ];

        foreach ($users as $data) {
            $passwordKey = 'SIMPERANET_DEMO_PASSWORD_'
                . strtoupper($data['username']);

            $password = env($passwordKey);

            if (! is_string($password) || $password === '') {
                throw new RuntimeException(
                    "Atur {$passwordKey} di file .env lokal terlebih dahulu."
                );
            }

            $user = User::firstOrNew([
                'username' => $data['username'],
            ]);

            $user->name = $data['name'];
            $user->role = $data['role'];
            $user->status = 'aktif';

            if (! $user->exists) {
                $user->email = $data['username']
                    . '@simperanet.local';

                $user->password = Hash::make($password);
            }

            $user->save();
        }
    }
}
