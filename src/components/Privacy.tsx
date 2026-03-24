import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import image from './logork.jpg'

const Icons = {
  Shield: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Lock: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Eye: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Document: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
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

export default function Privacy() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const privacySections = [
    {
      icon: <Icons.Eye />,
      title: "Information We Collect",
      content: "At RK AUTOS Custom Garage, we collect information that you provide directly to us, including:",
      items: [
        "Personal identification information (Name, email address, phone number)",
        "Vehicle information (make, model, year, VIN, modifications)",
        "Service history and maintenance records",
        "Payment information for completed services",
        "Communication preferences and feedback",
        "Custom project specifications and requirements"
      ]
    },
    {
      icon: <Icons.Document />,
      title: "How We Use Your Information",
      content: "We use the information we collect to:",
      items: [
        "Provide, maintain, and improve our automotive services",
        "Process transactions and send related information",
        "Send service reminders and maintenance notifications",
        "Manage custom project specifications and requirements",
        "Respond to your comments, questions, and requests",
        "Communicate about promotions, upcoming events, and news",
        "Monitor and analyze trends, usage, and activities"
      ]
    },
    {
      icon: <Icons.Shield />,
      title: "Information Sharing",
      content: "We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and trusted affiliates for the purposes outlined above."
    },
    {
      icon: <Icons.Lock />,
      title: "Data Security",
      content: "We implement appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, transaction information, and data stored on our systems."
    }
  ];

  const rights = [
    "Access and receive a copy of your personal data",
    "Rectify or update your personal data",
    "Request deletion of your personal data",
    "Restrict or object to our processing of your personal data",
    "Data portability",
    "Withdraw consent at any time"
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
                <div className="text-xl font-bold text-gray-900">DOJ COREFIELD ENERGY LIMITED</div>
                <div className="text-xs text-gray-600">Petroleum Services</div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Home</Link>
              <Link to="/services" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Services</Link>
              <Link to="/profiles" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Profiles</Link>
              <Link to="/contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Contact</Link>
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
                to="/about" 
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors py-2"
                onClick={handleNavClick}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors py-2"
                onClick={handleNavClick}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedSection direction="up" delay={200}>
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Icons.Shield className="text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Your privacy and data security are our top priorities at RK AUTOS
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Last Updated */}
        <AnimatedSection direction="up" delay={300}>
          <div className="bg-orange-500 text-white rounded-2xl p-6 text-center mb-12">
            <p className="text-lg font-semibold">Last updated: December 2024</p>
          </div>
        </AnimatedSection>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {privacySections.map((section, index) => (
            <AnimatedSection key={index} direction="up" delay={400 + index * 100}>
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <div className="text-orange-600">
                      {section.icon}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                  {section.content}
                </p>
                {section.items && (
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </AnimatedSection>
          ))}

          {/* Your Rights Section */}
          <AnimatedSection direction="up" delay={800}>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">Your Rights</h2>
              <p className="text-orange-100 mb-6 text-lg">
                You have the right to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rights.map((right, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>{right}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Information */}
          <AnimatedSection direction="up" delay={900}>
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <p className="text-gray-700 mb-6 text-lg">
                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">RK AUTOS Custom Garage</h3>
                    <p className="text-gray-600">123 Auto Street</p>
                    <p className="text-gray-600">Repair City, RC 12345</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Contact Details</h3>
                    <p className="text-gray-600">Email: privacy@rkautos.com</p>
                    <p className="text-gray-600">Phone: (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Policy Updates */}
          <AnimatedSection direction="up" delay={1000}>
            <div className="bg-orange-100 rounded-3xl p-8 border border-orange-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Policy Updates</h3>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new privacy policy on this page and updating the "Last updated" date.
              </p>
              <p className="text-gray-700">
                You are advised to review this privacy policy periodically for any changes. Changes to this 
                privacy policy are effective when they are posted on this page.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}