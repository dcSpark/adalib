import { Cluster } from '../types/cluster'

export const mainnetBetaProjectSerum: Cluster = {
  name: 'mainnetBeta',
  id: '4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
  endpoint: `https://solana-api.projectserum.com`
}

export const mainnetBetaWalletConnect: (projectId: string) => Cluster = projectId => ({
  name: 'mainnetBeta',
  id: '4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ',
  endpoint: `https://rpc.walletconnect.com/v1?chainId=solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ&projectId=${projectId}`
})

export const testnet: Cluster = {
  name: 'testnet',
  id: '8E9rvCKLFQia2Y35HXjjpWzj8weVo44K',
  endpoint: 'https://api.testnet.solana.com'
}

export const devnet: Cluster = {
  name: 'devnet',
  id: '8E9rvCKLFQia2Y35HXjjpWzj8weVo44K',
  endpoint: 'https://api.devnet.solana.com'
}
