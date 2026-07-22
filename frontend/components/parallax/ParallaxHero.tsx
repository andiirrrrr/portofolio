'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Import gambar .PNG
import bgImage from './0.png';
import layer1 from './1.png';
import layer2 from './2.png';
import layer3 from './3.png';
import layer4 from './4.png';

export default function ParallaxHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);

    // Cek mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Scroll untuk scroll indicator saja
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY < 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ==========================================
    // DESKTOP: Gerakan Kursor
    // ==========================================
    useEffect(() => {
        if (isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const x = (e.clientX - centerX) / (rect.width / 2);
            const y = (e.clientY - centerY) / (rect.height / 2);

            setOffsetX(x);
            setOffsetY(y);
            setIsInteracting(true);
        };

        const handleMouseLeave = () => {
            setOffsetX(0);
            setOffsetY(0);
            setIsInteracting(false);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [isMobile]);

    // ==========================================
    // MOBILE: Tap / Klik (bukan geser)
    // ==========================================
    useEffect(() => {
        if (!isMobile) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (!containerRef.current || e.touches.length === 0) return;

            const touch = e.touches[0];
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const x = (touch.clientX - centerX) / (rect.width / 2);
            const y = (touch.clientY - centerY) / (rect.height / 2);

            setOffsetX(x);
            setOffsetY(y);
            setIsInteracting(true);
        };

        const handleTouchEnd = () => {
            // Kembali ke posisi normal setelah tap selesai
            setOffsetX(0);
            setOffsetY(0);
            setIsInteracting(false);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('touchstart', handleTouchStart);
            container.addEventListener('touchend', handleTouchEnd);
            container.addEventListener('touchcancel', handleTouchEnd);
        }

        return () => {
            if (container) {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchend', handleTouchEnd);
                container.removeEventListener('touchcancel', handleTouchEnd);
            }
        };
    }, [isMobile]);

    // Konfigurasi layer
    const layers = [
        { src: bgImage, speed: 0, label: 'Background' },
        { src: layer1, speed: 0.15, label: 'Layer 1' },
        { src: layer2, speed: 0.30, label: 'Layer 2' },
        { src: layer3, speed: 0.70, label: 'Layer 3' },
        { src: layer4, speed: 0.95, label: 'Layer 4' },
    ];

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden bg-navy-950 cursor-default"
        >
            {/* Parallax Layers - Hanya bergerak saat interaksi */}
            {layers.map((layer, index) => {
                const isBackground = index === 0;
                // Hanya bergerak jika sedang berinteraksi (kursor di dalam / tap)
                const moveX = isBackground ? 0 : (isInteracting ? offsetX * layer.speed * 80 : 0);
                const moveY = isBackground ? 0 : (isInteracting ? offsetY * layer.speed * 60 : 0);
                const scale = isBackground ? 1.02 : 1.15; // Skala ekstra agar gambar tidak terpotong saat bergerak

                return (
                    <motion.div
                        key={index}
                        className="absolute inset-0 w-full h-full"
                        style={{
                            transform: `translate(${moveX}px, ${moveY}px) scale(${scale})`,
                            transition: isInteracting ? 'transform 0.05s ease-out' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                            zIndex: index,
                            willChange: 'transform',
                        }}
                    >
                        <div
                            className="w-full h-full bg-cover bg-center bg-no-repeat md:bg-[length:100%_100%]"
                            style={{
                                backgroundImage: `url(${layer.src.src})`,
                            }}
                        />
                    </motion.div>
                );
            })}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-navy-950/30 to-navy-950/80 z-10" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="mb-2"
                    >
                        <motion.p
                            initial={{ opacity: 0, letterSpacing: '20px' }}
                            animate={{ opacity: 1, letterSpacing: '6px' }}
                            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                            className="text-white text-sm md:text-base font-medium tracking-[6px] uppercase"
                        >
                            Welcome to
                        </motion.p>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold text-white"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-gradient bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-[length:200%] animate-gradient inline-block"
                        >
                            My{'  '}
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.85, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-gradient bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-[length:200%] animate-gradient inline-block"
                        >
                            Portfolio
                        </motion.span>
                    </motion.h1>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isVisible ? 1 : 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                            }`}
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
                </div>
            </div>
        </div>
    );
}