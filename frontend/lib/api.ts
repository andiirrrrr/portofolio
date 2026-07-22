import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

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

// Contacts
export const sendContact = (data: any) => api.post('/contacts', data);

export default api;