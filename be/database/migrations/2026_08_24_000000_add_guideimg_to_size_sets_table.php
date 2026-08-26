<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('size_sets', function (Blueprint $table) {
            $table->string('guideImg')->nullable()->after('active');
        });
    }

    public function down(): void
    {
        Schema::table('size_sets', function (Blueprint $table) {
            $table->dropColumn('guideImg');
        });
    }
};
