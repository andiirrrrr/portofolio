export interface Profile {
    id: number;
    full_name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    profile_image: string | null;
    cv_file: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    instagram_url: string | null;
    youtube_url: string | null;
    website_url: string | null;
    about_me: string;
    professional_summary: string;
    created_at: string;
    updated_at: string;
}

export interface Skill {
    id: number;
    name: string;
    category: string;
    icon: string;
    level: number;
    color: string;
    order: number;
    is_active: boolean;
}

export interface Experience {
    id: number;
    company_name: string;
    company_logo: string | null;
    position: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string;
    achievements: string[];
    company_website: string | null;
    order: number;
    is_active: boolean;
}

export interface Education {
    id: number;
    institution_name: string;
    institution_logo: string | null;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string;
    gpa: string | null;
    order: number;
    is_active: boolean;
}

export interface Project {
    id: number;
    title: string;
    slug: string;
    category: string;
    short_description: string;
    description: string;
    thumbnail: string | null;
    github_url: string | null;
    demo_url: string | null;
    tech_stack: string[];
    challenges: string | null;
    solutions: string | null;
    key_features: string[];
    order: number;
    is_featured: boolean;
    is_active: boolean;
    published_at: string | null;
    images: ProjectImage[];
}

export interface ProjectImage {
    id: number;
    image_path: string;
    caption: string;
    order: number;
}

export interface Certificate {
    id: number;
    name: string;
    issuer: string;
    issued_date: string;
    expiry_date: string | null;
    credential_id: string;
    credential_url: string;
    image: string | null;
    order: number;
    is_active: boolean;
}

export interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string | null;
    category: string;
    tags: string[];
    views: number;
    is_published: boolean;
    published_at: string;
}

export interface Contact {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    phone: string;
    is_read: boolean;
    is_replied: boolean;
}