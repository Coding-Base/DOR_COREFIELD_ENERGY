// src/pages/AdminDashboard.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Modal from '../components/Modal'
import api from '../api/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  useCreateCustomer,
  useCreateVehicleModel,
  useCreateVehicle,
  useCreateIssue,
  useCreateInvoice,
  useCustomersList,
  useVehicleModelsList,
  useTechniciansList,
  useIssueById
} from '../api/adminHooks'

// Icons (you can replace with your preferred icon library)
const Icons = {
  Customer: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Vehicle: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Issue: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Invoice: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  ChevronDown: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  Loading: () => <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
}

/**
 * Accept either array or DRF paginated response
 */
function unwrapList(data: any): any[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (data.results && Array.isArray(data.results)) return data.results
  return []
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

// Professional Input Component
const Input: React.FC<{
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
}> = ({ label, value, onChange, placeholder, type = 'text', className = '', required = false }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
    />
  </div>
)

// Professional Select Component
const Select: React.FC<{
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}> = ({ label, value, onChange, options, placeholder, className = '', disabled = false, required = false }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
    >
      <option value="">{placeholder || 'Select an option'}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
)

export default function AdminDashboard(): JSX.Element {
  const qc = useQueryClient()

  const [tab, setTab] = useState<'customer' | 'vehicle' | 'issue' | 'invoice'>('customer')
  const [open, setOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // --- mutations & queries from hooks ---
  const createCustomer = useCreateCustomer()
  const createModel = useCreateVehicleModel()
  const createVehicle = useCreateVehicle()
  const createIssue = useCreateIssue()
  const createInvoice = useCreateInvoice()

  const customersQ = useCustomersList()
  const modelsQ = useVehicleModelsList()
  const techsQ = useTechniciansList()

  // --- Customer form state ---
  const [custName, setCustName] = useState('')
  const [custEmail, setCustEmail] = useState('')
  const [custPhone, setCustPhone] = useState('')

  // --- Vehicle form state ---
  const [ownerId, setOwnerId] = useState<string>('')
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false)
  const ownerWrapperRef = useRef<HTMLDivElement | null>(null)

  const [modelName, setModelName] = useState('')
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null)
  const modelWrapperRef = useRef<HTMLDivElement | null>(null)

  const [plate, setPlate] = useState('')
  const [color, setColor] = useState('')
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null)

  // --- Issue form state ---
  const [issueCustomerId, setIssueCustomerId] = useState<string>('')
  const [issueVehicleId, setIssueVehicleId] = useState<string>('')
  const [issueDesc, setIssueDesc] = useState('')
  const [issueTechId, setIssueTechId] = useState<string>('')

  // --- Invoice form state ---
  const [invoiceIssueId, setInvoiceIssueId] = useState('')
  const issuePreviewQ = useIssueById(invoiceIssueId)
  const [serviceCharge, setServiceCharge] = useState('')

  // normalized lists
  const customers = unwrapList(customersQ.data)
  const models = unwrapList(modelsQ.data)
  const technicians = unwrapList(techsQ.data)

  // -------------------------
  // Vehicles-for-customer query (keyed by customer id)
  // -------------------------
  const fetchVehiclesFor = async (customerId?: string | null) => {
    if (!customerId) return []
    const resp = await api.get('/vehicles/', { params: { owner: customerId } })
    return resp.data
  }

  // vehicles for currently selected customer in Issue tab
  const vehiclesForIssueCustomerQ = useQuery(
    ['customer-vehicles', issueCustomerId || 'none'],
    () => fetchVehiclesFor(issueCustomerId),
    { enabled: !!issueCustomerId, staleTime: 0, cacheTime: 1000 * 60 * 5 }
  )

  const vehiclesForSelectedCustomer = unwrapList(vehiclesForIssueCustomerQ.data)

  // -------------------------
  // derived invoice totals
  // -------------------------
  const issueTotalItems = useMemo(() => {
    const issue = issuePreviewQ.data
    if (!issue) return 0
    return (issue.items || []).reduce((s: number, it: any) => s + Number(it.amount || 0), 0)
  }, [issuePreviewQ.data])

  const invoiceTotalPreview = useMemo(() => {
    const svc = parseFloat(serviceCharge || '0') || 0
    return issueTotalItems + svc
  }, [issueTotalItems, serviceCharge])

  // -------------------------
  // PDF Download Helper Function - UPDATED
  // -------------------------
  const downloadInvoicePdf = async (invoiceId: string) => {
    try {
      setDownloading(true)
      // Use the correct endpoint: /api/invoices/{invoice_id}/pdf/
      const response = await api.get(`/invoices/${invoiceId}/pdf/`, {
        responseType: 'blob' // Important for file downloads
      });

      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Invoice created but failed to download PDF. You can download it from the invoices list.');
    } finally {
      setDownloading(false)
    }
  }

  // -------------------------
  // Handlers
  // -------------------------
  const handleCreateCustomer = async () => {
    try {
      if (!custName) { alert('Please enter a name'); return }
      await createCustomer.mutateAsync({ name: custName, email: custEmail, phone: custPhone })
      setCustName(''); setCustEmail(''); setCustPhone('')
      qc.invalidateQueries(['customers'])
      alert('Customer created')
    } catch (e: any) {
      console.error(e)
      alert('Failed to create customer: ' + (e?.response?.data ? JSON.stringify(e.response.data) : 'unknown error'))
    }
  }

  const handlePickOwner = (id: number | string) => {
    setOwnerId(String(id))
    setOwnerDropdownOpen(false)
  }

  const handlePickModel = (m: any) => {
    setModelName(m.name)
    setSelectedModelId(m.id)
    setModelDropdownOpen(false)
  }

  const handleVehiclePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files ? e.target.files[0] : null
    setVehiclePhoto(f)
  }

  const handleAddVehicle = async () => {
    try {
      if (!ownerId) { alert('Please select an owner'); return }
      if (!modelName) { alert('Please pick or type a model'); return }
      if (!plate) { alert('Please enter plate number'); return }

      let modelIdToUse = selectedModelId
      if (!modelIdToUse) {
        const resp = await createModel.mutateAsync({ name: modelName })
        const created = (resp && (resp as any).data) ? (resp as any).data : resp
        modelIdToUse = created?.id
        if (!modelIdToUse) { alert('Failed to create model'); return }
      }

      if (vehiclePhoto) {
        const fd = new FormData()
        fd.append('owner', String(ownerId))
        fd.append('model_id', String(modelIdToUse))
        fd.append('plate_number', plate)
        fd.append('color', color)
        fd.append('photo', vehiclePhoto)
        await createVehicle.mutateAsync(fd)
      } else {
        await createVehicle.mutateAsync({
          owner: ownerId,
          model_id: modelIdToUse,
          plate_number: plate,
          color
        })
      }

      qc.invalidateQueries(['customer-vehicles', ownerId])
      qc.invalidateQueries(['vehicles'])
      qc.invalidateQueries(['customers'])
      qc.invalidateQueries(['vehicle-models'])

      setPlate(''); setColor(''); setVehiclePhoto(null); setModelName(''); setSelectedModelId(null); setOwnerId('')
      alert('Vehicle added')
    } catch (e: any) {
      console.error('Add vehicle error', e)
      alert('Failed to add vehicle: ' + (e?.response?.data ? JSON.stringify(e.response.data) : 'unknown error'))
    }
  }

  const handleCreateIssue = async () => {
    try {
      if (!issueCustomerId) { alert('Please select a customer'); return }
      if (!issueVehicleId) { alert('Please select a vehicle'); return }
      if (!issueDesc || issueDesc.trim().length < 3) {
        if (!confirm('Description is short — continue?')) return
      }

      const payload: any = {
        customer: issueCustomerId,
        vehicle: issueVehicleId,
        description: issueDesc
      }
      if (issueTechId) payload.assigned_to_id = issueTechId

      await createIssue.mutateAsync(payload)
      qc.invalidateQueries(['issues'])
      setIssueDesc(''); setIssueVehicleId(''); setIssueCustomerId(''); setIssueTechId('')
      alert('Issue created')
    } catch (e: any) {
      console.error('Create issue error', e)
      alert('Failed to create issue: ' + (e?.response?.data ? JSON.stringify(e.response.data) : 'unknown error'))
    }
  }

  // UPDATED: Handle Create Invoice with proper PDF download
  const handleCreateInvoice = async () => {
    try {
      if (!invoiceIssueId) { alert('Please enter/select an issue ID'); return }
      
      // First create the invoice and get the response
      const response = await createInvoice.mutateAsync({ 
        issue: invoiceIssueId, 
        service_charge: parseFloat(serviceCharge || '0') || 0 
      });

      // Extract the invoice ID from the response
      const invoiceId = response.id || response.data?.id;

      if (!invoiceId) {
        throw new Error('Invoice created but no ID returned');
      }

      // Then download the PDF using the invoice ID
      await downloadInvoicePdf(invoiceId);

      qc.invalidateQueries(['invoices'])
      setInvoiceIssueId(''); setServiceCharge('')
      alert('Invoice created and downloaded successfully!')
    } catch (e: any) {
      console.error('Create invoice error', e)
      if (e.message === 'Invoice created but no ID returned') {
        alert('Invoice created but could not retrieve invoice ID for download. Check invoices list.');
      } else {
        alert('Failed to create invoice: ' + (e?.response?.data ? JSON.stringify(e.response.data) : 'unknown error'))
      }
    }
  }

  // click outside logic for dropdowns
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      const target = ev.target as Node | null
      if (ownerWrapperRef.current && ownerWrapperRef.current.contains(target)) return
      if (modelWrapperRef.current && modelWrapperRef.current.contains(target)) return
      setOwnerDropdownOpen(false)
      setModelDropdownOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOwnerDropdownOpen(false); setModelDropdownOpen(false) }
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // clear selected vehicle whenever customer changes
  useEffect(() => {
    setIssueVehicleId('')
  }, [issueCustomerId])

  // Navigation items
  const navItems = [
    { key: 'customer' as const, label: 'Create Customer', icon: Icons.Customer },
    { key: 'vehicle' as const, label: 'Add Vehicle', icon: Icons.Vehicle },
    { key: 'issue' as const, label: 'Create Issue', icon: Icons.Issue },
    { key: 'invoice' as const, label: 'Create Invoice', icon: Icons.Invoice },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Enhanced Sidebar */}
      <aside className="w-80 bg-gradient-to-b from-blue-900 to-blue-800 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">AutoRepair Pro</h1>
          <p className="text-blue-200 text-sm mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1">
          <h3 className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-4">Management</h3>
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    tab === item.key 
                      ? 'bg-white text-blue-700 shadow-lg' 
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <Icon />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Recent Customers Section */}
        <div className="mt-8 pt-6 border-t border-blue-700">
          <h4 className="text-sm font-semibold text-blue-200 mb-3">Recent Customers</h4>
          <div className="space-y-2 max-h-48 overflow-auto">
            {customers.length === 0 ? (
              <div className="text-blue-300 text-sm">No customers yet</div>
            ) : (
              customers.slice(0, 6).map((c: any) => (
                <div key={c.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-blue-700/30">
                  <div>
                    <div className="font-medium text-white">{c.name}</div>
                    <div className="text-blue-200 text-xs">{c.phone || 'No phone'}</div>
                  </div>
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">ID: {c.id}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Enhanced Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {tab === 'customer' && 'Customer Management'}
              {tab === 'vehicle' && 'Vehicle Registration'}
              {tab === 'issue' && 'Issue Tracking'}
              {tab === 'invoice' && 'Billing & Invoicing'}
            </h1>
            <p className="text-gray-600">
              {tab === 'customer' && 'Add new customers to the system'}
              {tab === 'vehicle' && 'Register vehicles for existing customers'}
              {tab === 'issue' && 'Create and assign repair issues'}
              {tab === 'invoice' && 'Generate invoices for completed work'}
            </p>
          </div>

          {/* Customer Tab */}
          {tab === 'customer' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Customer</h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={custName}
                  onChange={setCustName}
                  placeholder="Enter customer's full name"
                  required
                />
                <Input
                  label="Email Address"
                  value={custEmail}
                  onChange={setCustEmail}
                  placeholder="customer@example.com"
                  type="email"
                />
                <Input
                  label="Phone Number"
                  value={custPhone}
                  onChange={setCustPhone}
                  placeholder="+1 (555) 000-0000"
                />
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="primary"
                    onClick={handleCreateCustomer}
                    loading={createCustomer.isLoading}
                    disabled={!custName}
                  >
                    Create Customer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setCustName(''); setCustEmail(''); setCustPhone('') }}
                  >
                    Clear Form
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Vehicle Tab */}
          {tab === 'vehicle' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Register New Vehicle</h3>
              <div className="space-y-5">
                {/* Owner Selection */}
                <div className="relative" ref={ownerWrapperRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Owner</label>
                  <div className="relative">
                    <input
                      value={ownerId ? `${ownerId}` : ''}
                      onFocus={() => setOwnerDropdownOpen(true)}
                      placeholder="Select a customer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white"
                      readOnly
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Icons.ChevronDown />
                    </div>
                  </div>
                  {ownerDropdownOpen && (
                    <div className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 w-full max-h-64 overflow-auto">
                      {customers.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">No customers found</div>
                      ) : (
                        customers.map((c: any) => (
                          <div
                            key={c.id}
                            onClick={() => handlePickOwner(c.id)}
                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.email} • {c.phone}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Model Selection */}
                <div className="relative" ref={modelWrapperRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
                  <div className="relative">
                    <input
                      value={modelName}
                      onChange={e => { setModelName(e.target.value); setSelectedModelId(null) }}
                      onFocus={() => setModelDropdownOpen(true)}
                      placeholder="Type or select a model"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Icons.ChevronDown />
                    </div>
                  </div>
                  {modelDropdownOpen && (
                    <div className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 w-full max-h-64 overflow-auto">
                      {models.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">No models found</div>
                      ) : (
                        models.map((m: any) => (
                          <div
                            key={m.id}
                            onClick={() => handlePickModel(m)}
                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{m.name}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="License Plate"
                    value={plate}
                    onChange={setPlate}
                    placeholder="ABC 123"
                    required
                  />
                  <Input
                    label="Color"
                    value={color}
                    onChange={setColor}
                    placeholder="e.g., Red, Blue, Black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Photo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleVehiclePhotoChange}
                      className="hidden"
                      id="vehicle-photo"
                    />
                    <label htmlFor="vehicle-photo" className="cursor-pointer">
                      {vehiclePhoto ? (
                        <div className="text-green-600">
                          <div className="font-medium">Selected: {vehiclePhoto.name}</div>
                          <div className="text-sm text-gray-500">Click to change</div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-gray-600">Click to upload photo</div>
                          <div className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="primary"
                    onClick={handleAddVehicle}
                    loading={createVehicle.isLoading}
                    disabled={!ownerId || !modelName || !plate}
                  >
                    Register Vehicle
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setModelName(''); setPlate(''); setColor(''); setVehiclePhoto(null); setOwnerId('') }}
                  >
                    Clear Form
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Issue Tab */}
          {tab === 'issue' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Create Repair Issue</h3>
              <div className="space-y-5">
                <Select
                  label="Customer"
                  value={issueCustomerId}
                  onChange={setIssueCustomerId}
                  options={customers.map((c: any) => ({ value: c.id, label: `${c.name} (ID: ${c.id})` }))}
                  placeholder="Select a customer"
                  required
                />

                <Select
                  label="Vehicle"
                  value={issueVehicleId}
                  onChange={setIssueVehicleId}
                  options={vehiclesForSelectedCustomer.map((v: any) => ({ 
                    value: v.id, 
                    label: `${v.model?.name || 'Unknown Model'} - ${v.plate_number} (ID: ${v.id})` 
                  }))}
                  placeholder={!issueCustomerId ? 'Select a customer first' : (vehiclesForSelectedCustomer.length === 0 ? 'No vehicles for this customer' : 'Select vehicle')}
                  disabled={!issueCustomerId || vehiclesForIssueCustomerQ.isLoading}
                  required
                />

                <Select
                  label="Assign Technician"
                  value={issueTechId}
                  onChange={setIssueTechId}
                  options={technicians.map((t: any) => ({ value: t.id, label: `${t.full_name} (${t.registration_number})` }))}
                  placeholder="Optional - assign technician"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Description</label>
                  <textarea
                    value={issueDesc}
                    onChange={e => setIssueDesc(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {issueDesc.length}/500 characters
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="primary"
                    onClick={handleCreateIssue}
                    loading={createIssue.isLoading}
                    disabled={!issueCustomerId || !issueVehicleId || !issueDesc}
                  >
                    Create Issue
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setIssueCustomerId(''); setIssueVehicleId(''); setIssueDesc(''); setIssueTechId('') }}
                  >
                    Clear Form
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Invoice Tab */}
          {tab === 'invoice' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Generate Invoice</h3>
              <div className="space-y-5">
                <Input
                  label="Issue ID"
                  value={invoiceIssueId}
                  onChange={setInvoiceIssueId}
                  placeholder="Enter issue ID to preview details"
                  required
                />

                {issuePreviewQ.isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Icons.Loading />
                    <span className="ml-2 text-gray-600">Loading issue details...</span>
                  </div>
                )}

                {issuePreviewQ.data && (
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">Issue Preview</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Issue ID:</span>
                        <div className="font-medium">#{issuePreviewQ.data.id}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Vehicle:</span>
                        <div className="font-medium">{issuePreviewQ.data.vehicle.model?.name} - {issuePreviewQ.data.vehicle.plate_number}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Description:</span>
                        <div className="font-medium mt-1">{issuePreviewQ.data.description}</div>
                      </div>
                      <div className="col-span-2 border-t pt-3">
                        <span className="text-gray-600">Items Total:</span>
                        <div className="text-lg font-bold text-green-600">${issueTotalItems.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                )}

                <Input
                  label="Service Charge ($)"
                  value={serviceCharge}
                  onChange={setServiceCharge}
                  placeholder="0.00"
                  type="number"
                />

                <Card className="p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Invoice Total:</span>
                    <span className="text-2xl font-bold text-green-600">${invoiceTotalPreview.toFixed(2)}</span>
                  </div>
                </Card>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="primary"
                    onClick={handleCreateInvoice}
                    loading={createInvoice.isLoading || downloading}
                    disabled={!invoiceIssueId}
                    className="min-w-[200px]"
                  >
                    {(createInvoice.isLoading || downloading) ? (
                      <>
                        <Icons.Loading />
                        {createInvoice.isLoading ? 'Creating...' : 'Downloading...'}
                      </>
                    ) : (
                      <>
                        <Icons.Download />
                        Generate & Download PDF
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setInvoiceIssueId(''); setServiceCharge('') }}
                  >
                    Clear Form
                  </Button>
                </div>

                {/* Download Instructions */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> After clicking "Generate & Download PDF", the invoice will be created and automatically downloaded as a PDF file.
                    {downloading && " Download in progress..."}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Modal open={open} onClose={() => setOpen(false)} title="Modal">Hello</Modal>
      </main>
    </div>
  )
}