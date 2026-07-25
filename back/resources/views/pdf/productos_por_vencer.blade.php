<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Productos por vencer</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 9px; color: #263238; }
        h2 { margin: 0 0 4px; }
        .meta { margin-bottom: 10px; color: #546e7a; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #b0bec5; padding: 4px; }
        th { background: #00796b; color: white; }
        .right { text-align: right; }
        .center { text-align: center; }
    </style>
</head>
<body>
<h2>Productos por vencer</h2>
<div class="meta">
    Generado: {{ $fecha }} |
    @if($buscar)
        Búsqueda global: “{{ $buscar }}”
    @else
        Próximos {{ $dias }} días
    @endif
</div>
<table>
    <thead>
    <tr>
        <th>#</th>
        <th>Producto</th>
        <th>Cantidad</th>
        <th>Factura</th>
        <th>Lote</th>
        <th>Proveedor</th>
        <th>Fecha compra</th>
        <th>Vencimiento</th>
        <th>Estado</th>
        <th>Días restantes</th>
    </tr>
    </thead>
    <tbody>
    @forelse($productos as $i => $producto)
        <tr>
            <td class="center">{{ $i + 1 }}</td>
            <td>{{ $producto->producto?->nombre }}</td>
            <td class="right">{{ $producto->cantidad_venta }}</td>
            <td>{{ $producto->compra?->nro_factura }}</td>
            <td>{{ $producto->lote }}</td>
            <td>{{ $producto->proveedor?->nombre }}</td>
            <td>{{ $producto->compra?->fecha }}</td>
            <td>{{ $producto->fecha_vencimiento }}</td>
            <td>{{ $producto->estado }}</td>
            <td class="center">{{ now()->startOfDay()->diffInDays(\Carbon\Carbon::parse($producto->fecha_vencimiento)->startOfDay(), false) }}</td>
        </tr>
    @empty
        <tr><td colspan="10" class="center">Sin resultados</td></tr>
    @endforelse
    </tbody>
</table>
</body>
</html>
