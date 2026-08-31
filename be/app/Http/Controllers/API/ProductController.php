<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['productImages', 'productParent', 'preorderSessions'])->orderByDesc('created_at')->get();
        $committed = OrderItem::select('product_id', DB::raw('SUM(qty) as total_qty'))
            ->where('type', 'preorder')
            ->whereHas('order', fn($q) => $q->whereIn('status', ['Awaiting', 'Paid', 'Producing', 'Shipping']))
            ->groupBy('product_id')
            ->pluck('total_qty', 'product_id');

        $paidStats = OrderItem::select('product_id', DB::raw('SUM(qty) as total_sold'))
            ->whereHas('order', fn($q) => $q->where('status', 'Paid'))
            ->groupBy('product_id')
            ->get()
            ->keyBy('product_id');

        $paidOrderIds = OrderItem::select('order_id')
            ->whereHas('order', fn($q) => $q->where('status', 'Paid'))
            ->groupBy('order_id')
            ->pluck('order_id');

        $orderTotals = DB::table('orders')
            ->whereIn('id', $paidOrderIds)
            ->pluck('total', 'id');

        $productOrders = OrderItem::select('product_id', 'order_id')
            ->whereIn('order_id', $paidOrderIds)
            ->groupBy('product_id', 'order_id')
            ->get()
            ->groupBy('product_id')
            ->map(fn($items) => $items->pluck('order_id')->toArray());

        $products->each(function ($p) use ($committed, $paidStats, $orderTotals, $productOrders) {
            $p->committed = $committed->get($p->id, 0);
            $stats = $paidStats->get($p->id);
            $p->totalSold = $stats->total_sold ?? 0;
            $orderIds = $productOrders->get($p->id, []);
            $p->totalRevenue = collect($orderIds)->sum(fn($oid) => $orderTotals->get($oid, 0));
        });

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $data = Product::create($request->except(['images', 'defaultImg', 'heroImg']));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $idx => $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('products/' . $data->id, 'public');
                    $data->productImages()->create(['src' => $path]);
                } elseif ($file) {
                    return response()->json([
                        'message' => 'File "' . $file->getClientOriginalName() . '" gagal diupload (maks 10MB)',
                    ], 422);
                }
            }
        }

        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function show($id)
    {
        $data = Product::with(['productImages', 'productParent', 'preorderSessions'])->where('id', $id)->orWhere('code', $id)->firstOrFail();
        $data->increment('views');
        $committed = OrderItem::where('product_id', $data->id)
            ->where('type', 'preorder')
            ->whereHas('order', fn($q) => $q->whereIn('status', ['Awaiting', 'Paid', 'Producing', 'Shipping']))
            ->sum('qty');

        $paidStats = OrderItem::where('product_id', $data->id)
            ->whereHas('order', fn($q) => $q->where('status', 'Paid'))
            ->selectRaw('SUM(qty) as total_sold')
            ->first();

        $orderIds = OrderItem::where('product_id', $data->id)
            ->whereHas('order', fn($q) => $q->where('status', 'Paid'))
            ->select('order_id')
            ->distinct()
            ->pluck('order_id');

        $totalRevenue = DB::table('orders')
            ->whereIn('id', $orderIds)
            ->sum('total');

        $data->committed = $committed;
        $data->totalSold = $paidStats->total_sold ?? 0;
        $data->totalRevenue = $totalRevenue;

        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $data = Product::where('id', $id)->orWhere('code', $id)->firstOrFail();
        $data->update($request->except(['images', 'defaultImg', 'heroImg', 'existingImages', 'removedImages']));

        $hasNewFiles = $request->hasFile('images') && count(array_filter($request->file('images'), fn($f) => $f && $f->isValid())) > 0;
        $existingImages = $request->input('existingImages', []);
        $removedImages = $request->input('removedImages', []);

        if ($hasNewFiles || count($existingImages) > 0 || count($removedImages) > 0) {
            $existingPaths = is_string($existingImages) ? json_decode($existingImages, true) : $existingImages;
            $removedPaths = is_string($removedImages) ? json_decode($removedImages, true) : $removedImages;

            $normalizePath = function ($path) {
                $path = trim($path);
                $path = preg_replace('#^https?://[^/]+/storage/#', '', $path);
                return $path;
            };

            $normalizedRemoved = array_map($normalizePath, $removedPaths);
            $normalizedExisting = array_map($normalizePath, $existingPaths);

            foreach ($data->productImages as $oldImage) {
                if (in_array($normalizePath($oldImage->src), $normalizedRemoved)) {
                    Storage::disk('public')->delete($oldImage->src);
                }
            }
            $data->productImages()->delete();

            foreach ($normalizedExisting as $path) {
                if ($path && Storage::disk('public')->exists($path)) {
                    $data->productImages()->create(['src' => $path]);
                }
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $idx => $file) {
                    if ($file && $file->isValid()) {
                        $path = $file->store('products/' . $data->id, 'public');
                        $data->productImages()->create(['src' => $path]);
                    } elseif ($file) {
                        return response()->json([
                            'message' => 'File "' . $file->getClientOriginalName() . '" gagal diupload (maks 10MB)',
                        ], 422);
                    }
                }
            }
        }

        return response()->json(['message' => 'Success', 'data' => $data]);
    }

    public function destroy($id)
    {
        $data = Product::where('id', $id)->orWhere('code', $id)->firstOrFail();

        foreach ($data->productImages as $image) {
            Storage::disk('public')->delete($image->src);
        }

        $data->delete();
        return response()->json(['message' => 'Success']);
    }
}
