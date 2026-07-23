'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import idCardImage from '@/components/idcard/foto.jpeg';

interface IDCardProps {
    imageUrl?: string;
}

// Panjang tali — extends ke atas melewati section boundary masuk ke hero
const ROPE_LEN = 560;
const CARD_W = 180;
const CARD_H = Math.round(CARD_W * (4 / 3)); // 240px

// Spring config untuk pendulum — stiffness rendah = ayunan lambat alami
const SPRING = { type: 'spring' as const, stiffness: 26, damping: 5, mass: 1.8 };

function ropePath(cx: number, cy: number): string {
    // Anchor atas: (0, -ROPE_LEN) → tetap di atas
    // End bawah: (cx, cy) → mengikuti posisi lubang kartu
    const ax = 0, ay = -ROPE_LEN;
    const ex = cx, ey = cy;
    const sag = Math.hypot(ex - ax, ey - ay) * 0.22 + 30;
    const cpx = (ax + ex) / 2;
    const cpy = (ay + ey) / 2 + sag;
    return `M ${ax} ${ay} Q ${cpx} ${cpy} ${ex} ${ey}`;
}

export default function IDCard({ imageUrl }: IDCardProps) {
    const finalImageUrl = imageUrl || idCardImage.src;
    const cardRef = useRef<HTMLDivElement>(null);

    // SVG path refs — update langsung ke DOM tanpa re-render
    const pathMainRef = useRef<SVGPathElement>(null);
    const pathShadRef = useRef<SVGPathElement>(null);
    const pathShineRef = useRef<SVGPathElement>(null);

    const isDraggingRef = useRef(false);
    const holdTimer = useRef<NodeJS.Timeout | null>(null);
    const idleCtrl = useRef<{ stop?: () => void } | null>(null);
    const releaseCtrl = useRef<{ stop?: () => void } | null>(null);
    const dragOrigin = useRef({ mx: 0, my: 0, cx: 0, cy: 0 });

    const [isDragging, setIsDragging] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Motion values — posisi kartu (tanpa spring bawaan, pakai animate() manual)
    const cardX = useMotionValue(0);
    const cardY = useMotionValue(0);

    // Update tali SVG setiap kali posisi berubah
    useEffect(() => {
        const update = () => {
            const x = cardX.get(), y = cardY.get();
            const d = ropePath(x, y);
            pathMainRef.current?.setAttribute('d', d);
            pathShadRef.current?.setAttribute('d', d);
            pathShineRef.current?.setAttribute('d', d);
        };
        const u1 = cardX.on('change', update);
        const u2 = cardY.on('change', update);
        update();
        return () => { u1(); u2(); };
    }, [cardX, cardY]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // ── Idle pendulum swing ──────────────────────────────────────
    const startIdle = useCallback(() => {
        let alive = true;
        idleCtrl.current?.stop?.();

        (async () => {
            while (alive && !isDraggingRef.current) {
                const c1 = animate(cardX, 20, SPRING);
                idleCtrl.current = c1;
                await c1;
                if (!alive || isDraggingRef.current) break;

                const c2 = animate(cardX, -20, SPRING);
                idleCtrl.current = c2;
                await c2;
            }
        })();

        return () => {
            alive = false;
            idleCtrl.current?.stop?.();
        };
    }, [cardX]);

    useEffect(() => {
        return startIdle();
    }, [startIdle]);

    // ── Desktop drag ─────────────────────────────────────────────
    useEffect(() => {
        if (isMobile || !cardRef.current) return;
        const card = cardRef.current;

        const onDown = (e: MouseEvent) => {
            e.preventDefault();
            holdTimer.current = setTimeout(() => {
                // Stop semua animasi sebelumnya
                idleCtrl.current?.stop?.();
                releaseCtrl.current?.stop?.();
                isDraggingRef.current = true;
                setIsDragging(true);
                setIsFlipped(false);
                dragOrigin.current = { mx: e.clientX, my: e.clientY, cx: cardX.get(), cy: cardY.get() };
            }, 350);
        };

        const onMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const MAX = 350;
            cardX.set(Math.max(-MAX, Math.min(MAX, dragOrigin.current.cx + e.clientX - dragOrigin.current.mx)));
            cardY.set(Math.max(-MAX, Math.min(MAX, dragOrigin.current.cy + e.clientY - dragOrigin.current.my)));
        };

        const onUp = () => {
            if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                setIsDragging(false);
                // Spring balik ke tengah, lalu restart idle
                const cx = animate(cardX, 0, SPRING);
                const cy = animate(cardY, 0, SPRING);
                releaseCtrl.current = { stop: () => { cx.stop?.(); cy.stop?.(); } };
                Promise.all([cx, cy]).then(() => { if (!isDraggingRef.current) startIdle(); });
            }
        };

        card.addEventListener('mousedown', onDown);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            card.removeEventListener('mousedown', onDown);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [isMobile, cardX, cardY, startIdle]);

    // ── Mobile touch drag ────────────────────────────────────────
    useEffect(() => {
        if (!isMobile || !cardRef.current) return;
        const card = cardRef.current;

        const onStart = (e: TouchEvent) => {
            if (!e.touches.length) return;
            const t = e.touches[0];
            holdTimer.current = setTimeout(() => {
                idleCtrl.current?.stop?.();
                releaseCtrl.current?.stop?.();
                isDraggingRef.current = true;
                setIsDragging(true);
                dragOrigin.current = { mx: t.clientX, my: t.clientY, cx: cardX.get(), cy: cardY.get() };
            }, 350);
        };

        const onMove = (e: TouchEvent) => {
            if (!isDraggingRef.current || !e.touches.length) return;
            const t = e.touches[0];
            const MAX = 350;
            cardX.set(Math.max(-MAX, Math.min(MAX, dragOrigin.current.cx + t.clientX - dragOrigin.current.mx)));
            cardY.set(Math.max(-MAX, Math.min(MAX, dragOrigin.current.cy + t.clientY - dragOrigin.current.my)));
        };

        const onEnd = () => {
            if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                setIsDragging(false);
                const cx = animate(cardX, 0, SPRING);
                const cy = animate(cardY, 0, SPRING);
                releaseCtrl.current = { stop: () => { cx.stop?.(); cy.stop?.(); } };
                Promise.all([cx, cy]).then(() => { if (!isDraggingRef.current) startIdle(); });
            }
        };

        card.addEventListener('touchstart', onStart);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onEnd);
        window.addEventListener('touchcancel', onEnd);
        return () => {
            card.removeEventListener('touchstart', onStart);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onEnd);
            window.removeEventListener('touchcancel', onEnd);
        };
    }, [isMobile, cardX, cardY, startIdle]);

    return (
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* ── SVG Tali Lanyard ──────────────────────────────────
                Diposisikan di luar card div → anchor atas tetap diam.
                Hanya ujung bawah yang mengikuti posisi cardX/cardY.
            ────────────────────────────────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    width: 0,
                    height: 0,
                    pointerEvents: 'none',
                    zIndex: 20,
                }}
            >
                <svg style={{ overflow: 'visible', position: 'absolute' }}>
                    <defs>
                        <linearGradient id="lanyardHookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f1f5f9" />
                            <stop offset="35%" stopColor="#ffffff" />
                            <stop offset="70%" stopColor="#94a3b8" />
                            <stop offset="100%" stopColor="#475569" />
                        </linearGradient>
                    </defs>

                    {/* Bayangan tali */}
                    <path
                        ref={pathShadRef}
                        stroke="rgba(0,0,0,0.45)"
                        strokeWidth="9"
                        fill="none"
                        strokeLinecap="round"
                        style={{ filter: 'blur(4px)' }}
                    />

                    {/* Tali utama — hitam pekat */}
                    <path
                        ref={pathMainRef}
                        stroke="#111111"
                        strokeWidth="5.5"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Kilap / tekstur tali */}
                    <path
                        ref={pathShineRef}
                        stroke="rgba(255,255,255,0.07)"
                        strokeWidth="2.5"
                        strokeDasharray="6 12"
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* ── Klip logam di atas ── */}
                    <g transform={`translate(0, ${-ROPE_LEN})`}>
                        {/* Ring oval */}
                        <ellipse
                            cx="0" cy="-11"
                            rx="6.5" ry="10"
                            fill="none"
                            stroke="url(#lanyardHookGrad)"
                            strokeWidth="3"
                        />
                        {/* Body klip */}
                        <rect x="-6.5" y="-2" width="13" height="13" rx="3.5" fill="url(#lanyardHookGrad)" />
                        {/* Highlight atas */}
                        <rect x="-5" y="-1" width="5.5" height="2.5" rx="1" fill="rgba(255,255,255,0.65)" />
                        {/* Sekrup detail */}
                        <circle cx="-2.5" cy="8" r="1.3" fill="rgba(71,85,105,0.9)" />
                        <circle cx="2.5" cy="8" r="1.3" fill="rgba(71,85,105,0.9)" />
                    </g>
                </svg>
            </div>

            {/* ── ID Card ──────────────────────────────────────────── */}
            <motion.div
                ref={cardRef}
                style={{
                    x: cardX,
                    y: cardY,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    width: CARD_W,
                    height: CARD_H,
                    perspective: 1000,
                    zIndex: 10,
                    userSelect: 'none',
                }}
                onMouseEnter={() => { if (!isDraggingRef.current) setIsFlipped(true); }}
                onMouseLeave={() => setIsFlipped(false)}
            >
                {/* Flip wrapper */}
                <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 110, damping: 18 }}
                    style={{
                        width: '100%',
                        height: '100%',
                        transformStyle: 'preserve-3d',
                        position: 'relative',
                    }}
                >
                    {/* ══ DEPAN — foto saja ══════════════════════════ */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            borderRadius: 14,
                            overflow: 'hidden',
                            border: '1.5px solid rgba(59,130,246,0.35)',
                            boxShadow: isDragging
                                ? '0 30px 70px -10px rgba(0,0,0,0.75), 0 0 30px rgba(59,130,246,0.2)'
                                : '0 20px 55px -8px rgba(0,0,0,0.7), 0 0 18px rgba(59,130,246,0.1)',
                        }}
                    >
                        {/* Lubang tali */}
                        <CardHole />

                        {/* Foto full cover */}
                        <img
                            src={finalImageUrl}
                            alt="Profile"
                            draggable={false}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                            }}
                        />

                        {/* Subtle edge darkening */}
                        <div style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none',
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 20%, transparent 78%, rgba(0,0,0,0.2) 100%)',
                        }} />
                        {/* Glare kiri atas */}
                        <div style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 45%)',
                        }} />
                    </div>

                    {/* ══ BELAKANG — teks ════════════════════════════ */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            borderRadius: 14,
                            overflow: 'hidden',
                            background: 'linear-gradient(150deg, #0d1526 0%, #07101e 55%, #0c1828 100%)',
                            border: '1.5px solid rgba(59,130,246,0.28)',
                            boxShadow: '0 20px 55px -8px rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Lubang tali belakang */}
                        <CardHole />

                        {/* Grid pattern background */}
                        <div style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.035,
                            backgroundImage: 'repeating-linear-gradient(45deg, rgba(59,130,246,1) 0, rgba(59,130,246,1) 1px, transparent 1px, transparent 14px)',
                        }} />
                        {/* Center glow */}
                        <div style={{
                            position: 'absolute', inset: 0, pointerEvents: 'none',
                            background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 68%)',
                        }} />

                        {/* Konten */}
                        <div style={{ textAlign: 'center', padding: '0 18px', position: 'relative', zIndex: 5 }}>
                            <Divider />

                            {/* Inisial */}
                            <div style={{
                                width: 58, height: 58, borderRadius: '50%',
                                background: 'rgba(59,130,246,0.12)',
                                border: '1.5px solid rgba(59,130,246,0.38)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 14px',
                                fontSize: 24, fontWeight: 900,
                                color: 'rgba(147,197,253,0.95)',
                                boxShadow: '0 0 28px rgba(59,130,246,0.22)',
                            }}>
                                A
                            </div>

                            <p style={{
                                fontSize: 11,
                                color: 'rgba(148,163,184,0.85)',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                marginBottom: 5,
                            }}>
                                founder
                            </p>
                            <p style={{
                                fontSize: 16,
                                fontWeight: 700,
                                background: 'linear-gradient(90deg, #60a5fa, #93c5fd, #60a5fa)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                letterSpacing: '-0.01em',
                            }}>
                                arwebstudio.id
                            </p>

                            <Divider style={{ marginTop: 18 }} />
                        </div>

                        {/* Sudut dekoratif */}
                        <CornerAccents />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

/* ─── Helper components ─────────────────────────────────────── */

function CardHole() {
    return (
        <div style={{
            position: 'absolute', top: -1, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30, width: 13, height: 16,
            background: '#020712',
            borderRadius: '0 0 7px 7px',
            border: '1.5px solid rgba(148,163,184,0.28)',
            borderTop: 'none',
        }}>
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 5, height: 5, borderRadius: '50%',
                background: '#000',
                border: '1px solid rgba(148,163,184,0.15)',
            }} />
        </div>
    );
}

function Divider({ style }: { style?: React.CSSProperties }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, ...style }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.5))' }} />
            <div style={{ width: 6, height: 6, transform: 'rotate(45deg)', background: 'rgba(99,179,237,0.8)' }} />
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(59,130,246,0.5))' }} />
        </div>
    );
}

function CornerAccents() {
    const b = '1px solid rgba(59,130,246,0.3)';
    return (
        <>
            <div style={{ position: 'absolute', top: 12, left: 12, width: 16, height: 16, borderTop: b, borderLeft: b }} />
            <div style={{ position: 'absolute', top: 12, right: 12, width: 16, height: 16, borderTop: b, borderRight: b }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, width: 16, height: 16, borderBottom: b, borderLeft: b }} />
            <div style={{ position: 'absolute', bottom: 12, right: 12, width: 16, height: 16, borderBottom: b, borderRight: b }} />
        </>
    );
}