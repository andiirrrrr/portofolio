'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Skills', href: '/skills' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Certificates', href: '/certificates' },
    { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 100; // Muncul setelah scroll 100px
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
            className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-md shadow-lg border-b border-navy-700/50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center"
                    >
                        <Link href="/" className="text-2xl font-bold text-white">
                            <span className="text-blue-400">Portfolio</span>
                            <span className="text-gray-light">.</span>
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                whileHover={{ y: -2 }}
                            >
                                <Link
                                    href={item.href}
                                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium relative group"
                                >
                                    {item.name}
                                    <motion.span
                                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"
                                        whileHover={{ width: '100%' }}
                                    />
                                </Link>
                            </motion.div>
                        ))}
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
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                            <Link
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block text-gray-300 hover:text-white transition-colors duration-300 text-lg"
                            >
                                {item.name}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.nav>
    );
}