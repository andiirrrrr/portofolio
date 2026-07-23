'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  Download,
  Globe,
} from 'lucide-react';
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaGlobe as FaGlobeIcon,
} from 'react-icons/fa6';
import ParallaxHero from '@/components/parallax/ParallaxHero';
import AnimatedSection from '@/components/animations/AnimatedSection';
import Lanyard from '@/components/lanyard';
import TypingText from '@/components/ui/TypingText';
import TechBadge from '@/components/ui/TechBadge';
import ProfileCard from '@/components/profile-card/ProfileCard';
import { getProfile, getExperiences, getEducations } from '@/lib/api';
import { Profile, Experience, Education } from '@/types';

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProfile(), getExperiences(), getEducations()])
      .then(([profileRes, expRes, eduRes]) => {
        setProfile(profileRes.data.data);
        setExperiences(expRes.data.data);
        setEducations(eduRes.data.data);
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

  // Social media links dari profile
  const socialLinks = [
    { icon: FaGithub, url: profile?.github_url, label: 'GitHub' },
    { icon: FaLinkedin, url: profile?.linkedin_url, label: 'LinkedIn' },
    { icon: FaInstagram, url: profile?.instagram_url, label: 'Instagram' },
    { icon: FaYoutube, url: profile?.youtube_url, label: 'YouTube' },
    { icon: FaGlobeIcon, url: profile?.website_url, label: 'Website' },
  ].filter(link => link.url);

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

      {/* ========================================== */}
      {/* SECTION 1: INTRODUCTION + LANYARD */}
      {/* ========================================== */}
      <section className="py-12 md:py-16 px-4 bg-navy-900 overflow-visible">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">

            {/* TEKS KIRI */}
            <AnimatedSection direction="left" delay={0.2}>
              <div className="space-y-4 md:space-y-5 pt-4 md:pt-8">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium"
                >
                  Introduction
                </motion.span>

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

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '60px' }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
                />

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
              </div>
            </AnimatedSection>

            {/* LANYARD 3D KANAN */}
            <div className="w-[calc(100%+12rem)] md:w-[calc(100%+18rem)] lg:w-[calc(100%+24rem)] -ml-24 md:-ml-[9rem] lg:-ml-[12rem] h-[500px] md:h-[700px] lg:h-[870px] mt-4 md:-mt-20 lg:-mt-24">
              <Lanyard
                position={[0, 2.5, 22]}
                gravity={[0, -40, 0]}
                fov={20}
                frontImage="/assets/lanyard/foto.jpeg"
                backImage="/assets/lanyard/card-back.png"
                imageFit="cover"
                lanyardWidth={1}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 2: ABOUT ME */}
      {/* ========================================== */}
      <section id="about" className="py-16 md:py-20 px-4 bg-navy-950 overflow-visible">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <AnimatedSection direction="up">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-3">
                About Me
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Get to Know{' '}
                <span className="text-gradient">Me Better</span>
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full mx-auto mt-3" />
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* TEKS KIRI */}
            <AnimatedSection direction="left" delay={0.2}>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Web System{' '}
                  <span className="text-gradient">Developer</span>
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full" />
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {profile?.about_me || profile?.professional_summary || 'Saya adalah Full-Stack Web Developer yang berdedikasi untuk membangun aplikasi web yang responsif, cepat, dan skalabel.'}
                </p>

                {/* DOWNLOAD CV BUTTON - di atas Work Experience */}
                {profile?.cv_file && (
                  <motion.a
                    href={profile.cv_file}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                  >
                    <Download size={18} />
                    Download CV
                  </motion.a>
                )}
              </div>
            </AnimatedSection>

            {/* PROFILE CARD KANAN + SOCIAL MEDIA */}
            <AnimatedSection direction="right" delay={0.4}>
              <div className="flex flex-col items-center gap-4">
                <ProfileCard
                  avatarUrl={profile?.profile_image || '/assets/lanyard/foto.jpeg'}
                  name={profile?.full_name || 'Andi Ranreng S.'}
                  title={profile?.title || 'Full-Stack Developer'}
                  handle="andiirrrrr"
                  status="Available"
                  contactText="Contact Me"
                  onContactClick={() => window.location.href = '/contact'}
                />

                {/* SOCIAL MEDIA BUTTONS */}
                {socialLinks.length > 0 && (
                  <div className="flex gap-3 mt-2">
                    {socialLinks.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <motion.a
                          key={index}
                          href={link.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.08 }}
                          whileHover={{
                            scale: 1.15,
                            y: -3,
                            boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)'
                          }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2.5 bg-navy-800 rounded-full border border-navy-700 hover:border-blue-500/50 transition-all duration-300 text-gray-400 hover:text-white"
                          aria-label={link.label}
                        >
                          <Icon size={18} />
                        </motion.a>
                      );
                    })}
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* EXPERIENCES & EDUCATIONS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Experiences */}
            <AnimatedSection direction="left" delay={0.3}>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Briefcase size={22} className="text-blue-400" />
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {experiences.length > 0 ? (
                    experiences.map((exp, index) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-navy-800 rounded-xl p-4 border border-navy-700 hover:border-blue-500/30 transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                          <div>
                            <h4 className="text-white font-semibold text-sm md:text-base">{exp.position}</h4>
                            <p className="text-blue-400 text-sm">{exp.company_name}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar size={12} />
                            {new Date(exp.start_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} -{' '}
                            {exp.is_current ? 'Present' : new Date(exp.end_date!).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-gray-400 text-xs md:text-sm mt-1">{exp.description}</p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No experience data yet.</p>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Educations */}
            <AnimatedSection direction="right" delay={0.4}>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <GraduationCap size={22} className="text-blue-400" />
                  Education
                </h3>
                <div className="space-y-4">
                  {educations.length > 0 ? (
                    educations.map((edu, index) => (
                      <motion.div
                        key={edu.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-navy-800 rounded-xl p-4 border border-navy-700 hover:border-blue-500/30 transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                          <div>
                            <h4 className="text-white font-semibold text-sm md:text-base">{edu.degree}</h4>
                            <p className="text-blue-400 text-sm">{edu.institution_name}</p>
                            <p className="text-gray-500 text-xs">{edu.field_of_study}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar size={12} />
                            {new Date(edu.start_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} -{' '}
                            {edu.is_current ? 'Present' : new Date(edu.end_date!).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        {edu.gpa && (
                          <p className="text-gray-400 text-xs mt-1">GPA: {edu.gpa}</p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No education data yet.</p>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 3: SKILLS PREVIEW */}
      {/* ========================================== */}
      <section className="py-16 md:py-20 px-4 bg-navy-900">
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