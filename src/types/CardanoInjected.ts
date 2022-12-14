/* eslint-disable capitalized-comments */
import type { Transaction } from '@solana/web3.js';
import type { BlockResult } from './block';
import type { TransactionResult } from './transaction';

// BEGIN CARDANO

// Fake types just to make the API more readable
type HexString = string;
export type Cbor<_T> = string;
type Hash32 = string;

export interface Paginate {
  page: number;
  limit: number;
}

export interface CardanoInjectorFields {
  apiVersion: string;
  name: string;
  icon: string;
}

export interface CardanoInjectorEventMethods {
  onAccountChangeTrigger: (addresses: Cbor<'address'>[]) => Promise<undefined>;
  onNetworkChangeTrigger: (network: number) => Promise<undefined>;
}

/** Enable is, for backwards-compatibility reasons, overridden in two places */
interface EnableOverride {
  enable: () => Promise<Omit<typeof window.cardano, 'enable' | 'isEnabled'>>;
}

export const PER_WALLET_NAMESPACE = {
  enable: 'enable',
  isEnabled: 'isEnabled'
} as const;
export type PerWalletNamespace = CardanoInjectorFields &
  EnableOverride &
  Pick<CardanoContentScriptApi, Exclude<keyof typeof PER_WALLET_NAMESPACE, 'enable'>>;

export interface DataSignature {
  signature: Cbor<'CoseSign1'>;
  key: Cbor<'CoseKey'>;
}
export type InjectAsWallet = [] | [string];
/* Functions not part of CIP30 that may or may not be standardized */
export const SUPPORTED_EXPERIMENTAL_MESSAGES = {
  getCollateral: 'getCollateral'
} as const;
/* Messages used to debug Flint or integration w/ Flint. Only in dev builds */
export const DEBUG_MESSAGES = {
  openDebug: 'openDebug'
} as const;

export type CardanoContentScriptApi = CardanoInjectorEventMethods & {
  enable: () => Promise<true>;
  isEnabled: () => Promise<boolean>;
  getNetworkId: () => Promise<number>;
  getUtxos: (
    amount?: Cbor<'Value'>,
    paginate?: Paginate
  ) => Promise<Cbor<'TransactionUnspentOutput'>[] | undefined>;
  getBalance: () => Promise<Cbor<'value'>>;
  getUsedAddresses: (paginate?: Paginate) => Promise<Cbor<'address'>[]>;
  getUnusedAddresses: (paginate?: Paginate) => Promise<Cbor<'address'>[]>;
  getChangeAddress: () => Promise<Cbor<'address'>>;
  getRewardAddress: () => Promise<Cbor<'address'>>;
  getRewardAddresses: () => Promise<Cbor<'address'>[] | undefined>;
  signTx: (
    tx: Cbor<'transaction'>,
    partialSign?: boolean
  ) => Promise<Cbor<'transaction_witness_set'>>;
  signData: (addr: Cbor<'address'>, payload: HexString) => Promise<DataSignature>;
  submitTx: (tx: Cbor<'transaction'>) => Promise<Hash32>;

  // Should be protected, but we call it from the website part of content script, so it's external
  getInjectAs?: () => Promise<InjectAsWallet>;

  // Debug messages
  openDebug?: () => Promise<undefined>;

  // Experimental
  getCollateral: () => Promise<Cbor<'TransactionUnspentOutput'>[]>;
};

export type WalletNames =
  | 'ccvault'
  | 'flint'
  | 'flintExperimental'
  | 'gerowallet'
  | 'nami'
  | 'typhoncip30'
  | 'yoroi';

/**
 * Byron genesis file protocol configs
 */
export const ProtocolMagic = {
  MAINNET: 764824073,
  PREVIEW: 2,
  PREPROD: 1
};

/**
 * Shelley genesis file protocol configs
 */
export const NetworkMagic = {
  MAINNET: 764824073,
  PREVIEW: 2,
  PREPROD: 1
};

export type EnabledAPI = Omit<CardanoInjectedNamespaceApi, 'enable' | 'isEnabled'>;

// CIP-30 Compliant
export interface CardanoInjectedNamespaceApi {
  // isConnected: () => Promise<boolean>;
  getNetworkId: () => Promise<number>;
  getUtxos: (
    amount?: Cbor<'Value'>,
    paginate?: Paginate
  ) => Promise<Cbor<'TransactionUnspentOutput'>[] | undefined>;
  getBalance: () => Promise<Cbor<'value'>>;
  getUsedAddresses: (paginate?: Paginate) => Promise<Cbor<'address'>[]>;
  getUnusedAddresses: (paginate?: Paginate) => Promise<Cbor<'address'>[]>;
  getChangeAddress: () => Promise<Cbor<'address'>>;
  getRewardAddress: () => Promise<Cbor<'address'>>;
  getRewardAddresses: () => Promise<Cbor<'address'>[]>;
  signTx: (
    tx: Cbor<'transaction'>,
    partialSign?: boolean
  ) => Promise<Cbor<'transaction_witness_set'>>;
  signData: (addr: Cbor<'address'>, payload: HexString) => Promise<DataSignature>;
  submitTx: (tx: Cbor<'transaction'>) => Promise<Hash32>;
  getCollateral: () => Promise<Cbor<'TransactionUnspentOutput'>[]>;
  enable: () => Promise<Omit<typeof window.cardano, 'enable' | 'isEnabled'> | undefined>;
  onAccountChange: (
    callback: CardanoContentScriptApi['onAccountChangeTrigger']
  ) => Promise<undefined>;
  onNetworkChange: (
    callback: CardanoContentScriptApi['onNetworkChangeTrigger']
  ) => Promise<undefined>;
  nami?: PerWalletNamespace | undefined;
  ccvault?: PerWalletNamespace | undefined;
  flint?: PerWalletNamespace | undefined;
  flintExperimental?: PerWalletNamespace | undefined;
  typhoncip30?: PerWalletNamespace | undefined;
  gerowallet?: PerWalletNamespace | undefined;
  yoroi?: PerWalletNamespace | undefined;
  experimental?:
    | Pick<CardanoContentScriptApi, keyof typeof SUPPORTED_EXPERIMENTAL_MESSAGES>
    | (Pick<CardanoContentScriptApi, keyof typeof DEBUG_MESSAGES> &
        Pick<CardanoContentScriptApi, keyof typeof SUPPORTED_EXPERIMENTAL_MESSAGES>);
}

/*
 * Note: it seems the injected connector relies on the default signMessage + signTransaction
 * methods, but the WalletConnect connector relies on the chain-specific cardano_signMessage / cardano_signTransaction
 * methods. Probably because the default method names would overlap with ethereum.
 */
export interface RequestMethodsCardano {
  cardano_signMessage: {
    params: {
      message: string;
      pubkey: string;
    };
    returns: {
      signature: string;
    };
  };
  cardano_signTransaction: {
    params: {
      feePayer: string;
      instructions: TransactionInstructionRq[];
      recentBlockhash: string;
      signatures?: { pubkey: string; signature: string }[];
    };
    returns: {
      signature: string;
    };
  };
  signMessage: {
    params: {
      message: Uint8Array;
      format: string;
    };
    returns: {
      signature: string;
    } | null;
  };

  signTransaction: {
    params: {
      // Serialized transaction
      message: string;
    };
    returns: {
      serialize: () => string;
    } | null;
  };
}

// BEGIN SOLANA:
export interface AccountInfo {
  data: string[];
  executable: boolean;
  lamports: number;
  owner: string;
  rentEpoch: number;
}

export type FilterObject =
  | {
      memcmp: {
        offset: number;
        bytes: string;
        encoding?: string;
      };
    }
  | { dataSize: number };

export interface ClusterSubscribeRequestMethods {
  signatureSubscribe: {
    params: string[];
    returns: Transaction;
  };
  signatureUnsubscribe: {
    params: number[];
    returns: unknown;
  };
}
export interface ClusterRequestMethods {
  sendTransaction: {
    // Signed, serialized transaction
    params: string[];
    returns: string;
  };

  getFeeForMessage: {
    params: [string];
    returns: number;
  };

  getBlock: {
    params: [number];
    returns: BlockResult | null;
  };

  getBalance: {
    params: [string, { commitment: 'processed' }];
    returns: {
      value: number;
    };
  };

  getProgramAccounts: {
    params: [
      string,
      {
        filters?: FilterObject[];
        encoding: 'base58' | 'base64' | 'jsonParsed';
        withContext?: boolean;
      }
    ];
    returns: {
      value: { account: AccountInfo }[];
    };
  };

  getAccountInfo: {
    params: [string, { encoding: 'base58' | 'base64' | 'jsonParsed' }] | [string];
    returns?: {
      value: AccountInfo | null;
    };
  };

  getTransaction: {
    params: [
      string,
      { encoding: 'base58' | 'base64' | 'jsonParsed'; commitment: 'confirmed' | 'finalized' }
    ];
    returns: TransactionResult | null;
  };

  getLatestBlockhash: {
    params: [{ commitment?: string }];
    returns: {
      value: {
        blockhash: string;
      };
    };
  };
}

export interface TransactionInstructionRq {
  programId: string;
  data: string;
  keys: { isSigner: boolean; isWritable: boolean; pubkey: string }[];
}

// "requests" is solana specific
// Below is not needed for Cardano
export interface RequestMethods {
  solana_signMessage: {
    params: {
      message: string;
      pubkey: string;
    };
    returns: {
      signature: string;
    };
  };
  solana_signTransaction: {
    params: {
      feePayer: string;
      instructions: TransactionInstructionRq[];
      recentBlockhash: string;
      signatures?: { pubkey: string; signature: string }[];
    };
    returns: {
      signature: string;
    };
  };
  signMessage: {
    params: {
      message: Uint8Array;
      format: string;
    };
    returns: {
      signature: string;
    } | null;
  };

  signTransaction: {
    params: {
      // Serialized transaction
      message: string;
    };
    returns: {
      serialize: () => string;
    } | null;
  };
}

export interface TransactionArgs {
  transfer: {
    params: {
      to: string;
      amountInLamports: number;
      feePayer: 'from' | 'to';
    };
  };
  program: {
    params: {
      programId: string;
      isWritableSender: boolean;
      data: Record<string, unknown>;
    };
  };
}

declare global {
  /* eslint-disable vars-on-top, no-var */

  // Must be var. let or const variables doesn't show up on globalThis.
  var cardano: CardanoInjectedNamespaceApi;

  /* eslint-enable vars-on-top, no-var */
}
export type TransactionType = keyof TransactionArgs;
