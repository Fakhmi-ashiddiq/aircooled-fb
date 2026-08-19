<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('productImages')->get());
    }

    public function store(Request $request)
    {
        
        $data = Product::create($request->except(['images', 'defaultImg', 'heroImg']));
        if ($request->has('images')) {
            foreach($request->images as $img) {
                $data->productImages()->create(['src' => is_string($img) ? $img : ($img['src'] ?? '')]);
            }
        }
        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function show($id)
    {
        $data = Product::with('productImages')->where('id', $id)->orWhere('code', $id)->firstOrFail();
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $data = Product::where('id', $id)->orWhere('code', $id)->firstOrFail();
        
        $data->update($request->except(['images', 'defaultImg', 'heroImg']));
        if ($request->has('images')) {
            $data->productImages()->delete();
            foreach($request->images as $img) {
                $data->productImages()->create(['src' => is_string($img) ? $img : ($img['src'] ?? '')]);
            }
        }
        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function destroy($id)
    {
        $data = Product::where('id', $id)->orWhere('code', $id)->firstOrFail();
        $data->delete();
        return response()->json(['message' => 'Success']);
    }
}
