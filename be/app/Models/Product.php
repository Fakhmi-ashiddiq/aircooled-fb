<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $casts = ['sizes' => 'array', 'costs' => 'array', 'gallery' => 'array', 'preorder' => 'array', 'productionSessions' => 'array', 'sessionHistory' => 'array', 'colors' => 'array', 'gallery' => 'array', 'images' => 'array', 'productionSessions' => 'array', 'sessionHistory' => 'array'];
}




