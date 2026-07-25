'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number; // Waktu jeda antar huruf (detik)
  delay?: number; // Delay awal sebelum mulai mengetik
  cursor?: boolean;
  once?: boolean;
}

export default function TypewriterText({
  text,
  className = '',
  speed = 0.02,
  delay = 0.4,
  cursor = true,
  once = true,
}: TypewriterTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once, amount: 0.2 });

  if (!text) return null;

  // Split teks menjadi kata-kata, lalu setiap kata menjadi huruf
  // Menggunakan inline-block & whitespace-nowrap per kata agar word-wrapping CSS tetap konsisten dan tidak patah/jitter saat animasi
  const words = text.split(' ');

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: speed,
      },
    },
  };

  const charVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 2,
      filter: 'blur(2px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.span
      ref={containerRef}
      className={`inline ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      key={text}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIdx) => (
            <motion.span
              key={charIdx}
              variants={charVariants}
              className="inline-block"
              style={{ willChange: 'opacity, transform, filter' }}
            >
              {char}
            </motion.span>
          ))}
          {/* Spasi antar kata */}
          {wordIdx < words.length - 1 && (
            <motion.span variants={charVariants} className="inline-block">
              &nbsp;
            </motion.span>
          )}
        </span>
      ))}

      {/* Kursor Ketik (Blinking Cursor Effect) */}
      {cursor && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="inline-block ml-1 w-[2px] h-[1.1em] bg-cyan-400 align-middle rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        />
      )}
    </motion.span>
  );
}
