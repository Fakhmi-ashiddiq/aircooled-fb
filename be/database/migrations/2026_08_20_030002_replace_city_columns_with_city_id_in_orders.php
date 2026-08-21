<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('city_id')->nullable()->after('address')->constrained('cities')->nullOnDelete();
            $table->dropColumn(['city', 'postal_code']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('city')->nullable()->after('address');
            $table->string('postal_code')->nullable()->after('city');
            $table->dropForeign(['city_id']);
            $table->dropColumn('city_id');
        });
    }
};
