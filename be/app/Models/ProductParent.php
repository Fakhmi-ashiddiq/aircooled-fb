<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductParent extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
