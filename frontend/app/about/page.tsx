'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProfile, getExperiences, getEducations } from '@/lib/api';
import { Profile, Experience, Education } from '@/types';
import AnimatedSection from '@/components/animations/AnimatedSection';
import PageTransition from '@/components/animations/PageTransition';
import { Calendar, MapPin, Briefcase, GraduationCap } from 'lucide-react';

export default function AboutPage() {
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
            <div className="min-h-screen flex items-center justify-center bg-navy-950">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <PageTransition direction="slide-up">
            <div className="min-h-screen bg-navy-950 pt-24 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <AnimatedSection direction="up">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
                            About <span className="text-gradient">Me</span>
                        </h1>
                        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
                            Get to know me better - my background, experience, and education
                        </p>
                    </AnimatedSection>

                    {/* Profile Card - menggunakan foto dari database */}
                    <AnimatedSection direction="scale" delay={0.2}>
                        <div className="bg-navy-800 rounded-2xl p-8 mb-12 border border-navy-700">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {profile?.profile_image ? (
                                    <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 bg-navy-700 border-4 border-blue-500/30">
                                        <img
                                            src={profile.profile_image}
                                            alt={profile.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-navy-700 flex items-center justify-center flex-shrink-0 border-4 border-blue-500/30">
                                        <span className="text-4xl text-gray-500">👤</span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white">{profile?.full_name}</h2>
                                    <p className="text-blue-400 mb-2">{profile?.title}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                                        {profile?.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={16} /> {profile.location}
                                            </span>
                                        )}
                                        {profile?.email && (
                                            <span className="flex items-center gap-1">
                                                ✉️ {profile.email}
                                            </span>
                                        )}
                                        {profile?.phone && (
                                            <span className="flex items-center gap-1">
                                                📱 {profile.phone}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-300">{profile?.about_me || profile?.professional_summary}</p>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Experiences - sama seperti sebelumnya */}
                    <AnimatedSection direction="left" delay={0.4}>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Briefcase size={24} className="text-blue-400" /> Work Experience
                        </h3>
                    </AnimatedSection>

                    <div className="space-y-4 mb-12">
                        {experiences.map((exp, index) => (
                            <AnimatedSection key={exp.id} direction="right" delay={index * 0.1}>
                                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 hover:border-blue-500/30 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {exp.company_logo ? (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-navy-600 flex items-center justify-center">
                                                <img
                                                    src={exp.company_logo}
                                                    alt={exp.company_name}
                                                    className="w-full h-full object-contain p-1"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                                                <span className="text-2xl">🏢</span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-white">{exp.position}</h4>
                                                    <p className="text-blue-400">{exp.company_name}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Calendar size={16} />
                                                    {new Date(exp.start_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} -{' '}
                                                    {exp.is_current ? 'Present' : new Date(exp.end_date!).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                            {exp.description && (
                                                <p className="text-gray-300 mt-2 text-sm">{exp.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    {/* Educations - sama seperti sebelumnya */}
                    <AnimatedSection direction="left" delay={0.6}>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <GraduationCap size={24} className="text-blue-400" /> Education
                        </h3>
                    </AnimatedSection>

                    <div className="space-y-4">
                        {educations.map((edu, index) => (
                            <AnimatedSection key={edu.id} direction="right" delay={index * 0.1}>
                                <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 hover:border-blue-500/30 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {edu.institution_logo ? (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-navy-600 flex items-center justify-center">
                                                <img
                                                    src={edu.institution_logo}
                                                    alt={edu.institution_name}
                                                    className="w-full h-full object-contain p-1"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                                                <span className="text-2xl">🎓</span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-white">{edu.degree}</h4>
                                                    <p className="text-blue-400">{edu.institution_name}</p>
                                                    <p className="text-sm text-gray-400">{edu.field_of_study}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Calendar size={16} />
                                                    {new Date(edu.start_date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} -{' '}
                                                    {edu.is_current ? 'Present' : new Date(edu.end_date!).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                            {edu.gpa && (
                                                <p className="text-sm text-gray-400 mt-1">GPA: {edu.gpa}</p>
                                            )}
                                            {edu.description && (
                                                <p className="text-gray-300 mt-2 text-sm">{edu.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}