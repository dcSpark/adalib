export interface ConnectResponse {
  publicKey: string
}

export interface Provider {
  connect: () => Promise<void>
  disconnect: () => void
}
