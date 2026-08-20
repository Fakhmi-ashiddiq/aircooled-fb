<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_parents', function (Blueprint $table) {
            $table->renameColumn('pku', 'sku');
        });
    }

    public function down(): void
    {
        Schema::table('product_parents', function (Blueprint $table) {
            $table->renameColumn('sku', 'pku');
        });
    }
};
