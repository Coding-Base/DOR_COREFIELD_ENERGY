import React from 'react'
import { Link } from 'react-router-dom'

const Icons = {
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Star: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
}

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                AP
              </div>
              <span className="text-xl font-bold text-gray-900">AutoPro</span>
            </Link>
            <div className="flex gap-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
              <Link to="/privacy" className="text-gray-700 hover:text-blue-600">Privacy</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About AutoPro</h1>
          <p className="text-xl text-gray-600">Excellence in automotive care since 2009</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Founded in 2009 by James Wilson, AutoPro started as a small neighborhood garage with 
            a big vision: to provide honest, reliable, and expert automotive care to our community. 
            What began as a one-man operation has grown into a team of certified professionals 
            serving thousands of satisfied customers.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Today, we continue to uphold our founding principles while embracing the latest 
            automotive technology and repair techniques. Our commitment to quality and customer 
            satisfaction remains unchanged.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To provide exceptional automotive repair services with transparency, integrity, 
              and technical excellence, ensuring every customer drives away with confidence 
              and peace of mind.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To be the most trusted automotive service center in our region, known for 
              unparalleled customer service, technical expertise, and community commitment.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "ASE Certified Master Technicians",
              "State-of-the-Art Diagnostic Equipment",
              "Same-Day Service Available",
              "12-Month/12,000-Mile Warranty",
              "Transparent Pricing - No Hidden Fees",
              "Eco-Friendly Practices",
              "Free Loaner Vehicles Available",
              "24/7 Roadside Assistance"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Icons.Check className="flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}