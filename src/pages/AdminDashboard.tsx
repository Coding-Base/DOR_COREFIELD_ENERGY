// src/pages/AdminDashboard.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import api from '../api/client'
import { useQueryClient } from '@tanstack/react-query'
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

// ---------- Icons ----------
const Icons = {
  Customer: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Vehicle: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Issue: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Invoice: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  ChevronDown: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  Loading: () => <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Plus: (props: any) => <svg {...props} className={`w-4 h-4 ${props.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Menu: (props: any) => <svg {...props} className={`w-6 h-6 ${props.className || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
}

// ---------- Helpers ----------
function unwrapList(data: any): any[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (data.results && Array.isArray(data.results)) return data.results
  return []
}

/**
 * Convert a string to Title Case:
 * - converts to lowercase first, then capitalizes the first letter of each word.
 * - safe for null/undefined values.
 */
const titleCase = (input?: any) => {
  if (input === null || input === undefined) return ''
  const s = String(input).trim()
  if (!s) return ''
  // split on spaces, keep inner-word punctuation intact
  return s
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

// ---------- Small UI primitives ----------
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>{children}</div>
)

const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm'|'md'|'lg';
}> = ({ children, variant = 'primary', loading = false, disabled = false, onClick, className = '', size='md' }) => {
  const baseStyles = "rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
  const sizes: any = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-3 text-lg"
  }
  const variants: any = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:text-gray-500",
    secondary: "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:text-gray-500",
    outline: "border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-400"
  }
  return (
    <button className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled || loading}>
      {loading && <Icons.Loading />}
      {children}
    </button>
  )
}

const Input: React.FC<{
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
}> = ({ label, value, onChange, placeholder, type = 'text', className = '', required = false }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" />
  </div>
)

// ---------- Toast system ----------
type Toast = { id: string; type?: 'success' | 'error' | 'info'; title: string; message?: string }
const useToasts = () => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = (t: Omit<Toast, 'id'>) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7)
    setToasts(s => [...s, { ...t, id }])
    setTimeout(() => setToasts(s => s.filter(x => x.id !== id)), 6000)
  }
  const remove = (id: string) => setToasts(s => s.filter(x => x.id !== id))
  const container = (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
      {toasts.map(t => (
        <div key={t.id} className={`max-w-sm w-full p-3 rounded-lg shadow-md ${t.type === 'error' ? 'bg-red-50 border border-red-200' : t.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-white border'}`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold text-sm">{t.title}</div>
              {t.message && <div className="text-xs text-gray-600 mt-1">{t.message}</div>}
            </div>
            <button className="text-xs text-gray-500" onClick={() => remove(t.id)}>Close</button>
          </div>
        </div>
      ))}
    </div>
  )
  return { push, container }
}

// ---------- Combobox (server-side) ----------
type ComboboxOption = { id: string | number; label: string; meta?: any }
const Combobox: React.FC<{
  placeholder?: string;
  fetcher: (params: { search: string; page: number }) => Promise<{ results: ComboboxOption[]; count?: number; next?: string | null }>;
  onSelect: (item: ComboboxOption | null) => void;
  valueLabel?: string;
  selected?: ComboboxOption | null;
  renderItem?: (it: ComboboxOption) => React.ReactNode;
  className?: string;
}> = ({ placeholder, fetcher, onSelect, selected = null, valueLabel, renderItem, className = '' }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<ComboboxOption[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  useEffect(() => {
    setItems([])
    setPage(1)
    setHasMore(false)
    const fetchPage = async (p = 1, s = search) => {
      setLoading(true)
      try {
        const resp = await fetcher({ search: s, page: p })
        setItems(prev => (p === 1 ? resp.results : [...prev, ...resp.results]))
        setHasMore(Boolean(resp.next))
      } catch (err) {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => fetchPage(1, search), 300)
    return () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current) }
  }, [search, fetcher])
  const loadMore = async () => {
    if (!hasMore) return
    const nextPage = page + 1
    setLoading(true)
    try {
      const resp = await fetcher({ search, page: nextPage })
      setItems(prev => [...prev, ...resp.results])
      setPage(nextPage)
      setHasMore(Boolean(resp.next))
    } catch (err) {
      // ignore
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button type="button" className="px-3 py-2 border border-gray-300 rounded-lg bg-white" onClick={() => { setOpen(o => !o) }}>
          <Icons.ChevronDown />
        </button>
      </div>

      {open && (
        <div className="absolute z-30 mt-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
          {loading && items.length === 0 ? (
            <div className="p-4 flex items-center gap-2"><Icons.Loading /><span>Loading...</span></div>
          ) : items.length === 0 ? (
            <div className="p-4 text-gray-600">No results</div>
          ) : (
            <>
              {items.map(it => (
                <button
                  key={String(it.id)}
                  onClick={() => { onSelect(it); setOpen(false); setSearch(it.label) }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
                >
                  {renderItem ? renderItem(it) : <div className="text-sm">{it.label}</div>}
                </button>
              ))}
              {hasMore && (
                <div className="p-3 text-center">
                  <button onClick={loadMore} className="text-sm underline">Load more</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {selected && valueLabel && (
        <div className="mt-2 text-xs text-gray-600">Selected: <strong>{valueLabel}</strong></div>
      )}
    </div>
  )
}

// ---------- Common colors & ColorPicker ----------
const COMMON_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#008000' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Purple', hex: '#800080' }
]

const ColorPicker: React.FC<{
  selectedColor: string;
  selectedHex: string;
  onColorChange: (name: string, hex: string) => void;
}> = ({ selectedColor, selectedHex, onColorChange }) => {
  const [selectedHexLocal, setSelectedHexLocal] = useState(selectedHex)
  const [selectedNameLocal, setSelectedNameLocal] = useState(selectedColor)

  useEffect(() => { setSelectedHexLocal(selectedHex) }, [selectedHex])
  useEffect(() => { setSelectedNameLocal(selectedColor) }, [selectedColor])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {COMMON_COLORS.map(c => (
          <button
            key={c.name}
            type="button"
            onClick={() => { setSelectedNameLocal(c.name); setSelectedHexLocal(c.hex); onColorChange(c.name, c.hex) }}
            className={`flex flex-col items-center gap-1 p-2 border rounded-lg transition-all duration-200 ${selectedNameLocal === c.name ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <span className="w-8 h-8 rounded border border-gray-300" style={{ background: c.hex }} />
            <span className="text-xs text-gray-600">{c.name}</span>
          </button>
        ))}
      </div>

      <div className="pt-2 border-t">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Custom Color Name" value={selectedNameLocal} onChange={(v) => { setSelectedNameLocal(v); onColorChange(v, selectedHexLocal) }} placeholder="Enter color name" />
          <Input label="Custom Color Hex" value={selectedHexLocal} onChange={(v) => { setSelectedHexLocal(v); onColorChange(selectedNameLocal, v) }} placeholder="#123456" />
        </div>
        {selectedHexLocal && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-600">Preview:</span>
            <div className="w-6 h-6 rounded border border-gray-300" style={{ background: selectedHexLocal }} />
            <span className="text-sm font-medium">{selectedNameLocal}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- Main component ----------
export default function AdminDashboard(): JSX.Element {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { push: pushToast, container: ToastContainer } = useToasts()

  const [tab, setTab] = useState<'customers' | 'vehicles' | 'issues' | 'invoices'>('customers')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Modal states
  const [openCreateCustomer, setOpenCreateCustomer] = useState(false)
  const [openAddVehicle, setOpenAddVehicle] = useState(false)
  const [openCreateIssue, setOpenCreateIssue] = useState(false)
  const [openIssueDetails, setOpenIssueDetails] = useState<{ open: boolean; issue?: any }>({ open: false })
  const [openCreateInvoice, setOpenCreateInvoice] = useState(false)

  // Admin info
  const [adminInfo, setAdminInfo] = useState<any | null>(null)

  // Hooks & lists
  const createCustomer = useCreateCustomer()
  const createModel = useCreateVehicleModel()
  const createVehicle = useCreateVehicle()
  const createIssue = useCreateIssue()
  const createInvoice = useCreateInvoice()

  const customersQ = useCustomersList()
  const modelsQ = useVehicleModelsList()
  const techsQ = useTechniciansList()
  const technicians = unwrapList(techsQ.data)

  // Form states
  const [custName, setCustName] = useState('')
  const [custEmail, setCustEmail] = useState('')
  const [custPhone, setCustPhone] = useState('')

  // Add Vehicle states
  const [selectedOwner, setSelectedOwner] = useState<{ id: string; label: string } | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<{ id: string; label: string } | null>(null)
  const [brandCustom, setBrandCustom] = useState('')
  const [modelsForBrand, setModelsForBrand] = useState<any[]>([]) // preloaded models for selected brand
  const [modelForBrand, setModelForBrand] = useState<{ id: number; name: string } | null>(null)
  const [modelCustom, setModelCustom] = useState('')
  const [plate, setPlate] = useState('')
  const [colorName, setColorName] = useState('')
  const [colorHex, setColorHex] = useState('')
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null)

  // Issue / Invoice states
  const [issueCustomerSelected, setIssueCustomerSelected] = useState<{ id: string; label: string } | null>(null)
  const [issueVehicleSelected, setIssueVehicleSelected] = useState<{ id: string; label: string } | null>(null)
  const [issueTitle, setIssueTitle] = useState('')
  const [issueDesc, setIssueDesc] = useState('')
  const [issueTech, setIssueTech] = useState<string>('')
  const [issueType, setIssueType] = useState<'fixing' | 'upgrading' | 'servicing'>('fixing')
  const [nextDueDate, setNextDueDate] = useState<string>('')
  const [linkedIssues, setLinkedIssues] = useState<ComboboxOption[]>([])

  const [invoiceUserSelected, setInvoiceUserSelected] = useState<{ id: string; label: string } | null>(null)
  const [invoiceIssueSelected, setInvoiceIssueSelected] = useState<{ id: string; label: string; meta?: any } | null>(null)
  const [serviceCharge, setServiceCharge] = useState('')
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false)
  const [issueItemsTotal, setIssueItemsTotal] = useState<number>(0)

  // Fetch admin info
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.get('/auth/me/')
        if (!cancelled && res?.data) setAdminInfo(res.data)
      } catch (err) { }
    })()
    return () => { cancelled = true }
  }, [])

  // ---------- Fetchers for comboboxes ----------
  const fetchCustomersCB = async ({ search = '', page = 1 }: { search: string; page: number }) => {
    const resp = await api.get('/admin/customers/', { params: { search, page, page_size: 10 } })
    const arr = resp.data.results || resp.data || []
    const results = arr.map((c: any) => ({ id: c.id, label: `${titleCase(c.name)} (${c.phone || 'no phone'})`, meta: c }))
    return { results, count: resp.data.count, next: resp.data.next }
  }

  const fetchVehiclesCB = async ({ search = '', page = 1 }: { search: string; page: number }) => {
    const resp = await api.get('/admin/vehicles/', { params: { search, page, page_size: 10 } })
    const arr = resp.data.results || resp.data || []
    const results = arr.map((v: any) => {
      const brandName = v.model?.brand?.name ? titleCase(v.model.brand.name) + ' ' : ''
      const modelName = v.model?.name ? titleCase(v.model.name) : 'Model'
      const ownerName = v.owner?.name ? titleCase(v.owner.name) : '—'
      return {
        id: v.id,
        label: `${brandName}${modelName} - ${v.plate_number || 'NO-PLATE'} (Owner: ${ownerName}#${v.owner?.id || '—'})`,
        meta: v
      }
    })
    return { results, count: resp.data.count, next: resp.data.next }
  }

  const fetchIssuesCB = async ({ search = '', page = 1 }: { search: string; page: number }) => {
    const resp = await api.get('/admin/issues/', { params: { search, page, page_size: 10, ordering: '-created_at' } })
    const arr = resp.data.results || resp.data || []
    const results = arr.map((it: any) => ({
      id: it.id,
      label: `${it.title ? titleCase(it.title) : '(no title)'} — #${it.id} (${it.customer?.name ? titleCase(it.customer.name) : (it.customer?.phone || '—')})`,
      meta: it
    }))
    return { results, count: resp.data.count, next: resp.data.next }
  }

  const fetchInvoicesCB = async ({ search = '', page = 1 }: { search: string; page: number }) => {
    const resp = await api.get('/admin/invoices/', { params: { search, page, page_size: 10, ordering: '-created_at' } })
    const arr = resp.data.results || resp.data || []
    const results = arr.map((inv: any) => {
      const custName = inv.issue?.customer?.name ? titleCase(inv.issue.customer.name) : (inv.issue?.customer?.phone || '—')
      return { id: inv.id, label: `Invoice #${inv.id} — Issue #${inv.issue?.id} (${custName})`, meta: inv }
    })
    return { results, count: resp.data.count, next: resp.data.next }
  }

  const fetchBrandsCB = async ({ search = '', page = 1 }: { search: string; page: number }) => {
    const resp = await api.get('/brands/', { params: { search, page, page_size: 10 } })
    const arr = resp.data.results || resp.data || []
    const results = arr.map((b: any) => ({ id: b.id, label: titleCase(b.name), meta: b }))
    return { results, count: resp.data.count, next: resp.data.next }
  }

  const fetchModelsByBrand = async (brandId: number | string | null) => {
    if (!brandId) return []
    try {
      const resp = await api.get('/vehicle-models/', { params: { brand: brandId, page_size: 50 } })
      // Normalize names to title case for display in select
      const data = resp.data.results || resp.data || []
      return data.map((m: any) => ({ ...m, name: titleCase(m.name) }))
    } catch (err) {
      return []
    }
  }

  // Fetch vehicles for a customer (used on issue form)
  const fetchVehiclesForCustomer = async ({ search = '', page = 1, owner }: { search: string; page: number; owner?: string | number }) => {
    const params: any = { search, page, page_size: 10 }
    if (owner) params.owner = owner
    const resp = await api.get('/admin/vehicles/', { params })
    const results = (resp.data.results || resp.data || []).map((v: any) => {
      const brand = v.model?.brand?.name ? titleCase(v.model.brand.name) + ' ' : ''
      const modelName = v.model?.name ? titleCase(v.model.name) : 'Model'
      return { id: v.id, label: `${brand}${modelName} - ${v.plate_number || 'NO-PLATE'}`, meta: v }
    })
    return { results, count: resp.data.count, next: resp.data.next }
  }

  // issues without invoice for invoice-creation combobox
  const fetchIssuesWithoutInvoiceCB = async ({ search = '', page = 1 }: { search: string; page: number }) => {
    const resp = await api.get('/admin/issues/', { params: { search, page, page_size: 10, ordering: '-created_at', has_invoice: 'false' } })
    const arr = resp.data.results || resp.data || []
    const results = arr.map((it: any) => ({
      id: it.id,
      label: `${it.title ? titleCase(it.title) : '(no title)'} — #${it.id} (${it.customer?.name ? titleCase(it.customer.name) : (it.customer?.phone || '—')})`,
      meta: it
    }))
    return { results, count: resp.data.count, next: resp.data.next }
  }

  // ---------- Action handlers ----------
  const handleOpenCreateCustomer = () => {
    setCustName(''); setCustEmail(''); setCustPhone('')
    setOpenCreateCustomer(true)
  }

  const handleSubmitCreateCustomer = async () => {
    if (!custName.trim()) { pushToast({ type: 'error', title: 'Validation', message: 'Name required' }); return }
    try {
      // Optional: send title-cased name to backend if you want uniform storage:
      const payload = { name: titleCase(custName), email: custEmail, phone: custPhone }
      await createCustomer.mutateAsync(payload)
      qc.invalidateQueries(['customers'])
      pushToast({ type: 'success', title: 'Customer created', message: `${titleCase(custName)} added.` })
      setOpenCreateCustomer(false)
    } catch (err: any) {
      pushToast({ type: 'error', title: 'Create failed', message: String(err?.response?.data || err?.message || err) })
    }
  }

  // ---------- Add Vehicle modal helpers & fixes ----------
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (selectedBrand && selectedBrand.id) {
          const ms = await fetchModelsByBrand(selectedBrand.id)
          if (!cancelled) setModelsForBrand(ms)
        } else {
          setModelsForBrand([])
          setModelForBrand(null)
        }
      } catch (err) {
        if (!cancelled) {
          setModelsForBrand([])
        }
      }
    })()
    return () => { cancelled = true }
  }, [selectedBrand])

  const handleOpenAddVehicle = () => {
    setSelectedOwner(null); setSelectedBrand(null); setBrandCustom(''); setModelsForBrand([]); setModelForBrand(null); setModelCustom('')
    setPlate(''); setColorName(''); setColorHex(''); setVehiclePhoto(null)
    setOpenAddVehicle(true)
  }

  const handleSubmitAddVehicle = async () => {
    if (!selectedOwner) { pushToast({ type: 'error', title: 'Validation', message: 'Please choose owner' }); return }
    if (!selectedBrand && !brandCustom) { pushToast({ type: 'error', title: 'Validation', message: 'Please choose or enter a brand' }); return }
    if (!modelForBrand && !modelCustom) { pushToast({ type: 'error', title: 'Validation', message: 'Please choose or enter a model' }); return }

    let createdBrandId: number | null = null
    let createdModelId: number | null = null

    try {
      // create brand if needed
      let brandId: number | string | null = selectedBrand ? selectedBrand.id : null
      if (!brandId && brandCustom) {
        const resp = await api.post('/brands/', { name: titleCase(brandCustom) })
        brandId = resp.data.id
        createdBrandId = brandId
        setSelectedBrand({ id: String(brandId), label: titleCase(brandCustom) })
        qc.invalidateQueries(['brands', 'fetchBrands'])
        pushToast({ type: 'success', title: 'Brand Created', message: `New brand "${titleCase(brandCustom)}" created` })
      }

      if (typeof brandId === 'string' && /^\d+$/.test(brandId)) brandId = parseInt(brandId, 10)

      // create model if needed
      let modelId: number | string | null = modelForBrand ? modelForBrand.id : null
      if (!modelId && modelCustom) {
        const resp = await api.post('/vehicle-models/', { name: titleCase(modelCustom), brand_id: brandId })
        modelId = resp.data.id
        createdModelId = modelId
        pushToast({ type: 'success', title: 'Model Created', message: `New model "${titleCase(modelCustom)}" created` })
        const returnedModel = resp.data
        setModelsForBrand(prev => [{ id: returnedModel.id, name: titleCase(returnedModel.name), brand_id: returnedModel.brand || brandId }, ...prev])
        qc.invalidateQueries(['vehicle-models', 'models'])
      }

      if (typeof modelId === 'string' && /^\d+$/.test(modelId)) modelId = parseInt(modelId, 10)

      const colorPayload = colorName ? (colorHex ? { name: titleCase(colorName), hex: colorHex } : { name: titleCase(colorName) }) : null

      // send owner_id & model_id (backend expects these)
      if (vehiclePhoto) {
        const fd = new FormData()
        fd.append('owner_id', String(selectedOwner.id))
        fd.append('model_id', String(modelId))
        if (plate) fd.append('plate_number', plate)
        if (colorPayload) fd.append('color', JSON.stringify(colorPayload))
        fd.append('photo', vehiclePhoto)
        await createVehicle.mutateAsync(fd)
      } else {
        await createVehicle.mutateAsync({
          owner_id: selectedOwner.id,
          model_id: modelId,
          plate_number: plate || null,
          color: colorPayload ? JSON.stringify(colorPayload) : null
        })
      }

      qc.invalidateQueries(['vehicles'])
      pushToast({ type: 'success', title: 'Vehicle added', message: `Vehicle registered for ${selectedOwner.label}` })
      setOpenAddVehicle(false)
    } catch (err: any) {
      const backendErr = err?.response?.data
      if (backendErr) {
        pushToast({ type: 'error', title: 'Add vehicle failed', message: JSON.stringify(backendErr) })
      } else {
        pushToast({ type: 'error', title: 'Add vehicle failed', message: String(err?.message || err) })
      }

      // cleanup created objects if any
      try { if (createdModelId) await api.delete(`/vehicle-models/${createdModelId}/`).catch(()=>{}) } catch (_) {}
      try { if (createdBrandId) await api.delete(`/brands/${createdBrandId}/`).catch(()=>{}) } catch (_) {}
    }
  }

  // ---------- Create Issue handlers ----------
  const handleOpenCreateIssue = () => {
    setIssueCustomerSelected(null)
    setIssueVehicleSelected(null)
    setIssueTitle('')
    setIssueDesc('')
    setIssueTech('')
    setIssueType('fixing')
    setNextDueDate('')
    setLinkedIssues([])
    setOpenCreateIssue(true)
  }

  const handleCreateIssueSubmit = async () => {
    if (!issueCustomerSelected) { pushToast({ type: 'error', title: 'Validation', message: 'Please select customer' }); return }
    if (!issueVehicleSelected) { pushToast({ type: 'error', title: 'Validation', message: 'Please select vehicle' }); return }
    if (!issueTitle.trim()) { pushToast({ type: 'error', title: 'Validation', message: 'Issue title is required' }); return }
    if (!issueTech) { pushToast({ type: 'error', title: 'Validation', message: 'Assign a technician' }); return }
    try {
      const payload: any = {
        customer: issueCustomerSelected.id,
        vehicle: issueVehicleSelected.id,
        title: issueTitle,
        description: issueDesc,
        issue_type: issueType,
        assigned_to_id: issueTech,
        linked_issues: linkedIssues.map(l => l.id)
      }
      if (issueType === 'servicing' && nextDueDate) payload.next_due_date = nextDueDate
      await createIssue.mutateAsync(payload)
      qc.invalidateQueries(['issues'])
      pushToast({ type: 'success', title: 'Issue created', message: `${titleCase(issueTitle)}` })
      setOpenCreateIssue(false)
    } catch (err: any) {
      pushToast({ type: 'error', title: 'Create issue failed', message: String(err?.response?.data || err?.message || err) })
    }
  }

  // ---------- Invoice helpers (FIXED: send issue_id and show total) ----------
  const handleOpenCreateInvoice = () => {
    setInvoiceUserSelected(null); setInvoiceIssueSelected(null); setServiceCharge(''); setIssueItemsTotal(0)
    setOpenCreateInvoice(true)
  }

  useEffect(() => {
    const load = async () => {
      if (!invoiceIssueSelected) { setIssueItemsTotal(0); return }
      try {
        const resp = await api.get(`/issues/${invoiceIssueSelected.id}/`)
        const issue = resp.data
        const itemsTotal = (issue.items || []).reduce((s: number, it: any) => s + Number(it.amount || 0), 0)
        setIssueItemsTotal(itemsTotal)
      } catch (err) {
        setIssueItemsTotal(0)
      }
    }
    load()
  }, [invoiceIssueSelected])

  const handleCreateInvoiceSubmit = async () => {
    if (!invoiceIssueSelected) { pushToast({ type: 'error', title: 'Validation', message: 'Please choose an issue' }); return }
    try {
      setIsCreatingInvoice(true)

      // parse and compute numbers
      const issueIdNum = Number(invoiceIssueSelected.id)
      const service = parseFloat(serviceCharge || '0') || 0
      const totalAmount = Number((issueItemsTotal || 0) + service)

      // IMPORTANT: backend expects issue_id (not issue)
      const payload: any = {
        issue_id: issueIdNum,
        service_charge: service
      }

      // include total if your API supports it (safe to include; backend should ignore extra fields if not used)
      payload.total = totalAmount

      const resp = await createInvoice.mutateAsync(payload)
      const invoiceId = resp?.id || resp?.data?.id
      qc.invalidateQueries(['invoices'])
      pushToast({ type: 'success', title: 'Invoice created', message: `Invoice #${invoiceId} created — Total: ${totalAmount.toFixed(2)}` })

      // attempt PDF download
      try {
        const pdfResp = await api.get(`/invoices/${invoiceId}/pdf/`, { responseType: 'blob' })
        const blob = new Blob([pdfResp.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice_${invoiceId}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (e) {
        // ignore
      }

      setOpenCreateInvoice(false)
    } catch (err: any) {
      pushToast({ type: 'error', title: 'Create invoice failed', message: String(err?.response?.data || err?.message || err) })
    } finally { setIsCreatingInvoice(false) }
  }

  const handleDownloadInvoicePdf = async (invoiceId: string | number) => {
    try {
      const resp = await api.get(`/invoices/${invoiceId}/pdf/`, { responseType: 'blob' })
      const blob = new Blob([resp.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice_${invoiceId}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      pushToast({ type: 'success', title: 'Download started', message: `Invoice #${invoiceId}` })
    } catch (err: any) {
      pushToast({ type: 'error', title: 'Download failed', message: String(err?.message || err) })
    }
  }

  // ---------- UI pieces (kept same) ----------
  const navItems = [
    { key: 'customers' as const, label: 'Customers', icon: Icons.Customer },
    { key: 'vehicles' as const, label: 'Vehicles', icon: Icons.Vehicle },
    { key: 'issues' as const, label: 'Issues', icon: Icons.Issue },
    { key: 'invoices' as const, label: 'Invoices', icon: Icons.Invoice },
  ]

  // preload vehicles for selected issue customer in the Create Issue modal:
  const fetchVehiclesForSelectedCustomer = async ({ search = '', page = 1 }: { search: string; page: number }) => {
    return await fetchVehiclesForCustomer({ search, page, owner: issueCustomerSelected ? issueCustomerSelected.id : undefined })
  }

  // linked issues add helper
  const addLinkedIssue = (it: ComboboxOption | null) => {
    if (!it) return
    if (linkedIssues.find(l => String(l.id) === String(it.id))) return
    setLinkedIssues(prev => [...prev, it])
  }
  const removeLinkedIssue = (id: string | number) => setLinkedIssues(prev => prev.filter(x => String(x.id) !== String(id)))

  // computed invoice totals for UI
  const parsedService = parseFloat(serviceCharge || '0') || 0
  const computedInvoiceTotal = (issueItemsTotal || 0) + parsedService

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar & main header UI */}
      <aside className="w-80 bg-gradient-to-b from-blue-900 to-blue-800 text-white p-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">RK Autos</h1>
          <p className="text-blue-200 text-sm mt-1">Admin Dashboard</p>
        </div>

        <div className="mb-6 p-3 bg-white/5 rounded-md">
          {adminInfo ? (
            <>
              <div className="text-sm font-medium">{adminInfo.username || adminInfo.email || 'Admin'}</div>
              <div className="text-xs text-blue-200">{adminInfo.email || ''}</div>
              <div className="text-xs text-blue-300 mt-1">Role: {adminInfo.role || 'admin'}</div>
            </>
          ) : <div className="text-sm text-blue-200">Welcome, Admin</div>}
        </div>

        <nav className="flex-1">
          <h3 className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-4">Management</h3>
          <div className="space-y-2">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <button key={item.key} onClick={() => setTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    tab === item.key ? 'bg-white text-blue-700 shadow-lg' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}>
                  <Icon />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="mt-6">
          <Button variant="outline" onClick={() => { localStorage.removeItem('access'); localStorage.removeItem('refresh'); delete (api as any).defaults.headers.common['Authorization']; navigate('/login') }}>
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tab === 'customers' && 'Customers'}
                {tab === 'vehicles' && 'Vehicles'}
                {tab === 'issues' && 'Issues'}
                {tab === 'invoices' && 'Invoices'}
              </h1>
              <p className="text-gray-600">
                {tab === 'customers' && 'Search and manage customers'}
                {tab === 'vehicles' && 'Search and manage vehicles'}
                {tab === 'issues' && 'Search, view and create issues'}
                {tab === 'invoices' && 'Search and reprint invoices'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {adminInfo ? (
                <div className="text-right">
                  <div className="font-medium text-gray-900">{adminInfo.username || adminInfo.email}</div>
                  <div className="text-sm text-gray-600">{adminInfo.email || ''}</div>
                </div>
              ) : (
                <div className="text-right">
                  <div className="font-medium text-gray-900">Admin</div>
                  <div className="text-sm text-gray-600">Administrator</div>
                </div>
              )}

              {tab === 'customers' && <Button variant="primary" onClick={handleOpenCreateCustomer}>Create Customer</Button>}
              {tab === 'vehicles' && <Button variant="primary" onClick={handleOpenAddVehicle}>Add Vehicle</Button>}
              {tab === 'issues' && <Button variant="primary" onClick={handleOpenCreateIssue}>Create Issue</Button>}
              {tab === 'invoices' && <Button variant="primary" onClick={handleOpenCreateInvoice}>Create Invoice</Button>}
            </div>
          </div>

          {/* Tab contents */}
          <div>
            {tab === 'customers' && (
              <Card  className="p-6 min-h-[700px]">
                <h3 className="text-lg font-semibold mb-4">Search Customers</h3>
                <Combobox
                  placeholder="Search by name, phone or email..."
                  fetcher={({ search, page }) => fetchCustomersCB({ search, page })}
                  onSelect={(it) => { if (it) pushToast({ type: 'info', title: 'Customer selected', message: it.label }) }}
                  renderItem={(it) => <div className="flex justify-between"><div>{it.label}</div></div>}
                />
                <div className="mt-6 text-sm text-gray-600">Tip: type name or phone to find a customer.</div>
              </Card>
            )}

            {tab === 'vehicles' && (
              <Card  className="p-6 min-h-[700px]">
                <h3 className="text-lg font-semibold mb-4">Search Vehicles</h3>
                <Combobox
                  placeholder="Search by model, owner or plate..."
                  fetcher={({ search, page }) => fetchVehiclesCB({ search, page })}
                  onSelect={(it) => { if (it) pushToast({ type: 'info', title: 'Vehicle selected', message: String(it.label) }) }}
                  renderItem={(it) => <div className="flex items-center gap-3"><div>{it.label}</div></div>}
                />
                <div className="mt-6 text-sm text-gray-600">Tip: search by plate, owner name or model.</div>
              </Card>
            )}

            {tab === 'issues' && (
              <Card  className="p-6 min-h-[700px]">
                <h3 className="text-lg font-semibold mb-4">Search Issues</h3>
                <Combobox
                  placeholder="Search by user name, phone or issue title..."
                  fetcher={({ search, page }) => fetchIssuesCB({ search, page })}
                  onSelect={(it) => { if (it) setOpenIssueDetails({ open: true, issue: it.meta }) }}
                  renderItem={(it) => <div><div className="font-medium">{it.meta.title ? titleCase(it.meta.title) : '(no title)'} <span className="text-xs text-gray-500">#{it.id}</span></div><div className="text-xs text-gray-500">{it.meta.customer?.name ? titleCase(it.meta.customer?.name) : ''} • {new Date(it.meta.created_at).toLocaleString()}</div></div>}
                />
                <div className="mt-6 text-sm text-gray-600">Tip: recent issues appear first.</div>
              </Card>
            )}

            {tab === 'invoices' && (
              <Card  className="p-6 min-h-[700px]">
                <h3 className="text-lg font-semibold mb-4">Search Invoices</h3>
                <Combobox
                  placeholder="Search by invoice number, issue number or user name..."
                  fetcher={({ search, page }) => fetchInvoicesCB({ search, page })}
                  onSelect={(it) => { if (it) pushToast({ type: 'info', title: 'Invoice selected', message: it.label }) }}
                  renderItem={(it) => <div className="flex justify-between items-center"><div>{it.label}</div><div><Button variant="outline" onClick={() => handleDownloadInvoicePdf(it.id)}>Reprint</Button></div></div>}
                />
                <div className="mt-6 text-sm text-gray-600">Tip: search by username or issue number to list invoices for that user.</div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}

      {/* Create Customer Modal */}
      <Modal open={openCreateCustomer} onClose={() => setOpenCreateCustomer(false)} title="Create Customer">
        <div className="space-y-4">
          <Input label="Full name" value={custName} onChange={setCustName} required />
          <Input label="Email" value={custEmail} onChange={setCustEmail} type="email" />
          <Input label="Phone" value={custPhone} onChange={setCustPhone} placeholder="+1 555 555 5555" />
          <div className="flex gap-3 pt-3">
            <Button variant="primary" onClick={handleSubmitCreateCustomer} loading={createCustomer.isLoading}>Create</Button>
            <Button variant="outline" onClick={() => setOpenCreateCustomer(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Add Vehicle Modal (keeps the updated behaviour) */}
      <Modal open={openAddVehicle} onClose={() => setOpenAddVehicle(false)} title="Register New Vehicle" size="lg">
        <div className="space-y-6 max-h-[70vh] overflow-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Owner</label>
            <Combobox
              placeholder="Search owner by name or phone..."
              fetcher={({ search, page }) => fetchCustomersCB({ search, page })}
              onSelect={(it) => setSelectedOwner(it ? { id: String(it.id), label: it.label } : null)}
              renderItem={(it) => <div>{it.label} <div className="text-xs text-gray-500">ID: {it.id}</div></div>}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <Combobox
                placeholder="Select existing brand or type new..."
                fetcher={({ search, page }) => fetchBrandsCB({ search, page })}
                onSelect={(it) => {
                  if (it) {
                    setSelectedBrand({ id: String(it.id), label: it.label })
                    setBrandCustom('')
                  } else {
                    setSelectedBrand(null)
                    setModelsForBrand([])
                  }
                }}
                renderItem={(it) => <div>{it.label}</div>}
              />
            </div>
            <Input label="Custom Brand Name" value={brandCustom} onChange={(v) => { setBrandCustom(v); if (v) { setSelectedBrand(null); setModelsForBrand([]) } }} placeholder="Enter new brand name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            {(selectedBrand && selectedBrand.id) || brandCustom ? (
              <div className="space-y-3">
                <div>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 max-h-48 overflow-auto"
                    value={String(modelForBrand?.id || '')}
                    onChange={(e) => {
                      const id = e.target.value
                      if (!id) { setModelForBrand(null); return }
                      const found = modelsForBrand.find((m: any) => String(m.id) === String(id))
                      setModelForBrand(found || null)
                    }}
                    size={Math.min(8, Math.max(3, modelsForBrand.length))}
                  >
                    <option value="">Select existing model</option>
                    {modelsForBrand.map((m: any) => (
                      <option key={m.id} value={m.id}>{titleCase(m.name)}</option>
                    ))}
                  </select>
                </div>

                <Input label="Custom Model Name" value={modelCustom} onChange={setModelCustom} placeholder="Enter new model name" />
                <div className="text-xs text-gray-500">Tip: choose existing model or enter a new model name to create.</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                Please select or enter a brand first to choose models
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="License plate (optional)" value={plate} onChange={setPlate} placeholder="ABC 123" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <ColorPicker selectedColor={colorName} selectedHex={colorHex} onColorChange={(name, hex) => { setColorName(name); setColorHex(hex) }} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Photo</label>
            <input type="file" accept="image/*" onChange={e => setVehiclePhoto(e.target.files ? e.target.files[0] : null)} className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="primary" onClick={handleSubmitAddVehicle} loading={createVehicle.isLoading} className="flex-1">Register Vehicle</Button>
            <Button variant="outline" onClick={() => setOpenAddVehicle(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Create Issue Modal (RESTORED) */}
      <Modal open={openCreateIssue} onClose={() => setOpenCreateIssue(false)} title="Create Issue" size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <Combobox
              placeholder="Search customer..."
              fetcher={({ search, page }) => fetchCustomersCB({ search, page })}
              onSelect={(it) => {
                setIssueCustomerSelected(it ? { id: String(it.id), label: it.label } : null)
                setIssueVehicleSelected(null)
              }}
              renderItem={(it) => <div className="flex justify-between"><div>{it.label}</div></div>}
            />
            {issueCustomerSelected && <div className="mt-2 text-xs text-gray-600">Selected: <strong>{issueCustomerSelected.label}</strong></div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
            <Combobox
              placeholder={issueCustomerSelected ? "Search vehicles for selected customer..." : "Select customer first"}
              fetcher={fetchVehiclesForSelectedCustomer}
              onSelect={(it) => setIssueVehicleSelected(it ? { id: String(it.id), label: it.label } : null)}
              renderItem={(it) => <div className="flex items-center gap-2"><div>{it.label}</div></div>}
            />
            {issueVehicleSelected && <div className="mt-2 text-xs text-gray-600">Selected: <strong>{issueVehicleSelected.label}</strong></div>}
          </div>

          <div>
            <Input label="Title" value={issueTitle} onChange={setIssueTitle} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={issueDesc} onChange={(e)=>setIssueDesc(e.target.value)} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Technician</label>
              <select value={issueTech || ''} onChange={(e)=>setIssueTech(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="">Select technician</option>
                {technicians.map((t:any)=>((
                  <option key={t.id} value={t.id}>{titleCase(t.full_name) || t.registration_number || t.email}</option>
                )))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={issueType} onChange={(e)=>setIssueType(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="fixing">Fixing</option>
                <option value="upgrading">Upgrading</option>
                <option value="servicing">Servicing</option>
              </select>
            </div>

            {issueType === 'servicing' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
                <input type="date" value={nextDueDate} onChange={(e)=>setNextDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link Issues (optional)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Combobox
                  placeholder="Search existing issues..."
                  fetcher={({ search, page }) => fetchIssuesCB({ search, page })}
                  onSelect={(it) => addLinkedIssue(it)}
                  renderItem={(it) => <div>{it.label}</div>}
                />
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  {linkedIssues.map(li => (
                    <div key={String(li.id)} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gray-100 border">
                      <span className="text-xs">{li.label}</span>
                      <button className="text-xs text-red-500" onClick={()=>removeLinkedIssue(li.id)}>x</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <Button variant="primary" onClick={handleCreateIssueSubmit} loading={createIssue.isLoading}>Create Issue</Button>
            <Button variant="outline" onClick={()=>setOpenCreateIssue(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Issue Details Modal */}
      <Modal open={openIssueDetails.open} onClose={() => setOpenIssueDetails({ open: false })} title={`Issue #${openIssueDetails.issue?.id || ''}`} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-auto pr-2">
          {openIssueDetails.issue ? (
            <>
              <div className="text-sm text-gray-600">Title: <strong>{titleCase(openIssueDetails.issue.title)}</strong></div>
              <div className="text-sm text-gray-600">Status: <strong>{openIssueDetails.issue.status}</strong></div>
              <div className="text-sm text-gray-600">Assigned to: <strong>{titleCase(openIssueDetails.issue.assigned_to?.full_name) || openIssueDetails.issue.assigned_to?.registration_number || '—'}</strong></div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                <div className="text-sm text-gray-600 bg-gray-50 rounded p-3">{openIssueDetails.issue.description}</div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Treatments</h4>
                <div className="space-y-2">
                  {(openIssueDetails.issue.treatments || []).map((t:any)=>((
                    <div key={t.id} className="p-2 border rounded bg-white">
                      <div className="text-xs text-gray-500">By: {titleCase(t.technician?.full_name) || '—'} • {new Date(t.created_at).toLocaleString()}</div>
                      <div className="text-sm">{t.description}</div>
                    </div>
                  )))}
                  {(!openIssueDetails.issue.treatments || openIssueDetails.issue.treatments.length===0) && <div className="text-sm text-gray-500">No treatments yet.</div>}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Items</h4>
                <div className="space-y-2">
                  {(openIssueDetails.issue.items || []).map((it:any)=>((
                    <div key={it.id} className="p-2 border rounded bg-white flex justify-between">
                      <div className="text-sm">{titleCase(it.name)}</div>
                      <div className="text-sm font-medium">{it.amount}</div>
                    </div>
                  )))}
                  {(!openIssueDetails.issue.items || openIssueDetails.issue.items.length===0) && <div className="text-sm text-gray-500">No items yet.</div>}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <Button variant="outline" onClick={()=>setOpenIssueDetails({ open:false })}>Close</Button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600">No issue selected</div>
          )}
        </div>
      </Modal>

      {/* Create Invoice Modal (FIXED) */}
      <Modal open={openCreateInvoice} onClose={() => setOpenCreateInvoice(false)} title="Create Invoice">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue (without invoice)</label>
            <Combobox
              placeholder="Search issues without invoice..."
              fetcher={({ search, page }) => fetchIssuesWithoutInvoiceCB({ search, page })}
              onSelect={(it) => setInvoiceIssueSelected(it ? { id: it.id as any, label: it.label, meta: it.meta } : null)}
              renderItem={(it) => <div>{it.label}</div>}
            />
            {invoiceIssueSelected && <div className="mt-2 text-xs text-gray-600">Selected: <strong>{invoiceIssueSelected.label}</strong></div>}
          </div>

          <div>
            <Input label="Service charge" value={serviceCharge} onChange={setServiceCharge} placeholder="0.00" />
            <div className="text-xs text-gray-500 mt-1">Items total: {issueItemsTotal.toFixed(2)}</div>
            <div className="text-sm font-medium mt-2">Total (items + service): {computedInvoiceTotal.toFixed(2)}</div>
          </div>

          <div className="flex gap-3 pt-3">
            <Button variant="primary" onClick={handleCreateInvoiceSubmit} loading={isCreatingInvoice}>Create Invoice</Button>
            <Button variant="outline" onClick={()=>setOpenCreateInvoice(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {ToastContainer}
    </div>
  )
}
