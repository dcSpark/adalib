/* eslint-disable no-underscore-dangle */
/* eslint-disable capitalized-comments */
import type UniversalProvider from '@dcspark/universal-provider';
import type { Connector } from './base';
import type { EnabledAPI, WalletNames } from '../types/CardanoInjected';
import { UniversalProviderFactory } from '../utils/universalProvider';
import { getChain, getProjectId, setAddress } from '../store';

import { EnabledWalletEmulator } from '../utils/EnabledWalletEmulator';
import { chainToId } from '../defaults/chains';

export interface WalletConnectAppMetadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

async function importW3mModalCtrl() {
  try {
    const web3modalCore = await import('@web3modal/core');

    web3modalCore.ConfigCtrl.setConfig({
      projectId: getProjectId(),
      accentColor: 'blue'
    });

    return web3modalCore.ModalCtrl;
  } catch {
    throw new Error('No @web3modal/core module found. It is needed when using the qrcode option');
  }
}

async function loadW3mModal() {
  try {
    await import('@web3modal/ui');
    document.getElementsByTagName('body')[0].appendChild(document.createElement('w3m-modal'));
  } catch {
    throw new Error('No @web3modal/ui module found. It is needed when using the qrcode option');
  }
}

export class WalletConnectConnector implements Connector {
  protected _provider: UniversalProvider | undefined;
  protected qrcode: boolean;
  private enabled = false;
  public enabledWallet: WalletNames | undefined;
  public connectedWalletAPI: EnabledAPI | undefined;

  public static connectorName = () => 'walletconnect';

  public constructor({
    relayerRegion,
    metadata,
    qrcode,
    autoconnect
  }: {
    relayerRegion: string;
    metadata: WalletConnectAppMetadata;
    qrcode?: boolean;
    autoconnect?: boolean;
  }) {
    this.qrcode = Boolean(qrcode);
    UniversalProviderFactory.setSettings({
      projectId: getProjectId(),
      relayerRegion,
      metadata,
      qrcode: this.qrcode
    });
    UniversalProviderFactory.getProvider().then(provider => {
      this.provider = provider;
      this.provider.on('session_delete', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        delete provider.session?.namespaces.cardano;
        setAddress('');
      });
    });
    if (typeof document !== 'undefined' && qrcode) loadW3mModal();

    if (autoconnect)
      UniversalProviderFactory.getProvider().then(provider => {
        this.provider = provider;
        console.log('Provider state', { provider });
        // (TODO update typing for provider)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this.provider.session?.namespaces?.cardano?.accounts?.length) {
          const [defaultAccount] = this.provider.session.namespaces.cardano.accounts;
          console.log('Found accounts', defaultAccount);
          const address = defaultAccount.split(':')[2];
          // is this still necessary? Or only for solana RPC queries?
          setAddress(address);
        }
      });
  }

  public async disconnect() {
    try {
      this.provider = this.provider ? this.provider : await UniversalProviderFactory.getProvider();

      await this.provider.disconnect();
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      delete this.provider?.session?.namespaces?.cardano;
      this.provider = undefined;
      this.enabled = false;
      this.connectedWalletAPI = undefined;
    }

    setAddress('');
  }

  public getConnectorName(): string {
    return WalletConnectConnector.connectorName();
  }

  public isAvailable() {
    return true;
  }

  private set provider(provider: UniversalProvider | undefined) {
    this._provider = provider;
    if (this._provider) {
      const emulatedAPI = new EnabledWalletEmulator(this._provider);
      this.connectedWalletAPI = emulatedAPI;
    }
  }

  private get provider() {
    return this._provider;
  }

  public async isEnabled(): Promise<boolean> {
    return Promise.resolve(this.enabled);
  }

  protected async getProvider() {
    const provider = await UniversalProviderFactory.getProvider();

    return provider;
  }

  public async enable() {
    // step 1: pair
    await this.connect();
    this.enabled = true;
    // step 2: initialize enabled Api
    if (!this.provider || !this.connectedWalletAPI) throw new Error('Provider not initialized');

    return this.connectedWalletAPI;
  }

  public getConnectorAPI(): EnabledAPI | undefined {
    return this.connectedWalletAPI;
  }

  /**
   * Connect to user's wallet.
   *
   * If `WalletConnectConnector` was configured with `qrcode = true`, this will
   * open a QRCodeModal, where the user will scan the qrcode and then this
   * function will resolve/return the address of the wallet.
   *
   * If `qrcode = false`, this will return the pairing URI used to generate the
   * QRCode.
   *
   * Cardano Note: We'll use cardano_ to prevent overlap in WC Modal product
   * We should rename this to `enable`
   */
  public async connect() {
    const chosenChain = getChain();
    const chainID = chainToId(chosenChain);

    const cardanoNamespace = {
      cip34: {
        chains: [chainID],
        methods: [
          'cardano_signTx',
          'cardano_signData',
          'cardano_submitTx',
          'cardano_getBalance',
          'cardano_getCollateral',
          'cardano_getUtxos',
          'cardano_getNetworkId',
          'cardano_getUsedAddresses',
          'cardano_getUnusedAddresses',
          'cardano_getChangeAddress',
          'cardano_getRewardAddress',
          'cardano_getRewardAddresses'
        ],
        events: ['cardano_onNetworkChange', 'cardano_onAccountChange'],
        rpcMap: {
          [chainID]: chosenChain.endpoint
        }
      }
    };

    // WC concept
    const provider = await UniversalProviderFactory.getProvider();
    this.provider = provider;

    return new Promise<string>((resolve, reject) => {
      provider.on('display_uri', (uri: string) => {
        if (this.qrcode)
          importW3mModalCtrl().then(ModalCtrl => {
            ModalCtrl.open({ uri, standaloneChains: [chainID] });
          });
        else resolve(uri);
      });

      provider
        .connect({
          pairingTopic: undefined,
          namespaces: cardanoNamespace
        })
        .then(providerResult => {
          if (!providerResult) throw new Error('Failed connection.');

          // (TODO update typing for provider)
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          const address = providerResult.namespaces?.cip34?.accounts[0]?.split(':')[2];
          if (address && this.qrcode) {
            setAddress(address);
            resolve(address);
            importW3mModalCtrl().then(ModalCtrl => {
              ModalCtrl.close();
            });
          } else reject(new Error('Could not resolve address'));
        });
    });
  }
}
