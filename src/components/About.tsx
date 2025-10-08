import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import image from './logork.jpg'

const Icons = {
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Star: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  Wrench: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Users: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>,
  Shield: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
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
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

export default function About() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const stats = [
    { number: "15+", label: "Years Experience", icon: <Icons.Wrench /> },
    { number: "5000+", label: "Vehicles Serviced", icon: <Icons.Users /> },
    { number: "98%", label: "Customer Satisfaction", icon: <Icons.Star /> },
    { number: "24/7", label: "Support Available", icon: <Icons.Shield /> }
  ];

  // Close mobile menu when clicking on a link
  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-orange-500">
                <img 
                  src={image}
                  alt="RK AUTOS Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">RK AUTOS</div>
                <div className="text-xs text-gray-600">Custom Garage</div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Home</Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Contact</Link>
              <Link to="/privacy" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Privacy</Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4">
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
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors py-2"
                onClick={handleNavClick}
              >
                Home
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors py-2"
                onClick={handleNavClick}
              >
                Contact
              </Link>
              <Link 
                to="/privacy" 
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors py-2"
                onClick={handleNavClick}
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={200}>
            <h1 className="text-5xl font-bold mb-6">About RK AUTOS</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Excellence in automotive care and custom solutions since 2009
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <AnimatedSection direction="up" delay={300}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-orange-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Our Story */}
        <AnimatedSection direction="up" delay={400}>
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Founded in 2009 by Robert King, RK AUTOS started as a small neighborhood garage with 
                    a big vision: to provide honest, reliable, and expert automotive care to our community. 
                    What began as a one-man operation has grown into a team of certified professionals 
                    serving thousands of satisfied customers.
                  </p>
                  <p>
                    Today, we continue to uphold our founding principles while embracing the latest 
                    automotive technology and repair techniques. Our commitment to quality and customer 
                    satisfaction remains unchanged, and we've expanded our services to include custom 
                    automotive solutions that set us apart.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={image}
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover"
                />
                <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-2xl font-bold">Since 2009</div>
                  <div className="text-orange-100">Trusted Service</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <AnimatedSection direction="right" delay={500}>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-8 h-full">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                <Icons.Star className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-orange-100 text-lg leading-relaxed">
                To provide exceptional automotive repair and custom services with transparency, integrity, 
                and technical excellence, ensuring every customer drives away with confidence and peace of mind.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="left" delay={600}>
            <div className="bg-white rounded-3xl shadow-lg p-8 h-full border border-orange-100">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Icons.Shield className="text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                To be the most trusted automotive service and custom garage in our region, known for 
                unparalleled customer service, technical expertise, and innovative custom solutions.
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* Why Choose Us */}
        <AnimatedSection direction="up" delay={700}>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-3xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold mb-8 text-center">Why Choose RK AUTOS?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "ASE Certified Master Technicians",
                "State-of-the-Art Diagnostic Equipment",
                "Same-Day Service Available",
                "12-Month/12,000-Mile Warranty",
                "Transparent Pricing - No Hidden Fees",
                "Custom Automotive Solutions",
                "Free Loaner Vehicles Available",
                "24/7 Roadside Assistance",
                "Performance Upgrades & Modifications",
                "Vintage & Classic Car Specialists"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Icons.Check className="flex-shrink-0" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Custom Services Highlight */}
        <AnimatedSection direction="up" delay={800} className="mt-16">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Custom Garage Specialists</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Beyond standard repairs, we specialize in custom automotive solutions including performance upgrades, 
              restoration projects, and personalized modifications to make your vehicle truly unique.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Performance Tuning", description: "Engine optimization and power upgrades" },
                { title: "Custom Body Work", description: "Paint, wraps, and body modifications" },
                { title: "Restoration Projects", description: "Classic and vintage car restoration" }
              ].map((service, index) => (
                <div key={index} className="p-6 bg-orange-50 rounded-2xl border border-orange-200">
                  <h4 className="font-bold text-gray-900 mb-2">{service.title}</h4>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}