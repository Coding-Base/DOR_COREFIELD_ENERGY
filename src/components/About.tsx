import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import image from './logork.jpg'
import Navigation from './Navigation'

// Icons - petroleum industry focused
const Icons = {
  Check: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Star: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  // Petroleum Icons
  Drill: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={2} fill="none" />
    </svg>
  ),
  Pipeline: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 20h14M5 4h14M5 12h14M7 8h4M7 16h4M13 8h4M13 16h4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 20h18M3 12h18" />
    </svg>
  ),
  SafetyHelmet: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4a8 8 0 00-8 8v2a4 4 0 008 0v-2a8 8 0 00-8-8zM12 4v2m0 8a4 4 0 01-8 0v-2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12a8 8 0 00-8-8v2a8 8 0 018 8z" />
    </svg>
  ),
  OilBarrel: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 12h14M5 16h14M3 20h18M3 4h18" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v12M17 8v12" />
    </svg>
  ),
  Team: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  MapPin: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Phone: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Clock: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

// Count Up Component
const CountUp: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end, duration, isInView])

  return <span ref={ref}>{count}{suffix}</span>
}

// CTA Button Component
const CTAButton: React.FC<{ text: string; variant?: 'primary' | 'secondary' }> = ({ text, variant = 'primary' }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/contact')
  }

  if (variant === 'secondary') {
    return (
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-primary transition-all duration-300 font-semibold text-sm"
      >
        {text}
      </motion.button>
    )
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white text-primary px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all duration-300 font-semibold text-sm shadow-lg"
    >
      {text}
    </motion.button>
  )
}

export default function About() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  const stats = [
    { number: 15, label: "Years Experience", icon: <Icons.Calendar />, suffix: "+" },
    { number: 1200, label: "Projects Completed", icon: <Icons.Drill />, suffix: "+" },
    { number: 99, label: "Safety Compliance", icon: <Icons.Shield />, suffix: "%" },
    { number: 24, label: "Field Support", icon: <Icons.Clock />, suffix: "/7" }
  ]

  const values = [
    { title: "Safety First", icon: <Icons.Shield />, description: "Zero harm commitment across all operations" },
    { title: "Operational Excellence", icon: <Icons.Drill />, description: "Delivering projects with precision and efficiency" },
    { title: "Integrity", icon: <Icons.Check />, description: "Transparent, ethical practices in all dealings" },
    { title: "Innovation", icon: <Icons.Pipeline />, description: "Embracing technology to improve outcomes" }
  ]

  // Scroll to top handler
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About DOJ COREFIELD ENERGY</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Professional petroleum services delivering field operations, logistics and technical consulting.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <CountUp end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Our Story */}
        <AnimatedSection>
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <p>
                    DOJ COREFIELD ENERGY LIMITED was founded with a vision to deliver world-class petroleum services 
                    across West Africa. With deep industry expertise and a commitment to safety, we've grown into a 
                    trusted partner for upstream and downstream operators.
                  </p>
                  <p>
                    From our beginnings in field operations and logistics, we've expanded to offer integrated 
                    solutions including pipeline maintenance, equipment calibration, and HSE consulting. Today, 
                    we're proud to support the energy sector with reliable, compliant, and efficient services.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={image}
                  alt="DOJ COREFIELD operations"
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-2xl font-bold">Since 2009</div>
                  <div className="text-white/90 text-sm">Industry Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <AnimatedSection delay={0.2}>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-r from-primary to-secondary text-white rounded-3xl p-8 h-full"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Icons.Star className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                To provide exceptional petroleum services with safety, integrity, and technical excellence, 
                ensuring maximum asset uptime and operational performance for our clients.
              </p>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl shadow-lg p-8 h-full border border-gray-100"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <div className="text-primary"><Icons.Shield /></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                To be the most trusted petroleum service provider in the region, known for operational excellence, 
                technical expertise, and unwavering commitment to safety and compliance.
              </p>
            </motion.div>
          </AnimatedSection>
        </div>

        {/* Core Values */}
        <AnimatedSection>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-md p-6 text-center border border-gray-100"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Why Choose Us */}
        <AnimatedSection>
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-3xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold mb-8 text-center">Why Choose DOJ COREFIELD?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Proven HSE & Compliance Track Record",
                "Field-first Operational Expertise",
                "Certified Inspection & Calibration Services",
                "Rapid Mobilization & Logistics",
                "Integrated Asset Integrity Programs",
                "Transparent Reporting & Audit Support",
                "24/7 Emergency Response",
                "ISO & Industry Certified Professionals"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <Icons.Check className="flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Team / Leadership */}
        <AnimatedSection delay={0.4}>
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-sm">
              Our experienced leadership brings decades of petroleum industry expertise to every project.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Daniel Okoro", role: "Chief Executive Officer", experience: "20+ years" },
                { name: "Aisha Bello", role: "HSE Director", experience: "15+ years" },
                { name: "Samuel Adu", role: "Technical Operations Lead", experience: "18+ years" }
              ].map((leader, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100"
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {leader.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{leader.name}</h3>
                  <div className="text-primary font-semibold mb-2 text-sm">{leader.role}</div>
                  <div className="text-gray-500 text-xs">{leader.experience} experience</div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-6">Ready to Partner With Us?</h2>
            <p className="text-white/90 mb-8 text-sm">
              Contact us to discuss your next project or learn more about our comprehensive petroleum services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton text="Get in Touch" />
              <CTAButton text="Request a Quote" variant="secondary" />
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