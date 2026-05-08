import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { NetworkId, DEFAULT_NETWORK, NETWORKS } from '../config/networks'

// ---------------------------------------------------------------------------
// Types — mirror @miden-sdk/react surface area so swapping in the real SDK
// only requires updating this file.
// ---------------------------------------------------------------------------

export interface Note {
  id: string
  type: 'sent' | 'received'
  counterparty: string
  amount: bigint
  token: string
  memo: string
  timestamp: number
  status: 'pending' | 'committed' | 'consumed'
  blockHeight?: number
}

export interface WalletState {
  connected: boolean
  address: string | null
  balance: bigint
  notes: Note[]
  network: NetworkId
  connecting: boolean
  error: string | null
}

interface WalletActions {
  connect: () => Promise<void>
  disconnect: () => void
  setNetwork: (n: NetworkId) => void
  sendPayment: (to: string, amount: bigint, memo: string) => Promise<string>
  consumeNote: (noteId: string) => Promise<void>
  refreshBalance: () => Promise<void>
}

type WalletCtx = WalletState & WalletActions

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const WalletContext = createContext<WalletCtx | null>(null)

// ---------------------------------------------------------------------------
// Mock helpers — replace with real Miden SDK calls
// ---------------------------------------------------------------------------

function mockAddress(): string {
  const hex = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  return `0x${hex}`
}

function mockNoteId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

const STORAGE_KEY = 'danax_wallet_state'

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function MidenProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        return {
          ...parsed,
          balance: BigInt(parsed.balance ?? 0),
          notes: (parsed.notes ?? []).map((n: Note & { amount: string }) => ({
            ...n,
            amount: BigInt(n.amount),
          })),
          connecting: false,
          error: null,
        }
      }
    } catch {}
    return {
      connected: false,
      address: null,
      balance: 0n,
      notes: [],
      network: DEFAULT_NETWORK,
      connecting: false,
      error: null,
    }
  })

  // Persist to localStorage (serialize BigInt as string)
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        balance: state.balance.toString(),
        notes: state.notes.map((n) => ({ ...n, amount: n.amount.toString() })),
      })
    )
  }, [state])

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, connecting: true, error: null }))
    await new Promise((r) => setTimeout(r, 1200)) // simulate SDK init
    const addr = mockAddress()
    setState((s) => ({
      ...s,
      connecting: false,
      connected: true,
      address: addr,
      balance: 5_000_000_000n, // 50 MIDEN (8 decimals)
    }))
  }, [])

  const disconnect = useCallback(() => {
    setState((s) => ({
      ...s,
      connected: false,
      address: null,
      balance: 0n,
      notes: [],
      error: null,
    }))
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const setNetwork = useCallback((network: NetworkId) => {
    setState((s) => ({ ...s, network }))
  }, [])

  const sendPayment = useCallback(
    async (to: string, amount: bigint, memo: string): Promise<string> => {
      if (!state.connected) throw new Error('Wallet not connected')
      if (amount > state.balance) throw new Error('Insufficient balance')
      await new Promise((r) => setTimeout(r, 1800)) // simulate note creation
      const noteId = mockNoteId()
      setState((s) => ({
        ...s,
        balance: s.balance - amount,
        notes: [
          {
            id: noteId,
            type: 'sent',
            counterparty: to,
            amount,
            token: 'MIDEN',
            memo,
            timestamp: Date.now(),
            status: 'committed',
            blockHeight: Math.floor(Math.random() * 100000) + 1,
          },
          ...s.notes,
        ],
      }))
      return noteId
    },
    [state.connected, state.balance]
  )

  const consumeNote = useCallback(async (noteId: string) => {
    await new Promise((r) => setTimeout(r, 1000))
    setState((s) => ({
      ...s,
      notes: s.notes.map((n) =>
        n.id === noteId ? { ...n, status: 'consumed' as const } : n
      ),
    }))
  }, [])

  const refreshBalance = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 600))
    // In production: query Miden node for spendable note commitments
  }, [])

  const ctx: WalletCtx = {
    ...state,
    connect,
    disconnect,
    setNetwork,
    sendPayment,
    consumeNote,
    refreshBalance,
  }

  return <WalletContext.Provider value={ctx}>{children}</WalletContext.Provider>
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useWallet(): WalletCtx {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside MidenProvider')
  return ctx
}

export function useAccountBalance() {
  const { balance, refreshBalance } = useWallet()
  return { balance, refresh: refreshBalance }
}

export function useNoteHistory() {
  const { notes } = useWallet()
  return {
    sent: notes.filter((n) => n.type === 'sent'),
    received: notes.filter((n) => n.type === 'received'),
    all: notes,
  }
}

export function useNetwork() {
  const { network, setNetwork } = useWallet()
  return { network, setNetwork, config: NETWORKS[network] }
}
