import type { Connector } from '../connectors/base';
import { getActiveConnector } from '../store';

export async function withConnector<T>(withConnectorFunc: (connector: Connector) => Promise<T>) {
  const connector = getActiveConnector();

  // TODO: Add is available check. isEnabled is insufficient because a connector can available but not enabled
  if (connector.isAvailable()) return withConnectorFunc(connector);

  return null;
}
