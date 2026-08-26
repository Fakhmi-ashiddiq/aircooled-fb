<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\SizeSet;

class SizeSetController extends Controller
{
    public function index()
    {
        return response()->json(SizeSet::all());
    }

    public function store(Request $request)
    {
        $data = SizeSet::create($request->all());
        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function show($id)
    {
        $data = SizeSet::findOrFail($id);
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $data = SizeSet::findOrFail($id);

        if ($request->hasFile('guideImg')) {
            if ($data->guideImg && Storage::disk('public')->exists($data->guideImg)) {
                Storage::disk('public')->delete($data->guideImg);
            }
            $path = $request->file('guideImg')->store('size-sets', 'public');
            $data->guideImg = $path;
            $data->save();
        } else {
            $data->update($request->except(['guideImg']));
        }

        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function destroy($id)
    {
        $data = SizeSet::findOrFail($id);
        $data->delete();
        return response()->json(['message' => 'Success']);
    }
}
