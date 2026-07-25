'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaGlobe } from 'react-icons/fa6';
import { getProfile } from '@/lib/api';
import { Profile } from '@/types';

export default function BottomBar() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        getProfile()
            .then((res) => setProfile(res.data.data))
            .catch(() => { });
    }, []);

    const socialLinks = [
        { icon: FaGithub, url: profile?.github_url, label: 'GitHub' },
        { icon: FaLinkedin, url: profile?.linkedin_url, label: 'LinkedIn' },
        { icon: FaInstagram, url: profile?.instagram_url, label: 'Instagram' },
        { icon: FaYoutube, url: profile?.youtube_url, label: 'YouTube' },
        { icon: FaGlobe, url: profile?.website_url, label: 'Website' },
    ].filter(link => link.url && link.url !== '#' && link.url !== '');

    return (
        <div className="border-t border-navy-800/30 py-5 px-4 bg-navy-950/50">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Copyright */}
                <p className="text-xs text-gray-500 order-2 sm:order-1">
                    &copy; {currentYear} {profile?.full_name || 'Andi Ranreng Sombeng'}. All rights reserved.
                </p>

                {/* Social Media Icons - Ukuran Lebih Besar */}
                {socialLinks.length > 0 && (
                    <div className="flex items-center gap-4 order-1 sm:order-2">
                        {socialLinks.map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{
                                    scale: 1.2,
                                    y: -3,
                                    color: '#ffffff'
                                }}
                                className="text-gray-400 hover:text-white transition-all duration-300"
                                aria-label={social.label}
                            >
                                <social.icon size={24} /> {/* ← Ukuran 24 (sebelumnya 18) */}
                            </motion.a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}