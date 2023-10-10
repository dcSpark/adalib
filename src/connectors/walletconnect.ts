/* eslint-disable multiline-comment-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable capitalized-comments */
import type UniversalProvider from '@walletconnect/universal-provider';
import type { Connector } from './base';
import type { DataSignature, EnabledAPI, WalletNames } from '../types/CardanoInjected';
import { UniversalProviderFactory } from '../utils/universalProvider';
import { getChain, getProjectId, setAddress } from '../store';
import { EnabledWalletEmulator } from '../utils/EnabledWalletEmulator';
import {  WALLETCONNECT_CARDANO_EVENTS, WALLETCONNECT_CARDANO_METHODS, chainToId } from '../defaults/chains';
import { Web3Modal } from '@web3modal/standalone';
import Client from "@walletconnect/sign-client";

import {
  PairingTypes,
  SessionTypes
} from "@walletconnect/types";
import { NamespaceConfig } from '@walletconnect/universal-provider';
import { WalletConnectV2ProviderErrorMessagesEnum } from './errors';

export interface WalletConnectAppMetadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
  redirect?: {native?: string, universal?: string};
}

interface ConnectParamsTypes {
  topic?: string;
  events?: SessionTypes.Namespace["events"];
  methods?: string[];
}

interface SessionEventTypes {
  event: {
    name: string;
    data: any;
  };
  chainId: string;
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
  protected static _provider: UniversalProvider | undefined;
  protected qrcode: boolean;
  protected signSession: boolean;
  private enabled = false;
  private currentTopic: string | undefined;
  public enabledWallet: WalletNames | undefined;
  public connectedWalletAPI: EnabledAPI | undefined;
  private signature: DataSignature | undefined = undefined;
  private isInitializing: boolean = false;
  private address: string = "";
  private session: SessionTypes.Struct | undefined;
  private pairings: PairingTypes.Struct[] | undefined;

  private cleanupInternalState() {
    this.enabled = false;
    this.currentTopic = undefined;
    this.signature = undefined;
    this.session = undefined;
    this.connectedWalletAPI = undefined;
    setAddress('');
  }

  public static connectorName = () => 'walletconnect';

  public constructor({
    relayerRegion,
    metadata,
    qrcode,
    autoconnect,
    signSession
  }: {
    relayerRegion: string;
    metadata: WalletConnectAppMetadata;
    qrcode?: boolean;
    autoconnect?: boolean,
    signSession?: boolean
  }) {
    
      this.cleanupInternalState();
      this.qrcode = Boolean(qrcode);
      this.signSession = Boolean(signSession);
      UniversalProviderFactory.setSettings({
        projectId: getProjectId(),
        relayerRegion,
        metadata,
        qrcode: this.qrcode
      });
      
      UniversalProviderFactory.getProvider().then(provider => {
        WalletConnectConnector._provider = provider;
        const emulatedAPI = new EnabledWalletEmulator();
        this.connectedWalletAPI = emulatedAPI;
      });

      if (autoconnect)
      {
        this.enable();
        // (TODO update typing for provider)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        //if (this.provider?.session?.namespaces?.cip34?.accounts?.length)
        {
          // const [defaultAccount] = this.provider.session.namespaces.cip34.accounts;
          // const address = defaultAccount.split(':')[2];
          // Note: Setting the address here would prevent the connection from being established
        }          
      }  
  } 
  getSession(): SessionTypes.Struct | undefined {
    if (!WalletConnectConnector._provider) {
      return undefined;
    }
    return this.session;
  }

  init(): Promise<void> {
    if (!WalletConnectConnector._provider) {  
      UniversalProviderFactory.getProvider().then(provider => {
        WalletConnectConnector._provider = provider;
      });
    }
    if (!this.connectedWalletAPI && WalletConnectConnector._provider)
    {
      const emulatedAPI = new EnabledWalletEmulator();
      this.connectedWalletAPI = emulatedAPI;
    }
    return Promise.resolve();
  }

  getSignature(): DataSignature | undefined {
    return this.signature;
  }

  public async disconnect() {
    // try {
    //   if (!WalletConnectConnector._provider) {
    //     throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    //   }
    //   if (this.sessionAvailable(WalletConnectConnector._provider.client)) {
    //     await this.provider?.disconnect();
    //   }
      
    //   await this.provider?.cleanupPendingPairings({ deletePairings: true });

    //   (await this.getPairings()).map((pairing) => {
    //     this.provider?.client.core.pairing.disconnect({topic: pairing.topic})
    //   })
    // } catch (error) {
    //   if (!/No matching key/iu.test((error as Error).message)) throw error;
    // } finally {
    //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    //    delete this.provider?.session?.namespaces?.cip34;
    //    this.provider = undefined;
    //   this.cleanupInternalState();
    // }
    try {
      if (!WalletConnectConnector._provider) {
        throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
      }
      const provider = WalletConnectConnector._provider;
      // const provider = await UniversalProviderFactory.getProvider();
      if (this.sessionAvailable(WalletConnectConnector._provider.client)) {
        await provider.disconnect();
      }
      
      await provider.cleanupPendingPairings({ deletePairings: true });

      (await this.getPairings()).map((pairing) => {
        provider.client.core.pairing.disconnect({topic: pairing.topic})
      })
    } catch (error) {
      if (!/No matching key/iu.test((error as Error).message)) throw error;
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      // delete provider?.session?.namespaces?.cip34;
      // this.provider = undefined;
      this.cleanupInternalState();
    }
  }

  public getConnectorName(): string {
    return WalletConnectConnector.connectorName();
  }

  public isAvailable() {
    return true;
  }

  private set provider(provider: UniversalProvider | undefined) {
    WalletConnectConnector._provider = provider;
  }

  protected static get provider(): UniversalProvider | undefined {
    return WalletConnectConnector._provider;
  }

  public async isEnabled(): Promise<boolean> {
    return Promise.resolve(this.enabled);
  }

  protected async getProvider() {
    if (!WalletConnectConnector._provider) {
      throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    }
    return WalletConnectConnector._provider;
  }

  /**
   * This will ping the wallet relay connection to check if it is connected
   * If the timeout expires, it will return false.
   * @param timeout timeout in milliseconds
   * @returns true if the wallet is still interactable, false otherwise
   */
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
    // if (!this.currentTopic) {
    //     return false;
    // }
    if (!WalletConnectConnector._provider) {
      throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    }

    try {      
      var availableSession =  await this.checkPersistedState(WalletConnectConnector._provider.client);
      if (availableSession) {
        var session = availableSession as SessionTypes.Struct;
        await WalletConnectConnector._provider?.client.ping({ topic: session.topic });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  public async enable() {
    if (!WalletConnectConnector._provider) {
      throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    }
    if (!this.connectedWalletAPI) {
      throw new Error(WalletConnectV2ProviderErrorMessagesEnum.walletApiNotInitialized);
    }    
    
    var availableSession = await this.checkPersistedState(WalletConnectConnector._provider.client);
    
    if (availableSession) {
      // this.onSessionConnected({ session: availableSession });
      // await this.subscribeToEvents(WalletConnectConnector._provider.client);
      this.session = availableSession;
      this.currentTopic = availableSession.topic;
    } else {
      await this.connect().catch((error) => {
         throw error;
      });
    }    
    
    this.enabled = true;
    return this.connectedWalletAPI;
  }

  public getConnectorAPI(): EnabledAPI | undefined {
    if (!this.connectedWalletAPI) {
      throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    } 
      
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
    
    if (!WalletConnectConnector._provider) {
      throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    }

    const chosenChain = getChain();
    const chainID = chainToId(chosenChain);

    const cardanoNamespace = this.getConnectionParams();    
    
    await this.subscribeToEvents(WalletConnectConnector._provider.client);

    return new Promise<string | undefined>(async (resolve, reject) => {      
      
      //  const provider = await WalletConnectConnector._provider;
       WalletConnectConnector._provider?.on('display_uri', (uri: string) => {
          if (this.qrcode) {
            
            const ModalCtrl = createW3mModalCtrl();
            ModalCtrl.openModal({ uri, standaloneChains: [chainID] });
            ModalCtrl.subscribeModal(newState => {
              if (!this.enabled && !newState.open) {
                return reject(newState);
              }
            });
          } else return resolve(uri);
        });        
        
        var [existingPairing] = await this.getPairings();
        let existingPairingTopic = undefined;
        if (existingPairing) {
          existingPairingTopic = existingPairing.topic;
        }
        // alert(existingPairing);
        let existingSession = this.getSession();   

        if (!WalletConnectConnector._provider?.session)
        {
          existingSession = WalletConnectConnector._provider?.session;
          existingPairingTopic = undefined;
        }        
                
        WalletConnectConnector._provider?.connect({
            pairingTopic: existingPairingTopic,
            sessionProperties: existingSession?.sessionProperties,
            namespaces: { ...cardanoNamespace }
          })
          .then(providerResult => {
            if (!providerResult) throw new Error(WalletConnectV2ProviderErrorMessagesEnum.unableToConnect);

            // (TODO update typing for provider)
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const address = providerResult.namespaces?.cip34?.accounts[0]?.split(':')[2];
            if (address && this.qrcode) {
              setAddress(address);

              const ModalCtrl = createW3mModalCtrl();
              this.enabled = true;
              this.currentTopic = providerResult.topic;
              this.session = providerResult;
              this.onSessionConnected({ session: providerResult });

              ModalCtrl.closeModal();

              if (this.signSession) {
                // TODO: Implement login by signing wallet address/message.
                this.login({token: this.session.topic})
              }

              return resolve(address);
            } else return reject(new Error('Could not resolve address'));
          })
          .catch(error => {
            // if (!/No matching key/iu.test((error as Error).message)) throw error;
            const ModalCtrl = createW3mModalCtrl();
            ModalCtrl.closeModal();
            alert(error);
            return reject(error);
          });
    });  
  }

  private async subscribeToEvents(client: Client): Promise<void> {
    // if (typeof client === "undefined") {
    //   throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    // }
    // const provider = await UniversalProviderFactory.getProvider();
    if (!WalletConnectConnector._provider) {
      throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    }
    const provider = WalletConnectConnector._provider;

    try {
      // Session Events
      client.on("session_update", ({ topic, params }) => {
        if (!this.session || this.session?.topic !== topic) {
          return;
        }

        const { namespaces } = params;
        const _session = client.session.get(topic);
        const updatedSession = { ..._session, namespaces };
        this.onSessionConnected({ session: updatedSession });
      });

      client.on("session_event", this.handleSessionEvents.bind(this));

      client.on("session_delete", async ({ topic }) => {
        if (!this.session || this.session?.topic !== topic) {
          return;
        }
        // if (!WalletConnectConnector._provider) {
        //   throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
        // }
        // Logger.error(WalletConnectV2ProviderErrorMessagesEnum.sessionDeleted);

        // this.onClientConnect.onClientLogout();

        this.cleanupInternalState();
        await provider.cleanupPendingPairings({ deletePairings: true });
      });

      client.on("session_expire", async ({ topic }) => {
        if (!this.session || this.session?.topic !== topic) {
          return;
        }
        // Logger.error(WalletConnectV2ProviderErrorMessagesEnum.sessionExpired);
        // this.onClientConnect.onClientLogout();

        this.cleanupInternalState();
        await provider.cleanupPendingPairings({ deletePairings: true });
      });

      // Pairing Events
      client.core?.pairing?.events.on(
        "pairing_delete",
        this.handleTopicUpdateEvent.bind(this)
      );

      client.core?.pairing?.events.on(
        "pairing_expire",
        this.handleTopicUpdateEvent.bind(this)
      );
    } catch (error) {
      // Logger.error(
      //   WalletConnectV2ProviderErrorMessagesEnum.unableToHandleEvent
      // );
    }
  }

  private async handleTopicUpdateEvent({
    topic,
  }: {
    topic: string;
  }): Promise<void> {
    
    // const provider = await UniversalProviderFactory.getProvider();

    try {
      const existingPairings = await this.getPairings();

      if (this.address && !this.isInitializing && existingPairings) {
        if (existingPairings?.length === 0) {
          // TODO: Add callback function first
          //this.onClientConnect.onClientLogout();
        } else {
          const lastActivePairing =
            existingPairings[existingPairings.length - 1];

          if (lastActivePairing?.topic === topic) {
            // TODO: Add callback function first
            //this.onClientConnect.onClientLogout();
          }
        }
      }
    } catch (error) {
      // Logger.error(
      //   WalletConnectV2ProviderErrorMessagesEnum.unableToHandleTopic
      // );
    } finally {
      this.pairings = await this.getPairings();
    }
  }


  private async handleSessionEvents({
    topic,
    params,
  }: {
    topic: string;
    params: SessionEventTypes;
  }): Promise<void> {
    
    // if (typeof this.walletConnector === "undefined") {
    //   throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    // }
    if (this.session && this.session?.topic !== topic) {
      return;
    }

     const { event } = params;
    if (event?.name && this.currentTopic === topic) {
      // const eventData = event.data;

      // this.onClientConnect.onClientEvent(eventData);
    }
  }

  /**
   * Fetches the WalletConnect pairings
   */
  async getPairings(): Promise<PairingTypes.Struct[]> {
    if (!WalletConnectConnector._provider) {
      throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    }
    
    const provider = WalletConnectConnector._provider;
    
    return provider.client.core.pairing.pairings?.getAll({ active: true }) ?? []
  
  }

  private async checkPersistedState(
    client: Client
  ): Promise<SessionTypes.Struct | undefined> {
    if (typeof client === "undefined") {
       throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    }

    if (typeof this.session !== "undefined") {
      return this.session;
    }
    
    // Populates existing session to state (assume only the top one)
    if (client.session.length && !this.address && !this.isInitializing) {
      const session = this.getCurrentSession(client);
      if (session) {
        return session;
      }
    }

    return undefined;
  }

  private async onSessionConnected(options?: {
    session: SessionTypes.Struct;
    signature?: DataSignature;
  }): Promise<string> {
    if (!options) {
      return "";
    }

    this.session = options.session;
    const address = this.getAddressFromSession(options.session);

    if (address) {
      await this.loginAccount({ address, signature: options.signature });

      return address;
    }

    return "";
  }

  // TODO: use signature for further conditions.
  async login(options?: {
    approval?: () => Promise<SessionTypes.Struct>;
    token?: string;
  }): Promise<string> {
    this.isInitializing = true;
    // const provider = await UniversalProviderFactory.getProvider();
    // if (!this.session) {
    //   await this.connect();
    // }

    if (!this.getConnectorAPI)
    {
      throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    }

    if (!this.session) {
      await this.disconnect();
    }

    try {
      if (options && options.approval) {
        const session = await options.approval();

        // const currentChain = getChain();
        // const chaindId = chainToId(currentChain);

        if (options.token) {
          const address = this.getAddressFromSession(session);
          // const { signature }: { signature: string } =
            // await provider.client.request({
            //   chainId: chaindId,
            //   topic: session.topic,
            //   request: {
            //     method: Operation.SIGN_DATA,
            //     params: {
            //       token: options.token,
            //       address,
            //     },
            //   },
            // });
          const signature = await this.getConnectorAPI()?.signData(address, options.token);
          if (!signature) {
            // Logger.error(
            //   WalletConnectV2ProviderErrorMessagesEnum.unableToSignLoginToken
            // );
            throw new Error(
              WalletConnectV2ProviderErrorMessagesEnum.unableToSignLoginToken
            );
          }

          return await this.onSessionConnected({
            session,
            signature,
          });
        }

        return await this.onSessionConnected({
          session,
          signature: undefined,
        });
      }
    } catch (error) {
      this.cleanupInternalState();
      // Logger.error(WalletConnectV2ProviderErrorMessagesEnum.unableToLogin);
      throw new Error(WalletConnectV2ProviderErrorMessagesEnum.unableToLogin);
      throw new Error("unableToLogin");
    } finally {
      this.isInitializing = false;
    }

    return "";
  }

  private async loginAccount(options?: {
    address: string;
    signature?: DataSignature;
  }): Promise<string> {
    if (!options) {
      return "";
    }

    // if (this.addressIsValid(options.address)) {
    if (options.address) {
      this.address = options.address;
      if (options.signature) {
        this.signature = options.signature;
      }

      return this.address;
    }

    // Logger.error(
    //   `${WalletConnectV2ProviderErrorMessagesEnum.invalidAddress} ${options.address}`
    // );
    
    await this.disconnect();    

    return "";
  }

  // private addressIsValid(destinationAddress: string): boolean {
  //   try {
  //     const addr = UserAddress.fromBech32(destinationAddress);
  //     return !!addr;
  //   } catch {
  //     return false;
  //   }
  // }

  private sessionAvailable(client: Client): boolean {
    return client.session.length > 0;
  }

  private getAddressFromSession(session: SessionTypes.Struct): string {
    const chosenChain = getChain();
    const namespace = chosenChain.chainType;
    const selectedNamespace = session.namespaces[namespace];

    if (selectedNamespace && selectedNamespace.accounts) {
      // Use only the first address in case of multiple provided addresses
      const currentSession = selectedNamespace.accounts[0];
      // const [namespace, reference, address] = currentSession.split(":");
      const address = currentSession.split(':')[2];

      return address;
    }

    return "";
  }
  
  private getCurrentSession(client: Client): SessionTypes.Struct {
    if (typeof client === "undefined") {
      throw new Error(WalletConnectV2ProviderErrorMessagesEnum.notInitialized);
    }
    
    const acknowledgedSessions = client
      .find({requiredNamespaces: this.getConnectionParams()})
      .filter((s) => s.acknowledged);

    if (acknowledgedSessions.length > 0) {
      const lastKeyIndex = acknowledgedSessions.length - 1;
      const session = acknowledgedSessions[lastKeyIndex];

      return session;
    } else if (client.session.length > 0) {
      const lastKeyIndex = client.session.keys.length - 1;
      const session = client.session.get(client.session.keys[lastKeyIndex]);

      return session;
    } else {
      // Logger.error(
      //   WalletConnectV2ProviderErrorMessagesEnum.sessionNotConnected
      // );
      throw new Error(
        WalletConnectV2ProviderErrorMessagesEnum.sessionNotConnected
      );
    }
  }

  private getConnectionParams(
    options?: ConnectParamsTypes
  ): NamespaceConfig {
    
    const chosenChain = getChain();
    const chainID = chainToId(chosenChain);

    const methods = [
      ...WALLETCONNECT_CARDANO_METHODS,
      ...(options?.methods ?? []),
    ];

    const cardanoNamespace = {
      cip34: {
        chains: [chainID],
        methods: methods,
        events: WALLETCONNECT_CARDANO_EVENTS,
        rpcMap: {
          [chainID]: chosenChain.endpoint
        }
      }
    };

    return cardanoNamespace;
  }
}
