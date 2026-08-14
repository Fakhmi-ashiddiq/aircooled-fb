<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Role;
use App\Models\ColorOption;
use App\Models\SizeSet;
use App\Models\Product;
use App\Models\Order;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Kaos', 'Topi', 'Goodie Bag', 'Hoodie', 'Jacket', 'Stiker', 'Print'];
        foreach ($categories as $cat) {
            Category::create(['name' => $cat]);
        }

        $roles = [
            ['code' => 'ro1', 'name' => 'Aircooled Syndicate', 'pic' => 'Atot'],
            ['code' => 'ro2', 'name' => 'RDPL', 'pic' => 'Dzikri']
        ];
        foreach ($roles as $role) {
            Role::create($role);
        }

        $colors = [
            ['code' => 'co1', 'name' => 'Off-White', 'hex' => '#EFEBE2', 'active' => true],
            ['code' => 'co2', 'name' => 'Sand', 'hex' => '#D9CBB0', 'active' => true],
            ['code' => 'co3', 'name' => 'Charcoal', 'hex' => '#26231F', 'active' => true],
            ['code' => 'co4', 'name' => 'Black', 'hex' => '#14110D', 'active' => true],
            ['code' => 'co5', 'name' => 'Navy', 'hex' => '#1a1f2b', 'active' => true],
            ['code' => 'co6', 'name' => 'Kraft', 'hex' => '#CDB892', 'active' => true],
            ['code' => 'co7', 'name' => 'Heather Grey', 'hex' => '#B8B5AE', 'active' => true],
            ['code' => 'co8', 'name' => 'Khaki', 'hex' => '#B7A98A', 'active' => false]
        ];
        foreach ($colors as $col) {
            ColorOption::create($col);
        }

        $sizeSets = [
            ['code' => 'reg', 'name' => 'Regular', 'active' => true, 'sizes' => json_encode(['S','M','L','XL','XXL'])],
            ['code' => 'over', 'name' => 'Oversized', 'active' => true, 'sizes' => json_encode(['M','L','XL','XXL'])],
            ['code' => 'one', 'name' => 'One Size', 'active' => true, 'sizes' => json_encode(['One Size'])]
        ];
        foreach ($sizeSets as $sz) {
            SizeSet::create($sz);
        }

        // Add 1 sample product
        Product::create([
            'code' => 'classic-tee',
            'name' => 'Syndicate Classic Tee',
            'category' => 'Kaos',
            'type' => 'ready',
            'price' => 185000,
            'compare_at' => 225000,
            'garment_hex' => '#D9CBB0',
            'print_type' => 'logo',
            'sizes' => json_encode(['S','M','L','XL','XXL']),
            'colors' => json_encode([['name'=>'Sand','hex'=>'#D9CBB0'],['name'=>'Charcoal','hex'=>'#26231F'],['name'=>'Off-White','hex'=>'#EFEBE2']]),
            'stock' => 48,
            'sold' => 126,
            'costs' => json_encode(['production'=>62000, 'kemasan'=>16000, 'stiker'=>11000]),
            'description' => 'Kaos cotton combed 24s dengan sablon plastisol logo Aircooled Syndicate. Potongan reguler unisex. Heritage staple yang dipakai sehari-hari.'
        ]);

        // Add 1 sample order
        Order::create([
            'code' => 'ASC-1051',
            'customer' => 'Bayu Pratama',
            'items' => 'Classic Tee ×2, Sticker Pack',
            'total' => 425000,
            'date' => '18 Jun',
            'type' => 'ready',
            'status' => 'Paid'
        ]);
    }
}
