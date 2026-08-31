<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PreorderSession;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class PreorderSessionController extends Controller
{
    public function index()
    {
        return response()->json(PreorderSession::with('product')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'session_name' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            // Create the session
            $session = PreorderSession::create($request->only([
                'product_id', 'session_name', 'opened_at', 'closed_at', 
                'target_min', 'estimated_delivery', 'status', 'profit_split'
            ]));

            // Update the product with new variants/pricing if provided
            $product = Product::findOrFail($request->product_id);
            $productUpdates = $request->only([
                'price', 'compare_at', 'sizes', 'colors', 'costs'
            ]);
            
            if (!empty($productUpdates)) {
                $product->update($productUpdates);
            }

            DB::commit();
            return response()->json(['message' => 'Success', 'data' => $session]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create session', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        return response()->json(PreorderSession::with('product')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $session = PreorderSession::findOrFail($id);
        
        DB::beginTransaction();
        try {
            $session->update($request->only([
                'session_name', 'opened_at', 'closed_at', 
                'target_min', 'estimated_delivery', 'status', 'profit_split'
            ]));

            $product = Product::findOrFail($session->product_id);
            $productUpdates = $request->only([
                'price', 'compare_at', 'sizes', 'colors', 'costs'
            ]);
            
            if (!empty($productUpdates)) {
                $product->update($productUpdates);
            }

            DB::commit();
            return response()->json(['message' => 'Success', 'data' => $session]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update session', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $session = PreorderSession::findOrFail($id);
        $session->delete();
        return response()->json(['message' => 'Success']);
    }
}
