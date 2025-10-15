<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of all users (admin only)
     */
    public function index()
    {
        $users = User::with('cars')->get();
        
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Display the specified user (admin only)
     */
    public function show(User $user)
    {
        $user->load('cars');
        
        // Asegurar que la fecha se devuelva en formato Y-m-d
        if ($user->birth_date) {
            $user->birth_date = $user->birth_date->format('Y-m-d');
        }
        
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update the specified user (admin only)
     */
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'first_name' => 'sometimes|nullable|string|max:100',
            'last_name' => 'sometimes|nullable|string|max:100',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|nullable|string|max:20',
            'birth_date' => 'sometimes|nullable|date',
            'role' => 'sometimes|required|in:user,admin',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($request->only([
            'name', 'first_name', 'last_name', 'email', 'phone', 'birth_date', 'role'
        ]));

        $updatedUser = $user->fresh();
        
        // Asegurar que la fecha se devuelva en formato Y-m-d
        if ($updatedUser->birth_date) {
            $updatedUser->birth_date = $updatedUser->birth_date->format('Y-m-d');
        }

        return response()->json([
            'success' => true,
            'data' => $updatedUser,
            'message' => 'User updated successfully'
        ]);
    }

    /**
     * Remove the specified user (admin only)
     */
    public function destroy(User $user)
    {
        // No permitir eliminar el propio usuario
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes eliminar tu propia cuenta'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Get user statistics (admin only)
     */
    public function statistics()
    {
        $stats = [
            'total_users' => User::count(),
            'admin_users' => User::admins()->count(),
            'regular_users' => User::users()->count(),
            'users_with_cars' => User::has('cars')->count(),
            'users_without_cars' => User::doesntHave('cars')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}