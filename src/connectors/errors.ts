/**
 * The base class for exceptions (errors).
 */
export class Err extends Error {
    inner: Error | undefined = undefined;
  
    public constructor(message: string, inner?: Error) {
      super(message);
      this.inner = inner;
    }
  }
  
  /**
   * Signals that a method is not yet implemented
   */
  export class ErrNotImplemented extends Err {
    public constructor() {
      super("Method not yet implemented");
    }
  }
  
  /**
   * Signals a bad address.
   */
  export class ErrBadAddress extends Err {
    public constructor(value: string, inner?: Error) {
      super(`Bad address: ${value}`, inner);
    }
  }
  
  /**
   * WalletConnect V2 Error Messages
   */
  
  export enum WalletConnectV2ProviderErrorMessagesEnum {
    unableToInit = "WalletConnect is unable to init",
    notInitialized = "WalletConnect is not initialized",
    walletApiNotInitialized = "WalletConnect might be initialized but no connectedWalletAPI was initialized",
    unableToConnect = "WalletConnect is unable to connect",
    unableToConnectExisting = "WalletConnect is unable to connect to existing pairing",
    unableToSignLoginToken = "WalletConnect could not sign login token",
    unableToLogin = "WalletConnect is unable to login",
    unableToHandleTopic = "WalletConnect: Unable to handle topic update",
    unableToHandleEvent = "WalletConnect: Unable to handle events",
    unableToHandleCleanup = "WalletConnect: Unable to handle cleanup",
    sessionNotConnected = "WalletConnect Session is not connected",
    sessionDeleted = "WalletConnect Session Deleted",
    sessionExpired = "WalletConnect Session Expired",
    alreadyLoggedOut = "WalletConnect: Already logged out",
    pingFailed = "WalletConnect Ping Failed",
    invalidAddress = "WalletConnect: Invalid address",
    requestDifferentChain = "WalletConnect: Request Chain Id different than Connection Chain Id",
    invalidMessageResponse = "WalletConnect could not sign the message",
    invalidMessageSignature = "WalletConnect: Invalid message signature",
    invalidTransactionResponse = "WalletConnect could not sign the transactions. Invalid signatures",
    invalidCustomRequestResponse = "WalletConnect could not send the custom request",
    transactionError = "Transaction canceled",
    connectionError = "WalletConnect could not establish a connection",
  }