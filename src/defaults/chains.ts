/* eslint-disable capitalized-comments */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */

import { ProtocolMagic } from '../types/CardanoInjected';
import type { Chain } from '../types/chain';

export const mainnet: Chain = {
  chainType: 'cardano', // required
  name: 'mainnet',
  networkId: '1',
  protocolMagic: `${ProtocolMagic.MAINNET}` // required
};

export const preprod: Chain = {
  chainType: 'cardano',
  name: 'testnet',
  networkId: '0',
  protocolMagic: `${ProtocolMagic.PREPROD}`
};

export const preview: Chain = {
  chainType: 'cardano',
  name: 'preview',
  networkId: '0',
  protocolMagic: `${ProtocolMagic.PREVIEW}`
};

export function cardanoMainnetWalletConnect() {
  return mainnet;
}

export function cardanoPreprodWalletConnect() {
  return preprod;
}

export function cardanoPreviewWalletConnect() {
  return preview;
}
