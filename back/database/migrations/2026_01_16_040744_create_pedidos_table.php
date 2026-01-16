<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('proveedor_id')->nullable();

            $table->date('fecha');
            $table->time('hora');

            $table->string('proveedor_nombre')->nullable();
            $table->string('telefono')->nullable();

            $table->decimal('subtotal', 10, 2)->default(0);

            $table->string('estado')->default('Activo'); // Activo | Anulado
            $table->text('observacion')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('proveedor_id')->references('id')->on('proveedores'); // si tu tabla es "proveedores" cambia a proveedores
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
