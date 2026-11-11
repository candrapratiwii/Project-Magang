<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;

class ActivityLogController extends Controller
{
    public function index(): JsonResponse
    {
        $activities = ActivityLog::query()
            ->select([
                'id',
                'user_id',
                'user_name',
                'activity_type',
                'description',
                'created_at',
            ])
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'message' => 'Riwayat aktivitas berhasil diambil.',
            'data' => $activities,
        ]);
    }
}
