<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'code', 'name', 'category', 'type', 'price', 'compare_at', 
        'garment_hex', 'print_type', 'sizes', 'colors', 'stock', 'sold', 'costs', 'description',
        'views', 'gallery', 'preorder', 'productionSessions', 'sessionHistory'
    ];

    protected $casts = ['sizes' => 'array', 'costs' => 'array', 'gallery' => 'array', 'preorder' => 'array', 'productionSessions' => 'array', 'sessionHistory' => 'array', 'colors' => 'array', 'gallery' => 'array', 'images' => 'array', 'productionSessions' => 'array', 'sessionHistory' => 'array'];
    public function productImages() { return $this->hasMany(ProductImage::class); }
}





