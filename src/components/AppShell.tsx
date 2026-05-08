import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useWallet, useNetwork } from '../hooks/useMiden'
import { NETWORKS, NetworkId } from '../config/networks'
import { Footer } from './Footer'

// ─── Danax Logo ──────────────────────────────────────────────────────────────

function DanaxLogo() {
  return (
    <svg width="110" height="28" viewBox="0 0 110 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Danax Pay">
      {/* D glyph — replace with real logo asset later */}
      <rect x="0" y="4" width="18" height="20" rx="4" fill="#7b6ef6"/>
      <rect x="4" y="8" width="8" height="12" rx="2" fill="#0a0a0f"/>
      <text x="24" y="21" fontFamily="'Syne', sans-serif" fontWeight="700" fontSize="16" fill="#f0f0f5" letterSpacing="-0.3">danax</text>
      <text x="80" y="21" fontFamily="'Syne', sans-serif" fontWeight="400" fontSize="13" fill="#7b6ef6">pay</text>
    </svg>
  )
}

// ─── Network Selector ─────────────────────────────────────────────────────────

function NetworkPill() {
  const { network, setNetwork, config } = useNetwork()

  function cycle() {
    const ids = Object.keys(NETWORKS) as NetworkId[]
    const next = ids[(ids.indexOf(network) + 1) % ids.length]
    setNetwork(next)
  }

  return (
    <button
      onClick={cycle}
      className={`badge ${network === 'testnet' ? 'badge-testnet' : 'badge-mainnet'}`}
      title="Switch network"
      style={{ cursor: 'pointer' }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: network === 'testnet' ? 'var(--accent2)' : 'var(--success)',
        display: 'inline-block',
        animation: network === 'testnet' ? 'pulse-ring 2s ease infinite' : undefined,
      }} />
      {config.label}
    </button>
  )
}

// ─── Wallet Button ────────────────────────────────────────────────────────────

function WalletButton() {
  const { connected, address, connecting, connect, disconnect } = useWallet()

  if (connecting) {
    return (
      <button className="btn-ghost" disabled style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="spinner" style={{ width: 14, height: 14 }} />
        Connecting
      </button>
    )
  }

  if (connected && address) {
    const short = `${address.slice(0, 6)}…${address.slice(-4)}`
    return (
      <button className="btn-ghost" onClick={disconnect} title="Click to disconnect">
        {short}
      </button>
    )
  }

  return (
    <button className="btn-ghost" onClick={connect} style={{ color: 'var(--accent2)', borderColor: 'rgba(123,110,246,0.35)' }}>
      Connect wallet
    </button>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { to: '/',        label: 'Send',    icon: SendIcon    },
  { to: '/receive', label: 'Receive', icon: ReceiveIcon },
  { to: '/history', label: 'History', icon: HistoryIcon },
]

function SendIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17 3L3 8.5l5.5 2L17 3z" stroke={active ? '#7b6ef6' : '#5a5a72'} strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M8.5 10.5l2 5.5L17 3" stroke={active ? '#7b6ef6' : '#5a5a72'} strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  )
}

function ReceiveIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v10M6 9l4 4 4-4" stroke={active ? '#7b6ef6' : '#5a5a72'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 15h14" stroke={active ? '#7b6ef6' : '#5a5a72'} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function HistoryIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke={active ? '#7b6ef6' : '#5a5a72'} strokeWidth="1.4"/>
      <path d="M10 6v4l3 2" stroke={active ? '#7b6ef6' : '#5a5a72'} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        height: 'var(--header-h)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '0.5px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)',
      }}>
        <DanaxLogo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <NetworkPill />
          <WalletButton />
        </div>
      </header>

      {/* Main content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 16px',
        paddingBottom: 'calc(var(--nav-h) + 24px)',
      }}>
        <div style={{ width: '100%', maxWidth: 'var(--max-w)' }} className="animate-fade-up">
          {children}
        </div>
        <Footer />
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-h)',
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(16px)',
        borderTop: '0.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        zIndex: 10,
      }}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <NavLink
              key={to}
              to={to}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '8px 20px',
                borderRadius: 10,
                transition: 'background 0.15s',
                background: active ? 'rgba(123,110,246,0.1)' : 'transparent',
                color: active ? 'var(--accent2)' : 'var(--text3)',
                fontSize: 11,
                fontWeight: active ? 500 : 400,
                letterSpacing: '0.03em',
              }}
            >
              <Icon active={active} />
              {label}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
