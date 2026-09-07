<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'T-Shirt Lengan Pendek'],
            ['name' => 'Long Sleeve - RIB'],
            ['name' => 'Long Sleeve - Non RIB'],
            ['name' => 'Hoodie'],
            ['name' => 'Jacket'],
            ['name' => 'Stiker'],
            ['name' => 'Print'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
