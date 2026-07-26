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

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

const animations: Record<AnimationDirection, { initial: any; animate: any; transition?: any }> = {
    up: {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
    },
    left: {
        initial: { opacity: 0, x: -32 },
        animate: { opacity: 1, x: 0 },
    },
    right: {
        initial: { opacity: 0, x: 32 },
        animate: { opacity: 1, x: 0 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.94, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0 },
    },
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
    },
    flip: {
        initial: { opacity: 0, rotateX: 18 },
        animate: { opacity: 1, rotateX: 0 },
    },
    // blur-up WITHOUT filter:blur — filter forces compositor layer per-element (very heavy on scroll)
    'blur-up': {
        initial: { opacity: 0, y: 22 },
        animate: { opacity: 1, y: 0 },
    },
    'flip-3d': {
        initial: { opacity: 0, y: 24, rotateX: 10, transformPerspective: 1000 },
        animate: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 1000 },
    },
    curtain: {
        initial: { opacity: 0, y: 36 },
        animate: { opacity: 1, y: 0 },
    },
    elastic: {
        initial: { opacity: 0, scale: 0.9, y: 16 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { type: 'spring', stiffness: 200, damping: 26, mass: 0.9 },
    },
};

export default function AnimatedSection({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    duration = 0.7,
    once = true,
    amount = 0.12,
}: AnimatedSectionProps) {
    const prefersReducedMotion = useReducedMotion();
    const animation = animations[direction] || animations.up;

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={animation.initial}
            whileInView={animation.animate}
            viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
            transition={
                animation.transition || {
                    duration,
                    delay,
                    ease: SMOOTH_EASE,
                }
            }
            className={className}
        >
            {children}
        </motion.div>
    );
}
