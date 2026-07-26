'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Aurora from '@/components/aurora/Aurora';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { getImageUrl } from '@/lib/api';
import { getSkillIcon } from '@/lib/skillIcons';
import { Project, Certificate, Skill } from '@/types';

const ChromaGrid = dynamic(() => import('@/components/chroma-grid/ChromaGrid'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

// ============================================
// TAB LABEL MAPPING
// ============================================
const tabLabels: Record<'portfolio' | 'certificates' | 'skills', string> = {
  portfolio: 'Portfolio',
  certificates: 'Certificates',
  skills: 'Tech Stack', // ← Skills → Tech Stack
};

interface ShowcaseSectionProps {
  projects: Project[];
  certificates: Certificate[];
  skills: Skill[];
  activeTab: 'portfolio' | 'certificates' | 'skills';
  setActiveTab: (tab: 'portfolio' | 'certificates' | 'skills') => void;
  onOpenProjectModal: (project: Project) => void;
  onOpenCertModal: (cert: Certificate) => void;
}

export default function ShowcaseSection({
  projects,
  certificates,
  skills,
  activeTab,
  setActiveTab,
  onOpenProjectModal,
  onOpenCertModal,
}: ShowcaseSectionProps) {
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

  return (
    <section ref={sectionRef} className="py-16 md:py-20 px-4 bg-navy-950 relative">
      {isVisible && (
        <Aurora
          colorStops={['#061222', '#123249', '#2D5B75']}
          speed={0.5}
          blend={0.5}
          amplitude={1.0}
        />
      )}
      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedSection direction="blur-up">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-3 border border-blue-500/30">
              ✦ Showcase
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              My <span className="text-gradient">Portfolio</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full mx-auto mt-3" />
          </div>
        </AnimatedSection>

        {/* Filter Tabs */}
        <AnimatedSection direction="elastic" delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
            {(['portfolio', 'certificates', 'skills'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeTab === tab
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-navy-800 text-gray-400 hover:text-white hover:bg-navy-700 border border-navy-700'
                  }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* CONTENT: Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <AnimatedSection direction="fade" delay={0.1}>
            {projects.length > 0 ? (
              <ChromaGrid
                items={projects.map((p, index) => {
                  const colors = [
                    '#3B82F6',
                    '#10B981',
                    '#8B5CF6',
                    '#F59E0B',
                    '#EF4444',
                    '#EC4899',
                    '#06B6D4',
                    '#F97316',
                  ];
                  const color = colors[index % colors.length];
                  return {
                    image: getImageUrl(p.thumbnail, 'https://i.pravatar.cc/300?img=8'),
                    title: p.title,
                    subtitle: p.category || 'Uncategorized',
                    borderColor: color,
                    gradient: `linear-gradient(145deg, ${color}33 0%, ${color}18 50%, ${color}0D 100%)`,
                    url: '#',
                    _project: p,
                  };
                })}
                radius={400}
                damping={0.95}
                fadeOut={0.85}
                ease="power3.out"
                onCardClick={(item) => {
                  if (item._project) {
                    onOpenProjectModal(item._project);
                  }
                }}
              />
            ) : (
              <p className="text-gray-400 text-center py-20">
                No projects yet. Add your first project in the admin panel.
              </p>
            )}
          </AnimatedSection>
        )}

        {/* CONTENT: Certificates Tab */}
        {activeTab === 'certificates' && (
          <AnimatedSection direction="fade" delay={0.1}>
            {certificates.length > 0 ? (
              <ChromaGrid
                items={certificates.map((c, index) => {
                  const colors = [
                    '#10B981',
                    '#3B82F6',
                    '#8B5CF6',
                    '#F59E0B',
                    '#EF4444',
                    '#EC4899',
                    '#06B6D4',
                    '#F97316',
                  ];
                  const color = colors[index % colors.length];
                  return {
                    image: getImageUrl(c.image, 'https://i.pravatar.cc/300?img=8'),
                    title: c.name,
                    subtitle: c.issuer,
                    handle: c.issued_date
                      ? new Date(c.issued_date).toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                      })
                      : '',
                    borderColor: color,
                    gradient: `linear-gradient(145deg, ${color}33 0%, ${color}18 50%, ${color}0D 100%)`,
                    url: '#',
                    _certificate: c,
                  };
                })}
                radius={400}
                damping={0.95}
                fadeOut={0.85}
                ease="power3.out"
                onCardClick={(item) => {
                  if (item._certificate) {
                    onOpenCertModal(item._certificate);
                  }
                }}
              />
            ) : (
              <p className="text-gray-400 text-center py-20">
                No certificates yet. Add your first certificate in the admin panel.
              </p>
            )}
          </AnimatedSection>
        )}

        {/* CONTENT: Tech Stack Tab */}
        {activeTab === 'skills' && (
          <AnimatedSection direction="fade" delay={0.1}>
            {skills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {skills.map((skill, index) => {
                  const IconComponent = getSkillIcon(skill.name);

                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      className="bg-navy-800/90 rounded-xl p-5 border border-navy-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-navy-700/80 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 text-blue-400">
                          <IconComponent className="w-7 h-7" />
                        </div>

                        <div className="flex-1 min-w-0 overflow-hidden">
                          <h4 className="text-white font-semibold text-sm truncate group-hover:text-blue-300 transition-colors">
                            {skill.name}
                          </h4>
                          <p className="text-xs text-gray-400 truncate">
                            {skill.category || 'Skill'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Level</span>
                          <span className="font-mono text-cyan-300">{skill.level || 0}/10</span>
                        </div>
                        <div className="w-full h-1.5 bg-navy-700/80 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(skill.level || 0) * 10}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 + index * 0.03 }}
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300"
                          />
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${skill.is_active ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                            }`}
                        />
                        <span className="text-[10px] text-gray-500">
                          {skill.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-20">
                No skills yet. Add your first skill in the admin panel.
              </p>
            )}
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}