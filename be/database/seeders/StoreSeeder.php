<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Owner;
use App\Models\ColorOption;
use App\Models\SizeSet;
use App\Models\Product;
use App\Models\Order;
use App\Models\ProductImage;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Kaos', 'Topi', 'Goodie Bag', 'Hoodie', 'Jacket', 'Stiker', 'Print'];
        foreach ($categories as $cat) {
            Category::create(['name' => $cat]);
        }

        $owners = [
            ['code' => 'ro1', 'name' => 'Aircooled Syndicate', 'pic' => 'Atot'],
            ['code' => 'ro2', 'name' => 'RDPL', 'pic' => 'Dzikri']
        ];
        foreach ($owners as $owner) {
            Owner::create($owner);
        }

        $colors = [
            ['code' => 'co1', 'name' => 'Off-White', 'hex' => '#EFEBE2', 'active' => true],
            ['code' => 'co2', 'name' => 'Sand', 'hex' => '#D9CBB0', 'active' => true],
            ['code' => 'co3', 'name' => 'Charcoal', 'hex' => '#26231F', 'active' => true],
            ['code' => 'co4', 'name' => 'Black', 'hex' => '#14110D', 'active' => true],
            ['code' => 'co5', 'name' => 'Navy', 'hex' => '#1a1f2b', 'active' => true],
            ['code' => 'co6', 'name' => 'Kraft', 'hex' => '#CDB892', 'active' => true],
            ['code' => 'co7', 'name' => 'Heather Grey', 'hex' => '#B8B5AE', 'active' => true],
            ['code' => 'co8', 'name' => 'Khaki', 'hex' => '#B7A98A', 'active' => true],
            ['code' => 'co9', 'name' => 'Natural', 'hex' => '#E4DCC8', 'active' => true]
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

        $products = [
            [
                'code' => 'classic-tee', 'name' => 'Syndicate Classic Tee', 'category' => 'Kaos', 'type' => 'ready', 'price' => 185000,
                'compare_at' => 225000, 'print_type' => 'logo', 'sizes' => json_encode(['S','M','L','XL','XXL']),
                'colors' => json_encode([['name'=>'Sand','hex'=>'#D9CBB0'],['name'=>'Charcoal','hex'=>'#26231F'],['name'=>'Off-White','hex'=>'#EFEBE2']]),
                'stock' => json_encode(['S'=>8,'M'=>10,'L'=>12,'XL'=>10,'XXL'=>8]), 'sold' => 126, 'costs' => json_encode(['production'=>62000, 'kemasan'=>16000, 'stiker'=>11000]),
                'hpp_less_xxl_unit' => 62000, 'hpp_more_xxl_unit' => 72000,
                'price_less_xxl' => 185000, 'price_more_xxl' => 210000,
                'price_less_xxl_discount' => 225000, 'price_more_xxl_discount' => 250000,
                'description' => 'Kaos cotton combed 24s dengan sablon plastisol logo Aircooled Syndicate.'
            ],
            [
                'code' => 'boxer-tee', 'name' => 'Boxer Engine Tee', 'category' => 'Kaos', 'type' => 'ready', 'price' => 195000,
                'compare_at' => 0, 'print_type' => 'logo', 'sizes' => json_encode(['M','L','XL','XXL']),
                'colors' => json_encode([['name'=>'Charcoal','hex'=>'#26231F'],['name'=>'Sand','hex'=>'#D9CBB0']]),
                'stock' => json_encode(['M'=>3,'L'=>4,'XL'=>3,'XXL'=>2]), 'sold' => 84, 'costs' => json_encode(['production'=>64000, 'kemasan'=>16000, 'stiker'=>11000]),
                'description' => 'Grafis flat-six engine cutaway di belakang. Bahan heavyweight cotton 16s.'
            ],
            [
                'code' => 'flatsix-cap', 'name' => 'Flat-Six Cap', 'category' => 'Topi', 'type' => 'ready', 'price' => 165000,
                'compare_at' => 0, 'print_type' => 'text', 'sizes' => json_encode(['One Size']),
                'colors' => json_encode([['name'=>'Black','hex'=>'#1d1a16'],['name'=>'Khaki','hex'=>'#B7A98A']]),
                'stock' => json_encode(['One Size'=>54]), 'sold' => 72, 'costs' => json_encode(['production'=>58000, 'kemasan'=>14000, 'stiker'=>9000]),
                'description' => 'Topi 6-panel unstructured, bordir logo di depan, strap kuningan adjustable. Warna hitam pekat.'
            ],
            [
                'code' => 'pit-tote', 'name' => 'Pit Crew Tote', 'category' => 'Goodie Bag', 'type' => 'ready', 'price' => 120000,
                'compare_at' => 150000, 'print_type' => 'logo', 'sizes' => json_encode(['One Size']),
                'colors' => json_encode([['name'=>'Natural','hex'=>'#E4DCC8']]),
                'stock' => json_encode(['One Size'=>67]), 'sold' => 54, 'costs' => json_encode(['production'=>38000, 'kemasan'=>13000, 'stiker'=>8000]),
                'description' => 'Tote bag kanvas 12oz natural, sablon logo besar. Muat majalah, helm cap, dan belanjaan part.'
            ],
            [
                'code' => 'heritage-hoodie', 'name' => 'Heritage Hoodie', 'category' => 'Hoodie', 'type' => 'ready', 'price' => 385000,
                'compare_at' => 0, 'print_type' => 'logo', 'sizes' => json_encode(['S','M','L','XL','XXL']),
                'colors' => json_encode([['name'=>'Heather Grey','hex'=>'#B8B5AE'],['name'=>'Charcoal','hex'=>'#26231F']]),
                'stock' => json_encode(['S'=>4,'M'=>5,'L'=>6,'XL'=>4,'XXL'=>3]), 'sold' => 41, 'costs' => json_encode(['production'=>168000, 'kemasan'=>24000, 'stiker'=>16000]),
                'description' => 'Hoodie fleece 320gsm heather grey, kantong kangguru, drawstring kuning. Hangat untuk morning run.'
            ],
            [
                'code' => 'sticker-vol1', 'name' => 'Sticker Pack Vol.1', 'category' => 'Stiker', 'type' => 'ready', 'price' => 55000,
                'compare_at' => 75000, 'print_type' => 'logo', 'sizes' => json_encode(['One Size']),
                'colors' => json_encode([['name'=>'Mix','hex'=>'#EFEBE2']]),
                'stock' => json_encode(['One Size'=>140]), 'sold' => 210, 'costs' => json_encode(['production'=>14000, 'kemasan'=>8000, 'stiker'=>5000]),
                'description' => 'Set 8 stiker die-cut vinyl tahan air & UV. Tempel di toolbox, laptop, atau bumper.'
            ],
            [
                'code' => 'lemans-tee', 'name' => 'Le Mans 70 Tee', 'category' => 'Kaos', 'type' => 'preorder', 'price' => 220000,
                'compare_at' => 0, 'print_type' => 'logo', 'sizes' => json_encode(['S','M','L','XL','XXL']),
                'colors' => json_encode([['name'=>'Off-White','hex'=>'#EFEBE2'],['name'=>'Sand','hex'=>'#D9CBB0']]),
                'stock' => json_encode([]), 'sold' => 0, 'costs' => json_encode(['production'=>68000, 'kemasan'=>17000, 'stiker'=>13000]),
                'description' => 'Edisi terbatas memperingati Le Mans 1970. Sablon 3 warna premium di cotton combed 20s.'
            ],
            [
                'code' => 'club-jacket', 'name' => 'Air-Cooled Club Jacket', 'category' => 'Jacket', 'type' => 'preorder', 'price' => 650000,
                'compare_at' => 0, 'print_type' => 'text', 'sizes' => json_encode(['M','L','XL','XXL']),
                'colors' => json_encode([['name'=>'Navy','hex'=>'#1a1f2b'],['name'=>'Black','hex'=>'#14110D']]),
                'stock' => json_encode([]), 'sold' => 0, 'costs' => json_encode(['production'=>340000, 'kemasan'=>30000, 'stiker'=>24000]),
                'description' => 'Coach jacket navy dengan bordir punggung penuh dan patch lengan. Bahan taslan anti air, lining flanel.'
            ],
            [
                'code' => 'rally-goodie', 'name' => 'Vintage Rally Goodie Set', 'category' => 'Goodie Bag', 'type' => 'preorder', 'price' => 275000,
                'compare_at' => 300000, 'print_type' => 'logo', 'sizes' => json_encode(['One Size']),
                'colors' => json_encode([['name'=>'Kraft','hex'=>'#CDB892']]),
                'stock' => json_encode([]), 'sold' => 0, 'costs' => json_encode(['production'=>96000, 'kemasan'=>20000, 'stiker'=>14000]),
                'description' => 'Bundle berisi tote, enamel pin set, patch, dan majalah edisi cetak terbatas. Dikemas dalam box kraft.'
            ]
        ];
        
        foreach ($products as $prod) {
            $p = Product::create($prod); $p->productImages()->create(['src' => '/logo.jpg']);
        }

        
    }
}

