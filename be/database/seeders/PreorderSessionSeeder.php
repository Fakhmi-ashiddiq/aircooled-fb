<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PreorderSession;

class PreorderSessionSeeder extends Seeder
{
    public function run(): void
    {
        $sessions = [
            [
                'product_id' => 33,
                'session_name' => 'DROP 1',
                'opened_at' => '2026-09-03',
                'closed_at' => '2026-09-06',
                'target_min' => 50,
                'estimated_delivery' => '2026-09-13',
                'status' => 'open',
            ],
            [
                'product_id' => 33,
                'session_name' => 'DROP 1',
                'opened_at' => '2026-09-03',
                'closed_at' => '2026-09-06',
                'target_min' => 50,
                'estimated_delivery' => '2026-09-13',
                'status' => 'open',
            ],
            [
                'product_id' => 30,
                'session_name' => 'DROP 1',
                'opened_at' => '2026-09-03',
                'closed_at' => '2026-09-04',
                'target_min' => 40,
                'estimated_delivery' => '2026-09-04',
                'status' => 'open',
            ],
        ];

        foreach ($sessions as $session) {
            PreorderSession::create($session);
        }
    }
}
