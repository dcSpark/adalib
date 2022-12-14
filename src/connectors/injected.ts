/* eslint-disable capitalized-comments */
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
  CardanoInjectorEventMethods,
  DataSignature,
  EnabledAPI,
  InjectAsWallet,
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
export class InjectedConnector extends BaseConnector implements Connector {
  private setLastConnectedWallet(walletName: string) {
    this.lastConnectedWallet = walletName;
  }

  public injectedWalletPath: string;

  /**
   * The enabled wallet's name
   */
  public enabledWallet: WalletNames | undefined;
  public connectedWalletAPI: EnabledAPI | undefined;
  public lastConnectedWallet: string | undefined;

  // Borrowed from cardano-connect-with-wallet library
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

  public static connectorName(walletName: string) {
    return `injected-${walletName}`;
  }

  public getConnectorName(): string {
    return InjectedConnector.connectorName(this.injectedWalletPath);
  }

  public async disconnect() {
    /*
     * const provider = await this.getProvider();
     * setAddress('');
     * provider.disconnect();
     */
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

  public async enable(): Promise<EnabledAPI> {
    const targetWalletName = this.injectedWalletPath.split('.').pop() as WalletNames;
    this.enabledWallet = targetWalletName;

    const cardano = (window as any).cardano;

    if (typeof cardano === 'undefined') throw new Error('Cardano object not found on window');

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
      throw new Error('Wallet does not support CIP-30');
    }
  }

  public async isEnabled(): Promise<boolean> {
    return (
      (this.enabledWallet != null &&
        window.cardano[this.enabledWallet] != null &&
        (await window.cardano[this.enabledWallet]?.isEnabled())) ??
      false
    );
  }

  /**
   * This is used for retrieving the enabled wallet's injected methods
   * @returns an object of enabled CIP-30 methods to call on the connected wallet
   * or undefined if the wallet is not connected.
   */
  public getConnectorAPI(): EnabledAPI | undefined {
    return this.connectedWalletAPI;
  }

  /**
   * @deprecated
   */
  public async signData(addr: string, payload: string): Promise<DataSignature> {
    if (!(await this.isConnected())) {
      throw new Error('Wallet is not connected');
    }

    return this.connectedWalletAPI!.signData(addr, payload);
  }

  /**
   * @deprecated for example purposes only
   */
  public async signTx(tx: string, partialSign?: boolean | undefined): Promise<string> {
    if (!(await this.isConnected())) {
      throw new Error('Wallet is not connected');
    }

    return this.connectedWalletAPI!.signTx(tx, partialSign);
  }

  // eslint-disable-next-line capitalized-comments
  /*
   * public async getCollateral(): Promise<string[]> {
   *   if (!(await this.isConnected())) {
   *     throw new Error('Wallet is not connected');
   *   }
   *   return this.connectedWalletAPI!.getCollateral();
   * }
   */

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
