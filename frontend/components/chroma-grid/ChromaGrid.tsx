'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export interface ChromaItem {
    image: string;
    title: string;
    subtitle: string;
    handle?: string;
    borderColor?: string;
    gradient?: string;
    url?: string;
    location?: string;
    _project?: any;
    [key: string]: any;
}

export interface ChromaGridProps {
    items?: ChromaItem[];
    className?: string;
    radius?: number;
    damping?: number;
    fadeOut?: number;
    ease?: string;
    onCardClick?: (item: ChromaItem) => void;
    // Tambahan opsi untuk mengatur seberapa lebar penyebaran warnanya
    hoverRadius?: number;
}

const ChromaGrid = ({
    items,
    className = '',
    radius = 500,
    damping = 0.85,
    fadeOut = 0.5,
    ease = 'power3.out',
    onCardClick,
    hoverRadius = 1 // Default radius 1 = menyalakan target, 1 di kiri, 1 di kanan
}: ChromaGridProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const setX = useRef<((value: number) => void) | null>(null);
    const setY = useRef<((value: number) => void) | null>(null);
    const pos = useRef({ x: 0, y: 0 });

    // STATE BARU: Menyimpan index dari card yang sedang disorot mouse
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const demo: ChromaItem[] = [
        {
            image: 'https://i.pravatar.cc/300?img=8',
            title: 'Alex Rivera',
            subtitle: 'Full Stack Developer',
            handle: '@alexrivera',
            borderColor: '#4F46E5',
            gradient: 'linear-gradient(145deg,#4F46E5,#000)',
            url: 'https://github.com/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=11',
            title: 'Jordan Chen',
            subtitle: 'DevOps Engineer',
            handle: '@jordanchen',
            borderColor: '#10B981',
            gradient: 'linear-gradient(210deg,#10B981,#000)',
            url: 'https://linkedin.com/in/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=3',
            title: 'Morgan Blake',
            subtitle: 'UI/UX Designer',
            handle: '@morganblake',
            borderColor: '#F59E0B',
            gradient: 'linear-gradient(165deg,#F59E0B,#000)',
            url: 'https://dribbble.com/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=16',
            title: 'Casey Park',
            subtitle: 'Data Scientist',
            handle: '@caseypark',
            borderColor: '#EF4444',
            gradient: 'linear-gradient(195deg,#EF4444,#000)',
            url: 'https://kaggle.com/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=25',
            title: 'Sam Kim',
            subtitle: 'Mobile Developer',
            handle: '@thesamkim',
            borderColor: '#8B5CF6',
            gradient: 'linear-gradient(225deg,#8B5CF6,#000)',
            url: 'https://github.com/'
        },
        {
            image: 'https://i.pravatar.cc/300?img=60',
            title: 'Tyler Rodriguez',
            subtitle: 'Cloud Architect',
            handle: '@tylerrod',
            borderColor: '#06B6D4',
            gradient: 'linear-gradient(135deg,#06B6D4,#000)',
            url: 'https://aws.amazon.com/'
        }
    ];

    const data = items?.length ? items : demo;

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        setX.current = gsap.quickSetter(el, '--x', 'px') as (value: number) => void;
        setY.current = gsap.quickSetter(el, '--y', 'px') as (value: number) => void;
        const { width, height } = el.getBoundingClientRect();
        pos.current = { x: width / 2, y: height / 2 };
        setX.current(pos.current.x);
        setY.current(pos.current.y);
    }, []);

    const moveTo = (x: number, y: number) => {
        gsap.to(pos.current, {
            x,
            y,
            duration: damping,
            ease,
            onUpdate: () => {
                setX.current?.(pos.current.x);
                setY.current?.(pos.current.y);
            },
            overwrite: true
        });
    };

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!rootRef.current) return;
        const r = rootRef.current.getBoundingClientRect();
        moveTo(e.clientX - r.left, e.clientY - r.top);
        gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    };

    const handleLeave = () => {
        // Reset warna ketika kursor meninggalkan area grid sepenuhnya
        setHoverIndex(null);
        gsap.to(fadeRef.current, {
            opacity: 1,
            duration: fadeOut,
            overwrite: true
        });
    };

    const handleCardClick = (item: ChromaItem) => {
        if (onCardClick) {
            onCardClick(item);
        } else if (item.url && item.url !== '#') {
            window.open(item.url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
        const c = e.currentTarget;
        const rect = c.getBoundingClientRect();
        c.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        c.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    return (
        <div
            ref={rootRef}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            className={`relative w-full h-full flex flex-wrap justify-center items-start gap-6 p-2 ${className}`}
            style={{
                '--r': `${radius}px`,
                '--x': '50%',
                '--y': '50%'
            } as React.CSSProperties}
        >
            {data.map((c, i) => {
                // LOGIKA RADIUS: Cek apakah card ini berada dalam jangkauan hoverRadius dari card yang ditunjuk
                const isHovered = hoverIndex !== null;
                const distance = isHovered ? Math.abs(i - hoverIndex) : Infinity;
                const isActive = !isHovered || distance <= hoverRadius;

                return (
                    <article
                        key={i}
                        onMouseMove={handleCardMove}
                        onMouseEnter={() => setHoverIndex(i)} // Simpan index saat disorot
                        onClick={() => handleCardClick(c)}
                        className={`group relative flex flex-col w-[300px] rounded-[20px] overflow-hidden border-2 border-transparent transition-all duration-500 cursor-pointer ${
                            // Ubah class dinamis berdasarkan status aktif/tidaknya
                            isActive
                                ? 'grayscale-0 brightness-100'
                                : 'grayscale brightness-[0.78]'
                            }`}
                        style={{
                            '--card-border': c.borderColor || 'transparent',
                            background: `${c.gradient || ''}, #0f1729`,
                            '--spotlight-color': 'rgba(255,255,255,0.3)'
                        } as React.CSSProperties}
                    >
                        {/* Hover Spotlight per Card */}
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
                            style={{
                                background:
                                    'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)'
                            }}
                        />

                        {/* Fixed Height Image Wrapper */}
                        <div className="relative z-10 w-full h-[250px] p-[10px] box-border">
                            <div className="w-full h-full rounded-[12px] overflow-hidden bg-navy-950">
                                <img
                                    src={c.image}
                                    alt={c.title}
                                    loading="lazy"
                                    onError={(e) => {
                                        const clean = c.image.replace(/^(https?:\/\/[^\/]+)?(\/storage\/|\/)?/, '');
                                        (e.target as HTMLImageElement).src = `/storage/${clean}`;
                                    }}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Fixed Height Footer */}
                        <footer className="relative z-10 h-[90px] px-4 py-3 text-white font-sans flex flex-col justify-center gap-0.5 border-t border-white/5">
                            <h3 className="m-0 text-[1.05rem] font-semibold line-clamp-1 group-hover:text-blue-400 transition-colors duration-300">
                                {c.title}
                            </h3>
                            <p className="m-0 text-[0.85rem] text-blue-400 font-medium opacity-90 line-clamp-1">
                                {c.subtitle}
                            </p>
                        </footer>
                    </article>
                );
            })}
        </div>
    );
};

export default ChromaGrid;