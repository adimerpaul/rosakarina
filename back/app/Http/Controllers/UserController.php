<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class UserController extends Controller{
    public function updatePermisos(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $permissions = $request->input('permissions', []);

        // Validar permisos existentes
        $validPermissionNames = Permission::pluck('name')->toArray();
        foreach ($permissions as $permName) {
            if (!in_array($permName, $validPermissionNames)) {
                return response()->json(['message' => "Permiso inválido: $permName"], 400);
            }
        }

        // Sincroniza permisos (borra los anteriores y asigna los nuevos)
        $user->syncPermissions($permissions);

        return response()->json(['message' => 'Permisos actualizados correctamente']);
    }
    function permisos(){
        return Permission::all();
    }
    function login(Request $request){
        $credentials = $request->only('username', 'password');
        $user = User::where('username', $credentials['username'])->with('permissions')->first();
        if (!$user || !password_verify($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Usuario o contraseña incorrectos',
            ], 401);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'token' => $token,
            'user' => $user,
            'datos' => [
                'nit' => env('NIT'),
                'razon' => env("RAZON"),
                'direccion' => env("DIRECCION"),
                'telefono' => env("TELEFONO"),
                'url' => env("URL_SIAT"),
                'url2' => env("URL_SIAT2")
            ]
        ]);
    }
    function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Token eliminado',
        ]);
    }
//    function me(Request $request){
//        $user = $request->user();
//        $user->load('permissions');
//        return $user;
//    }
    function me(Request $request){
//        return $request->user();
        $user = User::where('id', $request->user()->id)
            ->with('permissions')
            ->firstOrFail();
        return [
            'user' => $user,
            'datos' => [
                'nit' => env('NIT'),
                'razon' => env("RAZON"),
                'direccion' => env("DIRECCION"),
                'telefono' => env("TELEFONO"),
                'url' => env("URL_SIAT"),
                'url2' => env("URL_SIAT2")
            ]
        ];
    }
    function index(){
        return User::
//        where('id', '!=', 1)
            orderBy('id', 'desc')
            ->with('permissions')
            ->get();
    }
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->update($request->except(['password', 'avatar']));

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $fileName = time() . '.' . $file->getClientOriginalExtension();
            $path = public_path('avatares');

            $file->move($path, $fileName);

            $user->avatar = $fileName;
            $user->save();
        }

        return $user;
    }

    function updatePassword(Request $request, $id){
        $user = User::find($id);
        $user->update([
            'password' => bcrypt($request->password),
        ]);
        return $user;
    }
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:users',
            'password' => 'required',
            'name' => 'required',
        ]);

        $data = $request->except('avatar');

        $data['password'] = bcrypt($request->password);

        $user = User::create($data);

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $fileName = time() . '.' . $file->getClientOriginalExtension();
            $path = public_path('avatares');

            $file->move($path, $fileName);

            $user->avatar = $fileName;
            $user->save();
        }

        return $user;
    }

    function destroy($id){
        return User::destroy($id);
    }
}
