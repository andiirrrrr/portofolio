'use client';

import { useEffect, useState } from 'react';
import ParallaxHero from '@/components/parallax/ParallaxHero';
import AnimatedSection from '@/components/animations/AnimatedSection';
import IDCard from '@/components/ui/IDCard';
import TypingText from '@/components/ui/TypingText';
import TechBadge from '@/components/ui/TechBadge';
import { getProfile } from '@/lib/api';
import { Profile } from '@/types';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code, Layout, Database } from 'lucide-react';

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Kata kunci untuk animasi mengetik
  const keywords = [
    'Web Development',
    'Responsive Design',
    'Full Stack Solutions',
    'Clean Code',
    'Database Architecture',
    'API Integration',
  ];

  return (
    <>
      <ParallaxHero />

      {/* Section 2: Intro + ID Card */}
      <section className="py-12 md:py-16 px-4 bg-navy-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">

            {/* TEKS KIRI */}
            <AnimatedSection direction="left" delay={0.2}>
              <div className="space-y-4 md:space-y-5 pt-4 md:pt-8">
                {/* Badge */}
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium"
                >
                  Introduction
                </motion.span>

                {/* Title dengan efek typing */}
                <div className="space-y-1">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                  >
                    Full Stack
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold"
                  >
                    <span className="text-gradient">Developer</span>
                  </motion.div>
                </div>

                {/* Kata kunci dengan efek mengetik */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex items-center gap-2 text-lg md:text-xl"
                >
                  <span className="text-gray-400">✦</span>
                  <span className="text-gray-300">
                    <TypingText
                      words={keywords}
                      typingSpeed={80}
                      pauseDuration={2000}
                      className="text-blue-400 font-medium"
                    />
                  </span>
                </motion.div>

                {/* Garis dekorasi */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '60px' }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
                />

                {/* Paragraf */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="text-gray-300 text-sm md:text-base leading-relaxed"
                >
                  Sebagai Full Stack Developer, saya terbiasa menangani alur pengembangan
                  web secara <span className="text-white font-medium">end-to-end</span>—mulai dari
                  perancangan basis data relasional hingga integrasi antarmuka yang responsif.
                  Saya secara aktif mengintegrasikan AI ke dalam proses kerja harian untuk
                  meningkatkan efisiensi koding, melakukan refactoring kode, dan memastikan
                  sistem yang dibangun memiliki struktur yang bersih serta performa yang optimal.
                </motion.p>

                {/* Tech Stack Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  <TechBadge name="React" color="#61DAFB" />
                  <TechBadge name="Next.js" color="#4479A1" />
                  <TechBadge name="Laravel" color="#FF2D20" />
                  <TechBadge name="MySQL" color="#4479A1" />
                  <TechBadge name="Tailwind" color="#38BDF8" />
                </motion.div>

                {/* Tombol Portfolio & Get in Touch */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.0, duration: 0.6 }}
                  className="flex flex-wrap gap-3 pt-2"
                >
                  {/* Portfolio Button */}
                  <motion.a
                    href="/portfolio"
                    className="group relative overflow-hidden px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Portfolio
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight size={16} />
                      </motion.span>
                    </span>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>

                  {/* Get in Touch Button */}
                  <motion.a
                    href="/contact"
                    className="group relative overflow-hidden px-6 py-2.5 border border-gray-500 text-gray-300 hover:text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                    whileHover={{
                      scale: 1.05,
                      borderColor: '#3B82F6',
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles size={16} />
                      Get in Touch
                    </span>
                    <motion.span
                      className="absolute inset-0 bg-blue-500/10"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* ID CARD KANAN */}
            <AnimatedSection direction="right" delay={0.4}>
              <div className="flex justify-center pt-20 md:pt-28">
                <IDCard
                  imageUrl={profile?.profile_image || 'http://127.0.0.1:8000/storage/profiles/default.jpg'}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section 3: Skills Preview */}
      <section className="py-16 md:py-20 px-4 bg-navy-950">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
              Technologies I <span className="text-gradient">Work With</span>
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto text-sm md:text-base">
              Tools and frameworks I use daily to build premium digital experiences
            </p>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8">
            {['Laravel', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'MySQL', 'PHP', 'JavaScript'].map((tech, i) => (
              <AnimatedSection key={tech} direction="scale" delay={i * 0.08}>
                <motion.span
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
                  }}
                  className="px-5 py-2.5 md:px-6 md:py-3 bg-navy-800 rounded-full text-gray-300 hover:text-white hover:bg-navy-700 transition-all duration-300 border border-navy-700/50 hover:border-blue-500/30 text-sm md:text-base cursor-pointer"
                >
                  {tech}
                </motion.span>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}