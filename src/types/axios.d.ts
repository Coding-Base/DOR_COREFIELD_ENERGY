// src/types/axios.d.ts
import 'axios'

declare module 'axios' {
  // augment AxiosRequestConfig with our custom option
  interface AxiosRequestConfig {
    // mark optional - used by our interceptor to skip attaching Authorization
    skipAuth?: boolean
  }
}
