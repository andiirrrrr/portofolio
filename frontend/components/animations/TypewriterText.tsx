'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

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
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isInView || startedRef.current || !text) return;
    startedRef.current = true;

    const speedMs = speed * 1000; // convert seconds → ms
    const delayMs = delay * 1000;

    // Reset
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    const startTyping = () => {
      const tick = () => {
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
        if (indexRef.current < text.length) {
          timerRef.current = setTimeout(tick, speedMs);
        } else {
          setDone(true);
        }
      };
      timerRef.current = setTimeout(tick, speedMs);
    };

    timerRef.current = setTimeout(startTyping, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isInView, text, speed, delay]);

  // When text prop changes (re-trigger)
  useEffect(() => {
    if (!startedRef.current) return;
    startedRef.current = false;
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [text]);

  if (!text) return null;

  return (
    <span ref={containerRef} className={`inline ${className}`}>
      {displayed}
      {/* Blinking cursor */}
      {cursor && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={done ? { opacity: [1, 0, 1] } : { opacity: 1 }}
          transition={
            done
              ? { repeat: Infinity, duration: 0.8, ease: 'easeInOut' }
              : undefined
          }
          className="inline-block ml-1 w-[2px] h-[1.1em] bg-cyan-400 align-middle rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        />
      )}
    </span>
  );
}
