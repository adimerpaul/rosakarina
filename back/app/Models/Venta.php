<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Venta extends Model{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'cliente_id',
        'fecha',
        'hora',
        'ci',
        'nombre',
        'estado',
        'tipo_comprobante',
        'total',
        'tipo_venta',
        'tipo_pago',
        'pagado_interno',
        'doctor_id',
        'paciente_id_ref',
        'detalles'
    ];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];
    function user(){
        return $this->belongsTo(User::class);
    }
    function cliente(){
        return $this->belongsTo(Cliente::class);
    }
    function ventaDetalles(){
        return $this->hasMany(VentaDetalle::class);
    }
    protected $appends = ['detailsText'];
    function getDetailsTextAttribute(){
//        $detailsText = '';
//        foreach ($this->ventaDetalles as $ventaDetalle) {
//            $detailsText .= $ventaDetalle->cantidad . ' ' . $ventaDetalle->nombre . ',';
////            $detailsText .= $ventaDetalle->cantidad . ' ' . isset($ventaDetalle->producto) ? $ventaDetalle->producto->nombre : 'Producto Eliminado' . ',';
//        }
//        $detailsText = substr($detailsText, 0, -1);
//        return $detailsText;
        $detailsTextHtml = '<ul style="padding: 0; margin: 0;">';
        foreach ($this->ventaDetalles as $ventaDetalle) {
            $detailsTextHtml .= "<li style=\"list-style-type: none; margin: 0; padding: 0;font-size: 9px\">"
                . $ventaDetalle->cantidad . ' ' . strtolower($ventaDetalle->nombre)
                . "</li>";
        }
        return $detailsTextHtml;
    }
    public function doctor()
    {
        return $this->belongsTo(\App\Models\Doctor::class, 'doctor_id');
    }
}
