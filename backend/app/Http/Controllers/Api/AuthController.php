<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends ApiController
{
    /**
     * Register new user (admin/editor)
     */
    public function register(RegisterRequest $request)
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role ?? 'admin',
            ]);

            // Login the user to get token
            $token = auth('api')->login($user);

            return $this->success([
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth('api')->factory()->getTTL() * 60,
            ], 'User registered successfully', 201);
        } catch (\Exception $e) {
            Log::error('Register error: ' . $e->getMessage());
            return $this->error('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Login user
     */
    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->only('username', 'password');

            if (!$token = auth('api')->attempt($credentials)) {
                return $this->error('Invalid username or password', 401);
            }

            $user = auth('api')->user();

            return $this->success([
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth('api')->factory()->getTTL() * 60,
            ], 'Login successful');
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return $this->error('Login failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get authenticated user profile
     */
    public function me()
    {
        try {
            $user = auth('api')->user();
            
            if (!$user) {
                return $this->error('User not authenticated', 401);
            }
            
            return $this->success(new UserResource($user));
        } catch (\Exception $e) {
            Log::error('Me error: ' . $e->getMessage());
            return $this->error('Failed to get user profile: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Logout user
     */
    public function logout()
    {
        try {
            auth('api')->logout();
            return $this->success(null, 'Successfully logged out');
        } catch (\Exception $e) {
            return $this->error('Logout failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Refresh token
     */
    public function refresh()
    {
        try {
            $token = auth('api')->refresh();
            
            return $this->success([
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth('api')->factory()->getTTL() * 60,
            ], 'Token refreshed');
        } catch (\Exception $e) {
            return $this->error('Refresh token failed: ' . $e->getMessage(), 500);
        }
    }
}