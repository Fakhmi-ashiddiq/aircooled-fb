<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'product_parent_id', 'code', 'name', 'category', 'type', 'price', 'compare_at',
        'garment_hex', 'print_type', 'sizes', 'colors', 'stock', 'sold', 'weight', 'costs',
        'hpp_less_xxl_unit', 'hpp_more_xxl_unit',
        'price_less_xxl', 'price_more_xxl',
        'price_less_xxl_discount', 'price_more_xxl_discount',
        'description', 'views', 'gallery', 'preorder', 'productionSessions', 'sessionHistory', 'target'
    ];

    protected $casts = ['sizes' => 'array', 'costs' => 'array', 'gallery' => 'array', 'preorder' => 'array', 'productionSessions' => 'array', 'sessionHistory' => 'array', 'colors' => 'array', 'images' => 'array', 'stock' => 'array'];
    public function productImages() { return $this->hasMany(ProductImage::class); }
    public function productParent() { return $this->belongsTo(ProductParent::class); }
}





