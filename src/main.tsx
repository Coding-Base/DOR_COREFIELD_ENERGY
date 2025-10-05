// main.tsx (change only the BrowserRouter line)
import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import TechnicianDashboard from './pages/TechnicianDashboard'
import IssueDetail from './pages/IssueDetail'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import TechnicianRegister from './pages/TechnicianRegister'
import AdminRegister from './pages/AdminRegister'
import HomePage from './components/Home'
import AboutPage from './components/About'
import ContactPage from './components/Contact'
import Privacy from './components/Privacy'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* enable React Router future flags to opt-in early and silence warnings */}
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/privacy" element={<Privacy/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/technician" element={<TechnicianRegister />} />
          <Route path="/register/admin" element={<AdminRegister />} />
          <Route path="/tech/:reg/" element={<TechnicianDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/issues/:id" element={<IssueDetail />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

createRoot(document.getElementById('root')!).render(<App />)

