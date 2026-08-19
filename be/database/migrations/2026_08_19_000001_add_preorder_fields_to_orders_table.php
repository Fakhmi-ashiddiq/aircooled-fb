<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->string('product_code')->nullable()->after('user_id');
            $table->string('session_name')->nullable()->after('product_code');
            $table->string('phone')->nullable()->after('customer');
            $table->string('email')->nullable()->after('phone');
            $table->string('address')->nullable()->after('email');
            $table->string('city')->nullable()->after('address');
            $table->string('postal_code')->nullable()->after('city');
            $table->integer('shipping_cost')->default(0)->after('total');
            $table->text('notes')->nullable()->after('shipping_cost');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'user_id', 'product_code', 'session_name',
                'phone', 'email', 'address', 'city', 'postal_code',
                'shipping_cost', 'notes'
            ]);
        });
    }
};
