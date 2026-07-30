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

const CONTACT_EMAIL =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    (initialData.profile as { email?: string })?.email ||
    '';

// Contact Form:

export const sendContact = async (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    phone?: string;
}) => {
    const payload = {
        name: data.name,
        email: data.email,
        subject: data.subject || 'Contact Form Message',
        message: data.message,
        phone: data.phone,
    };

    const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1');

    if (isLocal) {
        try {
            const res = await axios.post('/api/contact', payload);
            if (res.data?.success) return res;
        } catch {
            // lanjut ke FormSubmit
        }
    }

    if (!CONTACT_EMAIL) {
        throw new Error('Email kontak belum dikonfigurasi');
    }

    const res = await axios.post(
        `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
        {
            name: payload.name,
            email: payload.email,
            _replyto: payload.email,
            _subject: `[Portfolio] ${payload.subject}`,
            message: payload.message,
            _template: 'table',
            _captcha: 'false',
        },
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 15000,
        }
    );

    const ok = res.data?.success === true || res.data?.success === 'true';
    if (!ok) {
        const raw = String(res.data?.message || '');
        if (/activat/i.test(raw)) {
            throw new Error(
                'Form belum diaktifkan. Cek inbox email portfolio Anda, buka email dari FormSubmit, lalu klik link aktivasi. Setelah itu coba kirim lagi.'
            );
        }
        throw new Error(raw || 'Gagal mengirim pesan. Silakan coba lagi.');
    }

    return { data: { success: true, message: 'Pesan berhasil dikirim ke email!' } };
};

export default api;