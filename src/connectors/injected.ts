/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable eqeqeq */
/* eslint-disable no-eq-null */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-return */
/* eslint-disable curly */
/* eslint-disable no-useless-catch */
import {
  decodeHexAddress,
  NetworkType,
  Observable,
  WalletNotCip30CompatibleError,
  WrongNetworkTypeError
} from '@cardano-foundation/cardano-connect-with-wallet';
import base58 from 'bs58';
import { setAddress } from '../store';
import type {
  CardanoContentScriptApi,
  CardanoInjectedNamespaceApi,
  DataSignature,
  Paginate,
  PerWalletNamespace,
  TransactionArgs,
  TransactionType,
  WalletNames
} from '../types/CardanoInjected';
import type { Connector } from './base';
import { BaseConnector } from './base';

export interface PhantomPublicKey {
  length: number;
  negative: number;
  words: Uint8Array;
  toString: () => string;
}

/**
 * Plan: Only expose `enable`, `isEnabled`, and `getConnectorAPI` methods.
 * enable populates the connectorAPI if the connection is successful.
 * For the wallet connect connector, it creates a custom instance of the
 * enabled CIP-30 API that relays everything through the wallet connect relay.
 */
export class InjectedConnector extends BaseConnector implements CardanoInjectedNamespaceApi {
  private setLastConnectedWallet(walletName: string) {
    this.lastConnectedWallet = walletName;
  }

  public injectedWalletPath: string;

  /**
   * The enabled wallet's name
   */
  public enabledWallet: WalletNames | undefined;
  public connectedWalletAPI: Omit<typeof window.cardano, 'enable' | 'isEnabled'> | undefined;
  public lastConnectedWallet: string | undefined;

  public enabledObserver = new Observable<boolean>(false);
  public isConnectingObserver = new Observable<boolean>(false);
  public enabledWalletObserver = new Observable<string | null>(null);
  public stakeAddressObserver = new Observable<string | null>(null);
  public installedWalletExtensionsObserver = new Observable<string[]>([]);

  public constructor(injectedWallet: string) {
    super();
    if (!injectedWallet) throw new Error('Invalid path provided, should match window..*');
    const walletPathSplit = injectedWallet.split('.');
    if (walletPathSplit[0] !== 'window')
      throw new Error('Injected wallet path must start at window');
    this.injectedWalletPath = injectedWallet;
  }
  getNetworkId: () => Promise<number>;
  getUtxos: (
    amount?: string | undefined,
    paginate?:
      | Paginate
      /* eslint-disable eqeqeq */
      /* eslint-disable no-eq-null */
      /* eslint-disable no-else-return */
      /* eslint-disable consistent-return */
      /* eslint-disable no-useless-return */
      /* eslint-disable curly */
      /* eslint-disable no-useless-catch */
      | undefined
  ) => Promise<string /* eslint-disable no-eq-null */[] | undefined>;
  public async getBalance(): Promise<string> {
    if (!(await this.isConnected())) {
      throw new Error('Wallet is not connected');
    }

    return this.connectedWalletAPI!.getBalance();
  }
  getUsedAddresses: (
    paginate?: Paginate | undefined
  ) => Promise/* eslint-disable eqeqeq */ <string[]>;
  getUnusedAddresses: (paginate?: Paginate | undefined) => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  submitTx: (tx: string) => Promise<string>;
  onAccountChange: (
    callback: (addresses: string[]) => Promise</* eslint-disable eqeqeq */
    /* eslint-disable no-eq-null */
    /* eslint-disable no-else-return */
    /* eslint-disable consistent-return */
    /* eslint-disable no-useless-return */
    /* eslint-disable curly */
    /* eslint-disable no-useless-catch */
    undefined>
  ) => Promise<undefined>;
  onNetworkChange: (callback: (network: number) => Promise<undefined>) => Promise<undefined>;
  /* eslint-disable no-eq-null */
  /* eslint-disable no-else-return */
  /* eslint-disable consistent-return */
  /* eslint-disable no-useless-return */
  /* eslint-disable curly */
  /* eslint-disable no-useless-catch */

  public static connectorName(walletName: string) {
    return `injected-${walletName}`;
  }

  public getConnectorName(): string {
    return InjectedConnector.connectorName(this.injectedWalletPath);
  }

  public async disconnect() {
    const provider = await this.getProvider();
    setAddress('');
    provider.disconnect();
  }

  protected async getProvider() {
    const providerPath = this.injectedWalletPath.split('.').slice(1);

    if (typeof window !== 'undefined') {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const injectedWalletProvider = providerPath.reduce<any>((provider, accessor) => {
        if (provider) return provider[accessor];

        return null;
      }, window);

      if (injectedWalletProvider) return Promise.resolve(injectedWalletProvider);
    }

    return Promise.resolve(null);
  }

  public isAvailable(): boolean {
    return Boolean(this.getProvider());
  }

  public async enable(): Promise<Omit<typeof window.cardano, 'enable' | 'isEnabled'> | undefined> {
    const targetWalletName = this.injectedWalletPath.split('.').pop() as WalletNames;
    this.enabledWallet = targetWalletName;

    const cardano = (window as any).cardano;

    if (typeof cardano === 'undefined') return;

    if (typeof cardano[targetWalletName].isEnabled === 'function') {
      const api = (await cardano[targetWalletName].enable()) as Omit<
        typeof window.cardano,
        'enable' | 'isEnabled'
      >;

      if (typeof api.getRewardAddresses === 'function') {
        const hexAddresses = await api.getRewardAddresses();

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, curly
        if (hexAddresses && hexAddresses.length > 0) {
          try {
            const bech32Address = decodeHexAddress(hexAddresses[0]);

            let networkType = NetworkType.MAINNET;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            if (bech32Address.startsWith('stake_test')) networkType = NetworkType.TESTNET;

            this.stakeAddressObserver.set(bech32Address);
            this.enabledWalletObserver.set(targetWalletName);
            this.enabledObserver.set(true);
            if (targetWalletName === 'typhoncip30') this.setLastConnectedWallet('typhon');
            else this.setLastConnectedWallet(targetWalletName);

            window.dispatchEvent(new Event('storage'));
            this.connectedWalletAPI = api;
            // eslint-disable-next-line consistent-return

            return api;
          } catch (error) {
            throw error;
          }
        }
      } else throw new WalletNotCip30CompatibleError(targetWalletName);
      this.connectedWalletAPI = api;

      return api;
    } else {
      return;
    }
  }

  public async connect() {
    /*
     * Provider is solana specific. Might need to implement a method here to detect which WC-supported wallets
     * are injected into the namespace)
     */
    const resp = await (await this.getProvider()).connect();

    if (resp?.publicKey) {
      setAddress(resp.publicKey.toString());

      return resp.publicKey.toString();
    } else if (resp?.publickey) {
      setAddress(resp.publickey.toString());

      return resp.publickey.toString();
    } else if (resp === true) {
      const provider = await this.getProvider();
      const pubkey = provider.pubkey || provider.publicKey;
      setAddress(pubkey.toString());

      return pubkey;
    }

    throw new Error('Failed to connect');
  }

  public async signData(addr: string, payload: string): Promise<DataSignature> {
    if (!(await this.isConnected())) {
      throw new Error('Wallet is not connected');
    }

    return this.connectedWalletAPI!.signData(addr, payload);
  }

  public async signTx(tx: string, partialSign?: boolean | undefined): Promise<string> {
    if (!(await this.isConnected())) {
      throw new Error('Wallet is not connected');
    }

    return this.connectedWalletAPI!.signTx(tx, partialSign);
  }

  public async getCollateral(): Promise<string[]> {
    if (!(await this.isConnected())) {
      throw new Error('Wallet is not connected');
    }

    return this.connectedWalletAPI!.getCollateral();
  }

  public async isConnected(): Promise<boolean> {
    return (
      this.connectedWalletAPI != null ||
      ((this.enabledWallet != null &&
        window.cardano[this.enabledWallet] != null &&
        (await window.cardano[this.enabledWallet]?.isEnabled())) ??
        false)
    );
  }
}
