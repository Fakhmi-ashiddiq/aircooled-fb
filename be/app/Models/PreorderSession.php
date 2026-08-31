<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreorderSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'session_name', 'opened_at', 'closed_at', 
        'target_min', 'estimated_delivery', 'status', 'profit_split'
    ];

    protected $casts = [
        'profit_split' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
