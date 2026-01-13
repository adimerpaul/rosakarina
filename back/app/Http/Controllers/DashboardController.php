<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $desde = $request->input('desde');
        $hasta = $request->input('hasta');

        // Defaults: mes actual [YYYY-MM-01 .. YYYY-MM-DD]
        if (!$desde || !$hasta) {
            $desde = now()->startOfMonth()->toDateString();
            $hasta = now()->toDateString();
        }

        // Helpers
        $isGastoSql = "LOWER(COALESCE(tipo_comprobante,'')) = 'gastos'";
        $isVentaSql = "LOWER(COALESCE(tipo_comprobante,'')) <> 'gastos'";

        // ==========================
        // ÚLTIMOS MOVIMIENTOS (VENTAS + GASTOS)
        // ==========================
        $movimientos = Venta::with(['doctor', 'user', 'cliente', 'ventaDetalles'])
            ->where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->orderByDesc('fecha')
            ->orderByDesc('hora')
            ->orderByDesc('id')
            ->take(15)
            ->get();

        // ==========================
        // KPIs (solo ACTIVAS)
        // ventasTotal: tipo_comprobante != gastos
        // gastosTotal: tipo_comprobante == gastos
        // ganancia: ventas - gastos
        // ==========================
        $kpis = Venta::selectRaw("
                SUM(CASE WHEN {$isVentaSql} THEN total ELSE 0 END) as ventas,
                SUM(CASE WHEN {$isGastoSql} THEN total ELSE 0 END) as gastos
            ")
            ->where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->first();

        $ventasTotal = (float) ($kpis->ventas ?? 0);
        $gastosTotal = (float) ($kpis->gastos ?? 0);
        $ganancia    = $ventasTotal - $gastosTotal;

        // ==========================
        // MOVIMIENTOS DIARIOS (2 series: ventas y gastos)
        // ==========================
        $porDia = Venta::where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->selectRaw("
                DATE(fecha) as dia,
                SUM(CASE WHEN {$isVentaSql} THEN total ELSE 0 END) as ventas,
                SUM(CASE WHEN {$isGastoSql} THEN total ELSE 0 END) as gastos
            ")
            ->groupBy('dia')
            ->orderBy('dia')
            ->get();

        $dias = $porDia->pluck('dia');
        $ventasDiarias = $porDia->pluck('ventas')->map(fn($v) => (float)$v);
        $gastosDiarios = $porDia->pluck('gastos')->map(fn($v) => (float)$v);

        // ==========================
        // SERIES MENSUALES (AÑO ACTUAL): Ventas vs Gastos
        // ==========================
        $anio = now()->year;

        $ventasMesRaw = Venta::where('estado', 'Activo')
            ->whereYear('fecha', $anio)
            ->selectRaw("MONTH(fecha) as m, SUM(CASE WHEN {$isVentaSql} THEN total ELSE 0 END) as total")
            ->groupBy('m')
            ->pluck('total', 'm');

        $gastosMesRaw = Venta::where('estado', 'Activo')
            ->whereYear('fecha', $anio)
            ->selectRaw("MONTH(fecha) as m, SUM(CASE WHEN {$isGastoSql} THEN total ELSE 0 END) as total")
            ->groupBy('m')
            ->pluck('total', 'm');

        $meses = [];
        $ventasMes = [];
        $gastosMes = [];
        for ($m = 1; $m <= 12; $m++) {
            $meses[]     = date('M', mktime(0, 0, 0, $m, 1));
            $ventasMes[] = (float) ($ventasMesRaw[$m] ?? 0);
            $gastosMes[] = (float) ($gastosMesRaw[$m] ?? 0);
        }

        // ==========================
        // VENTAS POR USUARIO (rango) - SOLO VENTAS (no gastos)
        // ==========================
        $ventasPorUsuario = Venta::where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->whereRaw($isVentaSql)
            ->join('users', 'users.id', '=', 'ventas.user_id')
            ->selectRaw("users.name as usuario, SUM(ventas.total) as total")
            ->groupBy('users.name')
            ->orderByDesc('total')
            ->limit(12)
            ->get();

        $usuarios = $ventasPorUsuario->pluck('usuario');
        $ventasUsuarios = $ventasPorUsuario->pluck('total')->map(fn($v) => (float)$v);

        return response()->json([
            'movimientos' => $movimientos,

            'kpis' => [
                'ventas'   => $ventasTotal,
                'gastos'   => $gastosTotal,
                'ganancia' => (float) $ganancia,
            ],

            // bar: diario (2 series)
            'dias'          => $dias,
            'ventasDiarias' => $ventasDiarias,
            'gastosDiarios' => $gastosDiarios,

            // line: mensual (año)
            'meses'     => $meses,
            'ventasMes' => $ventasMes,
            'gastosMes' => $gastosMes,

            // bar: ventas por usuario (rango)
            'usuarios'       => $usuarios,
            'ventasUsuarios' => $ventasUsuarios,

            'desde' => $desde,
            'hasta' => $hasta,
        ]);
    }
}
