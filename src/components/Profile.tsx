import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import image from './logork.jpg'
import okallaPhoto from './IMG-20260415-WA0078.jpg'
import destinyPhoto from '../pages/IMG-20260417-WA0018.jpg'
import Navigation from './Navigation'

type Partner = {
  id: number;
  name: string;
  title: string;
  location: string;
  email: string;
  phone?: string;
  degree?: string;
  experience: string;
  bio?: string;
  photo?: string;
  specialties?: string[];
}

// Icons (reusing from Home and About)
const Icons = {
  Check: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  MapPin: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Mail: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Phone: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  GraduationCap: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  Clock: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

// Animated Section Component
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Sample partner data (enhanced with more team members)
const samplePartners: Partner[] = [
  {
    id: 1,
    name: 'Engr. Okalla Christian',
    title: 'Co-director',
    location: 'Lagos, Nigeria',
    email: 'Okallachristian@gmail.com',
    phone: '+234 9039904685',
    degree: 'B.Eng., M.Eng., Ph.D',
    experience: '10+ years',
    bio: 'Experienced petroleum engineer with a strong academic background and field expertise. Specializes in operational excellence, asset integrity management, and technical innovations in offshore and onshore operations.',
    specialties: ['Petroleum Engineering', 'Operations Management', 'Asset Integrity', 'Well Intervention', 'Offshore Operations'],
    photo: okallaPhoto
  },
  {
    id: 2,
    name: 'Mr. Destiny Uzoh',
    title: 'Co-director',
    location: 'Aachen, Germany',
    email: 'destiny.uzor@rwth-aachen.de',
    phone: '+234 800 000 0001',
    degree: 'B.Tech., MSc.',
    experience: '8+ years',
    bio: 'Technically proficient leader with international academic credentials and field exposure across Europe and Africa. Expertise spans project delivery, technical consulting, and strategic business development in the petroleum services sector.',
    specialties: ['Project Management', 'Technical Consulting', 'Business Development'],
    photo: destinyPhoto
  },
  {
    id: 3,
    name: 'Engr. Samuel Adu',
    title: 'Technical Operations Manager',
    location: 'Port Harcourt, Nigeria',
    email: 'samuel.adu@dojcorefield.com',
    phone: '+234 800 000 0002',
    degree: 'M.Sc. Mechanical Engineering',
    experience: '15+ years in pipeline integrity and facility maintenance',
    bio: 'Specialist in pipeline inspection, maintenance, and integrity management. Certified NDT level III with extensive field experience.',
    specialties: ['Pipeline Integrity', 'NDT Testing', 'Facility Maintenance'],
    photo: ''
  },
  {
    id: 4,
    name: 'Dr. Aisha Bello',
    title: 'HSE & Compliance Director',
    location: 'Lagos, Nigeria',
    email: 'aisha.bello@dojcorefield.com',
    phone: '+234 800 000 0003',
    degree: 'Ph.D. Environmental Science',
    experience: '10+ years in HSE management and regulatory compliance',
    bio: 'Leads our HSE programs, ensuring compliance with international standards. Experienced in auditing and safety culture development.',
    specialties: ['HSE Audits', 'Regulatory Compliance', 'Training & Competency'],
    photo: ''
  }
]

// Partner Card Component
const PartnerCard: React.FC<{ partner: Partner; onClick: () => void; index: number }> = ({ partner, onClick, index }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { delay: index * 0.03, duration: 0.45 } }
      }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-primary/20 group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-md">
          {partner.photo ? (
            <img src={partner.photo} alt={partner.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            partner.name.split(' ').slice(0, 2).map(n => n[0]).join('')
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{partner.name}</h3>
          <p className="text-sm text-gray-600">{partner.title}</p>
        </div>
      </div>
      <div className="space-y-2 text-gray-600 text-sm">
        <div className="flex items-center gap-2">
          <Icons.MapPin className="text-primary" />
          <span>{partner.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icons.GraduationCap />
          <span>{partner.degree}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icons.Clock />
          <span>{partner.experience}</span>
        </div>
      </div>
      {partner.specialties && (
        <div className="mt-4 flex flex-wrap gap-2">
          {partner.specialties.slice(0, 2).map((spec, i) => (
            <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              {spec}
            </span>
          ))}
          {partner.specialties.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">+{partner.specialties.length - 2}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}

// Modal Component
const ProfileModal: React.FC<{ partner: Partner | null; onClose: () => void }> = ({ partner, onClose }) => {
  if (!partner) return null

  const scrollbarStyles = `
    .profile-modal-content::-webkit-scrollbar {
      width: 8px;
    }
    .profile-modal-content::-webkit-scrollbar-track {
      background: #f5f5f5;
      border-radius: 10px;
    }
    .profile-modal-content::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #1E2A78 0%, #5A2D82 100%);
      border-radius: 10px;
      transition: all 0.3s ease;
    }
    .profile-modal-content::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #5A2D82 0%, #1E2A78 100%);
      box-shadow: 0 0 6px rgba(30, 42, 120, 0.3);
    }
  `

  return (
    <>
      <style>{scrollbarStyles}</style>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable Content */}
          <div className="profile-modal-content overflow-y-auto flex-1">
            <div className="p-6 lg:p-10">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="float-right p-2 hover:bg-gray-100 rounded-full transition-colors mb-4"
                aria-label="Close modal"
              >
                <Icons.Close />
              </button>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Photo Section */}
            <div className="lg:col-span-2 flex items-start justify-center">
              <div className="w-full">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary to-secondary overflow-hidden shadow-lg">
                  {partner.photo ? (
                    <img 
                      src={partner.photo} 
                      alt={partner.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                      {partner.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Details Section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{partner.name}</h2>
                <p className="text-lg text-primary font-semibold">{partner.title}</p>
              </div>

              {/* Contact & Location Info */}
              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3 text-gray-700">
                  <Icons.MapPin className="text-primary flex-shrink-0" />
                  <span className="text-sm">{partner.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Icons.Clock className="text-primary flex-shrink-0" />
                  <span className="text-sm">{partner.experience}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Icons.Mail className="text-primary flex-shrink-0" />
                  <a href={`mailto:${partner.email}`} className="text-primary hover:underline text-sm">{partner.email}</a>
                </div>
                {partner.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Icons.Phone className="text-primary flex-shrink-0" />
                    <a href={`tel:${partner.phone}`} className="text-primary hover:underline text-sm">{partner.phone}</a>
                  </div>
                )}
              </div>

              {/* Education */}
              {partner.degree && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Education</h4>
                  <p className="text-gray-700 text-sm">{partner.degree}</p>
                </div>
              )}

              {/* Specialties */}
              {partner.specialties && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {partner.specialties.map((spec, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Biography */}
              {partner.bio && (
                <div className="pt-2">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">About</h4>
                  <p className="text-gray-700 leading-relaxed text-sm">{partner.bio}</p>
                </div>
              )}

              {/* Close Button */}
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="w-full px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all duration-300 font-medium text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default function Profile() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-neutral-50">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Leadership & Partners</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Experienced leadership driving safe, reliable petroleum services.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {samplePartners.map((partner, index) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                onClick={() => setSelectedPartner(partner)}
                index={index}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <ProfileModal partner={selectedPartner} onClose={() => setSelectedPartner(null)} />
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-6">Ready to Work With Our Experts?</h2>
            <p className="text-white/90 mb-8 text-sm">
              Contact our leadership team to discuss your next project or partnership opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all duration-300 font-semibold text-sm shadow-lg"
              >
                Get in Touch
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-primary transition-all duration-300 font-semibold text-sm"
              >
                Request a Consultation
              </motion.button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary">
                  <img 
                    src={image}
                    alt="DOJ COREFIELD Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xl font-bold">DOJ COREFIELD ENERGY LIMITED</div>
                  <div className="text-xs text-gray-400">Petroleum Services</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs">
                End-to-end petroleum services: field operations, logistics, equipment maintenance and compliance support.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-400 hover:text-white transition-colors text-xs">Home</Link>
                <Link to="/about" className="block text-gray-400 hover:text-white transition-colors text-xs">About Us</Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors text-xs">Contact</Link>
                <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors text-xs">Privacy Policy</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Services</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs">Field Operations</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs">Pipeline Maintenance</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs">Inspection & Calibration</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs">HSE Consulting</a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Icons.Phone className="w-4 h-4" />
                  <span>+234 9039904685</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Icons.MapPin className="w-4 h-4" />
                  <span>Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Icons.Clock className="w-4 h-4" />
                  <span>Mon-Fri: 8AM-6PM</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.92 11.92 0 0012 0C5.373 0 .02 5.373 0 12c0 2.11.553 4.18 1.6 6.02L0 24l6.2-1.6A11.92 11.92 0 0012 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.16-3.48-8.52zM12 21.5c-1.85 0-3.66-.48-5.2-1.38l-.37-.22-3.68.95.96-3.6-.24-.38A9.5 9.5 0 0112 2.5c5.24 0 9.5 4.26 9.5 9.5S17.24 21.5 12 21.5z"/></svg>
                </a>
                <a href="https://facebook.com/yourcompany" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.99 3.66 9.13 8.44 9.94v-7.03H8.12v-2.91h2.18V9.41c0-2.15 1.28-3.34 3.23-3.34.94 0 1.93.17 1.93.17v2.12h-1.09c-1.08 0-1.41.67-1.41 1.35v1.62h2.4l-.38 2.91h-2.02V22c4.78-.81 8.44-4.95 8.44-9.93z"/></svg>
                </a>
                <a href="https://linkedin.com/company/yourcompany" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.86v5.5H9.4V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.49v6.76zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 01-.01 4.12zM7.12 20.45H3.55V9h3.57v11.45z"/></svg>
                </a>
                <a href="https://x.com/yourcompany" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.954 4.569a10 10 0 01-2.825.775 4.945 4.945 0 002.163-2.723 9.9 9.9 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482A13.978 13.978 0 011.671 3.149a4.822 4.822 0 001.523 6.574 4.9 4.9 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.902 4.902 0 01-2.224.084 4.935 4.935 0 004.604 3.417A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646a9.935 9.935 0 002.41-2.534z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-xs">
            <p>&copy; 2024 DOJ COREFIELD ENERGY LIMITED. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-full shadow-lg z-50"
            aria-label="Scroll to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}