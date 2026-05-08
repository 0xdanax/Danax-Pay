export type NetworkId = 'testnet' | 'mainnet'

export interface NetworkConfig {
  id: NetworkId
  label: string
  rpcUrl: string
  faucetUrl: string | null
  explorerUrl: string | null
  isLive: boolean
}

export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  testnet: {
    id: 'testnet',
    label: 'Testnet',
    rpcUrl: 'https://rpc.testnet.miden.io',
    faucetUrl: 'https://faucet.testnet.miden.io',
    explorerUrl: 'https://explorer.testnet.miden.io',
    isLive: true,
  },
  mainnet: {
    id: 'mainnet',
    label: 'Mainnet',
    rpcUrl: 'https://rpc.miden.io',
    faucetUrl: null,
    explorerUrl: 'https://explorer.miden.io',
    isLive: false, // set to true when Miden mainnet launches
  },
}

export const DEFAULT_NETWORK: NetworkId = 'testnet'
