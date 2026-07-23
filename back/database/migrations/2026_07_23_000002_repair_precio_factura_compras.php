<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Reparar compras antiguas: el precio factura nunca se guardó (quedó en 0).
     * Se reconstruye desde precio_venta / factor y se recalculan los totales.
     */
    public function up(): void
    {
        // 1) Detalles: precio factura = precio_venta / factor (solo donde falta)
        DB::statement("
            UPDATE compra_detalles
            SET precio   = ROUND(precio_venta / factor, 2),
                total    = ROUND(ROUND(precio_venta / factor, 2) * cantidad, 2),
                precio13 = ROUND(ROUND(precio_venta / factor, 2) * 1.3, 2),
                total13  = ROUND(ROUND(precio_venta / factor, 2) * cantidad * 1.3, 2)
            WHERE (precio IS NULL OR precio = 0)
              AND COALESCE(precio_venta, 0) > 0
              AND COALESCE(factor, 0) > 0
        ");

        // 2) Cabeceras: total = suma de los totales de sus detalles no eliminados
        DB::statement("
            UPDATE compras c
            SET c.total = (
                SELECT COALESCE(SUM(cd.total), 0)
                FROM compra_detalles cd
                WHERE cd.compra_id = c.id
                  AND cd.deleted_at IS NULL
            )
            WHERE COALESCE(c.total, 0) = 0
        ");
    }

    public function down(): void
    {
        // Reparación de datos: no reversible.
    }
};
