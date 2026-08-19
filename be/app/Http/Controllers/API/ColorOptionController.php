<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ColorOption;

class ColorOptionController extends Controller
{
    public function index()
    {
        return response()->json(ColorOption::all());
    }

    public function store(Request $request)
    {
        $data = ColorOption::create($request->all());
        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function show($id)
    {
        $data = ColorOption::findOrFail($id);
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $data = ColorOption::findOrFail($id);
        $data->update($request->all());
        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function destroy($id)
    {
        $data = ColorOption::findOrFail($id);
        $data->delete();
        return response()->json(['message' => 'Success']);
    }
}
