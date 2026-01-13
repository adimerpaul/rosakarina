<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller{
    function searchCliente(Request $request){
        $ci = $request->nit;
        $cliente = Cliente::where('ci', $ci)->first();
        return $cliente;
    }
//    api reosuce clientes
    function index(Request $request){
        $search = $request->get('search');
        return Cliente::query()
            ->when($search, function($q) use ($search){
                $q->where('nombre','like',"%$search%")
                    ->orWhere('ci','like',"%$search%")
                    ->orWhere('telefono','like',"%$search%");
            })
            ->orderBy('id','desc')
            ->paginate(10);
    }
    function store(Request $request){
        return Cliente::create($request->all());
    }
    function show(Cliente $cliente){
        return $cliente;
    }
    function update(Request $request, Cliente $cliente){
        $cliente->update($request->all());
        return $cliente;
    }
    function destroy(Cliente $cliente){
        $cliente->delete();
        return response()->noContent();
    }
}
