<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        $committed = OrderItem::select('product_id', DB::raw('SUM(qty) as total_qty'))
            ->where('type', 'preorder')
            ->whereHas('order', fn($q) => $q->whereIn('status', ['Awaiting', 'Paid', 'Producing', 'Shipping']))
            ->groupBy('product_id')
            ->pluck('total_qty', 'product_id');

        $products->each(function ($p) use ($committed) {
            $p->committed = $committed->get($p->id, 0);
        });

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $data = Product::create($request->all());
        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function show($id)
    {
        $data = Product::findOrFail($id);
        $committed = OrderItem::where('product_id', $id)
            ->where('type', 'preorder')
            ->whereHas('order', fn($q) => $q->whereIn('status', ['Awaiting', 'Paid', 'Producing', 'Shipping']))
            ->sum('qty');
        $data->committed = $committed;
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $data = Product::findOrFail($id);
        $data->update($request->all());
        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function destroy($id)
    {
        $data = Product::findOrFail($id);
        $data->delete();
        return response()->json(['message' => 'Success']);
    }
}
