/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { Cbor } from '../types/CardanoInjected';
import { withConnector } from '../utils/connector';

export async function signTx(
  tx: Cbor<'transaction'>,
  partialSign: boolean
): Promise<Cbor<'transaction_witness_set'> | null | undefined> {
  return withConnector(async connector => {
    const api = connector.getConnectorAPI();
    if (!api) {
      throw new Error(`API for connector is not enabled.`);
    }

    return api.signTx(tx, partialSign);
  });
}

export async function submitTx(tx: string) {
  return withConnector(async connector => {
    const api = connector.getConnectorAPI();
    if (!api) {
      throw new Error(`API for connector is not enabled.`);
    }

    return api.submitTx(tx);
  });
}

export async function signData(addr: string, payload: string) {
  return withConnector(async connector => {
    const api = connector.getConnectorAPI();
    if (!api) {
      throw new Error(`API for connector is not enabled.`);
    }

    return api.signData(addr, payload);
  });
}
