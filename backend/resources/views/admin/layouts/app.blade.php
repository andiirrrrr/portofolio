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
<body class="bg-gray-100">
    <div class="flex h-screen">
        <!-- Sidebar -->
        @include('admin.layouts.sidebar')
        
        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-white shadow-sm">
                <div class="flex items-center justify-between px-6 py-4">
                    <h2 class="text-xl font-semibold text-gray-800">@yield('header')</h2>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-600">{{ Auth::user()->name ?? 'Admin' }}</span>
                        <form action="{{ route('admin.logout') }}" method="POST" class="inline">
                            @csrf
                            <button type="submit" class="text-red-500 hover:text-red-700 text-sm">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </form>
                    </div>
                </div>
            </header>
            
            <main class="flex-1 overflow-y-auto p-6">
                @if(session('success'))
                    <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {{ session('success') }}
                    </div>
                @endif
                
                @if(session('error'))
                    <div class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {{ session('error') }}
                    </div>
                @endif
                
                @yield('content')
            </main>
        </div>
    </div>
    @stack('scripts')
</body>
@vite('resources/js/app.js')
</html>