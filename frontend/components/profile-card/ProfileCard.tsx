'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProfileCardProps {
    avatarUrl?: string;
    name?: string;
    title?: string;
    handle?: string;
    status?: string;
    contactText?: string;
    onContactClick?: () => void;
    className?: string;
}

export default function ProfileCard({
    avatarUrl = '/assets/lanyard/foto.jpeg',
    name = 'Andi Ranreng S.',
    title = 'Full-Stack Developer',
    handle = 'andiirrrrr',
    status = 'Available',
    contactText = 'Contact Me',
    onContactClick,
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
                {/* CARD UTAMA */}
                <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                        border: '2px solid transparent',
                        backgroundImage: 'linear-gradient(#0F172A, #0F172A), linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(56, 189, 248, 0.4), rgba(59, 130, 246, 0.6))',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                        boxShadow: isHovering
                            ? '0 30px 60px -12px rgba(59, 130, 246, 0.5), inset 0 0 40px rgba(59, 130, 246, 0.05)'
                            : '0 20px 40px -12px rgba(59, 130, 246, 0.25), inset 0 0 20px rgba(59, 130, 246, 0.02)',
                    }}
                >
                    {/* 3D Glow effect mengikuti kursor */}
                    <div
                        className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
                        style={{
                            opacity: isHovering ? 0.4 : 0,
                            background: `radial-gradient(
                                ellipse at ${50 + rotateY * 3}% ${50 - rotateX * 3}%,
                                rgba(59, 130, 246, 0.3) 0%,
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
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 pointer-events-none" />

                        {/* Outer glow saat hover */}
                        <div
                            className={`absolute inset-[-4px] rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovering ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(56, 189, 248, 0.15))',
                                filter: 'blur(12px)',
                            }}
                        />

                        {/* Corner Accents */}
                        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-white/20 rounded-tl" />
                        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-white/20 rounded-tr" />
                        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-white/20 rounded-bl" />
                        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-white/20 rounded-br" />

                        {/* ID Card Label */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2">
                            <span className="text-[6px] font-bold text-white/30 tracking-widest uppercase">
                                ID CARD
                            </span>
                        </div>

                        {/* Nama di bawah - dengan background opacity 50% */}
                        <div className="absolute bottom-4 left-0 right-0 text-center px-2">
                            <div className="inline-block px-4 py-1.5 rounded-lg bg-navy-950/50 backdrop-blur-sm">
                                <p className="text-[15px] font-semibold text-white/90 tracking-wide">
                                    {name.toUpperCase()}
                                </p>
                                <p className="text-[10px] text-blue-400/80 tracking-wider">
                                    {title.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-navy-950/50 px-6 py-2 border-t border-navy-600 flex justify-between">
                        <span className="text-[8px] text-gray-500 tracking-widest uppercase">
                            •••• •••• •••• 2021
                        </span>
                        <span className="text-[8px] text-gray-500 tracking-widest uppercase">
                            {new Date().getFullYear()}
                        </span>
                    </div>


                </div>
            </motion.div>
        </motion.div>
    );
}