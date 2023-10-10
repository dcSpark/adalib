/* eslint-disable capitalized-comments */
/* eslint-disable multiline-comment-style */
import type { DataSignature, EnabledAPI, WalletNames } from '../types/CardanoInjected';

export interface Connector {
  enabledWallet: WalletNames | undefined;
  connectedWalletAPI: EnabledAPI | undefined;
  init(): Promise<void>;
  getConnectorName: () => string;
  getSignature(): DataSignature | undefined;
  getConnectorAPI: () => EnabledAPI | undefined;
  // Tx construction is dapp responsibility

  enable: () => Promise<EnabledAPI>;
  getSession:() => any;
  isEnabled: () => Promise<boolean>;
  isAvailable: () => boolean;
  isConnected: (timeout?: number) => Promise<boolean>;
  disconnect: () => Promise<void>;
}

// Look at the cardano library to adapt it for this implementation
export class BaseConnector {
  // private enabledWallet: WalletNames | undefined;
  // private connectedWalletAPI: Omit<typeof window.cardano, 'enable' | 'isEnabled'> | undefined;

  public getConnectorName() {
    return 'base';
  }

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

  public isAvailable() {
    throw new Error('Not allowed on base connector');
  }

  public isConnected() {
    throw new Error('Not allowed on base connector');
  }
}
