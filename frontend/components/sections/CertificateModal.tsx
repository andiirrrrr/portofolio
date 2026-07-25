'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download } from 'lucide-react';
import { Certificate } from '@/types';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateModal({ certificate, isOpen, onClose }: CertificateModalProps) {
  return (
    <AnimatePresence>
      {isOpen && certificate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
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
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-navy-800/80 hover:bg-navy-700 rounded-full text-gray-400 hover:text-white transition-all duration-300 border border-navy-600"
            >
              <X size={20} />
            </button>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              {/* Certificate Image Full */}
              <div className="relative w-full rounded-xl overflow-hidden bg-navy-800">
                {certificate.image ? (
                  <img
                    src={certificate.image}
                    alt={certificate.name}
                    className="w-full h-auto object-contain max-h-[70vh]"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-6xl text-navy-700">
                    📜
                  </div>
                )}
              </div>

              {/* Certificate Info */}
              <div className="mt-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{certificate.name}</h2>
                <p className="text-blue-400 text-lg mt-1">{certificate.issuer}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                  {certificate.issued_date && (
                    <span>
                      📅 Issued:{' '}
                      {new Date(certificate.issued_date).toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {certificate.expiry_date && (
                    <span>
                      ⏳ Expires:{' '}
                      {new Date(certificate.expiry_date).toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {certificate.credential_id && <span>🆔 ID: {certificate.credential_id}</span>}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-navy-700">
                  {certificate.credential_url && (
                    <a
                      href={certificate.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/30"
                    >
                      <ExternalLink size={16} />
                      Verify Certificate
                    </a>
                  )}
                  {certificate.image && (
                    <a
                      href={certificate.image}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-800 hover:bg-navy-700 text-white rounded-lg text-sm font-medium transition-all duration-300 border border-navy-600"
                    >
                      <Download size={16} />
                      Download Image
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
