// src/pages/TechnicianDashboard.tsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'

// Icons for a professional automotive technician interface
const Icons = {
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Vehicle: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Wrench: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  ChevronLeft: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  Loading: () => <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
  Status: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Open: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Email: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Menu: (props: any) => <svg {...props} className={`w-6 h-6 ${props.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>,
  Close: (props: any) => <svg {...props} className={`w-6 h-6 ${props.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
}

// Professional Card Component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    {children}
  </div>
)

// Professional Button Component
const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ children, variant = 'primary', loading = false, disabled = false, onClick, className = '' }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:text-gray-500",
    secondary: "bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:text-gray-500",
    outline: "border border-orange-500 hover:border-orange-600 text-orange-500 hover:text-orange-600 bg-white disabled:bg-gray-100 disabled:text-gray-400"
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Icons.Loading />}
      {children}
    </button>
  )
}

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    fixing: 'bg-orange-100 text-orange-800 border-orange-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const color = statusColors[status.toLowerCase() as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      <Icons.Status />
      <span className="ml-1 capitalize">{status}</span>
    </span>
  )
}

// Custom hook to fetch technician's assigned issues
const useTechnicianIssues = (registrationNumber: string | null, page: number = 1) => {
  return useQuery({
    queryKey: ['technician-issues', registrationNumber, page],
    queryFn: async () => {
      if (!registrationNumber) {
        return { results: [], count: 0 }
      }
      const response = await api.get(`/issues/assigned_to_technician/?tech=${registrationNumber}&page=${page}`)
      return response.data
    },
    enabled: !!registrationNumber,
    keepPreviousData: true
  })
}

// Custom hook to fetch vehicle details
const useVehicle = (vehicleId: string | number) => {
  return useQuery(
    ['vehicle', vehicleId],
    () => api.get(`/vehicles/${vehicleId}/`).then(res => res.data),
    { enabled: !!vehicleId }
  )
}

// Custom hook to fetch customer details
const useCustomer = (customerId: string | number) => {
  return useQuery(
    ['customer', customerId],
    () => api.get(`/customers/${customerId}/`).then(res => res.data),
    { enabled: !!customerId }
  )
}

// Custom hook to fetch vehicle model details - FIXED: Use model ID instead of object
const useVehicleModel = (modelId: string | number) => {
  return useQuery(
    ['vehicle-model', modelId],
    () => api.get(`/vehicle-models/${modelId}/`).then(res => res.data),
    { enabled: !!modelId }
  )
}

// Enhanced Issue Card Component
const IssueCard: React.FC<{ issue: any; techId?: string | number }> = ({ issue, techId }) => {
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(issue?.vehicle || '')
  const { data: customer, isLoading: customerLoading } = useCustomer(issue?.customer || '')
  // FIXED: Use vehicle?.model?.id instead of vehicle?.model
  const { data: vehicleModel, isLoading: modelLoading } = useVehicleModel(vehicle?.model?.id || '')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getVehicleModel = () => vehicleModel?.name || 'N/A'
  const getVehicleColor = () => {
    try {
      const color = vehicle?.color
      if (!color) return 'N/A'
      if (color.startsWith('{')) {
        const parsed = JSON.parse(color)
        return parsed.name || color
      }
      return color
    } catch {
      return vehicle?.color || 'N/A'
    }
  }
  const getVehiclePlate = () => vehicle?.plate_number || 'N/A'
  const getCustomerName = () => customer?.name || 'N/A'
  const getCustomerEmail = () => customer?.email || 'N/A'
  const getCustomerPhone = () => customer?.phone || 'N/A'

  const isLoading = vehicleLoading || customerLoading || modelLoading

  if (isLoading) {
    return <IssueCardSkeleton />
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Icons.Vehicle />
                Issue #{issue.id} - {getVehicleModel()}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={issue.status} />
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Icons.Calendar />
                  {formatDate(issue.created_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Vehicle & Customer Details</h4>
              <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="font-medium">Plate:</span> {getVehiclePlate()}
                  </div>
                  <div>
                    <span className="font-medium">Color:</span> {getVehicleColor()}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Owner:</span> {getCustomerName()}
                  </div>
                  {getCustomerEmail() !== 'N/A' && (
                    <div className="flex items-center gap-1">
                      <Icons.Email className="w-3 h-3" />
                      <span className="font-medium">Email:</span> {getCustomerEmail()}
                    </div>
                  )}
                  {getCustomerPhone() !== 'N/A' && (
                    <div className="flex items-center gap-1">
                      <Icons.Phone className="w-3 h-3" />
                      <span className="font-medium">Phone:</span> {getCustomerPhone()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Issue Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed bg-orange-50 rounded-lg p-3">
                {issue.description || 'No description provided.'}
              </p>
            </div>

            {issue.items && issue.items.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Required Items ({issue.items.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {issue.items.slice(0, 3).map((item: any, index: number) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-800 border border-orange-200">
                      {item.name}
                    </span>
                  ))}
                  {issue.items.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600 border border-gray-200">
                      +{issue.items.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <Link 
            to={`/issues/${issue.id}${techId ? `?techId=${encodeURIComponent(String(techId))}` : ''}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
          >
            <Icons.Open />
            Open Details
          </Link>
          
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Priority</div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              issue.priority === 'high' ? 'bg-red-100 text-red-800' :
              issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {issue.priority || 'normal'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Loading Skeleton Component
const IssueCardSkeleton: React.FC = () => (
  <Card className="p-6 animate-pulse">
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-12 bg-gray-100 rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:items-end">
        <div className="h-9 bg-gray-200 rounded w-24"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </Card>
)

export default function TechnicianDashboard() {
  const [page, setPage] = useState(1)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const [techInfo, setTechInfo] = useState<{ 
    id?: string | number;
    full_name?: string; 
    registration_number?: string;
    email?: string;
    photo?: string | null;
  } | null>(null)

  const { data, isLoading } = useTechnicianIssues(techInfo?.registration_number || null, page)

  // Helper to build image url
  const buildImageUrl = (photo: any) => {
    if (!photo) return null
    if (typeof photo === 'string' && (photo.startsWith('http://') || photo.startsWith('https://'))) {
      return photo
    }
    if (typeof photo === 'object' && photo !== null && typeof photo.url === 'string') {
      const u = photo.url
      if (u.startsWith('http://') || u.startsWith('https://')) return u
      if (u.startsWith('/')) {
        const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000'
        return `${API_BASE}${u}`
      }
      const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000'
      return `${API_BASE}/media/${u}`
    }
    if (typeof photo === 'string') {
      if (photo.startsWith('/')) {
        const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000'
        return `${API_BASE}${photo}`
      }
      const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000'
      return `${API_BASE}/media/${photo}`
    }
    return null
  }

  // fetch /auth/me/ to get technician info
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.get('/auth/me/')
        if (!cancelled && res?.data) {
          const tech = res.data?.technician || null
          setTechInfo({
            id: res.data?.id,
            full_name: tech?.full_name || res.data.username,
            registration_number: tech?.registration_number || '',
            email: res.data?.email || '',
            photo: buildImageUrl(tech?.photo)
          })
        }
      } catch (e) {
        console.error('Failed to fetch user info:', e)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const totalPages = Math.ceil((data?.count || 0) / 10)

  // Logout handler
  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem('refresh') || localStorage.getItem('token') || localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          await api.post('/auth/logout/', { refresh })
        } catch (e) {
          // ignore errors from logout endpoint
        }
      }

      // clear stored tokens & axios auth header
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      
      try {
        if (api && (api as any).defaults && (api as any).defaults.headers) {
          delete (api as any).defaults.headers.common['Authorization']
        }
      } catch (e) {
        // ignore
      }

      setTechInfo(null)
      navigate('/login')
    } catch (err) {
      setTechInfo(null)
      navigate('/login')
    }
  }

  return (
    <div className="flex h-screen bg-orange-50">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile, shown when mobileOpen is true */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-orange-900 to-orange-800 text-white p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">RK Autos</h1>
            <p className="text-orange-200 text-sm mt-1">Technician Portal</p>
          </div>
          <button 
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(false)}
          >
            <Icons.Close className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="mb-6 p-3 bg-white/5 rounded-md">
          {techInfo ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex-shrink-0">
                {techInfo.photo ? (
                  <img src={techInfo.photo} alt={techInfo.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="p-1.5 bg-orange-100 rounded-md flex items-center justify-center h-full">
                    <Icons.User />
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium">{techInfo.full_name}</div>
                <div className="text-xs text-orange-200">{techInfo.registration_number}</div>
                <div className="text-xs text-orange-300 mt-1">{techInfo.email}</div>
              </div>
            </div>
          ) : <div className="text-sm text-orange-200">Welcome, Technician</div>}
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <h3 className="text-xs uppercase tracking-wider text-orange-300 font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-orange-100 hover:bg-orange-700 hover:text-white"
            >
              <Icons.Vehicle />
              <span className="font-medium">My Issues</span>
            </button>
          </div>
        </nav>

        <div className="mt-6">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header with Hamburger */}
          <div className="mb-6 lg:mb-8 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 bg-orange-500 text-white rounded-lg"
                onClick={() => setMobileOpen(true)}
              >
                <Icons.Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-orange-900 mb-2">
                  Technician Dashboard
                </h1>
                <p className="text-orange-700 text-sm lg:text-base">
                  Automotive Repair & Maintenance
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {techInfo && (
                <div className="hidden lg:flex items-center gap-3 bg-orange-50 rounded-lg px-4 py-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex-shrink-0">
                    {techInfo.photo ? (
                      <img src={techInfo.photo} alt={techInfo.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="p-1.5 bg-orange-100 rounded-md flex items-center justify-center h-full">
                        <Icons.User />
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-orange-900">{techInfo.full_name}</div>
                    <div className="text-sm text-orange-700">{techInfo.registration_number}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Icons.Vehicle className="text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{data?.count || 0}</div>
                  <div className="text-sm text-gray-600">Total Assigned Issues</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Icons.Status className="text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {data?.results?.filter((issue: any) => 
                      ['pending', 'fixing'].includes(issue.status?.toLowerCase())
                    ).length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Active Issues</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Icons.Calendar className="text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {data?.results?.filter((issue: any) => 
                      issue.status?.toLowerCase() === 'completed'
                    ).length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Completed Issues</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Issues Section */}
          <Card className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Assigned Issues</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Manage and track all repair jobs assigned to you
                </p>
              </div>
              
              {data && data.count > 0 && (
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages || 1}
                  </span>
                </div>
              )}
            </div>

            {/* Issues List */}
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <IssueCardSkeleton key={index} />
                ))
              ) : data?.results?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Icons.Wrench className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Issues</h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    You don't have any repair issues assigned to you at the moment. 
                    New assignments will appear here automatically.
                  </p>
                </div>
              ) : (
                <>
                  {data?.results?.map((issue: any) => (
                    <IssueCard key={issue.id} issue={issue} techId={techInfo?.id} />
                  ))}

                  {/* Pagination */}
                  {data && data.count > 0 && (
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data.count)} of {data.count} issues
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="px-3 py-2"
                        >
                          <Icons.ChevronLeft />
                          Previous
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => setPage(p => p + 1)}
                          disabled={!data.next}
                          className="px-3 py-2"
                        >
                          Next
                          <Icons.ChevronRight />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

