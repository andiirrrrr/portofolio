'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypingTextProps {
    words: string[];
    className?: string;
    typingSpeed?: number;
    pauseDuration?: number;
}

export default function TypingText({
    words,
    className = '',
    typingSpeed = 100,
    pauseDuration = 2000,
}: TypingTextProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const currentWord = words[currentWordIndex];
        let timeout: NodeJS.Timeout;

        if (isPaused) {
            timeout = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, pauseDuration);
            return () => clearTimeout(timeout);
        }

        if (isDeleting) {
            if (displayText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayText(displayText.slice(0, -1));
                }, typingSpeed / 2);
            } else {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % words.length);
            }
        } else {
            if (displayText.length < currentWord.length) {
                timeout = setTimeout(() => {
                    setDisplayText(currentWord.slice(0, displayText.length + 1));
                }, typingSpeed);
            } else {
                setIsPaused(true);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, isPaused, currentWordIndex, words, typingSpeed, pauseDuration]);

    return (
        <span className={className}>
            {displayText}
            <span className="animate-pulse text-blue-400">|</span>
        </span>
    );
}