import React, { useEffect, useState } from 'react'
import api from '../api/client'
import { useNavigate, Link } from 'react-router-dom'

// Professional Icons
const Icons = {
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Wrench: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Camera: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Email: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Phone: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Lock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Briefcase: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
}

export default function TechnicianRegister() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [employment, setEmployment] = useState('staff')
  const [skills, setSkills] = useState<string[]>([])
  const [dob, setDob] = useState('')
  const [expertise, setExpertise] = useState<string[]>([])
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [availableSkills, setAvailableSkills] = useState<any[]>([])
  const [availableModels, setAvailableModels] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const fd = new FormData()
      fd.append('full_name', fullName)
      fd.append('email', email)
      fd.append('phone', phone)
      fd.append('password', password)
      fd.append('employment_status', employment)
      skills.forEach(s => fd.append('skills', s))
      expertise.forEach(x => fd.append('expertise', x))
      if (dob) fd.append('dob', dob)
      if (photo) fd.append('photo', photo)

      const res = await api.post('/auth/technician-register/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        skipAuth: true
      })

      if (res.data.access) localStorage.setItem('access', res.data.access)
      if (res.data.refresh) localStorage.setItem('refresh', res.data.refresh)
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // fetch skills and vehicle models
    ;(async () => {
      try {
        const sk = await api.get('/skills/')
        setAvailableSkills(sk.data)
      } catch (e) { console.error(e) }
      try {
        const vm = await api.get('/vehicle-models/')
        setAvailableModels(vm.data)
      } catch (e) { console.error(e) }
    })()
  }, [])

  // revoke object URL when preview changes/unmount
  useEffect(() => {
    return () => {
      if (photoPreview) {
        try { URL.revokeObjectURL(photoPreview) } catch (e) { /* ignore */ }
      }
    }
  }, [photoPreview])

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files ? e.target.files[0] : null
    setPhoto(f)
    if (f) {
      const url = URL.createObjectURL(f)
      setPhotoPreview(url)
    } else {
      setPhotoPreview(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Icons.Wrench className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Team</h1>
          <p className="text-gray-600">Create your technician account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Personal Information</label>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.User className="text-gray-400" />
                  </div>
                  <input 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    placeholder="Full name" 
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Email className="text-gray-400" />
                  </div>
                  <input 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Email address" 
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Phone className="text-gray-400" />
                  </div>
                  <input 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="Phone number" 
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Lock className="text-gray-400" />
                  </div>
                  <input 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Password" 
                    type="password" 
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Employment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Icons.Briefcase />
                Employment Status
              </label>
              <select 
                value={employment} 
                onChange={e => setEmployment(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors"
              >
                <option value="staff">Staff Technician</option>
                <option value="contract">Contract Technician</option>
              </select>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Technical Skills</label>
              <div className="grid grid-cols-2 gap-3">
                {(availableSkills.length > 0 ? availableSkills : [{id:1,name:'Mechanic'},{id:2,name:'Rewire'},{id:3,name:'Painter'},{id:4,name:'Car Upgrade'}]).map((s:any) => (
                  <label key={s.id} className="flex items-center p-3 border border-gray-300 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      value={s.name} 
                      checked={skills.includes(s.name)} 
                      onChange={e => {
                        const val = e.target.value
                        setSkills(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
                      }} 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span className="text-sm text-gray-700">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Expertise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Expertise</label>
              <div className="grid grid-cols-2 gap-3">
                {(availableModels.length > 0 ? availableModels : [{id:1,name:'Toyota'},{id:2,name:'Honda'},{id:3,name:'Ford'},{id:4,name:'BMW'},{id:5,name:'Nissan'}]).map((m:any) => (
                  <label key={m.id} className="flex items-center p-3 border border-gray-300 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      value={m.name} 
                      checked={expertise.includes(m.name)} 
                      onChange={e => {
                        const val = e.target.value
                        setExpertise(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
                      }} 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span className="text-sm text-gray-700">{m.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Icons.Calendar />
                Date of Birth
              </label>
              <input 
                type="date" 
                value={dob} 
                onChange={e => setDob(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Icons.Camera />
                Profile Photo
              </label>
              <div className="space-y-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {photoPreview && (
                  <div className="flex justify-center">
                    <img src={photoPreview} alt="preview" className="w-32 h-32 object-cover rounded-2xl border-4 border-white shadow-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <Icons.Check />
                  Create Technician Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}