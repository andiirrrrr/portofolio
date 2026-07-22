'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    direction?: 'up' | 'left' | 'right' | 'scale' | 'fade';
}

const childAnimations = {
    up: {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
    },
    left: {
        initial: { opacity: 0, x: -40 },
        animate: { opacity: 1, x: 0 },
    },
    right: {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
    },
    scale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
    },
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
    },
};

export default function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.1,
    direction = 'up',
}: StaggerContainerProps) {
    const animation = childAnimations[direction];

    return (
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
                animate: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {Array.isArray(children)
                ? children.map((child, index) => (
                    <motion.div key={index} variants={animation}>
                        {child}
                    </motion.div>
                ))
                : children}
        </motion.div>
    );
}