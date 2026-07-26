'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, Download } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaGlobe as FaGlobeIcon } from 'react-icons/fa6';
import Aurora from '@/components/aurora/Aurora';
import AnimatedSection from '@/components/animations/AnimatedSection';
import ProfileCard from '@/components/profile-card/ProfileCard';
import { getImageUrl } from '@/lib/api';
import TypewriterText from '@/components/animations/TypewriterText';
import { Profile, Experience, Education } from '@/types';

interface AboutSectionProps {
  profile: Profile | null;
  experiences: Experience[];
  educations: Education[];
}

export default function AboutSection({ profile, experiences, educations }: AboutSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Social media links dari profile
  const socialLinks = [
    { icon: FaGithub, url: profile?.github_url, label: 'GitHub' },
    { icon: FaLinkedin, url: profile?.linkedin_url, label: 'LinkedIn' },
    { icon: FaInstagram, url: profile?.instagram_url, label: 'Instagram' },
    { icon: FaYoutube, url: profile?.youtube_url, label: 'YouTube' },
    { icon: FaGlobeIcon, url: profile?.website_url, label: 'Website' },
  ].filter((link) => link.url);

  return (
    <section ref={sectionRef} id="about" className="py-16 md:py-20 px-4 bg-navy-950 overflow-visible relative">
      {isVisible && (
        <Aurora
          colorStops={['#061222', '#123249', '#2D5B75']}
          speed={0.6}
          blend={0.4}
          amplitude={1.2}
        />
      )}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <AnimatedSection direction="up">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-3">
              About Me
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Get to Know <span className="text-gradient">Me Better</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full mx-auto mt-3" />
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* TEKS KIRI - Tanpa animasi card & glow di belakang teks */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-b from-navy-800/80 to-navy-900/60 border border-blue-500/20 backdrop-blur-md shadow-2xl">
            <div className="space-y-5">
              {/* Title dengan Shimmer Effect */}
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                  Web System{' '}
                  <span className="text-gradient bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-[length:200%] animate-gradient">
                    Developer
                  </span>
                </h3>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '80px' }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="h-1 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 rounded-full"
                />
              </div>

              {/* Paragraph dengan Typewriter Animation yang Smooth */}
              <p className="text-gray-300 text-sm md:text-base leading-relaxed font-normal min-h-[4rem]">
                <TypewriterText
                  text={
                    profile?.about_me ||
                    profile?.professional_summary ||
                    'Saya adalah Full-Stack Web Developer yang berdedikasi untuk membangun aplikasi web yang responsif, cepat, dan skalabel.'
                  }
                  speed={0.02}
                  delay={0.4}
                />
              </p>

              {/* Highlight Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-navy-950/60 border border-navy-700/60 text-xs text-gray-300"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Full-Stack Architecture</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-navy-950/60 border border-navy-700/60 text-xs text-gray-300"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Clean & Scalable Code</span>
                </motion.div>
              </div>

              {/* DOWNLOAD CV BUTTON */}
              {profile?.cv_file && (
                <div className="pt-2">
                  <motion.a
                    href={profile.cv_file}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(59, 130, 246, 0.5)' }}
                    whileTap={{ scale: 0.96 }}
                    className="relative overflow-hidden group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-lg shadow-blue-500/25"
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out" />
                    <Download size={18} className="animate-bounce" />
                    <span>Download CV</span>
                  </motion.a>
                </div>
              )}
            </div>
          </div>

          {/* PROFILE CARD KANAN + SOCIAL MEDIA */}
          <AnimatedSection direction="elastic" delay={0.3}>
            <div className="flex flex-col items-center gap-4">
              <ProfileCard
                avatarUrl={getImageUrl(profile?.profile_image, '/assets/lanyard/foto.jpeg')}
                name={profile?.full_name || 'Andi Ranreng S.'}
                title={profile?.title || 'Full-Stack Developer'}
                handle="andiirrrrr"
                status="Available"
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
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.06 }}
                        whileHover={{
                          scale: 1.15,
                          y: -3,
                          boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)',
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

        {/* EXPERIENCES & EDUCATIONS GRID WITH TIMELINE BEAM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Experiences */}
          <AnimatedSection direction="curtain" delay={0.2}>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Briefcase size={22} className="text-blue-400" />
                Work Experience
              </h3>
              <div className="relative border-l-2 border-blue-500/30 pl-4 ml-2 space-y-6">
                {/* Glowing Vertical Line */}
                <div className="absolute top-0 left-[-2px] w-[2px] h-full bg-gradient-to-b from-blue-400 via-cyan-400 to-transparent" />

                {experiences.length > 0 ? (
                  experiences.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.08, 0.3), duration: 0.45 }}
                      className="relative bg-navy-800/90 rounded-xl p-5 border border-navy-700 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
                    >
                      {/* Timeline Node Dot */}
                      <span className="absolute -left-[23px] top-6 w-3 h-3 rounded-full bg-blue-500 border-2 border-navy-950 group-hover:scale-125 group-hover:bg-cyan-400 transition-all duration-300" />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                        <div>
                          <h4 className="text-white font-semibold text-sm md:text-base group-hover:text-blue-300 transition-colors">
                            {exp.position}
                          </h4>
                          <p className="text-blue-400 text-sm font-medium">{exp.company_name}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 bg-navy-900/60 px-2.5 py-1 rounded-md border border-navy-700/50 w-fit">
                          <Calendar size={12} className="text-cyan-400" />
                          {new Date(exp.start_date).toLocaleDateString('id-ID', {
                            month: 'long',
                            year: 'numeric',
                          })}{' '}
                          -{' '}
                          {exp.is_current
                            ? 'Present'
                            : new Date(exp.end_date!).toLocaleDateString('id-ID', {
                                month: 'long',
                                year: 'numeric',
                              })}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed">{exp.description}</p>
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
          <AnimatedSection direction="curtain" delay={0.3}>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <GraduationCap size={22} className="text-blue-400" />
                Education
              </h3>
              <div className="relative border-l-2 border-cyan-500/30 pl-4 ml-2 space-y-6">
                {/* Glowing Vertical Line */}
                <div className="absolute top-0 left-[-2px] w-[2px] h-full bg-gradient-to-b from-cyan-400 via-blue-400 to-transparent" />

                {educations.length > 0 ? (
                  educations.map((edu, index) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.08, 0.3), duration: 0.45 }}
                      className="relative bg-navy-800/90 rounded-xl p-5 border border-navy-700 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group"
                    >
                      {/* Timeline Node Dot */}
                      <span className="absolute -left-[23px] top-6 w-3 h-3 rounded-full bg-cyan-500 border-2 border-navy-950 group-hover:scale-125 group-hover:bg-blue-400 transition-all duration-300" />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                        <div>
                          <h4 className="text-white font-semibold text-sm md:text-base group-hover:text-cyan-300 transition-colors">
                            {edu.degree}
                          </h4>
                          <p className="text-blue-400 text-sm font-medium">{edu.institution_name}</p>
                          <p className="text-gray-400 text-xs">{edu.field_of_study}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 bg-navy-900/60 px-2.5 py-1 rounded-md border border-navy-700/50 w-fit">
                          <Calendar size={12} className="text-blue-400" />
                          {new Date(edu.start_date).toLocaleDateString('id-ID', {
                            month: 'long',
                            year: 'numeric',
                          })}{' '}
                          -{' '}
                          {edu.is_current
                            ? 'Present'
                            : new Date(edu.end_date!).toLocaleDateString('id-ID', {
                                month: 'long',
                                year: 'numeric',
                              })}
                        </div>
                      </div>
                      {edu.gpa && <p className="text-cyan-300 font-mono text-xs mt-2">GPA: {edu.gpa}</p>}
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
  );
}
