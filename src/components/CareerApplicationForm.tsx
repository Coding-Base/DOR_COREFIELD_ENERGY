import React, { useState } from 'react'

const Icons = {
  User: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
  FileText: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Briefcase: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4" />
    </svg>
  ),
  CheckCircle: (props: any) => (
    <svg {...props} className={`w-6 h-6 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChevronRight: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  ChevronLeft: (props: any) => (
    <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
}

interface FormData {
  name: string
  bio: string
  email: string
  phone: string
  experienceLevel: string
  position: string
  customPosition: string
  portfolioUrl: string
}

interface FormErrors {
  [key: string]: string
}

export default function CareerApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio: '',
    email: '',
    phone: '',
    experienceLevel: '',
    position: '',
    customPosition: '',
    portfolioUrl: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const oilGasPositions = [
    'Field Operations Engineer',
    'Pipeline Technician',
    'HSE Officer',
    'Inspection Specialist',
    'Drilling Support',
    'Equipment Maintenance',
    'Other',
  ]

  const experienceLevels = [
    'Entry-level',
    'Junior',
    'Mid-level',
    'Senior',
    'Lead/Principal',
    'Consultant',
  ]

  const validateStep1 = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required'
    } else if (formData.bio.length < 20) {
      newErrors.bio = 'Bio must be at least 20 characters'
    } else if (formData.bio.length > 300) {
      newErrors.bio = 'Bio must not exceed 300 characters'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: FormErrors = {}

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Experience level is required'
    }
    if (!formData.position) {
      newErrors.position = 'Position is required'
    }
    if (formData.position === 'Other' && !formData.customPosition.trim()) {
      newErrors.customPosition = 'Please specify your position'
    }
    if (formData.portfolioUrl && !/^https?:\/\/.+/.test(formData.portfolioUrl)) {
      newErrors.portfolioUrl = 'Please enter a valid URL (starting with http:// or https://)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(1)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep2()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID
      if (!formspreeId) {
        throw new Error('Formspree ID not configured')
      }

      const submissionData = {
        name: formData.name,
        bio: formData.bio,
        email: formData.email,
        phone: formData.phone,
        experienceLevel: formData.experienceLevel,
        position: formData.position === 'Other' ? formData.customPosition : formData.position,
        portfolioUrl: formData.portfolioUrl || 'Not provided',
      }

      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      })

      if (!res.ok) throw new Error('Failed to submit application')

      setSubmitSuccess(true)
      setFormData({
        name: '',
        bio: '',
        email: '',
        phone: '',
        experienceLevel: '',
        position: '',
        customPosition: '',
        portfolioUrl: '',
      })
      setErrors({})
      setCurrentStep(1)
    } catch (err) {
      console.error(err)
      setSubmitError('Failed to submit your application. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center py-12">
          <Icons.CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 text-lg mb-8">
            Thank you for applying! We've received your application and will review it shortly.
          </p>
          <p className="text-gray-500 mb-8">
            We'll contact you at the email or phone number you provided if we'd like to move forward.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all duration-300"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${currentStep >= 1 ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <span className="text-xs font-medium">Personal Info</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
          <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${currentStep >= 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <span className="text-xs font-medium">Experience</span>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Tell Us About Yourself</h2>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Full Name *</label>
              <div className="relative">
                <Icons.User className="absolute left-4 top-4 text-orange-600" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="text-red-600 text-sm mt-2">{errors.name}</p>}
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Professional Bio * ({formData.bio.length}/300)</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 300) })}
                className={`w-full px-4 py-3 border ${errors.bio ? 'border-red-300' : 'border-gray-300'} rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none`}
                placeholder="Tell us about your professional background and expertise"
                rows={4}
              />
              {errors.bio && <p className="text-red-600 text-sm mt-2">{errors.bio}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Email Address *</label>
              <div className="relative">
                <Icons.Mail className="absolute left-4 top-4 text-orange-600" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Phone Number *</label>
              <div className="relative">
                <Icons.Phone className="absolute left-4 top-4 text-orange-600" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                  placeholder="+234 (10+ digits)"
                />
              </div>
              {errors.phone && <p className="text-red-600 text-sm mt-2">{errors.phone}</p>}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-8">
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Next <Icons.ChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Experience & Portfolio */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Experience & Portfolio</h2>

            {/* Experience Level Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Experience Level *</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className={`w-full px-4 py-3 border ${errors.experienceLevel ? 'border-red-300' : 'border-gray-300'} rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white`}
              >
                <option value="">Select your experience level</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.experienceLevel && <p className="text-red-600 text-sm mt-2">{errors.experienceLevel}</p>}
            </div>

            {/* Position Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Position Applied For *</label>
              <div className="relative">
                <Icons.Briefcase className="absolute left-4 top-4 text-orange-600 pointer-events-none" />
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value, customPosition: '' })}
                  className={`w-full pl-12 pr-4 py-3 border ${errors.position ? 'border-red-300' : 'border-gray-300'} rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white appearance-none`}
                >
                  <option value="">Select a position</option>
                  {oilGasPositions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
              {errors.position && <p className="text-red-600 text-sm mt-2">{errors.position}</p>}
            </div>

            {/* Custom Position (only if "Other" is selected) */}
            {formData.position === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Your Position *</label>
                <textarea
                  value={formData.customPosition}
                  onChange={(e) => setFormData({ ...formData, customPosition: e.target.value })}
                  className={`w-full px-4 py-3 border ${errors.customPosition ? 'border-red-300' : 'border-gray-300'} rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none`}
                  placeholder="Describe the position you're interested in"
                  rows={3}
                />
                {errors.customPosition && <p className="text-red-600 text-sm mt-2">{errors.customPosition}</p>}
              </div>
            )}

            {/* Portfolio/CV URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Portfolio or CV URL (Optional)</label>
              <div className="relative">
                <Icons.FileText className="absolute left-4 top-4 text-orange-600" />
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 border ${errors.portfolioUrl ? 'border-red-300' : 'border-gray-300'} rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200`}
                  placeholder="https://example.com/portfolio"
                />
              </div>
              {errors.portfolioUrl && <p className="text-red-600 text-sm mt-2">{errors.portfolioUrl}</p>}
              <p className="text-xs text-gray-500 mt-2">Link to your GitHub, portfolio website, or CV document</p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-8">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={isSubmitting}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.ChevronLeft /> Previous
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
