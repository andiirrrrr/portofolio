'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Import gambar .PNG
import bgImage from './0.png';
import layer1 from './1.png';
import layer2 from './2.png';
import layer3 from './3.png';
import layer4 from './4.png';

// Konfigurasi layer
const LAYERS = [
    { src: bgImage, speed: 0, label: 'Background' },
    { src: layer1, speed: 0.15, label: 'Layer 1' },
    { src: layer2, speed: 0.30, label: 'Layer 2' },
    { src: layer3, speed: 0.70, label: 'Layer 3' },
    { src: layer4, speed: 0.95, label: 'Layer 4' },
];

export default function ParallaxHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rafRef = useRef<number>(0);
    const targetRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });
    const isInteractingRef = useRef(false);
    // Pause RAF when hero is scrolled out of view — saves CPU while user reads other sections
    const isHeroVisibleRef = useRef(true);

    // Hanya state yang benar-benar perlu re-render
    const [isScrollVisible, setIsScrollVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Cek mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Scroll indicator visibility
    useEffect(() => {
        const handleScroll = () => {
            setIsScrollVisible(window.scrollY < 100);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ==========================================
    // Pause RAF when hero scrolls off-screen
    // ==========================================
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { isHeroVisibleRef.current = entry.isIntersecting; },
            { threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // ==========================================
    // RAF loop -- lerp posisi layer tanpa setState
    // ==========================================
    useEffect(() => {
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const lerpFactor = 0.08;

        const animate = () => {
            rafRef.current = requestAnimationFrame(animate);

            // Skip expensive DOM updates when hero is off screen
            if (!isHeroVisibleRef.current) return;

            const tx = isInteractingRef.current ? targetRef.current.x : 0;
            const ty = isInteractingRef.current ? targetRef.current.y : 0;

            currentRef.current.x = lerp(currentRef.current.x, tx, lerpFactor);
            currentRef.current.y = lerp(currentRef.current.y, ty, lerpFactor);

            // Update DOM langsung -- ZERO React re-render
            layerRefs.current.forEach((el, index) => {
                if (!el || index === 0) return;
                const layer = LAYERS[index];
                const mx = currentRef.current.x * layer.speed * 80;
                const my = currentRef.current.y * layer.speed * 60;
                el.style.transform = `translate(${mx}px, ${my}px) scale(1.15)`;
            });
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
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
            targetRef.current.x = (e.clientX - centerX) / (rect.width / 2);
            targetRef.current.y = (e.clientY - centerY) / (rect.height / 2);
            isInteractingRef.current = true;
        };

        const handleMouseLeave = () => {
            isInteractingRef.current = false;
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
            targetRef.current.x = (touch.clientX - centerX) / (rect.width / 2);
            targetRef.current.y = (touch.clientY - centerY) / (rect.height / 2);
            isInteractingRef.current = true;
        };

        const handleTouchEnd = () => {
            isInteractingRef.current = false;
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('touchstart', handleTouchStart, { passive: true });
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

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden bg-navy-950 cursor-default"
        >
            {/* Parallax Layers */}
            {LAYERS.map((layer, index) => {
                const isBackground = index === 0;
                return (
                    <div
                        key={index}
                        ref={(el) => { layerRefs.current[index] = el; }}
                        className="absolute inset-0 w-full h-full"
                        style={{
                            transform: isBackground ? 'scale(1.02)' : 'translate(0px, 0px) scale(1.15)',
                            zIndex: index,
                            willChange: isBackground ? 'auto' : 'transform',
                        }}
                    >
                        <div
                            className="w-full h-full bg-cover bg-center bg-no-repeat md:bg-[length:100%_100%]"
                            style={{
                                backgroundImage: `url(${layer.src.src})`,
                            }}
                        />
                    </div>
                );
            })}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-navy-950/30 to-navy-950/80 z-10" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Subtitle: Welcome to */}
                    <div className="mb-2">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.035,
                                        delayChildren: 0.15,
                                    },
                                },
                            }}
                            className="flex justify-center flex-wrap gap-x-[0.35em] text-white text-sm md:text-base font-medium tracking-[6px] uppercase select-none"
                        >
                            {"Welcome to".split(" ").map((word, wordIndex) => (
                                <span key={wordIndex} className="inline-flex overflow-hidden">
                                    {word.split("").map((char, charIndex) => (
                                        <motion.span
                                            key={charIndex}
                                            variants={{
                                                hidden: {
                                                    opacity: 0,
                                                    y: 15,
                                                },
                                                visible: {
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: {
                                                        duration: 0.5,
                                                        ease: [0.16, 1, 0.3, 1],
                                                    },
                                                },
                                            }}
                                            className="inline-block"
                                            style={{ willChange: 'transform, opacity' }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Main Title: My Portfolio */}
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.04,
                                    delayChildren: 0.4,
                                },
                            },
                        }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold text-white select-none py-1"
                    >
                        <span className="inline-flex gap-x-[0.3em] flex-wrap justify-center">
                            {["My", "Portfolio"].map((word, wIdx) => (
                                <span key={wIdx} className="inline-flex overflow-hidden">
                                    {word.split("").map((letter, lIdx) => (
                                        <motion.span
                                            key={lIdx}
                                            variants={{
                                                hidden: {
                                                    opacity: 0,
                                                    y: 30,
                                                },
                                                visible: {
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: {
                                                        duration: 0.6,
                                                        ease: [0.16, 1, 0.3, 1],
                                                    },
                                                },
                                            }}
                                            className="text-gradient bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-[length:200%] animate-gradient inline-block"
                                            style={{ willChange: 'transform, opacity' }}
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                </span>
                            ))}
                        </span>
                    </motion.h1>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isScrollVisible ? 1 : 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-500 ${isScrollVisible ? 'opacity-100' : 'opacity-0'
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
