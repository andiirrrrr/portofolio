'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProfile } from '@/lib/api';
import { Profile } from '@/types';

export default function Hero() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfile()
            .then((res) => {
                setProfile(res.data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-navy-900">
            {/* Background Animation */}
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-700/20 rounded-full blur-3xl" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-6"
                    >
                        {profile?.title || 'Full Stack Developer'}
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                    >
                        Hi, I'm{' '}
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-gradient"
                        >
                            {profile?.full_name || 'Your Name'}
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                    >
                        {profile?.bio || 'Building premium digital experiences with modern technologies.'}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link href="/portfolio">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 group"
                            >
                                View My Work
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight size={18} />
                                </motion.span>
                            </motion.button>
                        </Link>
                        <Link href="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 border border-gray-500 hover:border-white text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-300"
                            >
                                Get In Touch
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
                >
                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}