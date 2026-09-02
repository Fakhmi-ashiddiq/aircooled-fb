<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('city_name')->nullable()->after('city_id');
            $table->string('postal_code')->nullable()->after('city_name');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('city_name')->nullable()->after('city_id');
            $table->string('postal_code')->nullable()->after('city_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['city_name', 'postal_code']);
        });
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['city_name', 'postal_code']);
        });
    }
};
