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
        Schema::create('preorder_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('session_name');
            $table->string('opened_at')->nullable();
            $table->string('closed_at')->nullable();
            $table->integer('target_min')->default(30);
            $table->string('estimated_delivery')->nullable();
            $table->string('status')->default('open');
            $table->json('profit_split')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preorder_sessions');
    }
};
