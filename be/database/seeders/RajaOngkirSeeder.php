<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class RajaOngkirSeeder extends Seeder
{
    public function run(): void
    {
        $apiKey = env('RAJAONGKIR_API_KEY');
        
        if (!$apiKey) {
            $this->command->error('RAJAONGKIR_API_KEY tidak ditemukan di .env');
            return;
        }

        $this->command->info('Mengambil data kota dari RajaOngkir...');
        
        $cities = [];
        try {
            $response = Http::timeout(5)->withoutVerifying()->withHeaders([
                'key' => $apiKey
            ])->get('https://api.rajaongkir.com/starter/city');
            $cities = $response->json()['rajaongkir']['results'] ?? [];
        } catch (\Exception $e) {
            $this->command->warn('Koneksi ke API timeout/gagal. Menggunakan data kota dummy untuk testing...');
        }

        if (empty($cities)) {
            // Fallback manual cities for testing if network is blocking API
            $cities = [
                ['city_id' => 114, 'province_id' => 1, 'province' => 'Bali', 'type' => 'Kota', 'city_name' => 'Denpasar', 'postal_code' => '80227'],
                ['city_id' => 152, 'province_id' => 6, 'province' => 'DKI Jakarta', 'type' => 'Kota', 'city_name' => 'Jakarta Pusat', 'postal_code' => '10540'],
                ['city_id' => 22, 'province_id' => 9, 'province' => 'Jawa Barat', 'type' => 'Kota', 'city_name' => 'Bandung', 'postal_code' => '40111'],
                ['city_id' => 444, 'province_id' => 11, 'province' => 'Jawa Timur', 'type' => 'Kota', 'city_name' => 'Surabaya', 'postal_code' => '60119']
            ];
        }

        $this->command->info('Menyimpan ' . count($cities) . ' kota ke database...');
        
        $insertData = [];
        foreach ($cities as $city) {
            $insertData[] = [
                'id' => $city['city_id'],
                'province_id' => $city['province_id'],
                'province' => $city['province'],
                'type' => $city['type'],
                'name' => $city['city_name'],
                'postcode' => $city['postal_code']
            ];
        }

        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        DB::table('cities')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
        
        DB::table('cities')->insert($insertData);
        
        $this->command->info('Berhasil menyimpan data kota!');
    }
}
