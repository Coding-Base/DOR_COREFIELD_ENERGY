import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Icons for the interface
const Icons = {
  Wrench: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Car: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Engine: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
  Battery: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  Star: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  Quote: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Phone: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  MapPin: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Clock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
}

// Animation Wrapper Component
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}> = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8'
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-x-0 translate-y-0' 
          : `opacity-0 ${directionClasses[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Service Card Component
const ServiceCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  price?: string;
  delay: number;
}> = ({ icon, title, description, features, price, delay }) => (
  <AnimatedSection delay={delay} direction="up">
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 group transform hover:-translate-y-2">
      <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      <div className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Icons.Check className="text-green-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
      {price && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{price}</div>
          <div className="text-sm text-gray-500">Starting from</div>
        </div>
      )}
    </div>
  </AnimatedSection>
)

// Testimonial Component
const TestimonialCard: React.FC<{
  name: string;
  role: string;
  content: string;
  rating: number;
  delay: number;
}> = ({ name, role, content, rating, delay }) => (
  <AnimatedSection delay={delay} direction="up">
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icons.Star key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
        ))}
      </div>
      <div className="mb-4">
        <Icons.Quote className="text-blue-600 opacity-20 mb-2" />
        <p className="text-gray-700 italic">"{content}"</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-600">{role}</div>
        </div>
      </div>
    </div>
  </AnimatedSection>
)

// Team Member Component
const TeamCard: React.FC<{
  name: string;
  role: string;
  experience: string;
  specialization: string[];
  image?: string;
  delay: number;
}> = ({ name, role, experience, specialization, image, delay }) => (
  <AnimatedSection delay={delay} direction="up">
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center group hover:shadow-xl transition-all duration-300">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
        {image ? (
          <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          name.charAt(0)
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
      <div className="text-blue-600 font-semibold mb-3">{role}</div>
      <div className="text-sm text-gray-600 mb-3">{experience} Experience</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {specialization.map((spec, index) => (
          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            {spec}
          </span>
        ))}
      </div>
    </div>
  </AnimatedSection>
)

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const services = [
    {
      icon: <Icons.Engine />,
      title: "Engine Repair & Maintenance",
      description: "Complete engine diagnostics, repair, and preventive maintenance to keep your vehicle running smoothly.",
      features: ["Engine Diagnostics", "Timing Belt Replacement", "Oil Change Services", "Complete Overhaul"],
      price: "$150+"
    },
    {
      icon: <Icons.Car />,
      title: "Brake System Services",
      description: "Professional brake inspection, repair, and replacement services for optimal safety and performance.",
      features: ["Brake Pad Replacement", "Rotor Resurfacing", "Brake Fluid Flush", "ABS System Repair"],
      price: "$120+"
    },
    {
      icon: <Icons.Battery />,
      title: "Electrical Systems",
      description: "Expert diagnosis and repair of electrical issues, battery replacement, and wiring solutions.",
      features: ["Battery Replacement", "Alternator Repair", "Starter Motor Service", "Wiring Diagnostics"],
      price: "$100+"
    },
    {
      icon: <Icons.Wrench />,
      title: "Transmission Services",
      description: "Comprehensive transmission repair, fluid changes, and clutch services for all vehicle types.",
      features: ["Transmission Flush", "Clutch Replacement", "Gearbox Repair", "CV Joint Service"],
      price: "$200+"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Customer",
      content: "The team at AutoPro fixed my transmission issue when three other shops couldn't figure it out. Professional service and fair pricing!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Fleet Manager",
      content: "We trust AutoPro with our entire fleet of 15 vehicles. Their preventive maintenance program has saved us thousands in repairs.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Local Business Owner",
      content: "Fast, reliable, and honest. They completed my brake service ahead of schedule and the car feels brand new. Highly recommended!",
      rating: 5
    }
  ]

  const teamMembers = [
    {
      name: "James Wilson",
      role: "Lead Technician",
      experience: "15+ years",
      specialization: ["Engine Specialist", "Diagnostics Expert", "Hybrid Systems"]
    },
    {
      name: "Maria Garcia",
      role: "Transmission Specialist",
      experience: "12+ years",
      specialization: ["Automatic Transmissions", "Manual Gearboxes", "CVT Systems"]
    },
    {
      name: "David Kim",
      role: "Electrical Engineer",
      experience: "10+ years",
      specialization: ["Electrical Systems", "Computer Diagnostics", "Wiring"]
    },
    {
      name: "Lisa Thompson",
      role: "Brake System Expert",
      experience: "8+ years",
      specialization: ["ABS Systems", "Brake Performance", "Safety Systems"]
    }
  ]

  const stats = [
    { number: "5000+", label: "Vehicles Serviced" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Emergency Support" },
    { number: "15+", label: "Years Experience" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Close mobile menu when clicking on a link
  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="down" delay={100}>
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Icons.Car className="text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">AutoPro</div>
                  <div className="text-xs text-gray-600">Automotive Excellence</div>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</Link>
                <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</Link>
                <Link to="/privacy" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Privacy</Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center gap-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-medium hidden md:block">
                  Book Service
                </button>
                <button 
                  className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen ? 'max-h-64 opacity-100 py-4' : 'max-h-0 opacity-0'
            }`}>
              <div className="flex flex-col space-y-4 pb-4 border-t border-gray-200 pt-4">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={handleNavClick}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={handleNavClick}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={handleNavClick}
                >
                  Contact
                </Link>
                <Link 
                  to="/privacy" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={handleNavClick}
                >
                  Privacy
                </Link>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium w-full text-center">
                  Book Service
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://media.istockphoto.com/id/2214445636/photo/happy-mechanic-working-at-an-auto-repair-shop-and-holding-tools.jpg?s=1024x1024&w=is&k=20&c=8E0tVmjUbbcN8ZapbiJLTLF-Xvjtg2XOjTgGw3xR1vM=')`
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <AnimatedSection direction="up" delay={200}>
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Premium Automotive <span className="text-blue-400">Repair</span> Services
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
                Expert technicians, state-of-the-art equipment, and unmatched customer service. 
                Your vehicle deserves the best care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg">
                  Schedule Service
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300 font-semibold text-lg">
                  Learn More
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={300}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Premium Services</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive automotive solutions delivered by certified technicians using the latest technology
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} delay={300 + index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="right" delay={300}>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose AutoPro?</h2>
                <div className="space-y-4">
                  {[
                    "Certified ASE Master Technicians",
                    "State-of-the-Art Diagnostic Equipment",
                    "Same-Day Service Available",
                    "12-Month/12,000-Mile Warranty",
                    "Transparent Pricing - No Hidden Fees",
                    "Eco-Friendly Practices"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Icons.Check className="text-green-500 flex-shrink-0" />
                      <span className="text-lg text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="left" delay={400}>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Technician working"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-2xl font-bold">15+ Years</div>
                  <div className="text-blue-100">of Excellence</div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-xl text-blue-100">Trusted by thousands of satisfied customers</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} delay={300 + index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
              <p className="text-xl text-gray-600">Certified professionals dedicated to your vehicle's care</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamCard key={index} {...member} delay={300 + index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={300}>
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-6">
                    JW
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">James Wilson</h2>
                  <div className="text-blue-600 text-xl font-semibold mb-4">Founder & CEO</div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    "With over 20 years in the automotive industry, I founded AutoPro with one mission: 
                    to provide honest, reliable, and expert automotive care. Our team shares my passion 
                    for excellence and commitment to customer satisfaction."
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Icons.Clock className="w-4 h-4" />
                    <span>20+ Years Industry Experience</span>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="CEO James Wilson"
                    className="rounded-2xl shadow-lg w-full h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={300}>
            <h2 className="text-4xl font-bold mb-6">Ready to Experience Premium Auto Care?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Schedule your service today and join thousands of satisfied customers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg">
                Book Appointment
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold text-lg">
                Call Now
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Icons.Car className="text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">AutoPro</div>
                    <div className="text-xs text-gray-400">Automotive Excellence</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Premium automotive repair services with unmatched quality and customer care.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link to="/" className="block text-gray-400 hover:text-white transition-colors">Home</Link>
                  <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</Link>
                  <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
                  <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Services</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Engine Repair</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Brake Services</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Transmission</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">Electrical Systems</a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Icons.Phone className="w-4 h-4" />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Icons.MapPin className="w-4 h-4" />
                    <span>123 Auto Street, Repair City</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Icons.Clock className="w-4 h-4" />
                    <span>Mon-Fri: 7AM-7PM</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="up" delay={300}>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2024 AutoPro Automotive. All rights reserved.</p>
            </div>
          </AnimatedSection>
        </div>
      </footer>
    </div>
  )
}