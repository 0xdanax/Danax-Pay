import React, { useState } from 'react'

interface FaqItem {
  q: string
  a: React.ReactNode
}

const FAQ: FaqItem[] = [
  {
    q: 'How does Miden privacy work?',
    a: 'Danax Pay uses Miden\'s zero-knowledge proof system. Every payment creates a private note — the amount, sender address, and receiver address are never revealed on-chain. Only the two parties involved can read the note contents.',
  },
  {
    q: 'Which wallets are supported?',
    a: 'Danax Pay is designed for native Miden wallets. Support for additional signers will be added as the Miden ecosystem grows. In the meantime, your wallet is managed locally via the Miden client SDK.',
  },
  {
    q: 'Can I send to someone before they have an account?',
    a: 'Yes. Miden notes can be sent to any valid wallet address. The recipient claims the note by connecting their wallet — the payment sits in a committed state until it is consumed.',
  },
  {
    q: 'Is Danax Pay non-custodial?',
    a: 'Yes. Your private keys never leave your device. Danax Pay only constructs and submits zero-knowledge transactions — it never has access to your funds.',
  },
  {
    q: 'What is Testnet?',
    a: 'Testnet is Miden\'s public test network. Transactions on testnet use test MIDEN tokens with no real value. You can get test tokens from the Miden faucet. Switch to Mainnet in the header once Miden mainnet is live.',
  },
]

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '0.5px solid var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '16px 0', background: 'none', cursor: 'pointer',
          color: 'var(--text)', fontSize: 14, fontWeight: 500, textAlign: 'left',
        }}
      >
        {item.q}
        <span style={{
          fontSize: 18, color: 'var(--accent2)',
          transform: open ? 'rotate(45deg)' : 'none',
          transition: 'transform 0.2s',
          display: 'inline-block',
          flexShrink: 0,
          marginLeft: 12,
        }}>+</span>
      </button>
      {open && (
        <div style={{
          paddingBottom: 16, fontSize: 13.5, color: 'var(--text2)',
          lineHeight: 1.65,
          animation: 'fadeUp 0.2s ease both',
        }}>
          {item.a}
        </div>
      )}
    </div>
  )
}

export function Footer() {
  return (
    <footer style={{
      borderTop: '0.5px solid var(--border)',
      marginTop: 48,
      padding: '48px 20px 40px',
      background: 'var(--bg2)',
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* FAQ */}
        <div style={{ maxWidth: 600, margin: '0 auto 48px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
            marginBottom: 4,
          }}>
            Frequently asked questions
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>
            Everything you need to know about private payments on Miden.
          </p>
          {FAQ.map(item => <FaqRow key={item.q} item={item} />)}
        </div>

        {/* Footer links */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 32, paddingTop: 32, borderTop: '0.5px solid var(--border)',
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>For you</p>
            {[['Send', '/'], ['Receive', '/receive'], ['History', '/history']].map(([label, href]) => (
              <a key={label} href={href} style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}
              >{label}</a>
            ))}
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Company</p>
            <a href="/about" style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>About</a>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Socials & docs</p>
            {[
              ['Twitter', 'https://twitter.com/danaxpay'],
              ['Telegram', 'https://t.me/danaxpay'],
              ['Docs', 'https://docs.danaxpay.xyz'],
              ['Miden', 'https://miden.io'],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 10, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}
              >{label}</a>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 40, textAlign: 'center' }}>
          © {new Date().getFullYear()} Danax Pay. Built on Miden. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
