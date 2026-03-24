// src/pages/CreateInvoice.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import Button from '../components/Button'
import Modal from '../components/Modal'
import useToasts from '../hooks/useToasts'

type IssueOption = { id: number; title?: string; customer?: any; vehicle?: any; items?: any[] }
type ItemRow = { id?: number | null; name: string; amount: number; quantity: number; source?: 'technician' | 'admin'; paid?: boolean; removable?: boolean }

export default function CreateInvoice(): JSX.Element {
  const { push: pushToast, container: ToastContainer } = useToasts()
  const navigate = useNavigate()

  // search & selection
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<IssueOption[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<IssueOption | null>(null)

  // debounce timer ref to avoid focus loss
  const searchTimer = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  // invoice items state
  const [items, setItems] = useState<ItemRow[]>([])
  const [serviceCharge, setServiceCharge] = useState<number | ''>(0)
  const [saving, setSaving] = useState(false)

  // when selectedIssue changes, populate items array with its items (technician items)
  useEffect(() => {
    if (!selectedIssue) {
      setItems([])
      return
    }
    // Items may already be included in selectedIssue; if not, fetch issue
    const load = async () => {
      try {
        let fetched = selectedIssue
        if (!fetched.items) {
          const res = await api.get(`/issues/${selectedIssue.id}/`)
          fetched = res.data
        }
        // map items
        const techItems = (fetched.items || []).map((it: any) => ({
          id: it.id,
          name: it.name,
          amount: Number(it.amount || 0),
          quantity: Number(it.quantity || 1),
          source: it.source || 'technician',
          paid: !!it.paid,
          removable: false // technician items cannot be removed by admin
        })) as ItemRow[]
        setItems(techItems)
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          try { navigate('/login') } catch {}
          return
        }
        pushToast('Failed to load issue items.')
      }
    }
    load()
  }, [selectedIssue, navigate, pushToast])

  // Debounced search to avoid constant re-renders and to preserve focus
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(async () => {
      if (!searchTerm || String(searchTerm).trim() === '') {
        setSearchResults([])
        setSearchLoading(false)
        return
      }
      setSearchLoading(true)
      try {
        // use admin endpoint for listing issues (admin_router) or fallback to public issues
        const res = await api.get('/admin/issues/', { params: { search: searchTerm, page_size: 10 } })
        setSearchResults(res.data?.results || [])
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          try { navigate('/login') } catch {}
          return
        }
        try {
          const res2 = await api.get('/issues/', { params: { search: searchTerm, page_size: 10 } })
          setSearchResults(res2.data?.results || [])
        } catch (err2) {
          setSearchResults([])
        }
      } finally {
        setSearchLoading(false)
      }
    }, 300)
    return () => clearTimeout(searchTimer.current)
  }, [searchTerm, navigate])

  // add a new admin-created item row
  const addAdminItemRow = () => {
    setItems(prev => [...prev, { id: null, name: '', amount: 0, quantity: 1, source: 'admin', paid: false, removable: true }])
  }

  // update an item row
  const updateItemRow = (index: number, patch: Partial<ItemRow>) => {
    setItems(prev => prev.map((r, i) => i === index ? { ...r, ...patch } : r))
  }

  // remove an item row (only removable ones allowed)
  const removeItemRow = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  // totals
  const totals = useMemo(() => {
    const techSum = items.filter(i => i.source === 'technician').reduce((s, it) => s + (it.amount * (it.quantity || 1)), 0)
    const adminSum = items.filter(i => i.source === 'admin').reduce((s, it) => s + (it.amount * (it.quantity || 1)), 0)
    const sc = Number(serviceCharge || 0)
    const total = techSum + adminSum + sc
    const paid = items.filter(i => i.source === 'technician').reduce((s, it) => s + (it.amount * (it.quantity || 1)), 0)
    const remaining = total - paid
    return { techSum, adminSum, serviceCharge: sc, total, paid, remaining }
  }, [items, serviceCharge])

  // save invoice (calls create_from_issue)
  const handleSave = async () => {
    if (!selectedIssue) {
      pushToast('Select an issue first.')
      return
    }
    setSaving(true)
    try {
      // Build admin items payload (only admin items should be created by admin)
      const adminItems = items.filter(i => i.source === 'admin').map(i => ({ name: i.name, amount: i.amount, quantity: i.quantity }))
      const payload: any = { issue_id: selectedIssue.id, service_charge: Number(serviceCharge || 0) }
      if (adminItems.length) payload.items = adminItems
      const res = await api.post('/invoices/create_from_issue/', payload)
      pushToast('Invoice created.')
      // navigate to invoices list or invoice detail if available (res.data.id)
      try {
        navigate('/admin/invoices') // or '/invoices' depends on your routing
      } catch {}
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        try { navigate('/login') } catch {}
        return
      }
      // show backend error message if present
      pushToast(err?.response?.data?.detail || 'Failed to create invoice.')
    } finally {
      setSaving(false)
    }
  }

  // when user selects a search result
  const onSelectIssue = (iss: IssueOption) => {
    setSelectedIssue(iss)
    setSearchTerm(iss.title ? `${iss.title} (#${iss.id})` : `#${iss.id}`)
    setSearchResults([])
    // focus management: restore focus to search box so typing won't lose focus
    try { searchInputRef.current?.focus() } catch {}
  }

  // ensure search input stays focused when typing
  const onSearchChange = (v: string) => {
    setSearchTerm(v)
  }

  return (
    <div className="p-6 bg-orange-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">Create Invoice</div>
          <div>
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search issue</label>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by issue title, customer or plate..."
                className="w-full border rounded p-2"
              />
              {searchLoading && <div className="absolute right-2 top-2 text-sm text-gray-500">Loading...</div>}
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2 border rounded bg-white shadow max-h-44 overflow-auto">
                {searchResults.map(s => (
                  <button key={s.id} className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => onSelectIssue(s)}>
                    <div className="font-medium">#{s.id} {s.title || ''}</div>
                    <div className="text-xs text-gray-500">{s.customer?.name || ''} • {s.vehicle?.plate_number || ''}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected issue summary */}
          {selectedIssue ? (
            <div className="border rounded p-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Issue #{selectedIssue.id} {selectedIssue.title ? `- ${selectedIssue.title}` : ''}</div>
                  <div className="text-sm text-gray-600">{selectedIssue.customer?.name || ''} • {selectedIssue.vehicle?.plate_number || ''}</div>
                </div>
                <div className="text-sm text-gray-600">Technician items populate below</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Select an issue to populate technician items.</div>
          )}

          {/* Items list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Items & Parts</div>
              <div>
                <Button variant="outline" onClick={addAdminItemRow}>Add item</Button>
              </div>
            </div>

            <div className="space-y-2">
              {items.length === 0 ? (
                <div className="text-sm text-gray-500">No items yet.</div>
              ) : items.map((it, idx) => (
                <div key={idx} className="p-2 border rounded flex gap-2 items-center">
                  <input value={it.name} onChange={(e) => updateItemRow(idx, { name: e.target.value })} placeholder="Item name" className="border rounded p-2 flex-1" />
                  <input value={String(it.quantity)} type="number" min={1} onChange={(e) => updateItemRow(idx, { quantity: Math.max(1, Number(e.target.value) || 1) })} className="w-20 border rounded p-2" />
                  <input value={String(it.amount)} type="number" min={0} step="0.01" onChange={(e) => updateItemRow(idx, { amount: Number(e.target.value) || 0 })} className="w-28 border rounded p-2" />
                  <div className="text-xs">
                    {it.source === 'technician' ? <span className="px-2 py-1 bg-green-100 rounded text-green-700">Paid</span> : <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">Admin</span>}
                  </div>
                  {it.removable ? (
                    <button onClick={() => removeItemRow(idx)} className="ml-2 text-red-500">✕</button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600">Service charge</label>
              <input value={String(serviceCharge)} onChange={(e) => setServiceCharge(e.target.value === '' ? '' : Number(e.target.value))} className="border rounded p-2 w-full" type="number" min={0} step="0.01" />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Total paid (technician items)</label>
              <div className="mt-2 font-semibold">${totals.paid.toFixed(2)}</div>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Total remaining</label>
              <div className="mt-2 font-semibold">${totals.remaining.toFixed(2)}</div>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">Total: <strong>${totals.total.toFixed(2)}</strong></div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !selectedIssue}>{saving ? 'Saving...' : 'Create Invoice'}</Button>
            </div>
          </div>
        </div>
      </div>

      {ToastContainer}
    </div>
  )
}
