<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with(['items.product', 'product'])->get());
    }

    public function store(Request $request)
    {
        $order = Order::create($request->except('order_items'));

        if ($request->has('order_items') && is_array($request->order_items)) {
            foreach ($request->order_items as $item) {
                $order->items()->create($item);
            }
        }

        return response()->json(['message' => 'Success', 'data' => $order->load(['items.product', 'product'])], 201);
    }

    public function show($id)
    {
        $data = Order::with(['items.product', 'product'])->findOrFail($id);
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->except('order_items'));

        if ($request->has('order_items') && is_array($request->order_items)) {
            $order->items()->delete();
            foreach ($request->order_items as $item) {
                $order->items()->create($item);
            }
        }

        return response()->json(['message' => 'Success', 'data' => $order->load(['items.product', 'product'])]);
    }

    public function destroy($id)
    {
        $data = Order::findOrFail($id);
        $data->delete();
        return response()->json(['message' => 'Success']);
    }
}
