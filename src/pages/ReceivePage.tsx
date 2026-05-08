import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import { useWallet, useAccountBalance } from '../hooks/useMiden'
import { DEFAULT_TOKEN, formatAmount } from '../config/tokens'

export function ReceivePage() {
  const { connected, address, connect, connecting } = useWallet()
  const { balance } = useAccountBalance()
  const [requestAmount, setRequestAmount] = useState('')
  const [copied, setCopied] = useState(false)

  const token = DEFAULT_TOKEN
  const balanceFormatted = formatAmount(balance, token.decimals)

  function buildLink(): string {
    const base = window.location.origin
    const params = new URLSearchParams({ to: address ?? '' })
    if (requestAmount) params.set('amount', requestAmount)
    return `${base}/?${params.toString()}`
  }

  async function copyAddress() {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    toast.success('Address copied')
    setTimeout(() => setCopied(false), 2000)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(buildLink())
    toast.success('Payment link copied')
  }

  if (!connected) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ marginBottom: 20 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 16px' }}>
            <rect x="4" y="4" width="18" height="18" rx="3" stroke="#7b6ef6" strokeWidth="1.5"/>
            <rect x="26" y="4" width="18" height="18" rx="3" stroke="#7b6ef6" strokeWidth="1.5"/>
            <rect x="4" y="26" width="18" height="18" rx="3" stroke="#7b6ef6" strokeWidth="1.5"/>
            <rect x="8" y="8" width="10" height="10" rx="1.5" fill="#7b6ef6" opacity="0.4"/>
            <rect x="30" y="8" width="10" height="10" rx="1.5" fill="#7b6ef6" opacity="0.4"/>
            <rect x="8" y="30" width="10" height="10" rx="1.5" fill="#7b6ef6" opacity="0.4"/>
            <path d="M26 26h4M34 26h8M26 30v4M26 38h8M34 34h4M34 38h8" stroke="#7b6ef6" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            Connect to receive
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>
            Connect your Miden wallet to generate a receive address and QR code.
          </p>
        </div>
        <button className="btn-primary" onClick={connect} disabled={connecting}>
          {connecting ? <><span className="spinner" /> Connecting…</> : 'Connect wallet'}
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Balance */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 16px', background: 'var(--bg3)',
        borderRadius: 'var(--radius)', border: '0.5px solid var(--border)',
      }}>
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>Balance</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text2)' }}>
          {balanceFormatted} <span style={{ color: 'var(--accent2)' }}>MIDEN</span>
        </span>
      </div>

      {/* QR card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, alignSelf: 'flex-start' }}>
          Receive
        </h1>

        {/* QR */}
        <div style={{
          padding: 16, background: '#fff', borderRadius: 14,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
        }}>
          <QRCodeSVG
            value={buildLink()}
            size={192}
            bgColor="#ffffff"
            fgColor="#0a0a0f"
            level="M"
          />
        </div>

        {/* Address */}
        <div style={{ width: '100%' }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
            Your address
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{
              padding: '12px 48px 12px 14px',
              background: 'var(--bg3)', borderRadius: 'var(--radius)',
              border: '0.5px solid var(--border2)',
              fontFamily: 'monospace', fontSize: 11,
              color: 'var(--text2)', wordBreak: 'break-all', lineHeight: 1.6,
            }}>
              {address}
            </div>
            <button
              onClick={copyAddress}
              style={{
                position: 'absolute', top: 10, right: 10,
                padding: '4px 8px', borderRadius: 6,
                background: copied ? 'rgba(74,222,128,0.15)' : 'var(--bg2)',
                border: '0.5px solid var(--border2)',
                color: copied ? 'var(--success)' : 'var(--text3)',
                fontSize: 11, transition: 'all 0.2s',
              }}
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Request specific amount */}
        <div style={{ width: '100%' }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
            Request amount <span style={{ color: 'var(--text3)', fontStyle: 'italic' }}>(optional)</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              className="field"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={requestAmount}
              onChange={e => setRequestAmount(e.target.value)}
              style={{ paddingRight: 70 }}
            />
            <span style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              fontSize: 13, color: 'var(--accent2)', fontWeight: 500,
            }}>
              MIDEN
            </span>
          </div>
        </div>

        {/* Share link */}
        <button className="btn-ghost" onClick={copyLink} style={{ width: '100%', textAlign: 'center', color: 'var(--accent2)', borderColor: 'rgba(123,110,246,0.35)' }}>
          Copy payment link
        </button>
      </div>

      {/* Privacy note */}
      <div style={{
        display: 'flex', gap: 10, padding: '12px 16px',
        background: 'rgba(123,110,246,0.05)',
        borderRadius: 'var(--radius-sm)',
        border: '0.5px solid rgba(123,110,246,0.15)',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M8 2L2.5 4.5v4c0 3 2.5 5 5.5 5.5C10.5 13.5 13 11.5 13 8.5v-4L8 2z" stroke="#7b6ef6" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
        <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
          Incoming payments are private. Senders cannot see your balance or any other notes in your wallet.
        </p>
      </div>
    </div>
  )
}
