'use client';

import React, { useRef, useState, useEffect } from 'react';
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
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Desktop: Mouse move untuk 3D tilt
    useEffect(() => {
        if (isMobile || !cardRef.current) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!cardRef.current) return;
            const rect = cardRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const x = (e.clientX - centerX) / (rect.width / 2);
            const y = (e.clientY - centerY) / (rect.height / 2);

            setRotateY(x * 12);
            setRotateX(-y * 12);
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => {
            setIsHovering(false);
            setRotateX(0);
            setRotateY(0);
        };

        const card = cardRef.current;
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isMobile]);

    // Mobile: Touch untuk 3D tilt
    useEffect(() => {
        if (!isMobile || !cardRef.current) return;

        let startX = 0;
        let startY = 0;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let isTouching = false;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 0) return;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            currentRotateX = rotateX;
            currentRotateY = rotateY;
            isTouching = true;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isTouching || e.touches.length === 0) return;
            const touch = e.touches[0];
            const deltaX = (touch.clientX - startX) / 2;
            const deltaY = (touch.clientY - startY) / 2;

            setRotateY(Math.max(-12, Math.min(12, currentRotateY + deltaX)));
            setRotateX(Math.max(-12, Math.min(12, currentRotateX + deltaY)));
        };

        const handleTouchEnd = () => {
            isTouching = false;
            setTimeout(() => {
                setRotateX(0);
                setRotateY(0);
            }, 300);
        };

        const card = cardRef.current;
        card.addEventListener('touchstart', handleTouchStart);
        card.addEventListener('touchmove', handleTouchMove);
        card.addEventListener('touchend', handleTouchEnd);
        card.addEventListener('touchcancel', handleTouchEnd);

        return () => {
            card.removeEventListener('touchstart', handleTouchStart);
            card.removeEventListener('touchmove', handleTouchMove);
            card.removeEventListener('touchend', handleTouchEnd);
            card.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [isMobile, rotateX, rotateY]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative w-full max-w-[320px] mx-auto ${className}`}
            style={{ perspective: '1000px' }}
        >
            <motion.div
                ref={cardRef}
                className="relative w-full rounded-2xl overflow-hidden cursor-pointer touch-none"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transition: isHovering || isMobile ? 'transform 0.05s ease-out' : 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
                        boxShadow: isHovering
                            ? '0 30px 60px -12px rgba(59, 130, 246, 0.5), inset 0 0 40px rgba(59, 130, 246, 0.05)'
                            : '0 20px 40px -12px rgba(59, 130, 246, 0.25), inset 0 0 20px rgba(59, 130, 246, 0.02)',
                    }}
                >
                    {/* Glossy Shine Effect - Mengkilat */}
                    <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                            background: `
                linear-gradient(
                  105deg,
                  transparent 40%,
                  rgba(255, 255, 255, 0.1) 45%,
                  rgba(255, 255, 255, 0.15) 50%,
                  rgba(255, 255, 255, 0.1) 55%,
                  transparent 60%
                )
              `,
                            backgroundSize: '300% 300%',
                            backgroundPosition: isHovering ? '100% 50%' : '0% 50%',
                            transition: 'background-position 0.8s ease',
                            mixBlendMode: 'overlay',
                        }}
                    />

                    {/* Rainbow Holographic Overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none z-[5] opacity-0 transition-opacity duration-500"
                        style={{
                            opacity: isHovering ? 0.15 : 0,
                            background: `
                conic-gradient(
                  from 0deg at 50% 50%,
                  #ff6b6b,
                  #ffd93d,
                  #6bcb77,
                  #4d96ff,
                  #9b59b6,
                  #ff6b6b
                )
              `,
                            animation: 'rainbowSpin 3s linear infinite',
                            mixBlendMode: 'overlay',
                        }}
                    />

                    {/* Rainbow Glow saat hover */}
                    <div
                        className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 z-[4]"
                        style={{
                            opacity: isHovering ? 0.6 : 0,
                            background: `radial-gradient(
                ellipse at ${50 + rotateY * 3}% ${50 - rotateX * 3}%,
                rgba(255, 107, 107, 0.2),
                rgba(255, 217, 61, 0.2),
                rgba(107, 203, 119, 0.2),
                rgba(77, 150, 255, 0.2),
                rgba(155, 89, 182, 0.2)
              )`,
                            filter: 'blur(20px)',
                        }}
                    />

                    {/* 3D Glow effect mengikuti kursor */}
                    <div
                        className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 z-[6]"
                        style={{
                            opacity: isHovering ? 0.3 : 0,
                            background: `radial-gradient(
                ellipse at ${50 + rotateY * 3}% ${50 - rotateX * 3}%,
                rgba(255, 255, 255, 0.15) 0%,
                transparent 60%
              )`,
                        }}
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

                        {/* Outer glow saat hover */}
                        <div
                            className={`absolute inset-[-4px] rounded-2xl transition-opacity duration-300 pointer-events-none z-[3] ${isHovering ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,107,107,0.3), rgba(77,150,255,0.3), rgba(155,89,182,0.3))',
                                filter: 'blur(12px)',
                            }}
                        />

                        {/* Corner Accents - Rainbow */}
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

                        {/* Nama & Title dengan Background */}
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
            </motion.div>

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