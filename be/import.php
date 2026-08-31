<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

DB::statement('SET FOREIGN_KEY_CHECKS=0;');
DB::table('cities')->truncate();
DB::unprepared(file_get_contents(database_path('import_cities.sql')));
DB::statement('SET FOREIGN_KEY_CHECKS=1;');
echo "Cities imported successfully!\n";
