'use client';

import { motion } from 'framer-motion';

interface TechBadgeProps {
    name: string;
    icon?: string;
    color?: string;
}

export default function TechBadge({ name, icon, color = '#3B82F6' }: TechBadgeProps) {
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
                scale: 1.1,
                rotate: [0, -3, 3, -3, 0],
                transition: { duration: 0.4 },
            }}
            whileTap={{ scale: 0.9 }}
            className="inline-block px-3 py-1.5 bg-navy-800 rounded-lg text-xs font-medium border border-navy-700 cursor-pointer"
            style={{
                borderColor: color + '40',
                boxShadow: `0 0 15px ${color}20`,
            }}
        >
            <motion.span
                whileHover={{
                    textShadow: `0 0 15px ${color}`,
                }}
                className="flex items-center gap-1.5"
            >
                {icon && <span className="text-sm">{icon}</span>}
                <span style={{ color }} className="text-xs md:text-sm">{name}</span>
            </motion.span>
        </motion.span>
    );
}