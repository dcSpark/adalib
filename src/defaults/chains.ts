/* eslint-disable capitalized-comments */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */

import { getProjectId } from '../store';
import { ProtocolMagic } from '../types/CardanoInjected';
import type { Chain } from '../types/chain';

export const mainnet: Chain = {
  chainType: 'cardano', // required
  name: 'mainnet',
  networkId: '1',
  protocolMagic: `${ProtocolMagic.MAINNET}`, // required
  endpoint: ''
};

export const preprod: Chain = {
  chainType: 'cardano',
  name: 'testnet',
  networkId: '0',
  protocolMagic: `${ProtocolMagic.PREPROD}`,
  endpoint: ''
};

export const preview: Chain = {
  chainType: 'cardano',
  name: 'preview',
  networkId: '0',
  protocolMagic: `${ProtocolMagic.PREVIEW}`,
  endpoint: ''
};

export function chainToId(chain: Chain): string {
  return `${chain.chainType}:${chain.networkId}:${chain.protocolMagic}`;
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
