<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Lista de Productos</title>
    <style>
        @page {
            size: letter;
            margin: 25px 25px;
        }

        * {
            box-sizing: border-box;
            font-family: DejaVu Sans, Arial, Helvetica, sans-serif;
        }

        body {
            margin: 0;
            color: #111827;
            font-size: 10px;
        }

        .header {
            border-bottom: 2px solid #0ea5e9;
            padding-bottom: 6px;
            margin-bottom: 8px;
        }

        .title {
            font-size: 14px;
            font-weight: 900;
            color: #0ea5e9;
            text-transform: uppercase;
            letter-spacing: 0.6px;
        }

        .meta {
            font-size: 9px;
            color: #6b7280;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #0ea5e9;
            color: #fff;
            padding: 4px 5px;
            font-size: 9px;
            text-transform: uppercase;
            text-align: left;
        }

        td {
            padding: 3px 5px;
            border-bottom: 1px solid #e5e7eb;
        }

        tr:nth-child(even) td {
            background: #f0f9ff;
        }

        .num {
            text-align: right;
        }
    </style>
</head>
<body>
<div class="header">
    <div class="title">Lista de Productos</div>
    <div class="meta">Generado: {{ $fecha }} — Total: {{ count($productos) }} productos</div>
</div>
<table>
    <thead>
    <tr>
        <th>#</th>
        <th>Nombre</th>
        <th>Descripción</th>
        <th>Presentación</th>
        <th class="num">Precio</th>
        <th class="num">Stock</th>
        <th class="num">Stock mín.</th>
        <th class="num">Stock máx.</th>
    </tr>
    </thead>
    <tbody>
    @foreach($productos as $i => $producto)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $producto->nombre }}</td>
            <td>{{ $producto->descripcion }}</td>
            <td>{{ $producto->unidad }}</td>
            <td class="num">{{ number_format((float) $producto->precio, 2) }}</td>
            <td class="num">{{ $producto->cantidad }}</td>
            <td class="num">{{ $producto->stock_minimo }}</td>
            <td class="num">{{ $producto->stock_maximo }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
