<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductParentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $parents = [
            ['sku' => 'PYB'],
            ['sku' => 'WWB'],
            ['sku' => 'ACS-VWPRS'],
            ['sku' => 'LS-ACS-VWPRS'],
            ['sku' => 'STCKR'],
        ];

        DB::table('product_parents')->insert($parents);
    }
}
