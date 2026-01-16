<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user  = $request->user();
        $desde = $request->input('desde');
        $hasta = $request->input('hasta');

        if (!$desde || !$hasta) {
            $desde = now()->startOfMonth()->toDateString();
            $hasta = now()->toDateString();
        }

        $isAdmin = strtolower($user->role) === 'administrador';

        $baseQuery = Venta::where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta]);

        if (!$isAdmin) {
            $baseQuery->where('user_id', $user->id);
        }

        $isGastoSql = "LOWER(COALESCE(tipo_comprobante,'')) = 'gastos'";
        $isVentaSql = "LOWER(COALESCE(tipo_comprobante,'')) <> 'gastos'";

        /* ==========================
         * MOVIMIENTOS
         * ========================== */
        $movimientos = (clone $baseQuery)
            ->with(['user', 'cliente'])
            ->orderByDesc('fecha')
            ->orderByDesc('hora')
            ->limit(15)
            ->get();

        /* ==========================
         * KPIs
         * ========================== */
        $kpis = (clone $baseQuery)
            ->selectRaw("
                SUM(CASE WHEN {$isVentaSql} THEN total ELSE 0 END) as ventas,
                SUM(CASE WHEN {$isGastoSql} THEN total ELSE 0 END) as gastos
            ")
            ->first();

        $ventasTotal = (float) ($kpis->ventas ?? 0);
        $gastosTotal = (float) ($kpis->gastos ?? 0);

        /* ==========================
         * POR DÍA
         * ========================== */
        $porDia = (clone $baseQuery)
            ->selectRaw("
                DATE(fecha) as dia,
                SUM(CASE WHEN {$isVentaSql} THEN total ELSE 0 END) as ventas,
                SUM(CASE WHEN {$isGastoSql} THEN total ELSE 0 END) as gastos
            ")
            ->groupBy('dia')
            ->orderBy('dia')
            ->get();

        /* ==========================
         * MENSUAL (AÑO ACTUAL)
         * ========================== */
        $anio = now()->year;

        $mensualBase = Venta::where('estado', 'Activo')
            ->whereYear('fecha', $anio);

        if (!$isAdmin) {
            $mensualBase->where('user_id', $user->id);
        }

        $ventasMesRaw = (clone $mensualBase)
            ->selectRaw("MONTH(fecha) m, SUM(CASE WHEN {$isVentaSql} THEN total ELSE 0 END) total")
            ->groupBy('m')
            ->pluck('total', 'm');

        $gastosMesRaw = (clone $mensualBase)
            ->selectRaw("MONTH(fecha) m, SUM(CASE WHEN {$isGastoSql} THEN total ELSE 0 END) total")
            ->groupBy('m')
            ->pluck('total', 'm');

        $meses = $ventasMes = $gastosMes = [];

        for ($m = 1; $m <= 12; $m++) {
            $meses[]     = date('M', mktime(0, 0, 0, $m, 1));
            $ventasMes[] = (float) ($ventasMesRaw[$m] ?? 0);
            $gastosMes[] = (float) ($gastosMesRaw[$m] ?? 0);
        }

        /* ==========================
         * VENTAS POR USUARIO
         * ========================== */
        $ventasUsuariosQuery = Venta::where('estado', 'Activo')
            ->whereBetween('fecha', [$desde, $hasta])
            ->whereRaw($isVentaSql)
            ->join('users', 'users.id', '=', 'ventas.user_id');

        if (!$isAdmin) {
            $ventasUsuariosQuery->where('ventas.user_id', $user->id);
        }

        $ventasPorUsuario = $ventasUsuariosQuery
            ->selectRaw("users.name usuario, SUM(ventas.total) total")
            ->groupBy('users.name')
            ->orderByDesc('total')
            ->limit(12)
            ->get();

        return response()->json([
            'movimientos' => $movimientos,
            'kpis' => [
                'ventas'   => $ventasTotal,
                'gastos'   => $gastosTotal,
                'ganancia' => $ventasTotal - $gastosTotal,
            ],
            'dias'          => $porDia->pluck('dia'),
            'ventasDiarias' => $porDia->pluck('ventas')->map(fn($v) => (float)$v),
            'gastosDiarios' => $porDia->pluck('gastos')->map(fn($v) => (float)$v),
            'meses'         => $meses,
            'ventasMes'     => $ventasMes,
            'gastosMes'     => $gastosMes,
            'usuarios'      => $ventasPorUsuario->pluck('usuario'),
            'ventasUsuarios'=> $ventasPorUsuario->pluck('total')->map(fn($v) => (float)$v),
        ]);
    }
}
