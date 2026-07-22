<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Admin CMS - @yield('title')</title>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <!-- Vite CSS -->
    @vite('resources/css/app.css')
    
    @stack('styles')
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-blue-600">Portfolio CMS</h1>
            <p class="text-gray-600 mt-2">Login to Admin Panel</p>
        </div>
        
        @if($errors->any())
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {{ $errors->first() }}
            </div>
        @endif
        
        <form action="{{ route('admin.login') }}" method="POST">
            @csrf
            
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                    Username
                </label>
                <div class="relative">
                    <i class="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                    <input type="text" 
                           name="username" 
                           id="username"
                           value="{{ old('username') }}"
                           class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                           placeholder="Enter username"
                           required>
                </div>
            </div>
            
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                    Password
                </label>
                <div class="relative">
                    <i class="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                    <input type="password" 
                           name="password" 
                           id="password"
                           class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                           placeholder="Enter password"
                           required>
                </div>
            </div>
            
            <div class="flex items-center justify-between mb-6">
                <label class="flex items-center">
                    <input type="checkbox" name="remember" class="rounded border-gray-300 text-blue-600">
                    <span class="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
            </div>
            
            <button type="submit" 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                <i class="fas fa-sign-in-alt mr-2"></i> Login
            </button>
        </form>
    </div>
</body>
</html>