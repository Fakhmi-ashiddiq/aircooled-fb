<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with(['items.product', 'product'])->orderByDesc('created_at')->get());
    }

    public function store(Request $request)
    {
        $order = Order::create($request->except('order_items'));

        if ($request->has('user_id') && $request->user_id) {
            $user = \App\Models\User::find($request->user_id);
            if ($user) {
                $user->update([
                    'phone' => $request->input('phone', $user->phone),
                    'address' => $request->input('address', $user->address),
                    'city_id' => $request->input('city_id', $user->city_id),
                    'city_name' => $request->input('city_name', $user->city_name),
                    'postal_code' => $request->input('postal_code', $user->postal_code)
                ]);
            }
        }

        if ($request->has('order_items') && is_array($request->order_items)) {
            foreach ($request->order_items as $item) {
                $order->items()->create($item);
            }
        }

        return response()->json(['message' => 'Success', 'data' => $order->load(['items.product', 'product'])], 201);
    }

    public function show($id)
    {
        $data = Order::with(['items.product', 'product'])->where('id', $id)->orWhere('code', $id)->firstOrFail();
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $order = Order::where('id', $id)->orWhere('code', $id)->firstOrFail();
        $previousStatus = $order->status;
        $order->update($request->except('order_items'));

        if ($request->has('order_items') && is_array($request->order_items)) {
            $order->items()->delete();
            foreach ($request->order_items as $item) {
                $order->items()->create($item);
            }
        }

        if ($previousStatus !== 'Paid' && $request->input('status') === 'Paid') {
            $items = $order->items()->with('product')->get();
            foreach ($items as $item) {
                if ($item->product && $item->product->type === 'ready' && !empty($item->size)) {
                    $product = $item->product;
                    $rawStock = $product->getRawOriginal('stock');
                    $stock = is_string($rawStock) ? json_decode($rawStock, true) : (is_array($rawStock) ? $rawStock : []);
                    $size = $item->size;
                    $qty = $item->qty ?? 1;
                    if (is_array($stock) && isset($stock[$size])) {
                        $stock[$size] = max(0, $stock[$size] - $qty);
                        $product->stock = $stock;
                        $product->save();
                    }
                }
            }
        }

        return response()->json(['message' => 'Success', 'data' => $order->load(['items.product', 'product'])]);
    }

    public function destroy($id)
    {
        $data = Order::where('id', $id)->orWhere('code', $id)->firstOrFail();
        $data->delete();
        return response()->json(['message' => 'Success']);
    }
}
