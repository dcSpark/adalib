import { polyfill } from './utils/polyfill';

export * from './actions';
export * from './defaults';
export * from './connectors';
export { cardano } from './types';
export { getActiveConnector, getConnectorIsAvailable, watchAddress } from './store';
polyfill();

export type { Chain } from './types/chain';
export type { StoreConfig } from './store/index';
export type { WalletConnectAppMetadata } from './connectors/walletconnect';
