// src/api/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './client'

/**
 * Fetch issues assigned to a technician.
 * - If `reg` is provided, call the backwards-compatible endpoint:
 *    /issues/assigned_to_technician/?tech=<reg>&page=<page>
 * - Otherwise call authenticated endpoint:
 *    /issues/mine/?page=<page>
 */
export function useTechnicianIssues(reg?: string | undefined, page = 1) {
  const keyReg = reg || 'mine'
  return useQuery(['tech-issues', keyReg, page], async () => {
    const url = reg
      ? `/issues/assigned_to_technician/?tech=${encodeURIComponent(reg)}&page=${page}`
      : `/issues/mine/?page=${page}`
    const res = await api.get(url)
    return res.data
  }, { keepPreviousData: true })
}

export function useIssue(id: string) {
  return useQuery(['issue', id], async () => {
    const res = await api.get(`/issues/${id}/`)
    return res.data
  })
}

export function useAddTreatment() {
  const qc = useQueryClient()
  return useMutation((payload: any) => api.post('/treatments/', payload), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['issue'] })
  })
}

export function useAddItem() {
  const qc = useQueryClient()
  return useMutation((payload: any) => api.post('/items/', payload), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['issue'] })
  })
}

export function useAddRecommendation() {
  const qc = useQueryClient()
  return useMutation((payload: any) => api.post('/recommendations/', payload), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['issue'] })
  })
}

export function useChangeStatus() {
  const qc = useQueryClient()
  return useMutation(({ id, status }: any) => api.post(`/issues/${id}/change_status/`, { status }), {
    onSuccess: (_, vars) => qc.invalidateQueries(['issue', vars.id])
  })
}
