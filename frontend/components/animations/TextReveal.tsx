'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TextRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    stagger?: number;
}

export default function TextReveal({
    children,
    className = '',
    delay = 0,
    stagger = 0.05,
}: TextRevealProps) {
    const text = typeof children === 'string' ? children : '';

    const words = text.split(' ');

    return (
        <div className={className}>
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.6,
                        delay: delay + index * stagger,
                        ease: 'easeOut',
                    }}
                    className="inline-block mr-1"
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
}