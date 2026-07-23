'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import GooeyNav from '@/components/gooey-nav/GooeyNav';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Skills', href: '/skills' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Certificates', href: '/certificates' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 100;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: scrolled ? 0 : -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-md"
            style={{ boxShadow: 'none' }} // Force hapus shadow
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center"
                    >
                        <a href="/" className="text-2xl font-bold text-white">
                            <span className="text-blue-400">Portfolio</span>
                            <span className="text-gray-light">.</span>
                        </a>
                    </motion.div>

                    {/* GooeyNav Desktop */}
                    <div className="hidden md:flex items-center">
                        <GooeyNav
                            items={navItems}
                            particleCount={15}
                            particleDistances={[90, 10]}
                            particleR={100}
                            initialActiveIndex={0}
                            animationTime={600}
                            timeVariance={300}
                            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                        />
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white p-2"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={false}
                animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="md:hidden overflow-hidden"
            >
                <div className="px-4 py-6 space-y-4 bg-navy-900/95 backdrop-blur-md">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                            <a
                                href={item.href}
                                onClick={() => {
                                    setIsOpen(false);
                                    if (item.href === '/') {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    } else if (item.href.includes('#')) {
                                        const targetId = item.href.split('#')[1];
                                        setTimeout(() => {
                                            const element = document.getElementById(targetId);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }
                                        }, 100);
                                    }
                                }}
                                className="block text-gray-300 hover:text-white transition-colors duration-300 text-lg"
                            >
                                {item.label}
                            </a>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.nav>
    );
}