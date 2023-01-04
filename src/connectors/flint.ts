import type { Connector } from './base';
import { InjectedConnector } from './injected';

const FLINT_WALLET_PATH = `window.cardano.flint`;

export class FlintConnector extends InjectedConnector implements Connector {
  public constructor() {
    super(FLINT_WALLET_PATH);
  }

  public static connectorName() {
    return super.connectorName(FLINT_WALLET_PATH);
  }
}

// This class implements Cardano CIP-30
