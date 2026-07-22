<aside class="w-64 bg-gray-800 text-white flex-shrink-0">
    <div class="p-4">
        <h1 class="text-2xl font-bold text-blue-400">Portfolio CMS</h1>
        <p class="text-sm text-gray-400">Admin Panel</p>
    </div>
    
    <nav class="mt-8">
        <a href="{{ route('admin.dashboard') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.dashboard') ? 'bg-gray-700' : '' }}">
            <i class="fas fa-chart-pie w-6"></i> Dashboard
        </a>
        
        <a href="{{ route('admin.profile.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.profile*') ? 'bg-gray-700' : '' }}">
            <i class="fas fa-user w-6"></i> Profile
        </a>
        
        <a href="{{ route('admin.skills.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.skills*') ? 'bg-gray-700' : '' }}">
            <i class="fas fa-code w-6"></i> Skills
        </a>
        
        <a href="{{ route('admin.experiences.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.experiences*') ? 'bg-gray-700' : '' }}">
            <i class="fas fa-briefcase w-6"></i> Experiences
        </a>
        
        
        <a href="{{ route('admin.educations.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.educations*') ? 'bg-gray-700' : '' }}">
            <i class="fas fa-graduation-cap w-6"></i> Educations
        </a>
        
        <a href="{{ route('admin.projects.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.projects*') ? 'bg-gray-700' : '' }}">
            <i class="fas fa-folder-open w-6"></i> Projects
        </a>
        
        <a href="{{ route('admin.certificates.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.certificates*') ? 'bg-gray-700' : '' }}">
            <i class="fas fa-certificate w-6"></i> Certificates
        </a>
        
        <a href="{{ route('admin.contacts.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.contacts*') ? 'bg-gray-700' : '' }}">
            <i class="fas fa-envelope w-6"></i> Contacts
            @php
                $unreadCount = App\Models\Contact::where('is_read', false)->count();
            @endphp
            @if($unreadCount > 0)
                <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full float-right">
                    {{ $unreadCount }}
                </span>
            @endif
        </a>
       
    </nav>
</aside>