<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::firstOrCreate(
            ['email' => 'admin@aircooled.com'],
            [
                'name' => 'Admin Aircooled',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '081234567890',
            ]
        );

        // Regular user
        User::firstOrCreate(
            ['email' => 'user@aircooled.com'],
            [
                'name' => 'User Biasa',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'phone' => '089876543210',
            ]
        );
    }
}
