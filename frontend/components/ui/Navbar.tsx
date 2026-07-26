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

const SECTION_IDS = ['home', 'about', 'portfolio', 'contact'] as const;

/** Posisi dokumen yang akurat (bukan offsetTop yang bisa relatif ke parent) */
function getDocumentTop(el: HTMLElement) {
    return el.getBoundingClientRect().top + window.scrollY;
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexRef = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 100);

            // Dekat puncak halaman → Home
            if (scrollY < 120) {
                if (activeIndexRef.current !== 0) {
                    activeIndexRef.current = 0;
                    setActiveIndex(0);
                }
                return;
            }

            // Marker: posisi section + offset navbar
            const marker = scrollY + 160;
            let foundIndex = 0;

            for (let i = 0; i < SECTION_IDS.length; i++) {
                const el = document.getElementById(SECTION_IDS[i]);
                if (!el) continue;
                if (getDocumentTop(el) <= marker) {
                    foundIndex = i;
                }
            }

            if (foundIndex !== activeIndexRef.current) {
                activeIndexRef.current = foundIndex;
                setActiveIndex(foundIndex);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, index: number) => {
        e.preventDefault();
        activeIndexRef.current = index;
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
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-md border-b border-navy-700/30"
            style={{ boxShadow: 'none' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center"
                    >
                        <a
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                activeIndexRef.current = 0;
                                setActiveIndex(0);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-xl font-bold text-white tracking-tight"
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
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                        aria-expanded={isOpen}
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
                <div className="px-4 py-3 space-y-2 bg-navy-900/95 backdrop-blur-md">
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
                                className={`block transition-colors duration-300 text-base py-1.5 ${activeIndex === index ? 'text-blue-400' : 'text-gray-300 hover:text-white'
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
