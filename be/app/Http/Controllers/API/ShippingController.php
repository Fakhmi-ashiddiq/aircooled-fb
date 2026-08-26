<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\RajaOngkirService;

class ShippingController extends Controller
{
    public function cost(Request $request)
    {
        $request->validate([
            'destination' => 'required|integer',
            'weight' => 'nullable|integer|min:1',
        ]);

        $service = new RajaOngkirService();
        $result = $service->getCost(
            $request->destination,
            $request->input('weight', 1000),
            $request->input('courier', 'jne')
        );

        return response()->json($result);
    }

    public function searchDestination(Request $request)
    {
        $request->validate([
            'search' => 'required|string|min:2',
        ]);

        $service = new RajaOngkirService();
        $result = $service->searchDestination($request->search);

        return response()->json($result);
    }
}
