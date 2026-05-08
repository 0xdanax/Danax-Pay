export interface TokenConfig {
  symbol: string
  name: string
  decimals: number
  faucetId: string | null
  isNative: boolean
}

export const TOKENS: TokenConfig[] = [
  {
    symbol: 'MIDEN',
    name: 'Miden',
    decimals: 8,
    faucetId: null, // set from faucet deployment
    isNative: true,
  },
]

export const DEFAULT_TOKEN = TOKENS[0]

export function formatAmount(raw: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals)
  const whole = raw / divisor
  const frac = raw % divisor
  if (frac === 0n) return whole.toString()
  const fracStr = frac.toString().padStart(decimals, '0').replace(/0+$/, '')
  return `${whole}.${fracStr}`
}

export function parseAmount(input: string, decimals: number): bigint {
  const [whole, frac = ''] = input.split('.')
  const fracPadded = frac.slice(0, decimals).padEnd(decimals, '0')
  return BigInt(whole + fracPadded)
}
