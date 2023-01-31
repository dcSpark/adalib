/* eslint-disable capitalized-comments */
import type { Chain } from '../types/chain';
import { setChain } from '../store';
import { withConnector } from '../utils/connector';

export async function connect() {
  return withConnector(async connector => {
    return connector.enable();
  });
}

/**
 * This method returns the underlying CIP-30 implementation
 * for whichever connector is active.
 * This method may be all we need to allow the WC modal and dapps
 * to use these connectors.
 * @returns EnabledAPI
 */
export async function getCardanoAPI() {
  return withConnector(async connector => {
    return Promise.resolve(connector.getConnectorAPI());
  });
}

export async function getChangeAddress() {
  return withConnector(async connector => {
    const api = connector.getConnectorAPI();
    if (!api) {
      throw new Error(`API for connector is not enabled.`);
    }

    return api.getChangeAddress();
  });
}

export async function getRewardAddress() {
  return withConnector(async connector => {
    const api = connector.getConnectorAPI();
    if (!api) {
      throw new Error(`API for connector is not enabled.`);
    }

    return api.getRewardAddress();
  });
}

export async function getRewardAddresses() {
  return withConnector(async connector => {
    const api = connector.getConnectorAPI();
    if (!api) {
      throw new Error(`API for connector is not enabled.`);
    }

    return api.getRewardAddresses();
  });
}

export async function getBalance() {
  return withConnector(async connector => {
    const api = connector.getConnectorAPI();
    if (!api) {
      throw new Error(`API for connector is not enabled.`);
    }

    return api.getBalance();
  });
}

export async function getCollateral() {
  return withConnector(async connector => {
    const api = connector.getConnectorAPI();
    if (!api) {
      throw new Error(`API for connector is not enabled.`);
    }

    return api.getCollateral();
  });
}

export async function getUsedAddresses() {
  return withConnector(async connector => {
    const api = connector.getConnectorAPI();
    if (!api) {
      throw new Error(`API for connector is not enabled.`);
    }

    return api.getUsedAddresses();
  });
}

export async function getUnusedAddresses() {
  return withConnector(async connector => {
    const api = connector.getConnectorAPI();
    if (!api) {
      throw new Error(`API for connector is not enabled.`);
    }

    return api.getUnusedAddresses();
  });
}

/**
 * @deprecated Unavailable in current standard
 */
export function switchNetwork(chain: Chain) {
  setChain(chain);
}

export async function getNetworkId() {
  return withConnector(async connector => {
    const api = connector.getConnectorAPI();
    if (!api) {
      throw new Error(`API for connector is not enabled.`);
    }

    return api.getNetworkId();
  });
}

export async function disconnect() {
  return withConnector(async connector => {
    return connector.disconnect();
  });
}
