'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'left' | 'right' | 'scale' | 'fade' | 'flip';
    duration?: number;
    once?: boolean;
}

const animations = {
    up: {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
    },
    left: {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
    },
    right: {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.85 },
        animate: { opacity: 1, scale: 1 },
    },
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
    },
    flip: {
        initial: { opacity: 0, rotateX: 90 },
        animate: { opacity: 1, rotateX: 0 },
    },
};

export default function AnimatedSection({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    duration = 0.6,
    once = true,
}: AnimatedSectionProps) {
    const animation = animations[direction];

    return (
        <motion.div
            initial={animation.initial}
            whileInView={animation.animate}
            viewport={{ once, amount: 0.15 }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}