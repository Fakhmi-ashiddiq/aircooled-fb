<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@aircooled.com',
            'password' => Hash::make('password'),
            'role' => '1',
        ]);

        User::create([
            'name' => 'User Demo',
            'email' => 'user@aircooled.com',
            'password' => Hash::make('password'),
            'role' => '2',
        ]);
    }
}
