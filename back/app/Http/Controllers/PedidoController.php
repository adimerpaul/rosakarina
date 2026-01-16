<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\PedidoDetalle;
use App\Models\Producto;
use App\Models\Proveedor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    public function index(Request $request)
    {
        $authUser = $request->user();

        $query = Pedido::with(['user', 'proveedor', 'detalles.producto'])
            ->orderByDesc('fecha')
            ->orderByDesc('id');

        if ($request->filled('fechaInicio') && $request->filled('fechaFin')) {
            $query->whereBetween('fecha', [$request->fechaInicio, $request->fechaFin]);
        }

        if ($request->filled('user')) {
            $query->where('user_id', $request->user);
        }

        if ($request->filled('proveedor_id')) {
            $query->where('proveedor_id', $request->proveedor_id);
        }

        if (strtolower($authUser->role ?? '') !== 'administrador') {
            $query->where('user_id', $authUser->id);
        }

        return $query->get();
    }

    public function show($id)
    {
        return Pedido::with(['user', 'proveedor', 'detalles.producto'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'proveedor_id' => 'nullable|integer',
            'telefono' => 'nullable|string|max:50',
            'observacion' => 'nullable|string',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|integer|exists:productos,id',
            'productos.*.cantidad' => 'required|numeric|min:0.01',
        ]);

        DB::beginTransaction();
        try {
            $fecha = Carbon::now()->format('Y-m-d');
            $hora  = Carbon::now()->format('H:i:s');

            $proveedor = null;
            if ($request->filled('proveedor_id')) {
                $proveedor = Proveedor::find($request->proveedor_id);
            }

            $pedido = Pedido::create([
                'user_id' => auth()->id(),
                'proveedor_id' => $request->proveedor_id,
                'fecha' => $fecha,
                'hora' => $hora,
                'proveedor_nombre' => $proveedor->nombre ?? null,
                'telefono' => $request->telefono ?? ($proveedor->telefono ?? null),
                'subtotal' => 0,
                'estado' => 'Activo',
                'observacion' => $request->observacion,
            ]);

            $subtotalPedido = 0;

            foreach ($request->productos as $p) {
                $producto = Producto::findOrFail($p['producto_id']);
                $cantidad = (float) $p['cantidad'];
                $precio   = (float) ($producto->precio ?? 0);
                $sub      = round($cantidad * $precio, 2);

                PedidoDetalle::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'precio' => $precio,
                    'cantidad' => $cantidad,
                    'subtotal' => $sub,
                    'estado' => 'Activo',
                ]);

                $subtotalPedido += $sub;
            }

            $pedido->subtotal = round($subtotalPedido, 2);
            $pedido->save();

            DB::commit();
            return Pedido::with(['user', 'proveedor', 'detalles.producto'])->find($pedido->id);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al registrar el pedido', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $pedido = Pedido::with('detalles')->findOrFail($id);

        $request->validate([
            'proveedor_id' => 'nullable|integer',
            'telefono' => 'nullable|string|max:50',
            'observacion' => 'nullable|string',
            'estado' => 'nullable|string',
            'productos' => 'nullable|array',
            'productos.*.producto_id' => 'required_with:productos|integer|exists:productos,id',
            'productos.*.cantidad' => 'required_with:productos|numeric|min:0.01',
        ]);

        DB::beginTransaction();
        try {
            if ($request->filled('proveedor_id')) {
                $proveedor = Proveedor::find($request->proveedor_id);
                $pedido->proveedor_id = $request->proveedor_id;
                $pedido->proveedor_nombre = $proveedor->nombre ?? null;
                $pedido->telefono = $request->telefono ?? ($proveedor->telefono ?? null);
            } else {
                $pedido->proveedor_id = null;
                $pedido->proveedor_nombre = null;
                $pedido->telefono = $request->telefono;
            }

            if ($request->filled('observacion')) $pedido->observacion = $request->observacion;
            if ($request->filled('estado')) $pedido->estado = $request->estado;

            // si mandan productos => reemplaza detalles
            if (is_array($request->productos)) {
                PedidoDetalle::where('pedido_id', $pedido->id)->delete();

                $subtotalPedido = 0;
                foreach ($request->productos as $p) {
                    $producto = Producto::findOrFail($p['producto_id']);
                    $cantidad = (float) $p['cantidad'];
                    $precio   = (float) ($producto->precio ?? 0);
                    $sub      = round($cantidad * $precio, 2);

                    PedidoDetalle::create([
                        'pedido_id' => $pedido->id,
                        'producto_id' => $producto->id,
                        'nombre' => $producto->nombre,
                        'precio' => $precio,
                        'cantidad' => $cantidad,
                        'subtotal' => $sub,
                        'estado' => 'Activo',
                    ]);

                    $subtotalPedido += $sub;
                }
                $pedido->subtotal = round($subtotalPedido, 2);
            }

            $pedido->save();
            DB::commit();

            return Pedido::with(['user', 'proveedor', 'detalles.producto'])->find($pedido->id);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar el pedido', 'error' => $e->getMessage()], 500);
        }
    }

    public function anular($id)
    {
        DB::beginTransaction();
        try {
            $pedido = Pedido::with('detalles')->findOrFail($id);
            if ($pedido->estado === 'Anulado') {
                return response()->json(['message' => 'El pedido ya fue anulado'], 400);
            }

            $pedido->estado = 'Anulado';
            $pedido->save();

            foreach ($pedido->detalles as $d) {
                $d->estado = 'Anulado';
                $d->save();
            }

            DB::commit();
            return response()->json(['message' => 'Pedido anulado correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al anular el pedido', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $pedido = Pedido::findOrFail($id);
        $pedido->delete();
        return response()->json(['message' => 'Pedido eliminado']);
    }
}
