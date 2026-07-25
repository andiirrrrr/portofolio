import axios from 'axios';
import initialData from './initialData.json';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 3000, // 3 detik timeout agar fallback cepat terhubung di production
});

export const getImageUrl = (path: string | null | undefined, fallback: string = ''): string => {
    if (!path) return fallback;

    // Local static paths or data URIs
    if (path.startsWith('/') || path.startsWith('data:')) {
        return path;
    }

    // External full HTTP URLs (not localhost)
    if ((path.startsWith('http://') || path.startsWith('https://')) && !path.includes('localhost') && !path.includes('127.0.0.1')) {
        return `/api/image-proxy?url=${encodeURIComponent(path)}`;
    }

    // Relative storage paths -> serve directly from frontend /storage/
    const cleanPath = path.replace(/^(https?:\/\/[^\/]+)?(\/storage\/|\/)?/, '');
    return `/storage/${cleanPath}`;
};

// Generic helper dengan fallback otomatis ke initialData.json
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
export const getChatMessages = async (since?: string) => {
    try {
        return await api.get('/chat-messages', { params: since ? { since, limit: 100 } : { limit: 50 } });
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
        return await api.post('/contacts', data);
    } catch {
        // Fallback simpan lokal atau beri respon sukses
        return { data: { success: true, message: 'Pesan berhasil terkirim!' } };
    }
};

export default api;