/* eslint-disable no-warning-comments */
/* eslint-disable multiline-comment-style */
/* eslint-disable capitalized-comments */
import type { Cbor, DataSignature, EnabledAPI, Paginate } from '../types/CardanoInjected';
import { currentChainID } from '../defaults/chains';
import { UniversalProviderFactory } from './universalProvider';

/**
 * This class is used to emulate the Cardano Wallet API's content script.
 * It serves as an interface between the dapp and the WalletConnect provider relay.
 * It simulates the API that the content script would provide to the dapp, and passes
 * each method's name and arguments to the provider relay when called.
 */
export class EnabledWalletEmulator implements EnabledAPI {
  public async getNetworkId() {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<number>({ method: 'cardano_getNetworkId' }, currentChainID());
  }
  public async getUtxos(amount?: string | undefined, paginate?: Paginate | undefined) {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<Cbor<'TransactionUnspentOutput'>[]>(
      {
        method: 'cardano_getUtxos',
        params: [amount, paginate]
      },
      currentChainID()
    );
  }
  public async getBalance() {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<Cbor<'value'>>({ method: 'cardano_getBalance' }, currentChainID());
  }
  public async getUsedAddresses(paginate?: Paginate | undefined) {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<Cbor<'address'>[]>(
      {
        method: 'cardano_getUsedAddresses',
        params: paginate ? [paginate] : []
      },
      currentChainID()
    );
  }
  public async getUnusedAddresses(paginate?: Paginate | undefined) {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<Cbor<'address'>[]>(
      {
        method: 'cardano_getUnusedAddresses',
        params: paginate ? [paginate] : []
      },
      currentChainID()
    );
  }
  public async getChangeAddress() {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<Cbor<'address'>>(
      { method: 'cardano_getChangeAddress' },
      currentChainID()
    );
  }
  public async getRewardAddress() {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<Cbor<'address'>>(
      { method: 'cardano_getRewardAddress' },
      currentChainID()
    );
  }
  public async getRewardAddresses() {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<Cbor<'address'>[]>(
      {
        method: 'cardano_getRewardAddresses'
      },
      currentChainID()
    );
  }
  public async signTx(tx: string, partialSign = false) {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<Cbor<'transaction_witness_set'>>(
      {
        method: 'cardano_signTx',
        params: [tx, partialSign]
      },
      currentChainID()
    );
  }
  public async signData(addr: string, payload: string) {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<DataSignature>(
      {
        method: 'cardano_signData',
        params: [addr, payload]
      },
      currentChainID()
    );
  }
  public async submitTx(tx: string) {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<string>({ method: 'cardano_submitTx', params: [tx] }, currentChainID());
  }
  /*
   *   Public getInjectAs: () => Promise<InjectAsWallet>;
   *   public openDebug: () => Promise<undefined>;
   */
  public async getCollateral() {
    const provider = await UniversalProviderFactory.getProvider();

    return provider.request<Cbor<'TransactionUnspentOutput'>[]>(
      {
        method: 'cardano_getCollateral'
      },
      currentChainID()
    );
  }

  /** TODO: Implement provider listeners to listen for these events and trigger callback
   * Note: These are not standardized in the CIP-30 Cardano Wallet API, so their implementation is not complete.
   */
  public async onAccountChange(callback: (addresses: Cbor<'address'>[]) => Promise<undefined>) {
    const provider = await UniversalProviderFactory.getProvider();

    return new Promise<undefined>((resolve, reject) => {
      try {
        provider.on('cardano_onAccountChange', callback);
        resolve(undefined);
      } catch (e) {
        reject(e);
      }
    });
  }
  public async onNetworkChange(callback: (network: number) => Promise<undefined>) {
    const provider = await UniversalProviderFactory.getProvider();

    return new Promise<undefined>((resolve, reject) => {
      try {
        provider.on('cardano_onNetworkChange', callback);
        resolve(undefined);
      } catch (e) {
        reject(e);
      }
    });
  }
}
