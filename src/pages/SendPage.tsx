import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useWallet, useAccountBalance } from '../hooks/useMiden'
import { DEFAULT_TOKEN, formatAmount, parseAmount } from '../config/tokens'

function isValidAddress(addr: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(addr)
}

export function SendPage() {
  const { connected, connect, sendPayment } = useWallet()
  const { balance } = useAccountBalance()
  const [params] = useSearchParams()

  const [to, setTo] = useState(params.get('to') ?? '')
  const [amount, setAmount] = useState(params.get('amount') ?? '')
  const [memo, setMemo] = useState('')
  const [sending, setSending] = useState(false)
  const [addrError, setAddrError] = useState('')

  // Validate address as user types
  useEffect(() => {
    if (to && !isValidAddress(to)) {
      setAddrError('Must be a 64-char hex Miden address (0x…)')
    } else {
      setAddrError('')
    }
  }, [to])

  const token = DEFAULT_TOKEN
  const balanceFormatted = formatAmount(balance, token.decimals)

  async function handleSend() {
    if (!connected) { await connect(); return }
    if (!isValidAddress(to)) { toast.error('Invalid address'); return }

    let rawAmount: bigint
    try {
      rawAmount = parseAmount(amount, token.decimals)
      if (rawAmount <= 0n) throw new Error()
    } catch {
      toast.error('Enter a valid amount')
      return
    }

    if (rawAmount > balance) {
      toast.error('Insufficient balance')
      return
    }

    setSending(true)
    try {
      const noteId = await sendPayment(to, rawAmount, memo)
      toast.success(`Payment sent · note ${noteId.slice(0, 12)}…`)
      setTo('')
      setAmount('')
      setMemo('')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Transaction failed')
    } finally {
      setSending(false)
    }
  }

  const canSend = connected && to && !addrError && amount && !sending

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Balance chip */}
      {connected && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
          background: 'var(--bg3)',
          borderRadius: 'var(--radius)',
          border: '0.5px solid var(--border)',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>Available</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text2)' }}>
            {balanceFormatted} <span style={{ color: 'var(--accent2)' }}>MIDEN</span>
          </span>
        </div>
      )}

      {/* Main card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
          Send
        </h1>

        {/* Amount */}
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
            Amount
          </label>
          <div style={{ position: 'relative' }}>
            <input
              className="field"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ paddingRight: 70, fontSize: 22, fontWeight: 500 }}
            />
            <span style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              fontSize: 13, color: 'var(--accent2)', fontWeight: 500,
            }}>
              MIDEN
            </span>
          </div>
        </div>

        {/* To address */}
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
            Recipient address
          </label>
          <input
            className="field"
            type="text"
            placeholder="0x…"
            value={to}
            onChange={e => setTo(e.target.value.trim())}
            style={{ fontFamily: 'monospace', fontSize: 13 }}
          />
          {addrError && (
            <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 5 }}>{addrError}</p>
          )}
        </div>

        {/* Memo */}
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
            Memo <span style={{ color: 'var(--text3)', fontStyle: 'italic' }}>(private · stored in note)</span>
          </label>
          <input
            className="field"
            type="text"
            placeholder="What's this for?"
            maxLength={80}
            value={memo}
            onChange={e => setMemo(e.target.value)}
          />
        </div>

        {/* Privacy notice */}
        <div style={{
          display: 'flex', gap: 10, padding: '10px 14px',
          background: 'rgba(123,110,246,0.07)',
          borderRadius: 'var(--radius-sm)',
          border: '0.5px solid rgba(123,110,246,0.2)',
        }}>
          <LockIcon />
          <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
            This payment is private. Amount, sender, and receiver are hidden on-chain via Miden zero-knowledge proofs.
          </p>
        </div>

        {/* CTA */}
        <button
          className="btn-primary"
          onClick={handleSend}
          disabled={!!sending || (connected ? !canSend : false)}
          style={{ marginTop: 4 }}
        >
          {sending ? (
            <><span className="spinner" /> Sending…</>
          ) : !connected ? (
            'Connect wallet to send'
          ) : (
            'Send payment'
          )}
        </button>
      </div>
    </div>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <rect x="3" y="7" width="10" height="7" rx="2" stroke="#7b6ef6" strokeWidth="1.2"/>
      <path d="M5 7V5.5a3 3 0 016 0V7" stroke="#7b6ef6" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
