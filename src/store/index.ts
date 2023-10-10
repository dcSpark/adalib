/* eslint-disable multiline-comment-style */
/* eslint-disable capitalized-comments */
/**
 * TODO: Place cardano wallet connect library store schema in here.
 * Update it the same way in injected and wallet-connect connectors.
 * Actually, managing localstorage wallet connection info should remain
 * a responsibility of the dapp in this particular instance.
 * This library is explicitly for connecting a wallet via walletconnect.
 * While it emulates similar functionality to the cf connect-wallet library,
 * it is not an all-in-one solution for connecting a wallet.
 */

import { proxy, subscribe } from 'valtio/vanilla';
import type { Connector } from '../connectors/base';
import type { Chain } from '../types/chain';

export interface StoreConfig {
  /**
   * List of connectors to be supported. a specific connector is chosen using
   * `connectorName`. Eg: `[new PhantomConnector()]`
   */
  connectors: Connector[];
  /**
   *  Name of the chosen connector from the `connectors` supplied.
   *  Can be accessed by statically getting the connector name,
   *  E.g: `WalletConnectConnector.connectorName`
   */
  connectorName: string;
  /**
   * Chosen network to communicate with. Options are exported. Eg:
   * `cardanoMainnetWalletConnect` which will communicate with the Cardano mainnet
   * using the connected wallet.
   */
  chosenChain: Chain;
}

interface State {
  connectors: Connector[];
  connectorName: string;
  chosenChain: Chain;
  requestId: number;
  walletConnectProjectId: string;
  socket?: WebSocket;
  address?: string;
}

/**
 * A temporary global store for the connectors.
 * Useful for setting the current connector and getting the current connector
 * with exported CIP-30 helper emulated methods to ensure usage of the correct connector.
 * Does not persist across page refreshes.
 */
const store: State = proxy<State>({
  connectors: [],
  chosenChain: {
    chainType: '',
    name: '',
    networkId: '',
    networkMagic: '',
    endpoint: ''
  },
  walletConnectProjectId: '',
  requestId: 0,
  connectorName: ''
});

function set<K extends keyof State>(key: K, value: State[K]) {
  store[key] = value;
}

function get<K extends keyof State>(key: K): State[K] {
  return store[key];
}

export function getNewRequestId() {
  const curId = store.requestId;
  store.requestId = curId + 1;

  return store.requestId;
}

export function setAddress(address: string) {
  set('address', address);
}

export function getAddress() {
  return get('address');
}

export function setConnectorName(connectorId: string) {
  // Get the names of all connectors from the store
  const connectorNames = store.connectors.map(connector => connector.getConnectorName());
  // If the provided connectorId is a valid connector name
  if (connectorNames.some(connectorName => connectorName === connectorId))
    // Set the connectorId as the connectorName in the store
    set('connectorName', connectorId);
  // Throw an error with a helpful message
  else
    throw new Error(`No connector with name ${connectorId} exists,
     available options are: ${connectorNames.join(',')} `);
}

export function getConnecterId() {
  return get('connectorName');
}

async function getConnector(name: string) {
  const { connectors } = store;
  const connector = connectors.find(
    availableConnector => availableConnector.getConnectorName() === name
  );

  if (!connector) throw new Error('Invalid connector id configured');
  await connector.init();
  return connector;
}

export function getActiveConnector() {
  const id = store.connectorName;
  return getConnector(id);
}

export async function getConnectorIsAvailable(name: string) {
  const connector = await getConnector(name);

  return connector.isAvailable();
}

export function setChain(chain: Chain) {
  set('chosenChain', chain);
}

export function watchAddress(callback: (address?: string) => void) {
  const unsub = subscribe(store, ops => {
    const addressChangeOp = ops.find(op => op[1].includes('address'));

    if (addressChangeOp) callback(store.address);
  });

  return unsub;
}

export function getChain() {
  return get('chosenChain');
}

export function setProjectId(projectId: string) {
  set('walletConnectProjectId', projectId);
}

export function getProjectId() {
  return get('walletConnectProjectId');
}

export function getConnectors() {
  return [...store.connectors];
}

export function initStore(config: StoreConfig) {
  Object.entries(config).forEach(([key, value]) => {
    set(key as keyof State, value);
  });

  setConnectorName(config.connectorName);
}
