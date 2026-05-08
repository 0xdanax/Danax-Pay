import React, { useState } from 'react'
import { useWallet, useNoteHistory } from '../hooks/useMiden'
import { DEFAULT_TOKEN, formatAmount } from '../config/tokens'
import type { Note } from '../hooks/useMiden'

type Tab = 'all' | 'sent' | 'received'

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

function NoteRow({ note }: { note: Note }) {
  const token = DEFAULT_TOKEN
  const isSent = note.type === 'sent'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0',
      borderBottom: '0.5px solid var(--border)',
    }}>
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isSent ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)',
      }}>
        {isSent ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 2L2 7l4.5 1.5L14 2z" stroke="#f87171" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M6.5 8.5l1.5 4.5L14 2" stroke="#f87171" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v8M5 8l3 3 3-3" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 13h12" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            {isSent ? 'Sent' : 'Received'}
          </span>
          <span style={{
            fontSize: 14, fontWeight: 500,
            color: isSent ? 'var(--danger)' : 'var(--success)',
          }}>
            {isSent ? '−' : '+'}{formatAmount(note.amount, token.decimals)} MIDEN
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: 12, color: 'var(--text3)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180,
            fontFamily: 'monospace',
          }}>
            {note.counterparty.slice(0, 8)}…{note.counterparty.slice(-4)}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>
            {timeAgo(note.timestamp)}
          </span>
        </div>
        {note.memo && (
          <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3, fontStyle: 'italic' }}>
            {note.memo}
          </p>
        )}
        {note.status === 'pending' && (
          <span className="badge badge-pending" style={{ marginTop: 4 }}>Pending</span>
        )}
      </div>
    </div>
  )
}

export function HistoryPage() {
  const { connected, connect, connecting } = useWallet()
  const { sent, received, all } = useNoteHistory()
  const [tab, setTab] = useState<Tab>('all')

  if (!connected) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 16px' }}>
          <circle cx="22" cy="22" r="17" stroke="#7b6ef6" strokeWidth="1.4"/>
          <path d="M22 12v10l6 4" stroke="#7b6ef6" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Transaction history
        </h2>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>
          Connect your wallet to view your private transaction history.
        </p>
        <button className="btn-primary" onClick={connect} disabled={connecting}>
          {connecting ? <><span className="spinner" /> Connecting…</> : 'Connect wallet'}
        </button>
      </div>
    )
  }

  const notes = tab === 'all' ? all : tab === 'sent' ? sent : received

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>
        History
      </h1>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, padding: 4,
        background: 'var(--bg3)', borderRadius: 'var(--radius)',
        border: '0.5px solid var(--border)',
      }}>
        {(['all', 'sent', 'received'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '8px 0',
              borderRadius: 'var(--radius-sm)',
              background: tab === t ? 'var(--bg2)' : 'transparent',
              border: tab === t ? '0.5px solid var(--border2)' : '0.5px solid transparent',
              color: tab === t ? 'var(--text)' : 'var(--text3)',
              fontSize: 13, fontWeight: tab === t ? 500 : 400,
              transition: 'all 0.15s', cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {t}
            {t !== 'all' && (
              <span style={{ marginLeft: 5, fontSize: 11, color: 'var(--text3)' }}>
                {t === 'sent' ? sent.length : received.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card" style={{ padding: '4px 16px' }}>
        {notes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text3)' }}>
            <p style={{ fontSize: 14 }}>No transactions yet</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Your private notes will appear here</p>
          </div>
        ) : (
          notes.map(note => <NoteRow key={note.id} note={note} />)
        )}
      </div>

      {notes.length > 0 && (
        <p style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>
          All transactions are private · stored locally in your Miden client
        </p>
      )}
    </div>
  )
}
