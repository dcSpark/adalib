/* eslint-disable no-warning-comments */
/* eslint-disable multiline-comment-style */
/* eslint-disable capitalized-comments */
import type UniversalProvider from '@walletconnect/universal-provider/dist/types/UniversalProvider';
import type {
  Cbor,
  DataSignature,
  EnabledAPI,
  Paginate
} from '../types/CardanoInjected';

/**
 * This class is used to emulate the Cardano Wallet API's content script.
 * It serves as an interface between the dapp and the WalleConnect provider relay.
 * It simulates the API that the content script would provide to the dapp, and passes
 * each method's name and arguments to the provider relay when called.
 */
export class EnabledWalletEmulator implements EnabledAPI {
  private readonly provider: UniversalProvider;

  public async getNetworkId() {
    return this.provider.request<number>({ method: 'cardano_getNetworkId' });
  }
  public async getUtxos(amount?: string | undefined, paginate?: Paginate | undefined) {
    return this.provider.request<Cbor<'TransactionUnspentOutput'>[]>({
      method: 'cardano_getUtxos',
      params: [amount, paginate]
    });
  }
  public async getBalance() {
    return this.provider.request<Cbor<'value'>>({ method: 'cardano_getBalance' });
  }
  public async getUsedAddresses(paginate?: Paginate | undefined) {
    return this.provider.request<Cbor<'address'>[]>({
      method: 'cardano_getUsedAddresses',
      params: [paginate]
    });
  }
  public async getUnusedAddresses(paginate?: Paginate | undefined) {
    return this.provider.request<Cbor<'address'>[]>({
      method: 'cardano_getUnusedAddresses',
      params: [paginate]
    });
  }
  public async getChangeAddress() {
    return this.provider.request<Cbor<'address'>>({ method: 'cardano_getChangeAddress' });
  }
  public async getRewardAddress() {
    return this.provider.request<Cbor<'address'>>({ method: 'cardano_getRewardAddress' });
  }
  public async getRewardAddresses() {
    return this.provider.request<Cbor<'address'>[]>({
      method: 'cardano_getRewardAddresses'
    });
  }
  public async signTx(tx: string, partialSign?: boolean | undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-eq-null, eqeqeq

    return this.provider.request<Cbor<'transaction_witness_set'>>({
      method: 'cardano_signTx',
      params: [tx, partialSign]
    });
  }
  public async signData(addr: string, payload: string) {
    return this.provider.request<DataSignature>({
      method: 'cardano_signData',
      params: [addr, payload]
    });
  }
  public async submitTx(tx: string) {
    return this.provider.request<string>({ method: 'cardano_submitTx', params: [tx] });
  }
  /*
   *   Public getInjectAs: () => Promise<InjectAsWallet>;
   *   public openDebug: () => Promise<undefined>;
   */
  public async getCollateral() {
    return this.provider.request<Cbor<'TransactionUnspentOutput'>[]>({
      method: 'cardano_getCollateral'
    });
  }
  //   public isConnected: () => Promise<boolean>;

  // TODO: Implement provider listeners to listen for these events and trigger callback
  // Note: These listeners may not be necessary because accounts and network changes are
  // unlikely to occur when the wallet is connected via WalletConnect
  public async onAccountChange(callback: (addresses: Cbor<'address'>[]) => Promise<undefined>) {
    return new Promise<undefined>((resolve, reject) => {
      try {
        this.provider.on('cardano_onAccountChange', callback);
        resolve(undefined);
      } catch (e) {
        reject(e);
      }
    });
  }
  public async onNetworkChange (callback: (network: number) ){
    return new Promise<undefined>((resolve, reject) => {
      try {
        this.provider.on('cardano_onNetworkChange', callback);
        resolve(undefined);
      } catch (e) {
        reject(e);
      }
    });
  }

  public constructor(provider: UniversalProvider) {
    this.provider = provider;
  }
  //   ccvault?: PerWalletNamespace | undefined;
  //   flint?: PerWalletNamespace | undefined;
  //   flintExperimental?: PerWalletNamespace | undefined;
  //   gerowallet?: PerWalletNamespace | undefined;
  //   nami?: PerWalletNamespace | undefined;
  //   typhoncip30?: PerWalletNamespace | undefined;
  //   yoroi?: PerWalletNamespace | undefined;
}
