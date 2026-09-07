<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Owner;

class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        $owners = [
            ['code' => 'ro1', 'name' => 'Aircooled Syndicate', 'pic' => 'Atot'],
            ['code' => 'ro2', 'name' => 'RDPL', 'pic' => 'Dzikri'],
        ];

        foreach ($owners as $owner) {
            Owner::create($owner);
        }
    }
}
