import api from './client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * Queries
 */

export function useCustomersList(enabled = true) {
  return useQuery(['customers'], async () => {
    const res = await api.get('/customers/')
    return res.data
  }, { enabled })
}

export function useVehicleModelsList(enabled = true) {
  return useQuery(['vehicle-models'], async () => {
    const res = await api.get('/vehicle-models/')
    return res.data
  }, { enabled })
}

export function useTechniciansList(enabled = true) {
  return useQuery(['technicians'], async () => {
    const res = await api.get('/technicians/')
    return res.data
  }, { enabled })
}

/**
 * Vehicles for a given customer
 */
export function useVehiclesForCustomer(customerId?: number | string) {
  return useQuery(
    ['customer-vehicles', customerId],
    async () => {
      const res = await api.get('/vehicles/', { params: { owner: customerId } })
      return res.data
    },
    { enabled: !!customerId }
  )
}

/**
 * Single issue fetch (used by invoice preview)
 */
export function useIssueById(issueId?: string | number) {
  return useQuery(
    ['issue', issueId],
    async () => {
      const res = await api.get(`/issues/${issueId}/`)
      return res.data
    },
    { enabled: !!issueId }
  )
}

/**
 * Mutations
 */

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation((payload: any) => api.post('/customers/', payload), {
    onSuccess: () => qc.invalidateQueries(['customers'])
  })
}

export function useCreateVehicleModel() {
  const qc = useQueryClient()
  return useMutation((payload: any) => api.post('/vehicle-models/', payload), {
    onSuccess: () => qc.invalidateQueries(['vehicle-models'])
  })
}

/**
 * createVehicle expects either JSON { owner, model, plate_number, color } OR
 * FormData when a photo is provided (the component will pass FormData).
 */
export function useCreateVehicle() {
  const qc = useQueryClient()
  return useMutation((payload: any) => {
    // if payload is FormData, axios will set proper headers
    return api.post('/vehicles/', payload, {
      headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    })
  }, {
    onSuccess: () => {
      qc.invalidateQueries(['customer-vehicles'])
      qc.invalidateQueries(['vehicles'])
    }
  })
}

export function useCreateIssue() {
  const qc = useQueryClient()
  return useMutation((payload: any) => api.post('/issues/', payload), {
    onSuccess: () => qc.invalidateQueries(['issues'])
  })
}

export function useCreateInvoice() {
  const qc = useQueryClient()
  return useMutation((payload: any) => api.post('/invoices/', payload), {
    onSuccess: () => qc.invalidateQueries(['invoices'])
  })
}
