/* eslint-disable capitalized-comments */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */

import { getProjectId } from '../store';
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
