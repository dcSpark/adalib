import type { Transaction } from '@solana/web3.js'

export interface ClusterSubscribeRequestMethods {
  signatureSubscribe: {
    params: string[]
    returns: Transaction
  }
  signatureUnsubscribe: {
    params: number[]
    returns: unknown
  }
}
export interface ClusterRequestMethods {
  sendTransaction: {
    // Signed, serialized transaction
    params: string[]
    returns: string
  }

  getBalance: {
    params: string[]
    returns: {
      value: number
    }
  }

  getLatestBlockhash: {
    params: [{ commitment?: string }]
    returns: {
      value: {
        blockhash: string
      }
    }
  }
}

export interface TransactionInstruction {
  programId: string
  data: string
  keys: { isSigner: boolean; isWritable: boolean; pubkey: string }[]
}

export interface RequestMethods {
  solana_signMessage: {
    params: {
      message: string
      pubkey: string
    }
    returns: {
      signature: string
    }
  }
  solana_signTransaction: {
    params: {
      feePayer: string
      instructions: TransactionInstruction[]
      recentBlockhash: string
      signatures?: { pubkey: string; signature: string }[]
    }
    returns: {
      signature: string
    }
  }
  signMessage: {
    params: {
      message: Uint8Array
      format: string
    }
    returns: {
      signature: string
    }
  }

  signTransaction: {
    params: {
      // Serialized transaction
      message: string
    }
    returns: {
      serialize: () => string
    }
  }
}

export interface TransactionArgs {
  transfer: {
    to: string
    amountInLamports: number
    feePayer: 'from' | 'to'
  }
}
export type TransactionType = keyof TransactionArgs
