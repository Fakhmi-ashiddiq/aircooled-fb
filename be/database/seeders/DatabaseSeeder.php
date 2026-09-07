<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            OwnerSeeder::class,
            ColorOptionSeeder::class,
            SizeSetSeeder::class,
            ProductParentSeeder::class,
            UserSeeder::class,
            ProductSeeder::class,
            OrderSeeder::class,
            PreorderSessionSeeder::class,
        ]);
    }
}
