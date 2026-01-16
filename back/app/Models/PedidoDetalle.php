<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PedidoDetalle extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'pedido_id',
        'producto_id',
        'nombre',
        'precio',
        'cantidad',
        'subtotal',
        'estado',
    ];

    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
