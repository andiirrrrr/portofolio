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
    // Ambil dari Laravel lokal (127.0.0.1:8000) via proxy agar 3D WebGL Lanyard terhubung penuh tanpa CORS
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return `/api/image-proxy?url=${encodeURIComponent(`http://127.0.0.1:8000/storage/${cleanPath}`)}`;
    }

    // 4. KONDISI VERCEL LIVE (Production di cloud) & SSR:
    // Ambil dari /storage/ statis milik frontend Vercel
    return `/storage/${cleanPath}`;
};

// Generic helper dengan fallback otomatis dan cepat ke initialData.json
const fetchWithFallback = async (endpoint: string, fallbackKey: keyof typeof initialData) => {
    // Di Vercel Live (bukan localhost) dan tanpa API URL khusus:
    // Langsung gunakan initialData secara instan (0ms) agar Lanyard 3D & foto tidak fallback ke /assets/foto.jpeg
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && !process.env.NEXT_PUBLIC_API_URL) {
        return { data: { data: initialData[fallbackKey] } };
    }

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

// Chat Messages (public guestbook — ephemeral on Vercel serverless)
export const getChatMessages = async () => {
    try {
        const res = await axios.get('/api/chat');
        return res;
    } catch {
        return { data: { data: [] } };
    }
};

export const sendChatMessage = async (data: { name: string; message: string }) => {
    const res = await axios.post('/api/chat', {
        name: data.name,
        message: data.message,
    });
    return res;
};

// Contact Form — real delivery via /api/contact (Laravel lokal atau email FormSubmit)
export const sendContact = async (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    phone?: string;
}) => {
    const res = await axios.post('/api/contact', {
        name: data.name,
        email: data.email,
        subject: data.subject || 'Contact Form Message',
        message: data.message,
        phone: data.phone,
    });

    if (!res.data?.success) {
        throw new Error(res.data?.message || 'Gagal mengirim pesan');
    }

    return res;
};

export default api;