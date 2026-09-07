<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ColorOption;

class ColorOptionSeeder extends Seeder
{
    public function run(): void
    {
        $colors = [
            ['code' => 'co1', 'name' => 'Off-White', 'hex' => '#EFEBE2', 'active' => true],
            ['code' => 'co2', 'name' => 'Sand', 'hex' => '#D9CBB0', 'active' => true],
            ['code' => 'co3', 'name' => 'Charcoal', 'hex' => '#26231F', 'active' => true],
            ['code' => 'co4', 'name' => 'Black', 'hex' => '#14110D', 'active' => true],
            ['code' => 'co5', 'name' => 'Navy', 'hex' => '#1a1f2b', 'active' => true],
            ['code' => 'co6', 'name' => 'Kraft', 'hex' => '#CDB892', 'active' => true],
            ['code' => 'co7', 'name' => 'Heather Grey', 'hex' => '#B8B5AE', 'active' => true],
            ['code' => 'co8', 'name' => 'Khaki', 'hex' => '#B7A98A', 'active' => true],
            ['code' => 'co9', 'name' => 'Natural', 'hex' => '#E4DCC8', 'active' => true],
        ];

        foreach ($colors as $col) {
            ColorOption::create($col);
        }
    }
}
