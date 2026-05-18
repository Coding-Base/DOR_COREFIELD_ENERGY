import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import CareerApplicationForm from '../components/CareerApplicationForm'

const Icons = {
  Users: (props: any) => (
    <svg {...props} className={`w-6 h-6 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.048M12 4.354L9.172 7.17M12 4.354l2.828 2.816M5.172 8.354L2 11.172M21 11.172l-3.172-2.818" />
    </svg>
  ),
  Briefcase: (props: any) => (
    <svg {...props} className={`w-6 h-6 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4" />
    </svg>
  ),
  Rocket: (props: any) => (
    <svg {...props} className={`w-6 h-6 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Heart: (props: any) => (
    <svg {...props} className={`w-6 h-6 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
}

const AnimatedSection: React.FC<{
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}> = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directionClasses[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default function CareersPage() {
  const navigate = useNavigate()
  const [showScrollTop, setShowScrollTop] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const benefits = [
    {
      icon: Icons.Briefcase,
      title: 'Career Growth',
      description: 'Develop your skills in the dynamic oil & gas sector with mentorship from industry experts.',
    },
    {
      icon: Icons.Users,
      title: 'Collaborative Team',
      description: 'Work with talented professionals in a supportive environment that values innovation and excellence.',
    },
    {
      icon: Icons.Rocket,
      title: 'Innovation Focus',
      description: 'Contribute to cutting-edge projects that drive the industry forward and make a real impact.',
    },
    {
      icon: Icons.Heart,
      title: 'Employee Wellbeing',
      description: 'Enjoy competitive benefits, flexible work arrangements, and comprehensive support programs.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-slate-700 to-secondary text-white py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={200}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Join Our Team</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto font-medium">
              Build a rewarding career in the oil & gas industry with DOJ COREFIELD ENERGY LIMITED
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Why Join Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" delay={100}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Join DOJ COREFIELD?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're committed to building a workplace where talented professionals can thrive and make a real difference.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <AnimatedSection key={index} direction="up" delay={200 + index * 100}>
                  <div className="bg-gradient-to-br from-orange-50 to-gray-50 rounded-2xl p-8 border border-orange-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                      <Icon className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection direction="up" delay={100}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're actively hiring for various roles across our organization. If you don't see a perfect fit, apply anyway — we'd love to hear from talented individuals!
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Field Operations Engineer', location: 'On-site', type: 'Full-time' },
              { title: 'Pipeline Technician', location: 'On-site', type: 'Full-time' },
              { title: 'HSE Officer', location: 'On-site/Remote', type: 'Full-time' },
              { title: 'Inspection Specialist', location: 'On-site', type: 'Full-time' },
              { title: 'Drilling Support', location: 'On-site', type: 'Full-time' },
              { title: 'Equipment Maintenance Technician', location: 'On-site', type: 'Full-time' },
            ].map((job, index) => (
              <AnimatedSection key={index} direction="left" delay={200 + index * 50}>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      {job.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">Passionate professionals wanted for growth-oriented roles in the oil & gas sector.</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection direction="up" delay={100}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Apply Now</h2>
              <p className="text-lg text-gray-600">
                Fill out the form below to submit your application. It takes just a few minutes!
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={200}>
            <CareerApplicationForm />
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection direction="up" delay={200}>
            <h2 className="text-4xl font-bold mb-6">Questions?</h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8 font-medium">
              If you have any questions about working at DOJ COREFIELD or our application process, please reach out to our HR team.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="bg-white text-primary px-8 py-4 rounded-2xl font-semibold hover:bg-opacity-90 transition-all duration-300"
            >
              Contact Us
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-full shadow-lg z-50 hover:opacity-90 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  )
}
