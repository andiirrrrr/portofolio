'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'left' | 'right' | 'scale';
}

const animations = {
    up: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
    },
    left: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
    },
    right: {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
    },
};

export default function AnimatedSection({
    children,
    className = '',
    delay = 0,
    direction = 'up',
}: AnimatedSectionProps) {
    const animation = animations[direction];

    return (
        <motion.div
            initial={animation.initial}
            whileInView={animation.animate}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}