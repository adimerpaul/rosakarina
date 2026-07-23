<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\CompraDetalle;
use App\Models\Producto;
use App\Models\Proveedor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompraController extends Controller{
    function historialCompras($id){
        $historial = \App\Models\CompraDetalle::with('compra','proveedor')
            ->where('producto_id', $id)
            ->orderByDesc('fecha_vencimiento')
            ->get();

        return response()->json($historial);
    }
    public function productosPorVencer(Request $request)
    {
        $dias = (int) ($request->dias ?? 5);
        $proveedorId = $request->proveedor_id;

        $hoy = Carbon::now();
        $limite = $hoy->copy()->addDays($dias);

        $productos = CompraDetalle::with(['producto', 'proveedor', 'compra'])
            ->whereNotNull('fecha_vencimiento')
            ->whereBetween('fecha_vencimiento', [
                $hoy->format('Y-m-d'),
                $limite->format('Y-m-d')
            ])
            ->where('cantidad_venta', '>', 0)
            ->where('estado', 'Activo')
            ->when($proveedorId, function ($q) use ($proveedorId) {
                $q->where('proveedor_id', $proveedorId);
            })
            ->orderBy('fecha_vencimiento')
            ->get();

        return response()->json($productos);
    }

    public function productosVencidos(Request $request)
    {
        $hoy = Carbon::now()->format('Y-m-d');
        $perPage = $request->per_page ?? 10;

        $productos = \App\Models\CompraDetalle::with('producto')
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<', $hoy)
            ->orderBy('fecha_vencimiento', 'desc')
            ->where('cantidad_venta', '>', 0)
            ->where('estado', 'Activo')
            ->paginate($perPage);

        return response()->json($productos);
    }


    public function index(Request $request)
    {
        $authUser = $request->user();

        $query = Compra::with(['user', 'proveedor', 'compraDetalles.producto'])
            ->orderByDesc('fecha')
            ->orderByDesc('id');

        // ==========================
        // FILTRO POR FECHAS
        // ==========================
        if ($request->filled('fechaInicio') && $request->filled('fechaFin')) {
            $query->whereBetween('fecha', [$request->fechaInicio, $request->fechaFin]);
        }

        // ==========================
        // FILTRO POR USUARIO (ADMIN)
        // ==========================
        // En el front mandas: user: '' (todos) o user: id
        if ($request->filled('user')) {
            $query->where('user_id', $request->user);
        }

        // ==========================
        // FILTRO POR PROVEEDOR (NUEVO)
        // ==========================
        // En el front manda: proveedor_id: '' o proveedor_id: id
        if ($request->filled('proveedor_id')) {
            $query->where('proveedor_id', $request->proveedor_id);
        }

        // ==========================
        // REGLA POR ROL
        // ==========================
        // si no es admin => solo ve sus compras (aunque manden user/proveedor)
        if (strtolower($authUser->role ?? '') !== 'administrador') {
            $query->where('user_id', $authUser->id);
        }

        return $query->get();
    }


    public function anular($id)
    {
        DB::beginTransaction();
        try {
            $compra = Compra::with('compraDetalles')->findOrFail($id);

            if ($compra->estado === 'Anulado') {
                return response()->json(['message' => 'La compra ya fue anulada'], 400);
            }

            foreach ($compra->compraDetalles as $detalle) {
                Producto::where('id', $detalle->producto_id)->decrement('stock', $detalle->cantidad);
                $detalle->estado = 'Anulado';
                $detalle->save();
            }

            $compra->estado = 'Anulado';
            $compra->save();

            DB::commit();
            return response()->json(['message' => 'Compra anulada correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al anular la compra', 'error' => $e->getMessage()], 500);
        }
    }


    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $fecha = Carbon::now()->format('Y-m-d');
            $hora = Carbon::now()->format('H:i:s');

            // Crear la compra
            $proveedor = Proveedor::find($request->proveedor_id);
//            error_log('Proveedor: ' . json_encode($proveedor));
//            error_log('Ci:' . $proveedor->ci);
            $compra = Compra::create([
                'user_id' => auth()->id(),
                'proveedor_id' => $request->proveedor_id ?? null,
                'fecha' => $fecha,
                'hora' => $hora,
                'ci' => $proveedor->ci ?? null,
                'nombre' => $proveedor->nombre ?? null,
                'estado' => 'Activo',
                'tipo_pago' => $request->tipo_pago,
                'total' => 0,
                'nro_factura' => $request->nro_factura ?? null,
            ]);

            // Crear los detalles
            $totalCompra = 0;
            foreach ($request->productos as $p) {
                $cantidad = (float)($p['cantidad'] ?? 0);
                $factor = (float)($p['factor'] ?? 0);
                $precioVenta = (float)($p['precio_venta'] ?? 0);

                // Precio factura: si no lo llenaron, derivarlo del precio de venta / factor
                $precio = (float)($p['precio'] ?? 0);
                if ($precio <= 0 && $precioVenta > 0 && $factor > 0) {
                    $precio = round($precioVenta / $factor, 2);
                }

                $totalCompra += $precio * $cantidad;

                CompraDetalle::create([
                    'compra_id' => $compra->id,
                    'user_id' => auth()->id(),
                    'producto_id' => $p['producto_id'],
                    'proveedor_id' => $compra->proveedor_id,
                    'nombre' => $p['producto']['nombre'],
                    'precio' => $precio,
                    'cantidad' => $cantidad,
                    'cantidad_venta' => $cantidad,
                    'factor' => $factor,
                    'total' => round($precio * $cantidad, 2),
                    'precio13' => round($precio * 1.3, 2),
                    'total13' => round($precio * $cantidad * 1.3, 2),
                    'precio_venta' => $precioVenta,
                    'estado' => 'Activo',
                    'lote' => $p['lote'],
                    'fecha_vencimiento' => $p['fecha_vencimiento'],
                    'nro_factura' => $compra->nro_factura,
                ]);

                // Actualizar el stock del producto
//                Producto::where('id', $p['producto_id'])->increment('stock', $p['cantidad']);
                if ($p['precio_venta'] ?? 0 > 0) {
                    Producto::where('id', $p['producto_id'])->update(['precio' => $p['precio_venta']]);
                }
//                $producto = Producto::find($p['producto_id']);
//                $producto->precio = $p['precio_venta'];
//                $producto->save();
            }

            $compra->update(['total' => round($totalCompra, 2)]);

            DB::commit();
            $compraSearch = Compra::with(['user', 'proveedor', 'compraDetalles.producto'])->find($compra->id);
            return $compraSearch;
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al registrar la compra', 'error' => $e->getMessage()], 500);
        }
    }

}
