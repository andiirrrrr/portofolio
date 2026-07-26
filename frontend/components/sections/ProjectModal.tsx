'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { Project } from '@/types';
import { getImageUrl } from '@/lib/api';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-navy-900 rounded-2xl border border-navy-700 shadow-2xl shadow-blue-500/20"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal"
              className="absolute top-4 right-4 z-10 p-2 bg-navy-800/80 hover:bg-navy-700 rounded-full text-gray-400 hover:text-white transition-all duration-300 border border-navy-600"
            >
              <X size={20} />
            </button>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              {/* Thumbnail */}
              {project.thumbnail && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-navy-800">
                  <img
                    src={getImageUrl(project.thumbnail)}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title & Category */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{project.title}</h2>
                  <p className="text-blue-400 text-sm mt-1">{project.category || 'Uncategorized'}</p>
                </div>
                <div className="flex gap-2">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-navy-800 hover:bg-navy-700 rounded-lg text-gray-400 hover:text-white transition-all duration-300 border border-navy-600"
                    >
                      <FaGithub size={18} />
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-navy-800 hover:bg-navy-700 rounded-lg text-gray-400 hover:text-white transition-all duration-300 border border-navy-600"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>

              {/* Short Description */}
              {project.short_description && (
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                  {project.short_description}
                </p>
              )}

              {/* Full Description */}
              {project.description && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Description
                  </h4>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </p>
                </div>
              )}

              {/* Tech Stack */}
              {project.tech_stack && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(project.tech_stack)
                      ? project.tech_stack
                      : typeof project.tech_stack === 'string'
                      ? JSON.parse(project.tech_stack)
                      : []
                    ).map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-navy-800 rounded-full text-xs text-gray-300 border border-navy-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {project.key_features && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Key Features
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(Array.isArray(project.key_features)
                      ? project.key_features
                      : typeof project.key_features === 'string'
                      ? JSON.parse(project.key_features)
                      : []
                    ).map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <Sparkles size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges & Solutions */}
              {project.challenges && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Challenges
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {project.challenges}
                  </p>
                </div>
              )}
              {project.solutions && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Solutions
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {project.solutions}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-navy-700">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-800 hover:bg-navy-700 text-white rounded-lg text-sm font-medium transition-all duration-300 border border-navy-600"
                  >
                    <FaGithub size={16} />
                    View Source
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/30"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
