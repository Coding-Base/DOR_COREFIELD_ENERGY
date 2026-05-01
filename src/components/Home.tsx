import React, { useState, useEffect, useRef } from 'react'
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import image from './logork.jpg'
import Navigation from './Navigation'
import image2 from './hero.avif'
import heroimage from './DOJFULL2.avif'
import PIPE from './pipefull2.jfif'
import rig1 from './rig1.jfif'
import rig2 from './rig2.avif'
import doj3 from './doj3.jfif'
import rigVideo from './Offshore_Rig_Video_Generation.mp4'
import { companyLogos } from './logoUrls'
import okallaPhoto from './IMG-20260415-WA0078.jpg'
import destinyPhoto from '../pages/IMG-20260417-WA0018.jpg'
import WhitneyChioma from './HR.jpg'
import EBUKA from './1000649554.jpg'


// Icons (same as before, but I've kept them for brevity)
const Icons = {
  Wrench: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Car: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Engine: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
  Battery: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  Star: (props: any) => <svg {...props} className={`w-5 h-5 ${props.className || ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  Quote: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" /></svg>,
  Check: (props: any) => <svg {...props} className={`w-5 h-5 ${props.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Phone: (props: any) => <svg {...props} className={`w-5 h-5 ${props.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  MapPin: (props: any) => <svg {...props} className={`w-5 h-5 ${props.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Clock: (props: any) => <svg {...props} className={`w-5 h-5 ${props.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Truck: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Gauge: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Target: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Shield: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Cog: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
}

// Utility function for class names
const cn = (...classes: (string | undefined | boolean)[]) => classes.filter(Boolean).join(' ')

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05
    }
  }
}

// Enhanced Animated Section with Framer Motion
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

// Service Card Component (Enhanced)
const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  price?: string;
  index: number;
}> = ({ icon, title, description, features, price, index }) => {
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
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary/20"
    >
      <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <span className="text-white">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed text-sm">{description}</p>
      <div className="space-y-2 mb-4">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2">
            <Icons.Check className="text-green-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
      {price && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-2xl font-bold text-primary">{price}</div>
          <div className="text-sm text-gray-500">Starting from</div>
        </div>
      )}
    </motion.div>
  )
}

// Testimonial Component (Enhanced)
const TestimonialCard: React.FC<{
  name: string;
  role: string;
  content: string;
  rating: number;
  index: number;
}> = ({ name, role, content, rating, index }) => {
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
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icons.Star key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
        ))}
      </div>
      <div className="mb-4">
        <div className="text-primary opacity-20 mb-2"><Icons.Quote /></div>
        <p className="text-gray-700 italic text-sm">"{content}"</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-sm">{name}</div>
          <div className="text-sm text-gray-600 text-xs">{role}</div>
        </div>
      </div>
    </motion.div>
  )
}

// Team Member Component (Enhanced)
const TeamCard: React.FC<{
  name: string;
  role: string;
  experience: string;
  specialization: string[];
  image?: string;
  index: number;
}> = ({ name, role, experience, specialization, image, index }) => {
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
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg p-6 text-center group hover:shadow-xl transition-all duration-300"
    >
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
        {image ? (
          <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          name.charAt(0)
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
      <div className="text-primary font-semibold mb-3 text-sm">{role}</div>
      <div className="text-sm text-gray-600 mb-3 text-xs">{experience} Experience</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {specialization.map((spec, i) => (
          <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
            {spec}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// Petroleum Partners Slider Component
const CarBrandSlider: React.FC = () => {
  const partners = [
    { name: 'Shell', code: 'SHELL' },
    { name: 'ExxonMobil', code: 'XOM' },
    { name: 'BP', code: 'BP' },
    { name: 'Chevron', code: 'CVX' },
    { name: 'Saudi Aramco', code: 'ARAMCO' },
    { name: 'TotalEnergies', code: 'TOTAL' },
    { name: 'Equinor', code: 'EQNR' },
    { name: 'ConocoPhillips', code: 'COP' }
  ]

  const [isPaused, setIsPaused] = useState(false)

  return (
    <div className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection delay={0.2}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Industry Partners & Standards</h2>
            <p className="text-gray-600 text-sm">Aligned with international petroleum service leaders and global standards</p>
          </div>
        </AnimatedSection>
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div 
            className="flex space-x-8 py-4"
            animate={{ x: isPaused ? 0 : '-50%' }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {partners.concat(partners).map((partner, index) => (
              <div key={index} className="flex-shrink-0 w-32 h-20 flex items-center justify-center">
                <div className="bg-white rounded-lg p-3 border border-gray-200 w-full h-full flex items-center justify-center hover:shadow-xl hover:border-gray-300 transition-all duration-300 group cursor-pointer">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={companyLogos[partner.name]} 
                      alt={partner.name}
                      className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback if logo fails to load
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent && parent.parentElement) {
                          parent.parentElement.innerHTML = `
                            <div class="text-center">
                              <div class="font-bold text-primary text-xs">${partner.code}</div>
                              <div class="text-gray-600 text-xs mt-1 font-medium">${partner.name}</div>
                            </div>
                          `
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Count Up Component
const CountUp: React.FC<{ end: number; duration?: number }> = ({ end, duration = 2 }) => {
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

  return <span ref={ref}>{count}+</span>
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const navigate = useNavigate()

  const services = [
    {
      icon: <Icons.Truck />,
      title: "Field Operations & Logistics",
      description: "End-to-end field operations including wellsite support, logistics coordination and mobilization services.",
      features: ["Wellsite Mobilization", "Supply Chain Coordination", "Field Staffing & Crew Management", "24/7 Operations Support"],
      price: "Project-based"
    },
    {
      icon: <Icons.Cog />,
      title: "Pipeline & Facility Maintenance",
      description: "Preventive and corrective maintenance for pipelines, tanks and processing facilities to ensure uptime and safety.",
      features: ["Routine Inspections", "Pigging & Cleaning", "Corrosion Control", "Valve & Pump Overhauls"],
      price: "Contract"
    },
    {
      icon: <Icons.Target />,
      title: "Equipment Inspection & Calibration",
      description: "Certified inspection, calibration and testing of meters, gauges and control systems to regulatory standards.",
      features: ["Instrument Calibration", "NDT & Ultrasonic Testing", "Meter Proving", "Certification Reports"],
      price: "Per-job"
    },
    {
      icon: <Icons.Shield />,
      title: "HSE & Compliance Consulting",
      description: "Health, safety and environmental services including audits, training and compliance program development.",
      features: ["HSE Audits", "Permit-to-Work Systems", "Training & Competency", "Regulatory Liaison"],
      price: "Consult"
    }
  ]

  const testimonials = [
    {
      name: "Amina Suleiman",
      role: "Operations Manager, Upstream Partner",
      content: "DOJ COREFIELD delivered a flawless mobilization within tight timelines and maintained exemplary safety standards throughout the campaign.",
      rating: 5
    },
    {
      name: "Kwame Mensah",
      role: "Logistics Lead, OilCo Ltd",
      content: "Their logistics coordination reduced downtime and optimized supply delivery — highly professional and responsive.",
      rating: 5
    },
    {
      name: "Helen Oke",
      role: "Compliance Officer",
      content: "Comprehensive HSE audits and clear remediation plans helped our operations meet regulatory requirements quickly.",
      rating: 5
    }
  ]

  const teamMembers = [
    {
      name: "Engr. Okalla Christian",
      role: "Co-director",
      experience: "8+ years",
      specialization: ["Well Intervention", "Wellsite Management", "Asset Integrity",'Petroleum Engineering'],
      image:okallaPhoto
    },
    {
      name: "Mr. Chukwuebuka Destiny Uzor",
      role: "Co-director",
      experience: "8+ years",
      specialization: ['Subsurface Resources Exploration','Geothermal Energy Development','Data-Driven Geoscience Solution','Sustainable Energy Projects'],
      image:destinyPhoto
    },
    {
      name: "Engr. Dike Chukwuebuka Francis",
      role: "Chief Operations Manager",
      experience: "8+ years",
      specialization: ['Field Operations', 'Onshore Operations ', 'Offshore Operations','Well Intervention',"Pipeline Maintenance", "Pumps & Valves", "NDT"],
      image:EBUKA
    },
    {
      name: "John Whitney Chioma",
      role: "HR Manager",
      experience: "3+ years",
      specialization: ['Social Media Manager', 'Project Manager', 'Virtual Assistant', 'Content Creator'],
      image:WhitneyChioma
    }
  ]

  const stats = [
    { number: 1200, label: "Projects Delivered", suffix: "+" },
    { number: 99, label: "Safety Compliance", suffix: "%" },
    { number: 24, label: "Field Support", suffix: "/7" },
    { number: 20, label: "Years Experience", suffix: "+" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-neutral-50 home-root">
      <Navigation showRequestButton={true} />

      {/* Hero Section with Parallax Effect */}
      <section className="relative bg-gradient-to-r from-primary to-secondary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/25 z-10"></div>
        
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          style={{ mixBlendMode: 'overlay' }}
        >
          <source src={rigVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Fallback Image for browsers that don't support video */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={heroimage}
            alt="Offshore oil platform at sunrise"
            className="w-full h-full object-cover opacity-0"
            loading="eager"
            decoding="async"
          />
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Delivering Reliable Petroleum Operations
              <span className="block text-white text-3xl md:text-4xl">Field Operations • Maintenance • Logistics</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
              DOJ COREFIELD ENERGY LIMITED provides integrated petroleum services from field operations and
              pipeline maintenance to equipment calibration and HSE compliance. Trusted by operators for safe,
              efficient and regulatory compliant delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl hover:opacity-95 transition-all duration-300 font-semibold text-sm shadow-lg shadow-primary/25 cursor-pointer"
              >
                Request Field Support
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/services')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-primary transition-all duration-300 font-semibold text-sm cursor-pointer"
              >
                Learn About Services
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Car Brand Slider */}
      <CarBrandSlider />

      {/* Stats Section with Count Up */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {stat.number === 1200 ? <CountUp end={1200} /> : 
                     stat.number === 99 ? <CountUp end={99} /> :
                     stat.number === 24 ? <CountUp end={24} /> :
                     <CountUp end={20} />}
                    {stat.suffix}
                  </div>
                  <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Premium Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                Comprehensive automotive solutions and quality vehicle sales delivered by certified professionals
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose DOJ COREFIELD?</h2>
                <div className="space-y-4">
                  {[
                    "Proven HSE & Compliance Track Record",
                    "Field-first Operational Expertise",
                    "Certified Inspection & Calibration Services",
                    "Rapid Mobilization & Logistics",
                    "Integrated Asset Integrity Programs",
                    "Transparent Reporting & Audit Support"
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center gap-3"
                    >
                      <Icons.Check className="text-primary flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="relative">
                <img
                  src={PIPE}
                  alt="Petroleum facility and pipeline"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-2xl font-bold">20+ Years</div>
                  <div className="text-white text-sm">of Industry Excellence</div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-white/80 text-sm">Trusted by operators for safe, compliant and efficient delivery</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
              <p className="text-gray-600 text-sm">Experienced professionals supporting petroleum operations and asset integrity</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamCard key={index} {...member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Capabilities</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm">Integrated services that keep your operations safe and productive.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{
                title: 'Operations & Mobilization',
                desc: 'Rapid site mobilization, crew management and on-site logistics.',
                icon: '🚀',
                image: rig1
              },{
                title: 'Inspection & Testing',
                desc: 'NDT, ultrasonic testing, and instrument calibration services.',
                icon: '🔬',
                image: rig2
              },{
                title: 'Pipeline Maintenance',
                desc: 'Pigging, corrosion control and preventive pipeline maintenance.',
                icon: '🔧',
                image: PIPE
              },{
                title: 'HSE & Compliance',
                desc: 'Audits, training and permit-to-work systems to meet regulators.',
                icon: '✓',
                image: doj3
              }].map((c, i) => (
                <div key={i} className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group h-full"
                  >
                    <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary/30">
                      <div 
                        className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden"
                        style={{
                          backgroundImage: `url(${c.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          opacity: 0.6
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
                      </div>
                      <CardContent className="relative">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 text-white font-bold text-xl shadow-lg -mt-8 relative z-10">
                          {c.icon}
                        </div>
                        <Typography variant="h6" component="h3" className="font-bold mb-2 text-gray-900">{c.title}</Typography>
                        <Typography variant="body2" className="text-gray-600 leading-relaxed">{c.desc}</Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Case Studies</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm">Selected project highlights demonstrating impact and expertise.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{
                title: 'Offshore Platform Mobilization',
                img: rig2,
                excerpt: 'Full mobilization and logistics for a multi-week offshore maintenance campaign.',
                results: 'Completed 2 weeks ahead, zero HSE incidents'
              },{
                title: 'Pipeline Integrity Program',
                img: PIPE,
                excerpt: 'Comprehensive inspection program including NDT and corrosion mitigation.',
                results: '2,400 km inspected, 98% defects remediated'
              },{
                title: 'HSE Remediation & Audit',
                img: doj3,
                excerpt: 'Audit, remediation plan and training that closed critical non-conformances.',
                results: 'All findings closed within 90 days'
              }].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 hover:border-primary/30">
                    <CardMedia component="img" height="220" image={s.img} alt={s.title} className="object-cover hover:scale-105 transition-transform duration-300" />
                    <CardContent>
                      <h3 className="text-lg font-bold mb-2 text-gray-900">{s.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{s.excerpt}</p>
                      <div className="bg-primary/5 border-l-4 border-primary px-3 py-2 rounded-r mb-4">
                        <p className="text-xs font-semibold text-primary">{s.results}</p>
                      </div>
                      <motion.div
                        whileHover={{ x: 4 }}
                      >
                        <Button variant="contained" className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300" size="small">
                          Read Case Study →
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="w-32 h-32 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6">
                    OC
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Engr. Okalla Christian</h2>
                  <div className="text-primary text-xl font-semibold mb-4 text-sm">Co-director</div>
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                    "Our mission is to deliver safe, compliant and efficient petroleum services that maximize asset uptime and operational performance for our clients. We combine field expertise with disciplined HSE practices to deliver measurable outcomes."
                  </p>
                  <div className="flex items-center gap-4 text-gray-500 text-xs">
                    <Icons.Clock className="w-4 h-4" />
                    <span>8+ Years Industry Experience</span>
                  </div>
                </div>
                <div className="relative flex justify-center items-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl"></div>
                  <img
                    src={okallaPhoto}
                    alt="Engr. Okalla Christian"
                    className="rounded-3xl shadow-2xl w-full max-w-sm h-96 object-cover relative z-10 border-4 border-white"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-6">Ready to Mobilize Your Next Project?</h2>
            <p className="text-white/90 mb-8 text-sm">
              Contact DOJ COREFIELD to discuss mobilization plans, maintenance contracts, or HSE audits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary px-8 py-4 rounded-xl hover:bg-opacity-90 transition-all duration-300 font-semibold text-sm shadow-lg"
                onClick={() => navigate('/contact')}
              >
                Request Proposal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-primary transition-all duration-300 font-semibold text-sm"
                onClick={() => navigate('/contact')}
              >
                Contact Us
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
                  <span>Aachen NRW, Germany Head Office</span>
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