<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$orders = [
    ['code' => 'ASC-1051', 'customer' => 'Bayu Pratama', 'items' => 'Classic Tee x2, Sticker Pack', 'total' => 425000, 'date' => '18 Jun', 'type' => 'ready', 'status' => 'Paid'],
    ['code' => 'ASC-1050', 'customer' => 'Rangga W.', 'items' => "Le Mans '70 Tee x1", 'total' => 220000, 'date' => '17 Jun', 'type' => 'preorder', 'status' => 'Awaiting'],
    ['code' => 'ASC-1049', 'customer' => 'Sari Indah', 'items' => 'Heritage Hoodie x1', 'total' => 385000, 'date' => '17 Jun', 'type' => 'ready', 'status' => 'Packing'],
    ['code' => 'ASC-1048', 'customer' => 'Dimas A.', 'items' => 'Club Jacket x1', 'total' => 650000, 'date' => '16 Jun', 'type' => 'preorder', 'status' => 'Awaiting'],
    ['code' => 'ASC-1047', 'customer' => 'Putri M.', 'items' => 'Flat-Six Cap x1, Tote', 'total' => 285000, 'date' => '15 Jun', 'type' => 'ready', 'status' => 'Shipped'],
    ['code' => 'ASC-1046', 'customer' => 'Wisnu G.', 'items' => 'Boxer Engine Tee x2', 'total' => 390000, 'date' => '14 Jun', 'type' => 'ready', 'status' => 'Shipped']
];
foreach ($orders as $order) {
    \App\Models\Order::create($order);
}
echo "Orders seeded\n";
