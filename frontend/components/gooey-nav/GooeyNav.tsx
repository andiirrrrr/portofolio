'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface GooeyNavItem {
    label: string;
    href: string;
}

interface GooeyNavProps {
    items: GooeyNavItem[];
    animationTime?: number;
    particleCount?: number;
    particleDistances?: [number, number];
    particleR?: number;
    timeVariance?: number;
    colors?: number[];
    initialActiveIndex?: number;
}

const GooeyNav = ({
    items,
    animationTime = 600,
    particleCount = 15,
    particleDistances = [90, 10],
    particleR = 100,
    timeVariance = 300,
    colors = [1, 2, 3, 1, 2, 3, 1, 4],
    initialActiveIndex = 0
}: GooeyNavProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLUListElement>(null);
    const filterRef = useRef<HTMLSpanElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
    const router = useRouter();

    const noise = (n = 1) => n / 2 - Math.random() * n;
    const getXY = (distance: number, pointIndex: number, totalPoints: number) => {
        const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    };

    const createParticle = (i: number, t: number, d: [number, number], r: number) => {
        let rotate = noise(r / 10);
        return {
            start: getXY(d[0], particleCount - i, particleCount),
            end: getXY(d[1] + noise(7), particleCount - i, particleCount),
            time: t,
            scale: 1 + noise(0.2),
            color: colors[Math.floor(Math.random() * colors.length)],
            rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
        };
    };

    const makeParticles = (element: HTMLElement) => {
        const d = particleDistances;
        const r = particleR;
        const bubbleTime = animationTime * 2 + timeVariance;
        element.style.setProperty('--time', `${bubbleTime}ms`);
        for (let i = 0; i < particleCount; i++) {
            const t = animationTime * 2 + noise(timeVariance * 2);
            const p = createParticle(i, t, d, r);
            element.classList.remove('active');
            setTimeout(() => {
                const particle = document.createElement('span');
                const point = document.createElement('span');
                particle.classList.add('particle');
                particle.style.setProperty('--start-x', `${p.start[0]}px`);
                particle.style.setProperty('--start-y', `${p.start[1]}px`);
                particle.style.setProperty('--end-x', `${p.end[0]}px`);
                particle.style.setProperty('--end-y', `${p.end[1]}px`);
                particle.style.setProperty('--time', `${p.time}ms`);
                particle.style.setProperty('--scale', `${p.scale}`);
                particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
                particle.style.setProperty('--rotate', `${p.rotate}deg`);
                point.classList.add('point');
                particle.appendChild(point);
                element.appendChild(particle);
                requestAnimationFrame(() => {
                    element.classList.add('active');
                });
                setTimeout(() => {
                    try {
                        element.removeChild(particle);
                    } catch {
                        // do nothing
                    }
                }, t);
            }, 30);
        }
    };

    // Use GPU hardware accelerated translate3d to eliminate reflow jitter and vibrations
    const updateEffectPosition = (element: HTMLElement) => {
        if (!containerRef.current || !filterRef.current || !textRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const pos = element.getBoundingClientRect();
        const x = pos.x - containerRect.x;
        const y = pos.y - containerRect.y;

        const transformStr = `translate3d(${x}px, ${y}px, 0)`;
        const widthStr = `${pos.width}px`;
        const heightStr = `${pos.height}px`;

        filterRef.current.style.transform = transformStr;
        filterRef.current.style.width = widthStr;
        filterRef.current.style.height = heightStr;

        textRef.current.style.transform = transformStr;
        textRef.current.style.width = widthStr;
        textRef.current.style.height = heightStr;
        textRef.current.innerText = element.innerText;
    };

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
        e.preventDefault();
        const liEl = e.currentTarget.parentElement;
        if (!liEl) return;

        const href = items[index].href;

        // HOME: Scroll ke paling atas
        if (href === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveIndex(index);
            updateEffectPosition(liEl);
            if (filterRef.current) {
                const particles = filterRef.current.querySelectorAll('.particle');
                particles.forEach(p => filterRef.current!.removeChild(p));
                makeParticles(filterRef.current);
            }
            if (textRef.current) {
                textRef.current.classList.remove('active');
                void textRef.current.offsetWidth;
                textRef.current.classList.add('active');
            }
            return;
        }

        // ABOUT (#about): Scroll ke section
        if (href.includes('#')) {
            const targetId = href.split('#')[1];
            setActiveIndex(index);
            updateEffectPosition(liEl);

            if (filterRef.current) {
                const particles = filterRef.current.querySelectorAll('.particle');
                particles.forEach(p => filterRef.current!.removeChild(p));
                makeParticles(filterRef.current);
            }
            if (textRef.current) {
                textRef.current.classList.remove('active');
                void textRef.current.offsetWidth;
                textRef.current.classList.add('active');
            }

            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }

        // Link lain
        if (activeIndex === index) {
            router.push(href);
            return;
        }

        setActiveIndex(index);
        updateEffectPosition(liEl);
        if (filterRef.current) {
            const particles = filterRef.current.querySelectorAll('.particle');
            particles.forEach(p => filterRef.current!.removeChild(p));
        }
        if (textRef.current) {
            textRef.current.classList.remove('active');
            void textRef.current.offsetWidth;
            textRef.current.classList.add('active');
        }
        if (filterRef.current) {
            makeParticles(filterRef.current);
        }
        setTimeout(() => {
            router.push(href);
        }, animationTime + 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const liEl = e.currentTarget.parentElement;
            if (liEl) {
                handleClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, index);
            }
        }
    };

    useEffect(() => {
        if (!navRef.current || !containerRef.current) return;
        const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
        if (activeLi) {
            updateEffectPosition(activeLi);
            textRef.current?.classList.add('active');
        }
        const resizeObserver = new ResizeObserver(() => {
            const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
            if (currentActiveLi) {
                updateEffectPosition(currentActiveLi);
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [activeIndex]);

    return (
        <>
            <style>
                {`
          :root {
            --cubic-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .effect {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
            will-change: transform, width, height;
            transition: transform 0.35s var(--cubic-bounce), width 0.35s var(--cubic-bounce), height 0.35s var(--cubic-bounce);
          }
          .effect.text {
            color: white;
            font-weight: 500;
            transition: color 0.2s ease, transform 0.35s var(--cubic-bounce), width 0.35s var(--cubic-bounce), height 0.35s var(--cubic-bounce);
          }
          .effect.text.active {
            color: black;
          }
          .effect.filter {
            filter: url(#gooey-nav-filter);
          }
          .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: white;
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
          }
          .effect.active::after {
            animation: pill 0.3s ease both;
          }
          @keyframes pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .particle,
          .point {
            display: block;
            opacity: 0;
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 10px);
            left: calc(50% - 10px);
            animation: particle calc(var(--time)) ease 1 -350ms;
          }
          .point {
            background: var(--color);
            opacity: 1;
            animation: point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes particle {
            0% {
              transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
              opacity: 1;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            70% {
              transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
              opacity: 1;
            }
            100% {
              transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
              opacity: 1;
            }
          }
          @keyframes point {
            0% {
              transform: scale(0);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            25% {
              transform: scale(calc(var(--scale) * 0.25));
            }
            38% {
              opacity: 1;
            }
            65% {
              transform: scale(var(--scale));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: scale(var(--scale));
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
          li.active {
            color: transparent;
            text-shadow: none;
          }
          /* Hapus background kotak ganda pada li::after untuk mencegah kerutan/getaran sudut */
          li::after {
            display: none !important;
          }
        `}
            </style>
            <div className="relative" ref={containerRef}>
                <nav className="flex relative" style={{ transform: 'translate3d(0,0,0.01px)' }}>
                    <ul
                        ref={navRef}
                        className="flex gap-8 list-none p-0 px-4 m-0 relative z-[3]"
                        style={{
                            color: 'white',
                            textShadow: '0 1px 1px hsl(205deg 30% 10% / 0.2)'
                        }}
                    >
                        {items.map((item, index) => (
                            <li
                                key={index}
                                className={`rounded-full relative cursor-pointer text-white font-medium ${activeIndex === index ? 'active' : ''
                                    }`}
                            >
                                <a
                                    onClick={(e) => handleClick(e, index)}
                                    href={item.href}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="outline-none py-[0.6em] px-[1em] inline-block"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <span className="effect filter" ref={filterRef} />
                <span className="effect text" ref={textRef} />

                {/* SVG Filter Gooey cair murni yang diproses di GPU (stdDeviation optimal 4) */}
                <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
                    <defs>
                        <filter id="gooey-nav-filter">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                            <feColorMatrix
                                in="blur"
                                type="matrix"
                                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                                result="goo"
                            />
                            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                        </filter>
                    </defs>
                </svg>
            </div>
        </>
    );
};

export default GooeyNav;