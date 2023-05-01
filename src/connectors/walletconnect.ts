/* eslint-disable multiline-comment-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable capitalized-comments */
import type UniversalProvider from '@walletconnect/universal-provider';
import type { Connector } from './base';
import type { EnabledAPI, WalletNames } from '../types/CardanoInjected';
import { UniversalProviderFactory } from '../utils/universalProvider';
import { getChain, getProjectId, setAddress } from '../store';

import { EnabledWalletEmulator } from '../utils/EnabledWalletEmulator';
import { chainToId } from '../defaults/chains';
import { Web3Modal } from '@web3modal/standalone';

export interface WalletConnectAppMetadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

function createW3mModalCtrl(standaloneChains?: string[]) {
  try {
    const web3modal = new Web3Modal({
      walletConnectVersion: 2,
      projectId: getProjectId(),
      standaloneChains
    });

    return web3modal;
  } catch (e) {
    throw new Error(`Error instantiating web3Modal: ${JSON.stringify(e)}`);
  }
}

export class WalletConnectConnector implements Connector {
  protected _provider: UniversalProvider | undefined;
  protected qrcode: boolean;
  private enabled = false;
  private currentTopic: string | undefined;
  public enabledWallet: WalletNames | undefined;
  public connectedWalletAPI: EnabledAPI | undefined;

  private cleanupInternalState() {
    this.enabled = false;
    this.currentTopic = undefined;
    this.connectedWalletAPI = undefined;
  }

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
    });

    if (autoconnect)
      UniversalProviderFactory.getProvider().then(provider => {
        this.provider = provider;

        // (TODO update typing for provider)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this.provider?.session?.namespaces?.cip34?.accounts?.length) {
          // const [defaultAccount] = this.provider.session.namespaces.cip34.accounts;
          // const address = defaultAccount.split(':')[2];
          // Note: Setting the address here would prevent the connection from being established
        }
      });
  }

  public async disconnect() {
    try {
      const provider = await UniversalProviderFactory.getProvider();
      await provider.disconnect();
      await provider.cleanupPendingPairings();
    } catch (error) {
      if (!/No matching key/iu.test((error as Error).message)) throw error;
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      // delete provider?.session?.namespaces?.cip34;
      // this.provider = undefined;
      this.cleanupInternalState();
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
      const emulatedAPI = new EnabledWalletEmulator();
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
    return UniversalProviderFactory.getProvider();
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

  private async actualConnectionCheck(): Promise<boolean> {
    if (!this.currentTopic) {
      return false;
    }
    try {
      const provider = await this.getProvider();
      await provider.client.ping({ topic: this.currentTopic });

      return true;
    } catch (e) {
      return false;
    }
  }

  // todo: Add timeout to return false
  // public async isConnected() {
  //   if (!this.currentTopic) {
  //     return false;
  //   }
  //   try {
  //     const provider = await this.getProvider();
  //     await provider.client.ping({ topic: this.currentTopic });

  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // }

  public async enable() {
    // step 0: cleanup
    this.cleanupInternalState();
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
    // let isConnected = false;

    return new Promise<string>((resolve, reject) => {
      provider.on('display_uri', (uri: string) => {
        if (this.qrcode) {
          const ModalCtrl = createW3mModalCtrl([chainID]);

          ModalCtrl.openModal({ uri, standaloneChains: [chainID] });
          ModalCtrl.subscribeModal(newState => {
            if (!this.enabled && !newState.open) {
              reject(new Error('User closed modal before connecting'));
            }
          });
        } else resolve(uri);
      });

      provider
        .connect({
          pairingTopic: undefined,
          namespaces: { ...cardanoNamespace }
        })
        .then(providerResult => {
          if (!providerResult) throw new Error('Failed connection.');

          // (TODO update typing for provider)
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          const address = providerResult.namespaces?.cip34?.accounts[0]?.split(':')[2];
          if (address && this.qrcode) {
            setAddress(address);

            const ModalCtrl = createW3mModalCtrl();

            this.enabled = true;
            this.currentTopic = providerResult.topic;
            ModalCtrl.closeModal();

            resolve(address);
          } else reject(new Error('Could not resolve address'));
        })
        .catch(error => {
          if (!/No matching key/iu.test((error as Error).message)) throw error;
        });
    });
  }
}
