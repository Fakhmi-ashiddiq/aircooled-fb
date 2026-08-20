<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $items = Cart::with('product')->where('user_id', $request->user()->id)->get();
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $existing = Cart::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->where('size', $request->size)
            ->where('color', $request->color)
            ->first();

        if ($existing) {
            $existing->update(['qty' => $existing->qty + ($request->qty ?? 1)]);
            return response()->json($existing->load('product'));
        }

        $item = Cart::create([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
            'size' => $request->size,
            'color' => $request->color,
            'qty' => $request->qty ?? 1,
        ]);

        return response()->json($item->load('product'), 201);
    }

    public function update(Request $request, $id)
    {
        $item = Cart::where('user_id', $request->user()->id)->findOrFail($id);
        $item->update(['qty' => $request->qty]);
        return response()->json($item->load('product'));
    }

    public function destroy(Request $request, $id)
    {
        $item = Cart::where('user_id', $request->user()->id)->findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function clear(Request $request)
    {
        Cart::where('user_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Cleared']);
    }
}
