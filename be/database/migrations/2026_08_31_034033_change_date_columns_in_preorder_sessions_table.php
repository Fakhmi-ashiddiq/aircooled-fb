<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $sessions = DB::table('preorder_sessions')->get();
        $months = ['Jan' => '01', 'Feb' => '02', 'Mar' => '03', 'Apr' => '04', 'May' => '05', 'Jun' => '06', 'Jul' => '07', 'Aug' => '08', 'Agu' => '08', 'Sep' => '09', 'Oct' => '10', 'Okt' => '10', 'Nov' => '11', 'Dec' => '12', 'Des' => '12'];
        foreach($sessions as $s) {
            $updates = [];
            foreach(['opened_at', 'closed_at', 'estimated_delivery'] as $col) {
                if ($s->$col && strpos($s->$col, ' ') !== false) {
                    $parts = explode(' ', $s->$col);
                    $d = str_pad($parts[0], 2, '0', STR_PAD_LEFT);
                    $m = $parts[1] ?? 'Jan';
                    $mm = $months[$m] ?? '01';
                    $updates[$col] = '2026-'.$mm.'-'.$d;
                }
            }
            if (!empty($updates)) {
                DB::table('preorder_sessions')->where('id', $s->id)->update($updates);
            }
        }

        Schema::table('preorder_sessions', function (Blueprint $table) {
            $table->date('opened_at')->nullable()->change();
            $table->date('closed_at')->nullable()->change();
            $table->date('estimated_delivery')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('preorder_sessions', function (Blueprint $table) {
            $table->string('opened_at')->nullable()->change();
            $table->string('closed_at')->nullable()->change();
            $table->string('estimated_delivery')->nullable()->change();
        });
    }
};
