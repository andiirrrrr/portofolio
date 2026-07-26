'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Aurora from '@/components/aurora/Aurora';
import AnimatedSection from '@/components/animations/AnimatedSection';
import TypingText from '@/components/ui/TypingText';
import TechBadge from '@/components/ui/TechBadge';
import { getImageUrl } from '@/lib/api';
import { Profile } from '@/types';

// Lazy-load heavy 3D Lanyard component
const Lanyard = dynamic(() => import('@/components/lanyard'), {
  ssr: false,
});

interface IntroSectionProps {
  profile: Profile | null;
}

const KEYWORDS = [
  'Web Development',
  'Responsive Design',
  'Full Stack Solutions',
  'Clean Code',
  'Database Architecture',
  'API Integration',
];

export default function IntroSection({ profile }: IntroSectionProps) {
  const [shouldRender3D, setShouldRender3D] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Load 3D once when near viewport — jangan unmount saat scroll (menyebabkan hitch/kaku)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender3D(true);
        }
      },
      { rootMargin: '250px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 px-4 bg-navy-900 overflow-visible relative">
      {shouldRender3D && (
        <Aurora
          colorStops={['#061222', '#123249', '#2D5B75']}
          speed={0.4}
          blend={0.5}
          amplitude={0.8}
        />
      )}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* TEKS KIRI */}
          <AnimatedSection direction="blur-up" delay={0.15}>
            <div className="space-y-4 md:space-y-5 pt-4 md:pt-8">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30 shadow-sm"
              >
                ✦ Introduction
              </motion.span>

              <div className="space-y-1">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                >
                  Full Stack
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold"
                >
                  <span className="text-gradient">Developer</span>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-2 text-lg md:text-xl"
              >
                <span className="text-gray-400">✦</span>
                <span className="text-gray-300">
                  <TypingText
                    words={KEYWORDS}
                    typingSpeed={80}
                    pauseDuration={2000}
                    className="text-blue-400 font-medium"
                  />
                </span>
              </motion.div>

              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '70px' }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="text-gray-300 text-sm md:text-base leading-relaxed"
              >
                Sebagai Full Stack Developer, saya terbiasa menangani alur pengembangan
                web secara <span className="text-white font-medium">end-to-end</span>—mulai dari
                perancangan basis data relasional hingga integrasi antarmuka yang responsif.
                Saya secara aktif mengintegrasikan AI ke dalam proses kerja harian untuk
                meningkatkan efisiensi koding, melakukan refactoring kode, dan memastikan
                sistem yang dibangun memiliki struktur yang bersih serta performa yang optimal.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="flex flex-wrap gap-2 pt-2"
              >
                <TechBadge name="React" color="#61DAFB" />
                <TechBadge name="Next.js" color="#4479A1" />
                <TechBadge name="Laravel" color="#FF2D20" />
                <TechBadge name="MySQL" color="#4479A1" />
                <TechBadge name="Tailwind" color="#38BDF8" />
              </motion.div>
            </div>
          </AnimatedSection>

          {/* LANYARD 3D KANAN */}
          {/* Tinggi dikurangi di mobile agar tidak mendominasi layar kecil */}
          <div className="w-full h-[380px] sm:h-[450px] md:h-[550px] lg:h-[680px] mt-2 sm:mt-4 lg:-mt-16 flex items-center justify-center">
            {shouldRender3D ? (
              <Lanyard
                position={[0, 0, 13]}
                gravity={[0, -32, 0]}
                fov={34}
                frontImage={getImageUrl(
                  profile?.lanyard_image ?? profile?.profile_image,
                  '/assets/lanyard/foto.jpeg'
                )}
                backImage="/assets/lanyard/card-back.png"
                imageFit="cover"
                lanyardWidth={0.8}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500/40 border-t-blue-400 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
