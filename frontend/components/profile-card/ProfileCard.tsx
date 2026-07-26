'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProfileCardProps {
    avatarUrl?: string;
    name?: string;
    title?: string;
    handle?: string;
    status?: string;
    className?: string;
}

export default function ProfileCard({
    avatarUrl = '/assets/lanyard/foto.jpeg',
    name = 'Andi Ranreng S.',
    title = 'Full-Stack Developer',
    handle = 'andiirrrrr',
    status = 'Available',
    className = '',
}: ProfileCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const isHoveringRef = useRef(false);
    const glowRef = useRef<HTMLDivElement>(null);
    const outerGlowRef = useRef<HTMLDivElement>(null);
    const holographicRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
        const card = cardRef.current;
        const inner = innerRef.current;
        if (!card || !inner) return;

        // ── DESKTOP: Mouse tilt via direct DOM (zero React re-renders) ──
        if (!isMobile) {
            const handleMouseMove = (e: MouseEvent) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
                const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
                const rY = x * 12;
                const rX = -y * 12;
                inner.style.transform = `rotateX(${rX}deg) rotateY(${rY}deg)`;
                // Update glow position
                if (glowRef.current) {
                    glowRef.current.style.background = `radial-gradient(ellipse at ${50 + rY * 3}% ${50 - rX * 3}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
                    glowRef.current.style.opacity = '0.3';
                }
                if (outerGlowRef.current) {
                    outerGlowRef.current.style.background = `radial-gradient(ellipse at ${50 + rY * 3}% ${50 - rX * 3}%, rgba(255,107,107,0.2), rgba(255,217,61,0.2), rgba(107,203,119,0.2), rgba(77,150,255,0.2), rgba(155,89,182,0.2))`;
                    outerGlowRef.current.style.opacity = '0.6';
                }
            };
            const handleMouseEnter = () => {
                isHoveringRef.current = true;
                inner.style.transition = 'transform 0.05s ease-out';
                if (holographicRef.current) holographicRef.current.style.opacity = '0.15';
            };
            const handleMouseLeave = () => {
                isHoveringRef.current = false;
                inner.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
                if (glowRef.current) glowRef.current.style.opacity = '0';
                if (outerGlowRef.current) outerGlowRef.current.style.opacity = '0';
                if (holographicRef.current) holographicRef.current.style.opacity = '0';
            };
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);
            return () => {
                card.removeEventListener('mousemove', handleMouseMove);
                card.removeEventListener('mouseenter', handleMouseEnter);
                card.removeEventListener('mouseleave', handleMouseLeave);
            };
        }

        // ── MOBILE: Touch tilt (lightweight, no setState) ──
        let startX = 0, startY = 0, curRX = 0, curRY = 0;
        let isTouching = false;
        const handleTouchStart = (e: TouchEvent) => {
            if (!e.touches[0]) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isTouching = true;
            inner.style.transition = 'transform 0.05s ease-out';
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (!isTouching || !e.touches[0]) return;
            const dx = (e.touches[0].clientX - startX) / 2;
            const dy = (e.touches[0].clientY - startY) / 2;
            curRY = Math.max(-12, Math.min(12, dx));
            curRX = Math.max(-12, Math.min(12, dy));
            inner.style.transform = `rotateX(${curRX}deg) rotateY(${curRY}deg)`;
        };
        const handleTouchEnd = () => {
            isTouching = false;
            inner.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            inner.style.transform = 'rotateX(0deg) rotateY(0deg)';
            curRX = 0; curRY = 0;
        };
        card.addEventListener('touchstart', handleTouchStart, { passive: true });
        card.addEventListener('touchmove', handleTouchMove, { passive: true });
        card.addEventListener('touchend', handleTouchEnd);
        card.addEventListener('touchcancel', handleTouchEnd);
        return () => {
            card.removeEventListener('touchstart', handleTouchStart);
            card.removeEventListener('touchmove', handleTouchMove);
            card.removeEventListener('touchend', handleTouchEnd);
            card.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative w-full max-w-[320px] mx-auto ${className}`}
            style={{ perspective: '1000px' }}
        >
            {/* Inner tilt wrapper — controlled directly via DOM ref */}
            <div
                ref={cardRef}
                style={{ perspective: '1000px' }}
            >
                <div
                    ref={innerRef}
                    className="relative w-full rounded-2xl overflow-hidden cursor-pointer touch-none"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: 'rotateX(0deg) rotateY(0deg)',
                        transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                >
                    {/* CARD UTAMA dengan RAINBOW HOLOGRAPHIC BORDER */}
                    <div
                        className="relative rounded-2xl overflow-hidden"
                        style={{
                            border: '2px solid transparent',
                            backgroundImage: 'linear-gradient(#0F172A, #0F172A), linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box',
                            backgroundSize: '200% 200%',
                            animation: 'rainbowBorder 4s linear infinite',
                            boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.25), inset 0 0 20px rgba(59, 130, 246, 0.02)',
                        }}
                    >
                        {/* Glossy Shine Effect */}
                        <div
                            className="absolute inset-0 pointer-events-none z-10"
                            style={{
                                background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)`,
                                backgroundSize: '300% 300%',
                                backgroundPosition: '0% 50%',
                                mixBlendMode: 'overlay',
                            }}
                        />

                        {/* Rainbow Holographic Overlay — shown on hover via ref */}
                        <div
                            ref={holographicRef}
                            className="absolute inset-0 pointer-events-none z-[5]"
                            style={{
                                opacity: 0,
                                transition: 'opacity 0.5s',
                                background: `conic-gradient(from 0deg at 50% 50%, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)`,
                                animation: 'rainbowSpin 3s linear infinite',
                                mixBlendMode: 'overlay',
                            }}
                        />

                        {/* Rainbow Glow — updated via ref */}
                        <div
                            ref={outerGlowRef}
                            className="absolute inset-0 pointer-events-none rounded-2xl z-[4]"
                            style={{
                                opacity: 0,
                                transition: 'opacity 0.3s',
                                filter: 'blur(20px)',
                            }}
                        />

                        {/* 3D Glow effect — updated via ref */}
                        <div
                            ref={glowRef}
                            className="absolute inset-0 pointer-events-none rounded-2xl z-[6]"
                            style={{ opacity: 0, transition: 'opacity 0.3s' }}
                        />

                        {/* Gambar - aspect ratio 3:4 */}
                        <div className="relative w-full aspect-[3/4]">
                            <img
                                src={avatarUrl}
                                alt={name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/assets/lanyard/foto.jpeg';
                                }}
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 pointer-events-none z-[7]" />

                            {/* Corner Accents */}
                            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-white/30 rounded-tl z-[8]" />
                            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-white/30 rounded-tr z-[8]" />
                            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-white/30 rounded-bl z-[8]" />
                            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-white/30 rounded-br z-[8]" />

                            {/* ID Card Label */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[8]">
                                <span className="text-[6px] font-bold text-white/40 tracking-widest uppercase">
                                    ID CARD
                                </span>
                            </div>

                            {/* Nama & Title */}
                            <div className="absolute bottom-4 left-0 right-0 text-center px-2 z-[8]">
                                <div className="inline-block px-4 py-1.5 rounded-lg bg-navy-950/60 backdrop-blur-sm border border-white/10">
                                    <p className="text-[15px] font-semibold text-white/90 tracking-wide">
                                        {name.toUpperCase()}
                                    </p>
                                    <p className="text-[12px] text-blue-400/80 tracking-wider">
                                        {title.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-navy-950/50 px-6 py-2 border-t border-navy-600 flex justify-between relative z-[8]">
                            <span className="text-[8px] text-gray-500 tracking-widest uppercase">
                                •••• •••• •••• 2024
                            </span>
                            <span className="text-[8px] text-gray-500 tracking-widest uppercase">
                                {new Date().getFullYear()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes rainbowBorder {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes rainbowSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </motion.div>
    );
}