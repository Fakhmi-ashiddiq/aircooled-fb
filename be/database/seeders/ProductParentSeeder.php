<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductParent;

class ProductParentSeeder extends Seeder
{
    public function run(): void
    {
        $parents = [
            ['sku' => 'PYB'],
            ['sku' => 'WWB'],
            ['sku' => 'ACS-VWPRS'],
            ['sku' => 'LS-ACS-VWPRS'],
            ['sku' => 'STCKR'],
        ];

        foreach ($parents as $parent) {
            ProductParent::create($parent);
        }
    }
}
