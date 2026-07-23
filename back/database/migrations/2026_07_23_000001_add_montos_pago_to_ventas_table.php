<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->decimal('monto_efectivo', 10, 2)->default(0)->after('tipo_pago');
            $table->decimal('monto_qr', 10, 2)->default(0)->after('monto_efectivo');
        });

        // Reparar pagos antiguos: Efectivo (o sin tipo) => todo a monto_efectivo, QR => todo a monto_qr
        DB::table('ventas')
            ->where('tipo_pago', 'QR')
            ->update(['monto_qr' => DB::raw('COALESCE(total, 0)')]);

        DB::table('ventas')
            ->where(function ($q) {
                $q->where('tipo_pago', '!=', 'QR')->orWhereNull('tipo_pago');
            })
            ->update(['monto_efectivo' => DB::raw('COALESCE(total, 0)')]);
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn(['monto_efectivo', 'monto_qr']);
        });
    }
};
