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

const store: State = proxy<State>({
  connectors: [],
  chosenChain: {
    chainType: '',
    name: '',
    networkId: '',
    protocolMagic: ''
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
  const connectorNames = store.connectors.map(connector => connector.getConnectorName());
  if (connectorNames.some(connectorName => connectorName === connectorId))
    set('connectorName', connectorId);
  else
    throw new Error(`No connector with name ${connectorId} exists,
     available options are: ${connectorNames.join(',')} `);
}

export function getConnecterId() {
  return get('connectorName');
}

function getConnector(name: string) {
  const { connectors } = store;
  const connector = connectors.find(
    availableConnector => availableConnector.getConnectorName() === name
  );

  if (!connector) throw new Error('Invalid connector id configured');

  return connector;
}

export function getActiveConnector() {
  const id = store.connectorName;

  return getConnector(id);
}

// probably unnecessary
export function getConnectorIsAvailable(name: string) {
  const connector = getConnector(name);

  return connector.isAvailable();
}

export function setChain(cluster: Chain) {
  set('chosenChain', cluster);
}

// todo: check if we need to use this to watch network changes
// or can leave that responsibility to the dapp
export function watchCluster(callback: (clusterName: Chain) => void) {
  console.log('Subscribing to cluster');
  const unsub = subscribe(store, ops => {
    const clusterChangedOp = ops.find(op => op[1].includes('chosenCluster'));

    // Making a copy to avoid sending the proxy object
    const { id, name, endpoint } = store.chosenChain;
    if (clusterChangedOp)
      callback({
        id,
        chainType: name,
        endpoint
      });
  });

  return unsub;
}

export function watchAddress(callback: (address?: string) => void) {
  console.log('Subscribing to address');
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
