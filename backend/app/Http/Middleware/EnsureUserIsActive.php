<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        $user = $request->user();

        if (! $user || $user->status !== 'aktif') {
            if ($user) {
                $user->tokens()->delete();
            }

            return response()->json([
                'message' => 'Akun Anda tidak aktif atau tidak memiliki akses.',
            ], 403);
        }

        return $next($request);
    }
}
