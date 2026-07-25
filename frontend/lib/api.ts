import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const getImageUrl = (path: string | null | undefined, fallback: string = ''): string => {
    if (!path) return fallback;

    // Local paths or data URIs — return as-is
    if (path.startsWith('/') || path.startsWith('data:')) {
        return path;
    }

    // Full backend URL (e.g. http://127.0.0.1:8000/storage/...)
    // → proxy through Next.js to avoid WebGL CORS issues
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return `/api/image-proxy?url=${encodeURIComponent(path)}`;
    }

    // Relative storage path → build backend URL and proxy
    const storageBase = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://127.0.0.1:8000/storage';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const fullUrl = `${storageBase.replace(/\/$/, '')}${cleanPath}`;
    return `/api/image-proxy?url=${encodeURIComponent(fullUrl)}`;
};

// Profile
export const getProfile = () => api.get('/profile');

// Skills
export const getSkills = () => api.get('/skills');

// Experiences
export const getExperiences = () => api.get('/experiences');

// Educations
export const getEducations = () => api.get('/educations');

// Projects
export const getProjects = () => api.get('/projects');

// Certificates
export const getCertificates = () => api.get('/certificates');

// Chat Messages (public polling endpoint)
export const getChatMessages = (since?: string) =>
    api.get('/chat-messages', { params: since ? { since, limit: 100 } : { limit: 50 } });

// Contacts
export const sendContact = (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    phone?: string;
}) => api.post('/contacts', data);

export default api;