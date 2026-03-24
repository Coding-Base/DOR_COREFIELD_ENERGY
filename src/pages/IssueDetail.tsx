// src/pages/IssueDetail.tsx
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/client'
import Modal from '../components/Modal'

// Icons for professional automotive interface
const Icons: Record<string, any> = {
  Vehicle: (props: any) => <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Wrench: (props: any) => <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Calendar: (props: any) => <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  User: (props: any) => <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Photo: (props: any) => <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Download: (props: any) => <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Plus: (props: any) => <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Loading: (props: any) => <svg {...props} className={`animate-spin h-5 w-5 ${props?.className || ''}`} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
  External: (props: any) => <svg {...props} className={`w-4 h-4 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Email: (props: any) => <svg {...props} className={`w-4 h-4 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Phone: (props: any) => <svg {...props} className={`w-4 h-4 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  ArrowLeft: (props: any) => <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  ClipboardList: (props: any) => <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  DocumentText: (props: any) => <svg {...props} className={`w-5 h-5 ${props?.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
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

  const color = statusColors[status?.toLowerCase?.() as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
      {status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'Unknown'}
    </span>
  )
}

// Custom hook to fetch issue details
const useIssue = (id: string) => {
  return useQuery({
    queryKey: ['issue', id],
    queryFn: () => api.get(`/issues/${id}/`).then(res => res.data),
    enabled: !!id,
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

// Custom hook to fetch vehicle model details
const useVehicleModel = (modelId: string | number) => {
  return useQuery(
    ['vehicle-model', modelId],
    () => api.get(`/vehicle-models/${modelId}/`).then(res => res.data),
    { enabled: !!modelId }
  )
}

// Custom hook to change issue status
const useChangeStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string | undefined; status: string }) =>
      api.post(`/issues/${id}/change_status/`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue'] })
      queryClient.invalidateQueries({ queryKey: ['technician-issues'] })
    }
  })
}

// Custom hook to add treatment
const useAddTreatment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { issue: string | undefined; description: string }) =>
      api.post('/treatments/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue'] })
    }
  })
}

// Custom hook to add item (now supports quantity)
const useAddItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { issue_id: string | undefined; name: string; amount: string | number; quantity?: number }) =>
      api.post('/items/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue'] })
    }
  })
}

// Custom hook to add recommendation
const useAddRecommendation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { issue: string | undefined; text: string }) =>
      api.post('/recommendations/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue'] })
    }
  })
}

export default function IssueDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  // read techId from query params (if present)
  const searchParams = new URLSearchParams(location.search)
  const techId = searchParams.get('techId')

  const {
    data: issue,
    isLoading: issueLoading,
    isError: issueIsError,
    error: issueError
  } = useIssue(id || '')

  // Fetch additional data
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(issue?.vehicle || '')
  const { data: customer, isLoading: customerLoading } = useCustomer(issue?.customer || '')
  const { data: vehicleModel, isLoading: modelLoading } = useVehicleModel(vehicle?.model?.id || '')

  const changeStatus = useChangeStatus()
  const addTreatment = useAddTreatment()
  const addItem = useAddItem()
  const addRec = useAddRecommendation()

  const [imgModalOpen, setImgModalOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [treatmentText, setTreatmentText] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemAmount, setItemAmount] = useState('')

  const [itemQuantity, setItemQuantity] = useState('1')
  const [recText, setRecText] = useState('')

  // if API returns 401 (unauthenticated) redirect to login preserving next
  useEffect(() => {
    if (!issueIsError || !issueError) return

    const statusCode = (issueError as any)?.response?.status || (issueError as any)?.status
    if (statusCode === 401) {
      const next = window.location.pathname + window.location.search
      navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true })
    }
  }, [issueIsError, issueError, navigate])

  //Check if the user is admin
  const isAdmin = localStorage.getItem('role') === 'admin';

  // New State For Tab
  const [activeTab, setActiveTab] = useState<'treatments' | 'items' | 'recommendations'>('treatments');

  const handleTabChange = (tab: 'treatments' | 'items' | 'recommendations') => {
    setActiveTab(tab);
  };

  const isLoading = issueLoading || vehicleLoading || customerLoading || modelLoading

  // small util to format ISO dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown'
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return String(dateString)
    }
  }

  // helper getters used in JSX (keeps parity with TechnicianDashboard helpers)
  const getVehicleModel = () => vehicleModel?.name || 'N/A'
  const getVehiclePlate = () => vehicle?.plate_number || 'N/A'
  const getVehicleColor = () => {
    try {
      const c = vehicle?.color
      if (!c) return 'N/A'
      if (String(c).trim().startsWith('{')) {
        const parsed = JSON.parse(String(c))
        return parsed.name || String(c)
      }
      return c
    } catch {
      return vehicle?.color || 'N/A'
    }
  }
  const getCustomerName = () => customer?.name || 'N/A'
  const getCustomerEmail = () => customer?.email || 'N/A'
  const getCustomerPhone = () => customer?.phone || 'N/A'

  // derive vehicle photo url safely
  const vehiclePhotoUrl = vehicle?.photo ? (vehicle.photo.startsWith('http') ? vehicle.photo : `${import.meta.env.VITE_API_BASE?.replace(/\/api\/?$/, '') || ''}${vehicle.photo}`) : null

  // unified go-back handler that checks for techId param
  const handleGoBack = () => {
    if (techId) {
      navigate(`/tech/${encodeURIComponent(techId)}`)
    } else {
      navigate('/login')
    }
  }

  // Handler to add item (with quantity)
  const handleAddItem = () => {
    if (!itemName.trim() || !itemAmount.trim()) {
      alert('Please enter both item name and amount')
      return
    }
    const qty = parseInt(itemQuantity || '1', 10) || 1
    if (qty <= 0) {
      alert('Quantity must be at least 1')
      return
    }
    // send issue_id because backend ItemSerializer expects issue_id write field
    addItem.mutate({ issue_id: id, name: itemName.trim(), amount: parseFloat(itemAmount), quantity: qty })
    setItemName('')
    setItemAmount('')
    setItemQuantity('1')
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={handleGoBack}
                className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors lg:hidden"
                aria-label="Go back"
              >
                <Icons.ArrowLeft />
              </button>
              <div className="p-3 bg-orange-500 rounded-lg hidden lg:block">
                <Icons.Wrench className="text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl lg:text-2xl font-bold text-orange-900">Issue #{issue.id}</h1>
                <p className="text-orange-700 mt-1 text-sm lg:text-base">Repair & Maintenance Details</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3">
                  <StatusBadge status={issue.status} />
                  <span className="text-sm text-orange-600 flex items-center gap-1">
                    <Icons.Calendar />
                    Created {formatDate(issue.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="hidden lg:inline-flex"
              >
                ← Go back to Technician Dashboard
              </Button>

            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${activeTab === 'treatments' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
              onClick={() => handleTabChange('treatments')}
            >
              Treatment
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${activeTab === 'items' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
              onClick={() => handleTabChange('items')}
            >
              Items/Parts
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${activeTab === 'recommendations' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
              onClick={() => handleTabChange('recommendations')}
            >
              Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Issue Details & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Overview Card */}
            <Card className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Overview</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Vehicle Model</label>
                        <p className="mt-1 text-gray-900">{getVehicleModel()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">License Plate</label>
                        <p className="mt-1 text-gray-900 font-mono">{getVehiclePlate()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Vehicle Color</label>
                        <p className="mt-1 text-gray-900">{getVehicleColor()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Customer</label>
                        <p className="mt-1 text-gray-900 flex items-center gap-2">
                          <Icons.User />
                          {getCustomerName()}
                        </p>
                        <div className="mt-2 space-y-1">
                          {getCustomerEmail() !== 'N/A' && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Icons.Email />
                              {getCustomerEmail()}
                            </p>
                          )}
                          {getCustomerPhone() !== 'N/A' && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Icons.Phone />
                              {getCustomerPhone()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Issue Description</label>
                      <p className="mt-2 p-4 bg-orange-50 rounded-lg text-gray-700 leading-relaxed">
                        {issue.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Linked Issues */}
                    {issue.linked_issues && issue.linked_issues.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Linked Issues</label>
                        <div className="mt-2 space-y-2">
                          {issue.linked_issues.map((li: any) => (
                            <div key={li.id} className="p-2 bg-orange-50 rounded border border-orange-200 flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium">{li.title || `(Issue #${li.id})`}</div>
                                <div className="text-xs text-orange-600">Status: {li.status || '—'}</div>
                              </div>
                              <div>
                                <button
                                  onClick={() => navigate(`/issues/${li.id}${techId ? `?techId=${encodeURIComponent(techId)}` : ''}`)}
                                  className="text-xs text-orange-600 underline"
                                >
                                  Open
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assigned Technician */}
                    {issue.assigned_to && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Assigned Technician</label>
                        <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
                          <p className="text-sm text-gray-700">
                            {issue.assigned_to.full_name || issue.assigned_to.registration_number}
                            {issue.assigned_to.registration_number && (
                              <span className="text-orange-600 ml-2">
                                ({issue.assigned_to.registration_number})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Photo */}
                <div className="lg:w-48">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Icons.Photo />
                    Vehicle Photo
                  </h3>
                  {vehiclePhotoUrl ? (
                    <button
                      onClick={() => setImgModalOpen(true)}
                      className="w-full block rounded-lg overflow-hidden border border-orange-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <img
                        src={vehiclePhotoUrl}
                        alt={`Vehicle ${getVehiclePlate()}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2 bg-orange-50 text-xs text-orange-600 text-center">
                        Click to preview
                      </div>
                    </button>
                  ) : (
                    <div className="w-full h-32 flex flex-col items-center justify-center bg-orange-50 border border-orange-200 rounded-lg text-orange-500">
                      <Icons.Photo />
                      <span className="text-sm">No photo available</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Status Update Card */}
            <Card className="p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="flex-1 px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select new status...</option>
                  <option value="pending">Pending</option>
                  <option value="fixing">Fixing</option>
                  <option value="completed">Completed</option>
                </select>
                <Button
                  variant="primary"
                  loading={changeStatus.isLoading}
                  onClick={() => {
                    if (!status) { alert('Please select a status'); return }
                    changeStatus.mutate({ id, status })
                    setStatus('')
                  }}
                  disabled={!status}
                >
                  Update Status
                </Button>
              </div>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Add Treatment */}
              {activeTab === 'treatments' && (
              <Card className="p-4 lg:p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icons.Wrench />
                  Add Treatment
                </h4>
                <textarea
                  value={treatmentText}
                  onChange={e => setTreatmentText(e.target.value)}
                  placeholder="Describe the treatment performed..."
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-32 resize-none"
                />
                <Button
                  variant="primary"
                  loading={addTreatment.isLoading}
                  onClick={() => {
                    if (!treatmentText.trim()) {
                      alert('Please enter treatment description');
                      return;
                    }
                    addTreatment.mutate({ issue: id, description: treatmentText });
                    setTreatmentText('')
                  }}
                  className="w-full mt-3"
                >
                  <Icons.Plus />
                  Add Treatment
                </Button>
              </Card>
              )}

              {/* Add Item (now with quantity) */}
              {activeTab === 'items' && (
              <Card className="p-4 lg:p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icons.Plus />
                  Add Item
                </h4>
                <input
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  placeholder="Item name"
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-3"
                />
                <input
                  value={itemAmount}
                  onChange={e => setItemAmount(e.target.value)}
                  placeholder="Unit amount (e.g. 25.00)"
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-3"
                />
                <input
                  value={itemQuantity}
                  onChange={e => setItemQuantity(e.target.value)}
                  placeholder="Quantity"
                  type="number"
                  min={1}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-3"
                />
                <Button
                  variant="primary"
                  loading={addItem.isLoading}
                  onClick={handleAddItem}
                  className="w-full"
                >
                  <Icons.Plus />
                  Add Item
                </Button>
              </Card>
              )}

              {/* Add Recommendation */}
              {activeTab === 'recommendations' && (
              <Card className="p-4 lg:p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icons.External />
                  Recommendation
                </h4>
                <textarea
                  value={recText}
                  onChange={e => setRecText(e.target.value)}
                  placeholder="Add recommendations for the customer..."
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-32 resize-none"
                />
                <Button
                  variant="outline"
                  loading={addRec.isLoading}
                  onClick={() => {
                    if (!recText.trim()) {
                      alert('Please enter recommendation text');
                      return;
                    }
                    addRec.mutate({ issue: id, text: recText });
                    setRecText('')
                  }}
                  className="w-full mt-3"
                >
                  <Icons.Plus />
                  Add Recommendation
                </Button>
              </Card>
              )}
            </div>
          </div>

          {/* Right Column - Activity & Details */}
          <div className="space-y-6">
            {/* Treatments */}
            {activeTab === 'treatments' && (
            <Card className="p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatments ({issue.treatments?.length || 0})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {!issue.treatments || issue.treatments.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No treatments recorded yet</p>
                ) : (
                  issue.treatments.map((t: any) => (
                    <div key={t.id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <p className="text-sm text-gray-700">{t.description}</p>
                      {t.created_at && (
                        <p className="text-xs text-orange-600 mt-2">
                          {formatDate(t.created_at)}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
            )}

            {/* Items */}
            {activeTab === 'items' && (
            <Card className="p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parts & Items ({issue.items?.length || 0})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {!issue.items || issue.items.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No items added yet</p>
                ) : (
                  issue.items.map((it: any) => {
                    const unit = parseFloat(it.amount || 0)
                    const qty = it.quantity || 1
                    const lineTotal = (unit * qty)
                    return (
                      <div key={it.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                        <div>
                          <div className="font-medium text-gray-700">{it.name}</div>
                          <div className="text-xs text-gray-500">Qty: {qty} × ${unit.toFixed(2)}</div>
                        </div>
                        <div className="text-green-600 font-semibold">${lineTotal.toFixed(2)}</div>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>
            )}

            {/* Recommendations */}
            {activeTab === 'recommendations' && (
            <Card className="p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations ({issue.recommendations?.length || 0})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {!issue.recommendations || issue.recommendations.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No recommendations yet</p>
                ) : (
                  issue.recommendations.map((r: any) => (
                    <div key={r.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <p className="text-sm text-gray-700">{r.text}</p>
                      {r.created_at && (
                        <p className="text-xs text-yellow-600 mt-2">
                          {formatDate(r.created_at)}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal open={imgModalOpen} onClose={() => setImgModalOpen(false)} title={`Vehicle ${getVehiclePlate()}`}>
        <div className="flex flex-col items-center gap-6">
          {vehiclePhotoUrl ? (
            <>
              <img
                src={vehiclePhotoUrl}
                alt={`Vehicle ${getVehiclePlate()}`}
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href={vehiclePhotoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.External />
                  Open in New Tab
                </a>
                <a
                  href={vehiclePhotoUrl}
                  download={`vehicle_${getVehiclePlate()}`}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.Download />
                  Download
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Icons.Photo />
              <p className="text-gray-600">No photo available</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
