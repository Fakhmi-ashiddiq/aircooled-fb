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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('category')->nullable();
            $table->enum('type', ['ready', 'preorder'])->default('ready');
            $table->integer('price')->default(0);
            $table->integer('compare_at')->nullable();
            $table->string('garment_hex')->nullable();
            $table->string('print_type')->nullable();
            $table->json('sizes')->nullable();
            $table->json('images')->nullable();
            $table->json('colors')->nullable();
            $table->integer('stock')->default(0);
            $table->integer('sold')->default(0);
            $table->json('costs')->nullable();
            $table->json('preorder_info')->nullable();
            $table->text('description')->nullable();
            $table->integer('views')->default(0); $table->json('gallery')->nullable(); $table->json('preorder')->nullable(); $table->json('productionSessions')->nullable(); $table->json('sessionHistory')->nullable(); $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};


