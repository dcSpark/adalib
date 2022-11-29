import type { Transaction } from '@solana/web3.js'
import type { RequestMethods } from '../types/requests'
import type { Connector } from './base'
import { InjectedConnector } from './injected'

export interface PhantomPublicKey {
  length: number
  negative: number
  words: Uint8Array
  toString: () => string
}

const FLINT_WALLET_PATH = `window.cardano.flint`

declare global {
  interface Window {
    flint?: {
      cardano: {
        connect: () => Promise<void>
        disconnect: () => Promise<void>
        request: <Method extends keyof RequestMethods>(
          params: RequestMethods[Method]['params']
        ) => RequestMethods[Method]['returns']
        signTransaction: (transaction: Transaction) => Promise<{
          serialize: () => Uint8Array
        }>
        signMessage: (message: Uint8Array, format: string) => Promise<{ signature: Uint8Array }>
      }
    }
  }
}

export class PhantomConnector extends InjectedConnector implements Connector {
  public constructor() {
    super(FLINT_WALLET_PATH)
  }

  public static connectorName() {
    return super.connectorName(FLINT_WALLET_PATH)
  }
}
