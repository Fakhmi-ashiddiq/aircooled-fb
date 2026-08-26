<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$p = \App\Models\Product::where('name', 'PYB A1')->first();
if (!$p) {
    echo "Product PYB A1 not found\n";
    exit;
}

echo "Product: {$p->name} (ID: {$p->id})\n";
echo "Stock raw: " . $p->getRawOriginal('stock') . "\n";
echo "Stock cast: " . json_encode($p->stock) . "\n";
echo "Stock type: " . gettype($p->stock) . "\n";

$paidItems = \App\Models\OrderItem::whereHas('order', fn($q) => $q->where('status', 'Paid'))
    ->where('product_id', $p->id)
    ->get();

echo "\nPaid items for this product:\n";
foreach ($paidItems as $item) {
    echo "Size:{$item->size} Qty:{$item->qty}\n";
}
