<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::query()
            ->select([
                'id',
                'name',
                'email',
                'username',
                'role',
                'status',
                'last_login_at',
                'created_at',
            ])
            ->orderBy('name')
            ->get();

        return response()->json([
            'message' => 'Data pengguna berhasil diambil.',
            'data' => $users,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'username' => [
                'required',
                'string',
                'max:255',
                'unique:users,username',
            ],
            'password' => ['required', 'string', 'min:8'],
            'role' => [
                'required',
                Rule::in(['admin', 'petugas_gudang']),
            ],
            'status' => [
                'sometimes',
                Rule::in(['aktif', 'nonaktif']),
            ],
        ]);

        $validated['password'] = Hash::make(
            $validated['password']
        );

        $user = User::create($validated);

        // Catat aktivitas penambahan pengguna
        $actor = $request->user();

        ActivityLog::create([
            'user_id' => $actor->id,
            'user_name' => $actor->name,
            'activity_type' => 'user_created',
            'description' => 'Menambahkan pengguna baru: ' . $user->name,
        ]);

        return response()->json([
            'message' => 'Pengguna berhasil ditambahkan.',
            'data' => $this->userData($user),
        ], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'message' => 'Data pengguna berhasil diambil.',
            'data' => $this->userData($user),
        ]);
    }

    public function update(
        Request $request,
        User $user
    ): JsonResponse {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'username' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($user->id),
            ],
            'password' => ['sometimes', 'required', 'string', 'min:8'],
            'role' => [
                'sometimes',
                'required',
                Rule::in(['admin', 'petugas_gudang']),
            ],
            'status' => [
                'sometimes',
                'required',
                Rule::in(['aktif', 'nonaktif']),
            ],
        ]);

        $actor = $request->user();

        // Simpan status lama sebelum data diperbarui
        $oldStatus = $user->status;

        // Pisahkan perubahan status dari perubahan data lainnya
        $otherChanges = array_diff_key(
            $validated,
            ['status' => true]
        );

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make(
                $validated['password']
            );
        }

        $user->update($validated);

        $updatedUser = $user->fresh();

        // Catat aktivitas perubahan data pengguna
        // Password tidak pernah ditampilkan dalam keterangan
        if (
            ! empty($otherChanges) &&
            $user->wasChanged(array_keys($otherChanges))
        ) {
            ActivityLog::create([
                'user_id' => $actor->id,
                'user_name' => $actor->name,
                'activity_type' => 'user_updated',
                'description' => 'Memperbarui data pengguna: '
                    . $updatedUser->name,
            ]);
        }

        // Catat aktivitas perubahan status akun secara terpisah
        if (
            array_key_exists('status', $validated) &&
            $oldStatus !== $updatedUser->status
        ) {
            ActivityLog::create([
                'user_id' => $actor->id,
                'user_name' => $actor->name,
                'activity_type' => 'status_changed',
                'description' => 'Mengubah status akun '
                    . $updatedUser->name
                    . ' dari '
                    . $oldStatus
                    . ' menjadi '
                    . $updatedUser->status
                    . '.',
            ]);
        }

        return response()->json([
            'message' => 'Data pengguna berhasil diperbarui.',
            'data' => $this->userData($updatedUser),
        ]);
    }

    private function userData(User $user): array
    {
        return $user->only([
            'id',
            'name',
            'email',
            'username',
            'role',
            'status',
            'last_login_at',
            'created_at',
        ]);
    }
}
