<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$p = \App\Models\Product::find(27);
$raw = DB::table('products')->where('id', 27)->value('stock');
echo "DB raw: " . var_export($raw, true) . "\n";
echo "DB raw type: " . gettype($raw) . "\n";
echo "Model stock: " . var_export($p->stock, true) . "\n";
echo "Model stock type: " . gettype($p->stock) . "\n";
