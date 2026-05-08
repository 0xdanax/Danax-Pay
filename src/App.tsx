import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { MidenProvider } from './hooks/useMiden'
import { AppShell } from './components/AppShell'
import { SendPage } from './pages/SendPage'
import { ReceivePage } from './pages/ReceivePage'
import { HistoryPage } from './pages/HistoryPage'
import './styles/globals.css'

export default function App() {
  return (
    <MidenProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<SendPage />} />
            <Route path="/receive" element={<ReceivePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#181824',
              color: '#f0f0f5',
              border: '0.5px solid rgba(255,255,255,0.12)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              borderRadius: '10px',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#0a0a0f' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#0a0a0f' } },
          }}
        />
      </BrowserRouter>
    </MidenProvider>
  )
}
