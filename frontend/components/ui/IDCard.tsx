'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

import idCardImage from '@/components/idcard/foto.jpeg';

interface IDCardProps {
    imageUrl?: string;
}

export default function IDCard({ imageUrl }: IDCardProps) {
    const finalImageUrl = imageUrl || idCardImage.src;
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isHeld, setIsHeld] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [startCardPos, setStartCardPos] = useState({ x: 0, y: 0 });
    const [isReturning, setIsReturning] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

    const springX = useSpring(0, { stiffness: 150, damping: 15, mass: 0.8 });
    const springY = useSpring(0, { stiffness: 150, damping: 15, mass: 0.8 });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        return () => {
            if (holdTimerRef.current) {
                clearTimeout(holdTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isReturning) {
            springX.set(position.x);
            springY.set(position.y);
        }
    }, [position, isReturning, springX, springY]);

    // Desktop
    useEffect(() => {
        if (isMobile || !cardRef.current) return;

        const handleMouseDown = (e: MouseEvent) => {
            e.preventDefault();
            setIsHeld(false);
            setHoldProgress(0);
            setIsReturning(false);

            holdTimerRef.current = setTimeout(() => {
                setIsHeld(true);
                setIsDragging(true);
                setStartPos({ x: e.clientX, y: e.clientY });
                setStartCardPos({ x: position.x, y: position.y });
                setHoldProgress(100);
                springX.set(position.x);
                springY.set(position.y);
            }, 500);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startPos.x;
            const deltaY = e.clientY - startPos.y;

            const maxMove = 400;
            const newX = Math.max(-maxMove, Math.min(maxMove, startCardPos.x + deltaX));
            const newY = Math.max(-maxMove, Math.min(maxMove, startCardPos.y + deltaY));

            setPosition({ x: newX, y: newY });
            springX.set(newX);
            springY.set(newY);
        };

        const handleMouseUp = () => {
            if (holdTimerRef.current) {
                clearTimeout(holdTimerRef.current);
                holdTimerRef.current = null;
            }

            if (isDragging) {
                setIsDragging(false);
                setHoldProgress(0);
                setIsHeld(false);
                setIsReturning(true);

                setPosition({ x: 0, y: 0 });
                springX.set(0);
                springY.set(0);

                setTimeout(() => {
                    setIsReturning(false);
                }, 1000);
            }
        };

        const card = cardRef.current;
        card.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            card.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isMobile, isDragging, startPos, startCardPos, position, springX, springY]);

    // Mobile
    useEffect(() => {
        if (!isMobile || !cardRef.current) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 0) return;
            const touch = e.touches[0];
            setIsHeld(false);
            setHoldProgress(0);
            setIsReturning(false);

            holdTimerRef.current = setTimeout(() => {
                setIsHeld(true);
                setIsDragging(true);
                setStartPos({ x: touch.clientX, y: touch.clientY });
                setStartCardPos({ x: position.x, y: position.y });
                setHoldProgress(100);
                springX.set(position.x);
                springY.set(position.y);
            }, 500);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging || e.touches.length === 0) return;
            const touch = e.touches[0];
            const deltaX = touch.clientX - startPos.x;
            const deltaY = touch.clientY - startPos.y;

            const maxMove = 400;
            const newX = Math.max(-maxMove, Math.min(maxMove, startCardPos.x + deltaX));
            const newY = Math.max(-maxMove, Math.min(maxMove, startCardPos.y + deltaY));

            setPosition({ x: newX, y: newY });
            springX.set(newX);
            springY.set(newY);
        };

        const handleTouchEnd = () => {
            if (holdTimerRef.current) {
                clearTimeout(holdTimerRef.current);
                holdTimerRef.current = null;
            }

            if (isDragging) {
                setIsDragging(false);
                setHoldProgress(0);
                setIsHeld(false);
                setIsReturning(true);

                setPosition({ x: 0, y: 0 });
                springX.set(0);
                springY.set(0);

                setTimeout(() => {
                    setIsReturning(false);
                }, 1000);
            }
        };

        const card = cardRef.current;
        card.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);

        return () => {
            card.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [isMobile, isDragging, startPos, startCardPos, position, springX, springY]);

    const cardX = position.x;
    const cardY = position.y;

    // ==========================================
    // TALI: Desktop panjang, Mobile pendek
    // ==========================================
    const stringTopY = isMobile ? -20 : -400;
    const stringBottomY = isMobile
        ? -20 + cardY * 0.2  // Pendek: hanya di atas card
        : 300 + cardY * 0.2; // Panjang: sampai bawah layar

    const dashArray = isDragging ? '8 6' : '12 8';

    return (
        <div ref={containerRef} className="relative flex flex-col items-center w-full h-full min-h-[300px] md:min-h-[500px]">
            {/* Tali */}
            <svg
                className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                width="80"
                height={isMobile ? "80" : "100%"}
                style={{
                    minHeight: isMobile ? '80px' : '700px',
                    overflow: 'visible',
                }}
            >
                {/* Tali utama */}
                <line
                    x1="40"
                    y1={stringTopY}
                    x2={40 + cardX * 0.3}
                    y2={stringBottomY}
                    stroke="#9CA3AF"
                    strokeWidth={isMobile ? "1.5" : "2"}
                    strokeLinecap="round"
                    strokeDasharray={dashArray}
                    style={{
                        transition: isDragging ? 'none' : 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                />

                {/* Tali kiri (lebih pendek di mobile) */}
                {!isMobile && (
                    <>
                        <line
                            x1="15"
                            y1={stringTopY + 30}
                            x2={-20 + cardX * 0.2}
                            y2={-50 + cardY * 0.3}
                            stroke="#9CA3AF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeDasharray="6 8"
                            opacity="0.5"
                            style={{
                                transition: isDragging ? 'none' : 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        />
                        <line
                            x1="65"
                            y1={stringTopY + 30}
                            x2={100 + cardX * 0.2}
                            y2={-50 + cardY * 0.3}
                            stroke="#9CA3AF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeDasharray="6 8"
                            opacity="0.5"
                            style={{
                                transition: isDragging ? 'none' : 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        />
                        <line
                            x1="25"
                            y1={stringTopY + 80}
                            x2={10 + cardX * 0.15}
                            y2={0 + cardY * 0.2}
                            stroke="#9CA3AF"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeDasharray="4 6"
                            opacity="0.3"
                            style={{
                                transition: isDragging ? 'none' : 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        />
                        <line
                            x1="55"
                            y1={stringTopY + 80}
                            x2={70 + cardX * 0.15}
                            y2={0 + cardY * 0.2}
                            stroke="#9CA3AF"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeDasharray="4 6"
                            opacity="0.3"
                            style={{
                                transition: isDragging ? 'none' : 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        />
                    </>
                )}

                {/* Gantungan atas */}
                <circle
                    cx="40"
                    cy={stringTopY}
                    r={isMobile ? "3" : "5"}
                    fill="#6B7280"
                    stroke="#9CA3AF"
                    strokeWidth="1"
                />

                {/* Gantungan bawah */}
                <circle
                    cx={40 + cardX * 0.3}
                    cy={stringBottomY - (isMobile ? 10 : 30)}
                    r={isMobile ? "4" : "6"}
                    fill="#6B7280"
                    stroke="#9CA3AF"
                    strokeWidth="1"
                    style={{
                        transition: isDragging ? 'none' : 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                />
            </svg>

            {/* ID Card */}
            <motion.div
                ref={cardRef}
                className="relative z-10 touch-none"
                style={{
                    x: springX,
                    y: springY,
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
                animate={{
                    rotate: isDragging ? position.x * 0.02 : 0,
                    scale: isDragging ? 1.04 : isHeld ? 1.02 : 1,
                }}
                transition={{
                    type: 'spring',
                    stiffness: isReturning ? 120 : 300,
                    damping: isReturning ? 14 : 22,
                    mass: isReturning ? 1.2 : 0.8,
                }}
            >
                <div
                    className="relative w-40 md:w-56 rounded-2xl overflow-hidden"
                    style={{
                        aspectRatio: '3/4',
                        border: '2px solid transparent',
                        backgroundImage: 'linear-gradient(#0F172A, #0F172A), linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(56, 189, 248, 0.4), rgba(59, 130, 246, 0.6))',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                        boxShadow: isDragging
                            ? '0 30px 60px -12px rgba(59, 130, 246, 0.5), inset 0 0 40px rgba(59, 130, 246, 0.05)'
                            : '0 20px 40px -12px rgba(59, 130, 246, 0.25), inset 0 0 20px rgba(59, 130, 246, 0.02)',
                    }}
                >
                    <img
                        src={finalImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 pointer-events-none" />

                    <div
                        className={`absolute inset-[-4px] rounded-2xl transition-opacity duration-300 pointer-events-none ${isDragging ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(56, 189, 248, 0.15))',
                            filter: 'blur(12px)',
                        }}
                    />

                    <div className="absolute top-2 left-2 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-white/20 rounded-tl" />
                    <div className="absolute top-2 right-2 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-white/20 rounded-tr" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-white/20 rounded-bl" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-white/20 rounded-br" />

                    <div className="absolute top-2 left-1/2 -translate-x-1/2">
                        <span className="text-[5px] md:text-[6px] font-bold text-white/30 tracking-widest uppercase">
                            ID CARD
                        </span>
                    </div>

                    {isHeld && !isDragging && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 pointer-events-none animate-pulse" />
                    )}
                </div>
            </motion.div>

            {/* Hint */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isDragging ? 0 : 0.3 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-gray-500 mt-8 text-center pointer-events-none"
            >
                {isMobile ? '✧ Tekan lama lalu tarik ✧' : '✧ Press & hold then drag ✧'}
            </motion.p>
        </div>
    );
}