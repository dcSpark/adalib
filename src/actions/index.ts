export { init, switchConnector, getProjectId, setProjectId, getConnectorIsAvailable } from './main';
export {
  connect,
  disconnect,
  getAddress,
  getBalance,
  signMessage,
  switchNetwork,
  getNetworkId,
  watchNetwork,
  watchAddress
} from './accounts';

export {
  signAndSendTransaction,
  signTransaction,
  sendTransaction,
  getTransaction
} from './transactions';
