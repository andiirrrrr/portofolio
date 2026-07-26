'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

export type AnimationDirection =
    | 'up'
    | 'left'
    | 'right'
    | 'scale'
    | 'fade'
    | 'flip'
    | 'blur-up'
    | 'flip-3d'
    | 'curtain'
    | 'elastic';

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: AnimationDirection;
    duration?: number;
    once?: boolean;
    amount?: number;
}

const animations: Record<AnimationDirection, { initial: any; animate: any; transition?: any }> = {
    up: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
    },
    left: {
        initial: { opacity: 0, x: -35 },
        animate: { opacity: 1, x: 0 },
    },
    right: {
        initial: { opacity: 0, x: 35 },
        animate: { opacity: 1, x: 0 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.92, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
    },
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
    },
    flip: {
        initial: { opacity: 0, rotateX: 25 },
        animate: { opacity: 1, rotateX: 0 },
    },
    // blur-up WITHOUT filter:blur — filter forces compositor layer per-element (very heavy on mobile)
    'blur-up': {
        initial: { opacity: 0, y: 25 },
        animate: { opacity: 1, y: 0 },
    },
    'flip-3d': {
        initial: { opacity: 0, y: 30, rotateX: 12, transformPerspective: 1000 },
        animate: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 1000 },
    },
    curtain: {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
    },
    elastic: {
        initial: { opacity: 0, scale: 0.85, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { type: 'spring', stiffness: 280, damping: 22 },
    },
};


export default function AnimatedSection({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    duration = 0.6,
    once = true, // once: true = smooth & bebas stutter saat refresh
    amount = 0.15,
}: AnimatedSectionProps) {
    const prefersReducedMotion = useReducedMotion();
    const animation = animations[direction] || animations.up;

    // Respect system accessibility preference
    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={animation.initial}
            whileInView={animation.animate}
            viewport={{ once, amount }}
            transition={
                animation.transition || {
                    duration,
                    delay,
                    ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier spring-like smooth curve
                }
            }
            className={className}
        >
            {children}
        </motion.div>
    );
}