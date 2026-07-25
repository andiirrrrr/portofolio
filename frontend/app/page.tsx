'use client';

import { useEffect, useRef, useState } from 'react';
import ParallaxHero from '@/components/parallax/ParallaxHero';
import IntroSection from '@/components/sections/IntroSection';
import AboutSection from '@/components/sections/AboutSection';
import ShowcaseSection from '@/components/sections/ShowcaseSection';
import ChatRoom from '@/components/sections/ChatRoom';
import ProjectModal from '@/components/sections/ProjectModal';
import CertificateModal from '@/components/sections/CertificateModal';
import BottomBar from '@/components/ui/BottomBar';
import {
  getProfile,
  getExperiences,
  getEducations,
  getProjects,
  getCertificates,
  getSkills,
} from '@/lib/api';
import { Profile, Experience, Education, Project, Certificate, Skill } from '@/types';

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'certificates' | 'skills'>('portfolio');
  const secondaryLoaded = useRef(false);

  // Modal states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  useEffect(() => {
    // Phase 1: Load critical data first → unblock render immediately
    Promise.all([getProfile(), getExperiences(), getEducations()])
      .then(([profileRes, expRes, eduRes]) => {
        setProfile(profileRes.data.data);
        setExperiences(expRes.data.data);
        setEducations(eduRes.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Phase 2: Load secondary data after first paint (non-blocking)
    if (loading || secondaryLoaded.current) return;
    secondaryLoaded.current = true;

    const loadSecondary = () => {
      Promise.all([getProjects(), getCertificates(), getSkills()])
        .then(([projectRes, certRes, skillRes]) => {
          setProjects(projectRes.data.data || []);
          setCertificates(certRes.data.data || []);
          setSkills(skillRes.data.data || []);
        })
        .catch(() => { });
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(loadSecondary, { timeout: 2000 });
    } else {
      setTimeout(loadSecondary, 300);
    }
  }, [loading]);

  // Modal handlers
  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => setSelectedProject(null), 300);
  };

  const openCertModal = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setIsCertModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCertModal = () => {
    setIsCertModalOpen(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => setSelectedCertificate(null), 300);
  };

  return (
    <>
      {/* 1. Hero Section (Rendered immediately on frame 0 for 60fps instant entrance) */}
      <section id="home">
        <ParallaxHero />
      </section>

      {loading ? (
        <div className="py-24 bg-navy-950 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-xs tracking-wider uppercase">Memuat data...</p>
        </div>
      ) : (
        <>
          {/* 2. Introduction Section + 3D Lanyard */}
          <IntroSection profile={profile} />

      {/* 3. About Me Section + Profile Card + Work/Education Timelines */}
      <section id="about">
        <AboutSection profile={profile} experiences={experiences} educations={educations} />
      </section>

      {/* 4. Showcase Section (Portfolio / Certificates / Skills) */}
      <section id="portfolio">
        <ShowcaseSection
          projects={projects}
          certificates={certificates}
          skills={skills}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenProjectModal={openProjectModal}
          onOpenCertModal={openCertModal}
        />
      </section>

      {/* 5. Contact Section */}
      <section id="contact">
        <ChatRoom />
      </section>

      <BottomBar />

      {/* Detail Modals */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeProjectModal}
      />
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={isCertModalOpen}
        onClose={closeCertModal}
      />
        </>
      )}
    </>
  );
}