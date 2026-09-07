<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SizeSet;

class SizeSetSeeder extends Seeder
{
    public function run(): void
    {
        $sizeSets = [
            ['code' => 'reg', 'name' => 'Regular', 'active' => true, 'sizes' => json_encode(['XS','S','M','L','XL','XXL','3L','4L','5L','6L'])],
            ['code' => 'over', 'name' => 'Oversized', 'active' => true, 'sizes' => json_encode(['XS','S','M','L','XL','XXL','3L','4L','5L','6L'])],
            ['code' => 'one', 'name' => 'One Size', 'active' => true, 'sizes' => json_encode(['One Size'])],
        ];

        foreach ($sizeSets as $sz) {
            SizeSet::create($sz);
        }
    }
}
