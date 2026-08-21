<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Jika tb_city ada, maka ganti nama. Jika tidak ada, langsung buat tabel cities.
        if (Schema::hasTable('tb_city')) {
            Schema::rename('tb_city', 'cities');
        } elseif (!Schema::hasTable('cities')) {
            Schema::create('cities', function (Blueprint $table) {
                $table->id();
                $table->string('province_id');
                $table->string('province');
                $table->string('type');
                $table->string('name');
                $table->string('postcode');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
