import type { PublicKey } from '@solana/web3.js'
import { SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'
import type BN from 'bn.js'
import base58 from 'bs58'
import {
  NAME_OFFERS_ID,
  NAME_PROGRAM_ID,
  REVERSE_LOOKUP_CLASS,
  ROOT_DOMAIN_ACCOUNT
} from '../constants/splNameService'
import { getAddress, getCluster, getNewRequestId } from '../store'
import type {
  AccountInfo,
  ClusterRequestMethods,
  ClusterSubscribeRequestMethods,
  FilterObject,
  RequestMethods,
  TransactionArgs,
  TransactionType
} from '../types/requests'
import { registerListener, unregisterListener } from '../utils/clusterFactory'
import { getHashedName, getNameAccountKey } from '../utils/hash'
import borsh from 'borsh'
import { Buffer } from 'buffer'
import { FavouriteDomain, NameRegistry } from '../utils/nameService'
import type { BlockResult } from '../types/block'

export interface Connector {
  isEnabled: () => Promise<boolean>
  /*
   * GetConnectorName: () => string
   * disconnect: () => Promise<void> unavailable in cardano dapp / managed by wallet
   */
  enable: () => Promise<Omit<typeof window.cardano, 'enable' | 'isEnabled'>>
  signMessage: (message: string) => Promise<string>
  signTransaction: <Type extends TransactionType>(
    type: Type,
    params: TransactionArgs[Type]['params']
  ) => Promise<string>
  sendTransaction: (encodedTransaction: string) => Promise<string>
  getAccount: (
    requestedAddress?: string,
    encoding?: 'base58' | 'base64' | 'jsonParsed'
  ) => Promise<AccountInfo | null>
  signAndSendTransaction: <Type extends TransactionType>(
    type: Type,
    params: TransactionArgs[Type]['params']
  ) => Promise<string>
  getBalance: (requestedAddress?: string) => Promise<{
    formatted: string
    value: BN
    decimals: number
    symbol: string
  } | null>
  getTransaction: (
    transactionSignature: string
  ) => Promise<ClusterRequestMethods['getTransaction']['returns']>
  watchTransaction: (
    transactionSignature: string,
    callback: (params: unknown) => void
  ) => Promise<() => void>
  getSolDomainsFromPublicKey: (address: string) => Promise<string[]>
  getAddressFromDomain: (address: string) => Promise<string | null>
  getFavoriteDomain: (address: string) => Promise<{ domain: PublicKey; reverse: string } | null>
  getBlock: (slot: number) => Promise<BlockResult | null>
  getFeeForMessage: <Type extends TransactionType>(
    type: Type,
    params: TransactionArgs[Type]['params']
  ) => Promise<number>
}

// Look at the cardano library to adapt it for this implementation
export class BaseConnector {
  public getConnectorName() {
    return 'base'
  }

  // Solana specific
  protected async getProvider(): Promise<{
    /* eslint-disable @typescript-eslint/no-explicit-any */
    request: (args: any) => any
  }> {
    return Promise.reject(new Error('No provider in base connector'))
  }

  // Tx construction is dapp responsibility

  public async sendTransaction(encodedTransaction: string) {
    /*
     * Const signature = await this.requestCluster('sendTransaction', [encodedTransaction])
     * return signature
     */
  }

  public async request<Method extends keyof RequestMethods>(
    method: Method,
    params: RequestMethods[Method]['params']
  ): Promise<RequestMethods[Method]['returns']> {
    return (await this.getProvider()).request({ method, params })
  }
}
