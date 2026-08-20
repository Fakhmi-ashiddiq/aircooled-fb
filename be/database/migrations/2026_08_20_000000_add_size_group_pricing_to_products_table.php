<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->integer('hpp_less_xxl_unit')->default(0)->after('costs');
            $table->integer('hpp_more_xxl_unit')->default(0)->after('hpp_less_xxl_unit');
            $table->integer('price_less_xxl')->default(0)->after('hpp_more_xxl_unit');
            $table->integer('price_more_xxl')->default(0)->after('price_less_xxl');
            $table->integer('price_less_xxl_discount')->nullable()->after('price_more_xxl');
            $table->integer('price_more_xxl_discount')->nullable()->after('price_less_xxl_discount');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'hpp_less_xxl_unit', 'hpp_more_xxl_unit',
                'price_less_xxl', 'price_more_xxl',
                'price_less_xxl_discount', 'price_more_xxl_discount',
            ]);
        });
    }
};
