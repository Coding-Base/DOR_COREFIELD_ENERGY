import React from 'react'
import { Link } from 'react-router-dom'

export default function Privacy() {
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
              <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: December 2024</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                At AutoPro Automotive, we collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Personal identification information (Name, email address, phone number)</li>
                <li>Vehicle information (make, model, year, VIN)</li>
                <li>Service history and maintenance records</li>
                <li>Payment information for completed services</li>
                <li>Communication preferences and feedback</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide, maintain, and improve our automotive services</li>
                <li>Process transactions and send related information</li>
                <li>Send service reminders and maintenance notifications</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Communicate about promotions, upcoming events, and other news</li>
                <li>Monitor and analyze trends, usage, and activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700">
                We do not sell, trade, or rent your personal identification information to others. 
                We may share generic aggregated demographic information not linked to any personal 
                identification information regarding visitors and users with our business partners 
                and trusted affiliates for the purposes outlined above.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate data collection, storage, and processing practices and 
                security measures to protect against unauthorized access, alteration, disclosure, 
                or destruction of your personal information, transaction information, and data 
                stored on our systems.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify or update your personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Restrict or object to our processing of your personal data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-100 rounded-xl">
                <p className="text-gray-700">AutoPro Automotive</p>
                <p className="text-gray-700">123 Auto Street, Repair City, RC 12345</p>
                <p className="text-gray-700">Email: privacy@autopro.com</p>
                <p className="text-gray-700">Phone: (555) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}