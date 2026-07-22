'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
    direction?: 'fade' | 'slide-up' | 'slide-left' | 'scale';
}

const transitions = {
    'fade': {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    },
    'slide-up': {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
    },
    'slide-left': {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
    },
    'scale': {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
    },
};

export default function PageTransition({
    children,
    className = '',
    direction = 'fade',
}: PageTransitionProps) {
    const transition = transitions[direction];

    return (
        <motion.div
            initial={transition.initial}
            animate={transition.animate}
            exit={transition.exit}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}