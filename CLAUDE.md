# Danax Pay — CLAUDE.md

Private payment app built on Miden. Wallet-to-wallet only. No social IDs, no yield, no points.

## Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: react-router-dom v6
- **Miden**: hooks in `src/hooks/useMiden.tsx` — currently mocked, swap in `@miden-sdk/react` when available
- **Toasts**: react-hot-toast
- **QR**: qrcode.react
- **Fonts**: Syne (display) + DM Sans (body) via Google Fonts

## Project structure

```
danax-pay/
  index.html                   # Entry HTML
  src/
    main.tsx                   # React root
    App.tsx                    # Router + providers
    config/
      networks.ts              # Miden testnet + mainnet RPC config
      tokens.ts                # MIDEN native token, formatAmount, parseAmount
    hooks/
      useMiden.tsx             # MidenProvider, useWallet, useAccountBalance,
                               # useNoteHistory, useNetwork
    components/
      AppShell.tsx             # Header, NetworkPill, WalletButton, BottomNav, Footer
      Footer.tsx               # FAQ accordion + footer links (no For Business)
    pages/
      SendPage.tsx             # Send screen — address + amount + memo
      ReceivePage.tsx          # Receive screen — QR + copyable address + payment link
      HistoryPage.tsx          # History — all/sent/received tabs
    styles/
      globals.css              # Design tokens, utility classes, animations
```

## Design system

All tokens are in `globals.css` `:root`. Key values:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0a0f` | Page background |
| `--bg2` | `#111118` | Card background |
| `--bg3` | `#181824` | Input / inner surface |
| `--accent` | `#7b6ef6` | Primary purple |
| `--accent2` | `#9d92f8` | Lighter purple (labels, links) |
| `--text` | `#f0f0f5` | Primary text |
| `--text2` | `#9898b0` | Secondary text |
| `--text3` | `#5a5a72` | Muted / placeholder |
| `--font-display` | Syne | Headings, buttons |
| `--font-body` | DM Sans | Body, inputs |

## Network switching

The header `NetworkPill` cycles between `testnet` and `mainnet` on click. Network state is persisted in the `MidenProvider` via `localStorage`. The `mainnet.isLive` flag in `networks.ts` is currently `false` — set to `true` when Miden mainnet launches and optionally disable the toggle until then.

## Miden SDK integration

`src/hooks/useMiden.tsx` exposes these hooks with a mock implementation:

| Hook | Returns | Real SDK equivalent |
|---|---|---|
| `useWallet()` | full wallet state + actions | `useWallet()` from `@miden-sdk/react` |
| `useAccountBalance()` | `{ balance, refresh }` | query spendable note commitments |
| `useNoteHistory()` | `{ sent, received, all }` | read local Miden client note store |
| `useNetwork()` | `{ network, setNetwork, config }` | provider-level network config |

**To replace mocks with the real SDK:**
1. `yarn add @miden-sdk/react`
2. Replace `MidenProvider` body with the real SDK provider wrapping
3. Replace `connect/sendPayment/consumeNote` with real SDK calls
4. Keep the same hook signatures — pages don't need to change

### Key SDK calls (real implementation reference)

```typescript
// Send a private P2P note
await client.createNote({
  recipient: recipientAddress,
  amount: rawAmount,
  token: faucetId,
  noteType: 'private',
})

// Consume incoming notes
await client.consumeNotes(pendingNoteIds)

// Query balance
const notes = await client.getSpendableNotes()
const balance = notes.reduce((sum, n) => sum + n.amount, 0n)
```

## Payment link format

```
/?to=0x{address}&amount={amount}
```

The `SendPage` reads `?to` and `?amount` from URL params on mount and pre-fills the form. The `ReceivePage` generates links from the connected wallet address + optional request amount.

## Logo

Placeholder SVG wordmark is inlined in `AppShell.tsx` inside the `DanaxLogo` component. To replace:
1. Add your logo file as `public/danax-logo.svg` (or `.png`)
2. Replace the `<DanaxLogo>` component with `<img src="/danax-logo.svg" height={28} alt="Danax Pay" />`

## Features intentionally excluded

- Email / Twitter / social username payments (Loofta feature — removed)
- APY / Morpho Vault yield display
- Points / rewards system
- Burner wallet
- Fee breakdown UI
- "For Business" footer section (Checkout, Partners links)

## Running locally

```bash
cd danax-pay
yarn install
yarn dev       # http://localhost:3000
yarn build     # production build → dist/
yarn typecheck # TypeScript check
```

## Extending

- **Add a Settings page**: create `src/pages/SettingsPage.tsx`, add route in `App.tsx`, add nav item in `AppShell.tsx`
- **Add more tokens**: extend `TOKENS` array in `src/config/tokens.ts`
- **Add note explorer links**: use `config.explorerUrl` from `useNetwork()` to link to block explorer once deployed
- **Mainnet launch**: set `NETWORKS.mainnet.isLive = true` in `networks.ts`
