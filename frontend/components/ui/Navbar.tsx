'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import GooeyNav from '@/components/gooey-nav/GooeyNav';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    // Simpan activeIndex di ref agar scroll handler tidak perlu di-re-register
    const activeIndexRef = useRef(0);

    // ScrollSpy untuk update active index
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 100;
            setScrolled(isScrolled);

            const scrollY = window.scrollY + 150; // offset untuk trigger lebih awal

            // Daftar section dengan urutan
            const sections = [
                { id: 'home', index: 0, top: 0 },
                { id: 'about', index: 1 },
                { id: 'portfolio', index: 2 },
                { id: 'contact', index: 3 },
            ];

            // Jika di paling atas (parallax hero)
            if (window.scrollY < 200) {
                if (activeIndexRef.current !== 0) {
                    activeIndexRef.current = 0;
                    setActiveIndex(0);
                }
                return;
            }

            // Cari section yang sedang aktif berdasarkan posisi scroll
            let foundIndex = 0;
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i].id);
                if (section) {
                    const sectionTop = section.offsetTop;
                    // Jika section top <= scrollY + offset
                    if (sectionTop <= scrollY) {
                        // Tambahkan margin untuk section berikutnya
                        const nextSection = sections[i + 1];
                        if (nextSection) {
                            const nextEl = document.getElementById(nextSection.id);
                            if (nextEl && scrollY < nextEl.offsetTop - 100) {
                                foundIndex = sections[i].index;
                                break;
                            }
                        } else {
                            foundIndex = sections[i].index;
                            break;
                        }
                    }
                }
            }

            // Jika tidak ada section yang terdeteksi, cek berdasarkan posisi manual
            if (foundIndex === 0 && window.scrollY > 200) {
                // Cek apakah di about
                const aboutEl = document.getElementById('about');
                if (aboutEl && window.scrollY >= aboutEl.offsetTop - 150) {
                    foundIndex = 1;
                }
                // Cek apakah di portfolio
                const portfolioEl = document.getElementById('portfolio');
                if (portfolioEl && window.scrollY >= portfolioEl.offsetTop - 150) {
                    foundIndex = 2;
                }
                // Cek apakah di contact
                const contactEl = document.getElementById('contact');
                if (contactEl && window.scrollY >= contactEl.offsetTop - 150) {
                    foundIndex = 3;
                }
            }

            if (foundIndex !== activeIndexRef.current) {
                activeIndexRef.current = foundIndex;
                setActiveIndex(foundIndex);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ← dependency kosong: listener hanya didaftarkan 1x, tidak loop

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, index: number) => {
        e.preventDefault();
        setActiveIndex(index);

        if (href === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (href.includes('#')) {
            const targetId = href.split('#')[1];
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: scrolled ? 0 : -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-md border-b border-navy-700/30"
            style={{ boxShadow: 'none' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center"
                    >
                        <a
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveIndex(0);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-2xl font-bold text-white"
                        >
                            <span className="text-blue-400">Andir</span>
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
                            activeIndex={activeIndex}
                            initialActiveIndex={0}
                            animationTime={600}
                            timeVariance={300}
                            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                            onItemClick={handleNavClick}
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
                                onClick={(e) => {
                                    setIsOpen(false);
                                    handleNavClick(e, item.href, index);
                                }}
                                className={`block transition-colors duration-300 text-lg ${activeIndex === index ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                                    }`}
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