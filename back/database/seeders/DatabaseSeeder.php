<?php

namespace Database\Seeders;

use App\Models\AntecedentesFamiliare;
use App\Models\Area;
use App\Models\Diagnostico;
use App\Models\HabitosPersonale;
use App\Models\HistorialMedico;
use App\Models\Material;
use App\Models\Paciente;
use App\Models\Periodo;
use App\Models\Receta;
use App\Models\RecetaDetalle;
use App\Models\SignosVitale;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

//        User::factory()->create([
//            'name' => 'Test User',
//            'email' => 'test@example.com',
//        ]);
//        User::create([
//            'name' => 'Administrador',
//            'username' => 'admin',
//            'email' => 'admin@test.com',
//            'password' => bcrypt('admin'),
//            'role' => 'Administrador',
//        ]);
//        User::factory(10)->create();
        $sqlFIle = base_path('database/seeders/productos.sql');
        $sqlContent = file_get_contents($sqlFIle);
        DB::unprepared($sqlContent);

//        $sqlFIle = base_path('database/seeders/users.sql');
//        $sqlContent = file_get_contents($sqlFIle);
//        DB::unprepared($sqlContent);
//        Usuarios:
//        Administrador: Roger Vigabriel
//CI:5725839
//    Karina Quiñonez
//CI: 7264841
//    Paola Flores
//CI:7320086
//    Jessica Carata
//CI: 14425737
        User::create([
            'name' => 'Roger Vigabriel',
            'username' => 'roger',
            'password' => bcrypt('5725839'),
            'role' => 'Administrador',
        ]);
        User::create([
            'name' => 'Karina Quiñonez',
            'username' => 'karina',
            'password' => bcrypt('7264841'),
            'role' => 'Vendedor',
        ]);
        User::create([
            'name' => 'Paola Flores',
            'username' => 'paola',
            'password' => bcrypt('7320086'),
            'role' => 'Vendedor',
        ]);
        User::create([
            'name' => 'Jessica Carata',
            'username' => 'jessica',
            'password' => bcrypt('14425737'),
            'role' => 'Vendedor',
        ]);

        $permisos = [
            'Usuarios', 'Pacientes', 'Productos', 'Ventas', 'Nueva venta',
            'Proveedores', 'Compras', 'Compras nuevas', 'Productos por vencer',
            'Productos vencidos'
        ];
        foreach ($permisos as $permiso) {
            Permission::create(['name' => $permiso]);
        }
        $admin = User::find(1);
        $admin->givePermissionTo($permisos);
    }
}
