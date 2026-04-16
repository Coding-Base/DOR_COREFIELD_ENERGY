import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import image from './logork.jpg'

const Icons = {
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

interface NavigationProps {
  showRequestButton?: boolean;
}

export default function Navigation({ showRequestButton = false }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  const handleRequestSupport = () => {
    navigate('/contact')
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary">
              <img 
                src={image}
                alt="DOJ COREFIELD Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">DOJ COREFIELD ENERGY LIMITED</div>
              <div className="text-xs text-gray-600">Energy Services</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors text-sm">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-primary font-medium transition-colors text-sm">About</Link>
            <Link to="/services" className="text-gray-700 hover:text-primary font-medium transition-colors text-sm">Services</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary font-medium transition-colors text-sm">Contact</Link>
            <Link to="/privacy" className="text-gray-700 hover:text-primary font-medium transition-colors text-sm">Privacy</Link>
            <Link to="/profiles" className="text-gray-700 hover:text-primary font-medium transition-colors text-sm">Profiles</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {showRequestButton && (
              <button 
                onClick={handleRequestSupport}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-xl hover:opacity-95 transition-all duration-300 transform hover:scale-105 font-medium hidden md:block text-sm shadow-md"
              >
                Request Support
              </button>
            )}
            <button 
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-4 pb-4 border-t border-gray-200 pt-4">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-primary font-medium transition-colors py-2 text-sm"
                  onClick={handleNavClick}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-primary font-medium transition-colors py-2 text-sm"
                  onClick={handleNavClick}
                >
                  About
                </Link>
                <Link 
                  to="/services" 
                  className="text-gray-700 hover:text-primary font-medium transition-colors py-2 text-sm"
                  onClick={handleNavClick}
                >
                  Services
                </Link>
                <Link 
                  to="/contact" 
                  className="text-gray-700 hover:text-primary font-medium transition-colors py-2 text-sm"
                  onClick={handleNavClick}
                >
                  Contact
                </Link>
                <Link 
                  to="/privacy" 
                  className="text-gray-700 hover:text-primary font-medium transition-colors py-2 text-sm"
                  onClick={handleNavClick}
                >
                  Privacy
                </Link>
                <Link 
                  to="/profiles" 
                  className="text-gray-700 hover:text-primary font-medium transition-colors py-2 text-sm"
                  onClick={handleNavClick}
                >
                  Profiles
                </Link>
                {showRequestButton && (
                  <button 
                    onClick={handleRequestSupport}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl hover:opacity-95 transition-all duration-300 font-medium w-full text-center text-sm"
                  >
                    Request Support
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
