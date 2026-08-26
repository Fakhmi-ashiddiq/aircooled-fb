<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RajaOngkirService
{
    protected $key;
    protected $origin;
    protected $baseUrl = 'https://rajaongkir.komerce.id/api/v1';

    public function __construct()
    {
        $this->key = config('services.rajaongkir.key');
        $this->origin = config('services.rajaongkir.origin');
    }

    public function getCost($destination, $weight = 1000, $courier = 'jne')
    {
        if (empty($this->key)) {
            return [
                'results' => [
                    ['service' => 'JNE REG', 'cost' => 9000, 'etd' => '2-3'],
                    ['service' => 'JNE OKE', 'cost' => 7000, 'etd' => '3-5'],
                    ['service' => 'JNE YES', 'cost' => 22000, 'etd' => '1-1'],
                ],
            ];
        }

        $response = Http::withoutVerifying()->withHeaders([
            'key' => $this->key,
        ])->asForm()->post($this->baseUrl . '/calculate/domestic-cost', [
            'origin' => $this->origin,
            'destination' => $destination,
            'weight' => $weight,
            'courier' => $courier,
            'price' => 'lowest',
        ]);

        if ($response->failed()) {
            return ['results' => [], 'error' => 'Gagal menghitung ongkir'];
        }

        $data = $response->json();
        $results = [];

        $items = $data['data'] ?? [];
        if (is_array($items)) {
            foreach ($items as $item) {
                $service = $item['service'] ?? '';
                $description = $item['description'] ?? '';
                $results[] = [
                    'service' => $service . ' - ' . $description,
                    'code' => $item['code'] ?? 'jne',
                    'cost' => $item['cost'] ?? 0,
                    'etd' => $item['etd'] ?? '-',
                ];
            }
        }

        return ['results' => $results];
    }

    public function searchDestination($search)
    {
        if (empty($this->key)) {
            return ['results' => []];
        }

        $response = Http::withoutVerifying()->withHeaders([
            'key' => $this->key,
        ])->get($this->baseUrl . '/destination/domestic-destination', [
            'search' => $search,
        ]);

        if ($response->failed()) {
            return ['results' => []];
        }

        $data = $response->json();
        $results = [];

        $items = $data['data'] ?? [];
        if (is_array($items)) {
            foreach ($items as $item) {
                $results[] = [
                    'id' => $item['id'] ?? null,
                    'label' => $item['label'] ?? '',
                    'city_name' => $item['city_name'] ?? '',
                    'province_name' => $item['province_name'] ?? '',
                    'district_name' => $item['district_name'] ?? '',
                    'subdistrict_name' => $item['subdistrict_name'] ?? '',
                    'zip_code' => $item['zip_code'] ?? '',
                ];
            }
        }

        return ['results' => $results];
    }
}
