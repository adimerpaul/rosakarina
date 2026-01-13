<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\CompraDetalle;
use App\Models\Producto;
use App\Models\Receta;
use App\Models\Venta;
use App\Models\VentaDetalle;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    // ✅ NUEVO: registrar gasto sin tabla extra
    public function storeGasto(Request $request)
    {
        DB::beginTransaction();
        try {
            $fecha = $request->input('fecha') ?? date('Y-m-d');
            $concepto = trim((string)$request->input('concepto', ''));
            $monto = (float)$request->input('monto', 0);
            $tipoPago = $request->input('tipo_pago', 'Efectivo');

            if ($concepto === '') abort(422, 'Ingrese el concepto del gasto.');
            if ($monto <= 0) abort(422, 'Ingrese un monto válido.');

            /** @var Venta $venta */
            $venta = Venta::create([
                'user_id'          => auth()->id(),
                'cliente_id'       => null,
                'fecha'            => $fecha,
                'hora'             => date('H:i:s'),
                'ci'               => '0',
                'nombre'           => $concepto,
                'estado'           => 'Activo',

                // ✅ clave: aquí va el comprobante
                'tipo_comprobante' => 'Gastos',

                // no afecta chips Interno/Externo si no quieres, lo dejas null o algo fijo
                'tipo_venta'       => null,

                'total'            => $monto,
                'tipo_pago'        => $tipoPago,
                'pagado_interno'   => false,
            ]);

            DB::commit();
            return Venta::with('user', 'cliente', 'ventaDetalles')->findOrFail($venta->id);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al guardar gasto: ' . $e->getMessage()], 500);
        }
    }

    public function ventasDevolverProducto(Request $request)
    {
        DB::beginTransaction();
        try {
            $ventaId = (int)$request->input('venta_id', 0);
            $ventaDetalleId = (int)$request->input('venta_detalle_id', 0);
            $cantidad = (float)$request->input('cantidad', 0);

            /** @var VentaDetalle $vd */
            $vd = VentaDetalle::where('id', $ventaDetalleId)
                ->where('venta_id', $ventaId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($cantidad <= 0 || $cantidad > (float)$vd->cantidad) {
                abort(422, 'Cantidad inválida para la devolución.');
            }

            // Restaurar stock en el lote
            if ($vd->compra_detalle_id) {
                $cd = CompraDetalle::where('id', $vd->compra_detalle_id)
                    ->lockForUpdate()
                    ->first();
                if ($cd) {
                    $cd->cantidad_venta = (float)$cd->cantidad_venta + $cantidad;
                    $cd->save();
                }
            }

            // Actualizar detalle de venta
            $precioDet = (float)$vd->precio; // guardar antes por si se borra
            $vd->cantidad = (float)$vd->cantidad - $cantidad;
            if ($vd->cantidad <= 1e-9) {
                $vd->delete();
            } else {
                $vd->save();
            }

            // Actualizar total de venta
            $venta = Venta::where('id', $ventaId)->lockForUpdate()->firstOrFail();
            $venta->total = (float)$venta->total - ($cantidad * $precioDet);
            if ((float)$venta->total < 0) $venta->total = 0;
            $venta->save();

            DB::commit();
            return response()->json(['message' => 'Devolución procesada correctamente.'], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'No se pudo procesar la devolución: ' . $e->getMessage()], 500);
        }
    }

    public function proformaPacientePdf(\App\Models\Paciente $paciente)
    {
        $paciente->load([
            'pacienteVentas' => function ($q) {
                $q->orderBy('fecha', 'asc');
            },
            'pacienteVentas.venta' => function ($q) {
                $q->with(['ventaDetalles.producto', 'doctor']);
            },
            'pacienteVentas.user'
        ]);

        $totalGeneral = 0;
        foreach ($paciente->pacienteVentas as $pv) {
            $venta = $pv->venta;
            if (!$venta) continue;

            if ($venta->total === null) {
                $subtotal = 0;
                foreach ($venta->ventaDetalles as $d) {
                    $subtotal += floatval($d->cantidad) * floatval($d->precio);
                }
                $venta->total = $subtotal;
            }
            $totalGeneral += floatval($venta->total);
        }

        $hoy = now();

        $pdf = Pdf::loadView('pdf.proforma_paciente', [
            'paciente'       => $paciente,
            'pacienteVentas' => $paciente->pacienteVentas,
            'totalGeneral'   => $totalGeneral,
            'hoy'            => $hoy,
        ])->setPaper('letter');

        return $pdf->stream('proforma_paciente_'.$paciente->id.'.pdf');
    }

    public function searchCliente(Request $request)
    {
        $nit = trim((string)$request->input('nit', ''));
        if ($nit === '') return response()->json([]);

        $c = Cliente::where('ci', $nit)->first();
        if (!$c) return response()->json([]);

        return response()->json([
            'nombre' => $c->nombre,
            'email' => $c->email ?? null,
            'codigoTipoDocumentoIdentidad' => 1,
            'complemento' => $c->complemento ?? null,
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $cliente = $this->clienteUpdateOrCreate($request);

            $fecha = $request->input('fecha') ?? date('Y-m-d');
            $request->merge([
                'user_id'    => auth()->id(),
                'cliente_id' => $cliente->id,
                'fecha'      => $fecha,
                'hora'       => date('H:i:s'),
                'estado'     => 'Activo',
                'tipo_comprobante' => 'Venta',
                'tipo_venta' => ($request->input('tipo_venta')=='Interno' || $request->input('tipo_venta')=='Internado') ? 'Internado' : 'Externo',
            ]);

            $venta = Venta::create($request->all());

            $productos = (array)$request->input('productos', []);
            $total = 0.0;

            foreach ($productos as $item) {
                $productoId = (int)($item['producto_id'] ?? 0);
                $cantidad   = (float)($item['cantidad'] ?? 0);
                $precio     = (float)($item['precio'] ?? 0);

                if ($productoId <= 0 || $cantidad <= 0) {
                    abort(422, 'Producto o cantidad inválida.');
                }

                $producto = Producto::select('id','nombre')->findOrFail($productoId);
                $nombreProducto = $producto->nombre;

                if (!empty($item['compra_detalle_id'])) {
                    $loteId = (int)$item['compra_detalle_id'];

                    $cd = CompraDetalle::where('id', $loteId)
                        ->lockForUpdate()
                        ->firstOrFail();

                    if ((int)$cd->producto_id !== $productoId) {
                        abort(422, 'El lote seleccionado no corresponde al producto.');
                    }
                    if ($cd->estado !== 'Activo') {
                        abort(422, 'El lote seleccionado no está activo.');
                    }
                    if ((float)$cd->cantidad_venta < $cantidad) {
                        abort(422, "Stock insuficiente para '{$nombreProducto}' (disponible: {$cd->cantidad_venta}).");
                    }

                    VentaDetalle::create([
                        'venta_id'          => $venta->id,
                        'producto_id'       => $productoId,
                        'compra_detalle_id' => $cd->id,
                        'nombre'            => $nombreProducto,
                        'cantidad'          => $cantidad,
                        'precio'            => $precio,
                        'lote'              => $cd->lote,
                        'fecha_vencimiento' => $cd->fecha_vencimiento,
                    ]);

                    $cd->cantidad_venta = (float)$cd->cantidad_venta - $cantidad;
                    $cd->save();

                    $total += $cantidad * $precio;
                    continue;
                }

                $restante = $cantidad;

                $lotes = CompraDetalle::where('producto_id', $productoId)
                    ->where('estado', 'Activo')
                    ->whereNull('deleted_at')
                    ->where('cantidad_venta', '>', 0)
                    ->orderByRaw("CASE WHEN fecha_vencimiento IS NULL THEN 1 ELSE 0 END, fecha_vencimiento ASC")
                    ->lockForUpdate()
                    ->get(['id','cantidad_venta','lote','fecha_vencimiento']);

                foreach ($lotes as $l) {
                    if ($restante <= 0) break;

                    $take = min((float)$l->cantidad_venta, $restante);
                    if ($take <= 0) continue;

                    VentaDetalle::create([
                        'venta_id'          => $venta->id,
                        'producto_id'       => $productoId,
                        'compra_detalle_id' => $l->id,
                        'nombre'            => $nombreProducto,
                        'cantidad'          => $take,
                        'precio'            => $precio,
                        'lote'              => $l->lote,
                        'fecha_vencimiento' => $l->fecha_vencimiento,
                    ]);

                    $l->cantidad_venta = (float)$l->cantidad_venta - $take;
                    $l->save();

                    $total += $take * $precio;
                    $restante -= $take;
                }

                if ($restante > 1e-9) abort(422, 'Stock insuficiente por lotes.');
            }

            $venta->update(['total' => $total]);

            if ($request->filled('receta_id')) {
                $receta = Receta::findOrFail((int)$request->input('receta_id'));
                $receta->numero_factura = $venta->id;
                $receta->save();
            }

            DB::commit();

            return Venta::with('user', 'ventaDetalles.producto', 'cliente','doctor')->findOrFail($venta->id);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al guardar la venta: ' . $e->getMessage()], 500);
        }
    }

    public function anular(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            /** @var Venta $venta */
            $venta = Venta::with('ventaDetalles')->lockForUpdate()->findOrFail($id);

            if ($venta->estado === 'Anulada') {
                DB::commit();
                return $venta;
            }

            // Si es GASTO no toca lotes
            if (strtolower((string)$venta->tipo_comprobante) !== 'gastos') {
                foreach ($venta->ventaDetalles as $det) {
                    if ($det->compra_detalle_id) {
                        $cd = CompraDetalle::where('id', $det->compra_detalle_id)->lockForUpdate()->first();
                        if ($cd) {
                            $cd->cantidad_venta = (float)$cd->cantidad_venta + (float)$det->cantidad;
                            $cd->save();
                        }
                    }
                }

                DB::table('paciente_ventas')->where('venta_id', $venta->id)->delete();
            }

            $venta->estado = 'Anulada';
            $venta->save();

            DB::commit();
            return $venta;
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'No se pudo anular: ' . $e->getMessage()], 500);
        }
    }

    public function tipoVentasChange(Request $request, $id)
    {
        $venta = Venta::findOrFail($id);

        // Si es gasto, no cambia tipo_venta
        if (strtolower((string)$venta->tipo_comprobante) === 'gastos') {
            return $venta;
        }

        $venta->tipo_venta = $venta->tipo_venta === 'Internado' ? 'Externo' : 'Internado';
        $venta->save();
        return $venta;
    }

    public function index(Request $request)
    {
        $fechaInicio = $request->input('fechaInicio');
        $fechaFin    = $request->input('fechaFin');
        $user        = $request->input('user');

        $q = Venta::with('user', 'cliente','ventaDetalles')
            ->when($fechaInicio && $fechaFin, fn($qq)=>$qq->whereBetween('fecha', [$fechaInicio, $fechaFin]))
            ->orderBy('created_at', 'desc');

        if ($user) $q->where('user_id', $user);

        return $q->get();
    }

    public function show($id)
    {
        return Venta::with('user', 'cliente', 'ventaDetalles.producto')->findOrFail($id);
    }

    private function clienteUpdateOrCreate(Request $request)
    {
        $ci = trim((string)$request->input('ci', '0'));
        $data = $request->only(['ci','nombre','email','complemento','direccion','telefono']);
        $c = Cliente::where('ci', $ci)->first();
        if ($c) {
            $c->update($data);
            return $c;
        }
        return Cliente::create($data + ['ci' => $ci ?: '0', 'nombre' => $data['nombre'] ?? 'SN']);
    }
}
