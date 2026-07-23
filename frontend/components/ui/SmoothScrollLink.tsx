'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SmoothScrollLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function SmoothScrollLink({
    href,
    children,
    className = '',
    onClick,
}: SmoothScrollLinkProps) {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        // Jika href adalah anchor link (misal /#about)
        if (href.startsWith('/#')) {
            const targetId = href.split('#')[1];

            // Cek apakah kita sudah di halaman yang sama
            if (window.location.pathname === '/') {
                // Scroll ke section
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                // Navigasi ke home dulu, lalu scroll
                router.push('/');
                // Tunggu sebentar agar halaman ter-render
                setTimeout(() => {
                    const element = document.getElementById(targetId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            }
        } else {
            // Navigasi biasa
            router.push(href);
        }

        if (onClick) onClick();
    };

    return (
        <Link href={href} className={className} onClick={handleClick}>
            {children}
        </Link>
    );
}