<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductParent;

class ProductParentController extends Controller
{
    public function index()
    {
        return response()->json(ProductParent::all());
    }

    public function store(Request $request)
    {
        $data = ProductParent::create($request->all());
        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function show($id)
    {
        return response()->json(ProductParent::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = ProductParent::findOrFail($id);
        $data->update($request->all());
        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function destroy($id)
    {
        ProductParent::findOrFail($id)->delete();
        return response()->json(['message' => 'Success']);
    }
}
