<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('product_id')->nullable()->after('user_id');
            $table->dropColumn(['product_code']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->unsignedBigInteger('product_id')->nullable()->after('order_id');
            $table->dropColumn(['product_code', 'product_name']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('product_code')->nullable()->after('user_id');
            $table->dropColumn(['product_id']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->string('product_code')->nullable()->after('order_id');
            $table->string('product_name')->nullable()->after('product_code');
            $table->dropColumn(['product_id']);
        });
    }
};
