/* eslint-disable capitalized-comments */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */

import { getChain, getProjectId } from '../store';
import { ProtocolMagic } from '../types/CardanoInjected';
import type { Chain } from '../types/chain';

const chainType = 'cip34';

const mainnet: Chain = {
  chainType, // required
  name: 'mainnet',
  networkId: '1',
  networkMagic: `${ProtocolMagic.MAINNET}`, // required
  endpoint: ''
};

const preprod: Chain = {
  chainType,
  name: 'testnet',
  networkId: '0',
  networkMagic: `${ProtocolMagic.PREPROD}`,
  endpoint: ''
};

const preview: Chain = {
  chainType,
  name: 'preview',
  networkId: '0',
  networkMagic: `${ProtocolMagic.PREVIEW}`,
  endpoint: ''
};

export function chainToId(chain: Chain): string {
  // No colon between networkId and protocolMagic because walletconnect only accepts one colon
  return `${chain.chainType}:${chain.networkId}-${chain.networkMagic}`;
}

function chainToEndpoint(chain: Chain): string {
  const chainID = chainToId(chain);
  const endpoint = `https://rpc.walletconnect.com/v1?chainId=${chainID}&projectId=${getProjectId()}`;

  return endpoint;
}

export function cardanoMainnetWalletConnect() {
  return { ...mainnet, endpoint: chainToEndpoint(mainnet) };
}

export function cardanoPreprodWalletConnect() {
  return { ...preprod, endpoint: chainToEndpoint(preprod) };
}

export function cardanoPreviewWalletConnect() {
  return { ...preview, endpoint: chainToEndpoint(preview) };
}

export function currentChainID(): string {
  const chosenChain = getChain();
  const chainID = chainToId(chosenChain);

  return chainID;
}

export enum Operation {
  SIGN_TRANSACTION = "cardano_signTx",
  SIGN_DATA = "cardano_signData",
  SUBMIT_TRANSACTION = "cardano_submitTx",
  GET_BALANCE = "cardano_getBalance",
  GET_COLLATERAL = "cardano_getCollateral",
  GET_UTXOS = "cardano_getUtxos",
  GET_NETWORK_ID = "cardano_getNetworkId",
  GET_USED_ADDRESSES = "cardano_getUsedAddresses",
  GET_UNUSED_ADDRESSES = "cardano_getUnusedAddresses",
  GET_CHANGE_ADDRESS = "cardano_getChangeAddress",
  GET_REWARD_ADDRESS = "cardano_getRewardAddress",
  GET_REWARD_ADDRESSES = "cardano_getRewardAddresses",
  EXIT_WALLET = "cardano_exitWallet"
}

export enum Events {
  ON_NETWORK_CHANGE = "cardano_onNetworkChange",
  ON_ACCOUNT_CHANGE = "cardano_onAccountChange"
}

export const WALLETCONNECT_CARDANO_METHODS = Object.values(Operation);
export const WALLETCONNECT_CARDANO_EVENTS = Object.values(Events);