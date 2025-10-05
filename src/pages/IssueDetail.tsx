// src/pages/IssueDetail.tsx
import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Modal from '../components/Modal'
import { useIssue } from '../api/hooks'
import { useAddTreatment, useAddItem, useAddRecommendation, useChangeStatus } from '../api/hooks'
import api from '../api/client'
import { useQuery } from '@tanstack/react-query'

// Icons for professional automotive interface
const Icons = {
  Vehicle: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Wrench: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Photo: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Loading: () => <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
  External: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Email: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
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
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:text-gray-500",
    secondary: "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:text-gray-500",
    outline: "border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-400"
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
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    fixing: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const color = statusColors[status?.toLowerCase?.() || ''] || 'bg-gray-100 text-gray-800 border-gray-200'

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
      {status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'Unknown'}
    </span>
  )
}

// Custom hook to fetch vehicle details
const useVehicle = (vehicleId: string | number | undefined) => {
  return useQuery(
    ['vehicle', vehicleId],
    () => api.get(`/vehicles/${vehicleId}/`).then(res => res.data),
    { enabled: !!vehicleId }
  )
}

// Custom hook to fetch customer details
const useCustomer = (customerId: string | number | undefined) => {
  return useQuery(
    ['customer', customerId],
    () => api.get(`/customers/${customerId}/`).then(res => res.data),
    { enabled: !!customerId }
  )
}

// Custom hook to fetch vehicle model details
const useVehicleModel = (modelId: string | number | undefined) => {
  return useQuery(
    ['vehicle-model', modelId],
    () => api.get(`/vehicle-models/${modelId}/`).then(res => res.data),
    { enabled: !!modelId }
  )
}

export default function IssueDetail() {
  const { id } = useParams()
  const { data: issue, isLoading: issueLoading } = useIssue(id || '')

  // Fetch additional data
  const vehicleId = issue?.vehicle?.id || issue?.vehicle
  const customerId = issue?.customer?.id || issue?.customer
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(vehicleId)
  const { data: customer, isLoading: customerLoading } = useCustomer(customerId)
  const modelId = vehicle?.model || issue?.vehicle?.model || undefined
  const { data: vehicleModel, isLoading: modelLoading } = useVehicleModel(modelId)

  const changeStatus = useChangeStatus()
  const addTreatment = useAddTreatment()
  const addItem = useAddItem()
  const addRec = useAddRecommendation()

  const [imgModalOpen, setImgModalOpen] = useState(false)
  const [status, setStatus] = useState('')
  const [treatmentText, setTreatmentText] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemAmount, setItemAmount] = useState('')
  const [recText, setRecText] = useState('')

  const isLoading = issueLoading || vehicleLoading || customerLoading || modelLoading

  // Normalize possible linked issue fields into an array of IDs
  const resolveLinkedIds = (): number[] => {
    if (!issue) return []
    const possible = (issue.linked_issue ?? issue.linked_issues ?? issue.linked ?? null)
    if (!possible) return []
    if (Array.isArray(possible)) return possible.map((x: any) => Number(x)).filter(Boolean)
    if (typeof possible === 'number') return [possible]
    if (typeof possible === 'string') {
      // maybe a single numeric string or comma-separated
      if (possible.indexOf(',') !== -1) {
        return possible.split(',').map(s => Number(s.trim())).filter(Boolean)
      }
      const n = Number(possible)
      return Number.isFinite(n) ? [n] : []
    }
    return []
  }

  const linkedIds = resolveLinkedIds()

  // Fetch linked issue summaries (single query that loads all linked ids)
  const linkedIssuesQ = useQuery(
    ['linked-issues', linkedIds.join(',')],
    async () => {
      if (linkedIds.length === 0) return []
      const promises = linkedIds.map(id => api.get(`/issues/${id}/`).then(r => r.data))
      const results = await Promise.all(promises)
      return results
    },
    { enabled: linkedIds.length > 0 }
  )

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Icons.Loading />
        <p className="mt-2 text-gray-600">Loading issue details...</p>
      </div>
    </div>
  )

  if (!issue) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icons.Vehicle />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Issue Not Found</h2>
        <p className="text-gray-600">The requested issue could not be found.</p>
      </div>
    </div>
  )

  /**
   * Build a usable image URL from the `photo` value the API returns.
   */
  const buildImageUrl = (photo: any) => {
    if (!photo) return null
    if (typeof photo === 'string' && (photo.startsWith('http://') || photo.startsWith('https://'))) {
      return photo
    }
    if (typeof photo === 'object' && photo !== null && typeof photo.url === 'string') {
      const u = photo.url
      if (u.startsWith('http://') || u.startsWith('https://')) return u
      if (u.startsWith('/')) {
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
        return `${API_BASE}${u}`
      }
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
      return `${API_BASE}/media/${u}`
    }
    if (typeof photo === 'string') {
      if (photo.startsWith('/')) {
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
        return `${API_BASE}${photo}`
      }
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
      return `${API_BASE}/media/${photo}`
    }
    return null
  }

  const vehiclePhotoUrl = buildImageUrl(vehicle?.photo ?? issue?.vehicle?.photo)

  const handleDownloadInvoice = async () => {
    try {
      if (!issue || !issue.invoices || issue.invoices.length === 0) {
        alert('No invoice found for this issue')
        return
      }
      const invId = issue.invoices[0].id
      const resp = await api.get(`/invoices/${invId}/pdf/`, { responseType: 'blob' })
      const blob = resp.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice_${invId}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Download failed. Please try again.')
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Helper functions to safely access data
  const getVehicleModel = () => vehicleModel?.name || issue?.vehicle?.model?.name || 'N/A'
  const getVehicleColor = () => vehicle?.color || issue?.vehicle?.color || 'N/A'
  const getVehiclePlate = () => vehicle?.plate_number || issue?.vehicle?.plate_number || 'N/A'
  const getCustomerName = () => customer?.name || issue?.customer?.name || 'N/A'
  const getCustomerEmail = () => customer?.email || issue?.customer?.email || 'N/A'
  const getCustomerPhone = () => customer?.phone || issue?.customer?.phone || 'N/A'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Icons.Wrench />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Issue #{issue.id}</h1>
                <p className="text-gray-600 mt-1">Repair & Maintenance Details</p>
                <div className="flex items-center gap-4 mt-3">
                  <StatusBadge status={issue.status} />
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Icons.Calendar />
                    Created {formatDate(issue.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {issue.invoices?.length > 0 && (
              <Button
                variant="secondary"
                onClick={handleDownloadInvoice}
                className="lg:self-start"
              >
                <Icons.Download />
                Download Invoice
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Issue Details & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Overview Card */}
            <Card className="p-6">
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
                      <p className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700 leading-relaxed">
                        {issue.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Assigned Technician */}
                    {issue.assigned_to && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Assigned Technician</label>
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-sm text-gray-700">
                            {issue.assigned_to.full_name || issue.assigned_to.registration_number}
                            {issue.assigned_to.registration_number && (
                              <span className="text-gray-500 ml-2">
                                ({issue.assigned_to.registration_number})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Linked Issues */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Linked Issue(s)</label>
                      <div className="mt-2">
                        {linkedIds.length === 0 ? (
                          <p className="text-sm text-gray-500">No linked issues</p>
                        ) : linkedIssuesQ.isLoading ? (
                          <div className="text-sm text-gray-500 flex items-center gap-2"><Icons.Loading /> Loading linked issues...</div>
                        ) : (linkedIssuesQ.data && linkedIssuesQ.data.length > 0) ? (
                          <div className="space-y-2">
                            {linkedIssuesQ.data.map((li: any) => (
                              <Link
                                key={li.id}
                                to={`/issues/${li.id}`}
                                className="block p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                              >
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Issue #{li.id} - {li.vehicle?.model?.name || li.vehicle?.model || 'Model'}</div>
                                    <div className="text-sm text-gray-600 mt-1">{(li.description || '').slice(0, 100)}{(li.description || '').length > 100 ? '…' : ''}</div>
                                  </div>
                                  <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                    {formatDate(li.created_at)}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Linked issue(s) not found</p>
                        )}
                      </div>
                    </div>
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
                      className="w-full block rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <img
                        src={vehiclePhotoUrl}
                        alt={`Vehicle ${getVehiclePlate()}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2 bg-gray-50 text-xs text-gray-600 text-center">
                        Click to preview
                      </div>
                    </button>
                  ) : (
                    <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
                      <Icons.Photo />
                      <span className="text-sm mt-2">No photo available</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Status Update Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Add Treatment */}
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icons.Wrench />
                  Add Treatment
                </h4>
                <textarea
                  value={treatmentText}
                  onChange={e => setTreatmentText(e.target.value)}
                  placeholder="Describe the treatment performed..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                />
                <Button
                  variant="primary"
                  loading={addTreatment.isLoading}
                  onClick={() => {
                    if (!treatmentText.trim()) {
                      alert('Please enter treatment description')
                      return
                    }
                    addTreatment.mutate({ issue: id, description: treatmentText })
                    setTreatmentText('')
                  }}
                  className="w-full mt-3"
                >
                  <Icons.Plus />
                  Add Treatment
                </Button>
              </Card>

              {/* Add Item */}
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icons.Plus />
                  Add Item
                </h4>
                <input
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  placeholder="Item name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                />
                <input
                  value={itemAmount}
                  onChange={e => setItemAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                />
                <Button
                  variant="primary"
                  loading={addItem.isLoading}
                  onClick={() => {
                    if (!itemName.trim() || !itemAmount.trim()) {
                      alert('Please enter both item name and amount')
                      return
                    }
                    addItem.mutate({ issue: id, name: itemName, amount: itemAmount })
                    setItemName('')
                    setItemAmount('')
                  }}
                  className="w-full"
                >
                  <Icons.Plus />
                  Add Item
                </Button>
              </Card>

              {/* Add Recommendation */}
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Icons.External />
                  Recommendation
                </h4>
                <textarea
                  value={recText}
                  onChange={e => setRecText(e.target.value)}
                  placeholder="Add recommendations for the customer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                />
                <Button
                  variant="outline"
                  loading={addRec.isLoading}
                  onClick={() => {
                    if (!recText.trim()) {
                      alert('Please enter recommendation text')
                      return
                    }
                    addRec.mutate({ issue: id, text: recText })
                    setRecText('')
                  }}
                  className="w-full mt-3"
                >
                  <Icons.Plus />
                  Add Recommendation
                </Button>
              </Card>
            </div>
          </div>

          {/* Right Column - Activity & Details */}
          <div className="space-y-6">
            {/* Treatments */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatments ({issue.treatments?.length || 0})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {!issue.treatments || issue.treatments.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No treatments recorded yet</p>
                ) : (
                  issue.treatments.map((t: any) => (
                    <div key={t.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-gray-700">{t.description}</p>
                      {t.created_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(t.created_at)}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Items */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parts & Items ({issue.items?.length || 0})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {!issue.items || issue.items.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No items added yet</p>
                ) : (
                  issue.items.map((it: any) => (
                    <div key={it.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                      <span className="font-medium text-gray-700">{it.name}</span>
                      <span className="text-green-600 font-semibold">${parseFloat(it.amount || 0).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations ({issue.recommendations?.length || 0})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {!issue.recommendations || issue.recommendations.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No recommendations yet</p>
                ) : (
                  issue.recommendations.map((r: any) => (
                    <div key={r.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <p className="text-sm text-gray-700">{r.text}</p>
                      {r.created_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(r.created_at)}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
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
              <div className="flex gap-3">
                <a
                  href={vehiclePhotoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Icons.External />
                  Open in New Tab
                </a>
                <a
                  href={vehiclePhotoUrl}
                  download={`vehicle_${getVehiclePlate()}`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Icons.Download />
                  Download
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Icons.Photo className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No photo available</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
