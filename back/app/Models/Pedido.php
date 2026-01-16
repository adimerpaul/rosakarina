<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pedido extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'proveedor_id',
        'fecha',
        'hora',
        'proveedor_nombre',
        'telefono',
        'subtotal',
        'estado',
        'observacion',
    ];

    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    protected $appends = ['detailsText'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class);
    }

    public function detalles()
    {
        return $this->hasMany(PedidoDetalle::class);
    }

    public function getDetailsTextAttribute()
    {
        $txt = '';
        foreach ($this->detalles as $d) {
            $txt .= $d->cantidad.' '.$d->nombre.', ';
        }
        return rtrim($txt, ', ');
    }
}
