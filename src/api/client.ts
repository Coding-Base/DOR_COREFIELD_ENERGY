import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api',
})

// Endpoints that should never carry Authorization header
const NO_AUTH = [
  '/auth/admin-register/',
  '/auth/technician-register/',
  '/auth/token/',
  '/auth/token/refresh/',
]

// small helper to check url endings
function isNoAuthUrl(url?: string) {
  if (!url) return false
  return NO_AUTH.some(path => url.endsWith(path))
}

// queue to hold pending requests while refreshing token
let isRefreshing = false
let failedQueue: {
  resolve: (value?: any) => void
  reject: (reason?: any) => void
  config: InternalAxiosRequestConfig
}[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error)
    else {
      if (token && p.config.headers) p.config.headers['Authorization'] = `Bearer ${token}`
      p.resolve(api.request(p.config))
    }
  })
  failedQueue = []
}

// attach JWT token if present, but respect skipAuth or NO_AUTH
api.interceptors.request.use((config: InternalAxiosRequestConfig & { skipAuth?: boolean } = {} as any) => {
  // If caller explicitly sets skipAuth, do not attach Authorization header
  if (config.skipAuth) return config

  // Also skip for known NO_AUTH endpoints
  if (isNoAuthUrl(config.url)) return config

  const token = localStorage.getItem('access')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

// response interceptor to handle refresh when access token expired
api.interceptors.response.use((response) => response, async (error: AxiosError & { config?: AxiosRequestConfig }) => {
  const originalConfig = error.config as AxiosRequestConfig & { _retry?: boolean }

  if (!error.response) {
    // network error or CORS issue
    return Promise.reject(error)
  }

  // If the request itself was to token refresh or token endpoints, just reject
  if (isNoAuthUrl(originalConfig?.url)) {
    return Promise.reject(error)
  }

  const status = error.response.status
  const data = (error.response.data as any) || {}

  const tokenNotValid =
    status === 401 &&
    (data.code === 'token_not_valid' ||
      (Array.isArray(data.messages) && data.messages.some((m: any) => /expired/i.test(String(m.message || '')))) ||
      /Token is expired/i.test(String(data.detail || '')))

  if (!tokenNotValid) {
    return Promise.reject(error)
  }

  // If already trying to refresh, queue the request
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject, config: originalConfig as InternalAxiosRequestConfig })
    })
  }

  originalConfig._retry = true
  isRefreshing = true

  const refreshToken = localStorage.getItem('refresh')

  if (!refreshToken) {
    // No refresh token -> force logout (clear tokens) and reject
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    isRefreshing = false
    return Promise.reject(error)
  }

  try {
    // attempt to refresh
    const resp = await api.post('/auth/token/refresh/', { refresh: refreshToken }, { skipAuth: true })
    const newAccess = (resp.data && resp.data.access) ? resp.data.access : null

    if (!newAccess) {
      // refresh failed
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      processQueue(new Error('Refresh token failed'), null)
      isRefreshing = false
      return Promise.reject(error)
    }

    // store new access token
    localStorage.setItem('access', newAccess)

    // update original request Authorization header and retry
    if (originalConfig.headers) originalConfig.headers['Authorization'] = `Bearer ${newAccess}`

    processQueue(null, newAccess)
    isRefreshing = false

    return api.request(originalConfig)
  } catch (err) {
    // refresh failed - clear tokens and reject queued requests
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    processQueue(err, null)
    isRefreshing = false
    return Promise.reject(err)
  }
})

export default api
