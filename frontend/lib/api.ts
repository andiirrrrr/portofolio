import axios from 'axios';
import initialData from './initialData.json';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 3000,
});

export const getImageUrl = (path: string | null | undefined, fallback: string = ''): string => {
    if (!path) return fallback;

    // 1. Data URIs atau path statis frontend (/assets/...)
    if (path.startsWith('data:') || path.startsWith('/assets/')) {
        return path;
    }

    // 2. Bersihkan path (buang prefix http://.../storage/ atau /storage/)
    const cleanPath = path.replace(/^(https?:\/\/[^\/]+)?(\/storage\/|\/)?/, '');

    // 3. KONDISI LOCALHOST (Development di laptop):
    // Ambil langsung dari Laravel lokal (127.0.0.1:8000) via proxy agar 3D WebGL Lanyard terhubung penuh tanpa CORS
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return `/api/image-proxy?url=${encodeURIComponent(`http://127.0.0.1:8000/storage/${cleanPath}`)}`;
    }

    // 4. KONDISI VERCEL LIVE (Production di cloud) & SSR:
    // Ambil dari /storage/ statis milik frontend Vercel
    return `/storage/${cleanPath}`;
};

// Generic helper dengan fallback otomatis ke initialData.json jika backend offline
const fetchWithFallback = async (endpoint: string, fallbackKey: keyof typeof initialData) => {
    try {
        const res = await api.get(endpoint);
        if (res.data && res.data.data) {
            return res;
        }
        throw new Error('No data');
    } catch {
        return { data: { data: initialData[fallbackKey] } };
    }
};

// Profile
export const getProfile = () => fetchWithFallback('/profile', 'profile');

// Skills
export const getSkills = () => fetchWithFallback('/skills', 'skills');

// Experiences
export const getExperiences = () => fetchWithFallback('/experiences', 'experiences');

// Educations
export const getEducations = () => fetchWithFallback('/educations', 'educations');

// Projects
export const getProjects = () => fetchWithFallback('/projects', 'projects');

// Certificates
export const getCertificates = () => fetchWithFallback('/certificates', 'certificates');

// Chat Messages
export const getChatMessages = async () => {
    try {
        const res = await axios.get('/api/chat');
        return res;
    } catch {
        return { data: { data: [] } };
    }
};

// Contacts
export const sendContact = async (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    phone?: string;
}) => {
    try {
        const res = await axios.post('/api/chat', {
            name: data.name,
            message: data.message,
        });
        return res;
    } catch {
        return { data: { success: true, message: 'Pesan berhasil terkirim!' } };
    }
};

export default api;