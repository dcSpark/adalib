/* eslint-disable multiline-comment-style */
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
  Observable,
  WalletNotCip30CompatibleError
} from '@cardano-foundation/cardano-connect-with-wallet';
import { setAddress } from '../store';
import type {
  CardanoInjectedNamespaceApi,
  DataSignature,
  EnabledAPI,
  WalletNames
} from '../types/CardanoInjected';
import type { Connector } from './base';

/**
 * Cardano methods are injected.
 * The InjectedConnector utilizes these cip-30 methods to
 * comply with the Connector abstraction under the hood.
 */
declare global {
  interface Window {
    cardano: CardanoInjectedNamespaceApi;
  }
}

/**
 * Plan: Only expose `enable`, `isEnabled`, and `getConnectorAPI` methods.
 * enable populates the connectorAPI if the connection is successful.
 * For the wallet connect connector, it creates a custom instance of the
 * enabled CIP-30 API that relays everything through the wallet connect relay.
 */
export class InjectedConnector implements Connector {
  public injectedWalletPath: string;

  /**
   * The enabled wallet's name
   */
  public enabledWallet: WalletNames | undefined;
  public connectedWalletAPI: EnabledAPI | undefined;

  // Borrowed from cardano-connect-with-wallet library
  public enabledObserver = new Observable<boolean>(false);
  public isConnectingObserver = new Observable<boolean>(false);
  public enabledWalletObserver = new Observable<string | null>(null);
  public stakeAddressObserver = new Observable<string | null>(null);
  public installedWalletExtensionsObserver = new Observable<string[]>([]);

  public constructor(injectedWallet: string) {
    if (!injectedWallet) throw new Error('Invalid path provided, should match window..*');
    const walletPathSplit = injectedWallet.split('.');
    if (walletPathSplit[0] !== 'window')
      throw new Error('Injected wallet path must start at window');
    this.injectedWalletPath = injectedWallet;
  }

  public isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    if (typeof window.cardano === 'undefined') return false;
    const targetWalletName = this.injectedWalletPath.split('.').pop() as WalletNames;
    if (typeof window.cardano[targetWalletName] === 'undefined') return false;

    return true;
  }

  public static connectorName(walletName: string) {
    return `injected-${walletName}`;
  }

  public getConnectorName(): string {
    return InjectedConnector.connectorName(this.injectedWalletPath);
  }

  public async disconnect() {
    this.connectedWalletAPI = undefined;
    this.enabledWallet = undefined;
    this.enabledObserver.set(false);
    setAddress('');

    return Promise.resolve();
  }

  public async enable(): Promise<EnabledAPI> {
    const targetWalletName = this.injectedWalletPath.split('.').pop() as WalletNames;
    this.enabledWallet = targetWalletName;

    const cardano = window.cardano;

    if (typeof cardano === 'undefined') throw new Error('Cardano object not found on window');
    const injectedWalletObject = cardano[targetWalletName];
    if (injectedWalletObject != null && typeof injectedWalletObject.isEnabled === 'function') {
      const api = await injectedWalletObject.enable();

      if (typeof api.getRewardAddresses === 'function') {
        const hexAddresses = await api.getRewardAddresses();

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, curly
        if (hexAddresses && hexAddresses.length > 0) {
          this.connectedWalletAPI = api;
          setAddress(hexAddresses[0]);

          return api;
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

  public async isConnected(timeout = 10000): Promise<boolean> {
    return new Promise<boolean>((resolve, _) => {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        resolve(false);
      }, timeout);

      this.actualConnectionCheck()
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(() => {
          clearTimeout(timeoutId);
          resolve(false);
        });
    });
  }

  private async actualConnectionCheck() {
    if (this.enabledWallet != null && window.cardano[this.enabledWallet] != null) {
      const isEnabled = await window.cardano[this.enabledWallet]?.isEnabled();
      if (isEnabled && this.getConnectorAPI()) {
        // checks if we can still receive a response from the injected wallet
        const networkID = await this.getConnectorAPI()?.getNetworkId();

        if (networkID != null) {
          return true;
        }
      }
    }

    return false;
  }
}
