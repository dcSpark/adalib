/* eslint-disable capitalized-comments */
/* eslint-disable multiline-comment-style */
import type { PublicKey } from '@solana/web3.js';
import { SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import type BN from 'bn.js';
import base58 from 'bs58';
import {
  NAME_OFFERS_ID,
  NAME_PROGRAM_ID,
  REVERSE_LOOKUP_CLASS,
  ROOT_DOMAIN_ACCOUNT
} from '../constants/splNameService';
import { getAddress, getCluster, getNewRequestId } from '../store';
import type {
  AccountInfo,
  ClusterRequestMethods,
  ClusterSubscribeRequestMethods,
  EnabledAPI,
  FilterObject,
  RequestMethods,
  TransactionArgs,
  TransactionType,
  WalletNames
} from '../types/CardanoInjected';
import { registerListener, unregisterListener } from '../utils/clusterFactory';
import { getHashedName, getNameAccountKey } from '../utils/hash';
import borsh from 'borsh';
import { Buffer } from 'buffer';
import { FavouriteDomain, NameRegistry } from '../utils/nameService';
import type { BlockResult } from '../types/block';

export interface Connector {
  enabledWallet: WalletNames | undefined;
  connectedWalletAPI: EnabledAPI | undefined;

  getConnectorName: () => string;

  // Solana specific
  getConnectorAPI: () => EnabledAPI | undefined;
  // Tx construction is dapp responsibility

  enable: () => Promise<EnabledAPI>;

  isEnabled: () => Promise<boolean>;
}

// Look at the cardano library to adapt it for this implementation
export class BaseConnector {
  // private enabledWallet: WalletNames | undefined;
  // private connectedWalletAPI: Omit<typeof window.cardano, 'enable' | 'isEnabled'> | undefined;

  public getConnectorName() {
    return 'base';
  }

  // Solana specific
  public getConnectorAPI(): EnabledAPI | undefined {
    throw new Error('Not allowed on base connector');
  }

  // Tx construction is dapp responsibility

  public enable() {
    throw new Error('Not allowed on base connector');
  }

  public isEnabled() {
    throw new Error('Not allowed on base connector');
  }
}
