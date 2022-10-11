import type UniversalProvider from '@walletconnect/universal-provider'
import QRCodeModal from '@walletconnect/qrcode-modal'
import type { Connector } from './base'
import { BaseConnector } from './base'
import type { TransactionArgs, TransactionType } from '../types/requests'
import base58 from 'bs58'
import { PublicKey } from '@solana/web3.js'
import { UniversalProviderFactory } from '../utils/universalProvider'
import { getAddress, getCluster, setAddress } from '../store'

export interface WalletConnectAppMetadata {
  name: string
  description: string
  url: string
  icons: string[]
}

export class WalletConnectConnector extends BaseConnector implements Connector {
  protected provider: UniversalProvider | undefined
  protected qrcode: boolean

  public constructor({
    projectId,
    relayerRegion,
    metadata,
    qrcode,
    autoconnect
  }: {
    projectId: string
    relayerRegion: string
    metadata: WalletConnectAppMetadata
    qrcode?: boolean
    autoconnect?: boolean
  }) {
    super()
    this.qrcode = Boolean(qrcode)
    UniversalProviderFactory.setSettings({
      projectId,
      relayerRegion,
      metadata,
      qrcode: this.qrcode
    })
    if (autoconnect) {
      console.log('WC constructor > autoconnect true')
      UniversalProviderFactory.getProvider().then(provider => {
        console.log('Provider state', { provider })
        if (provider.session.namespaces.solana.accounts.length) {
          const [defaultAccount] = provider.session.namespaces.solana.accounts
          console.log('Found accounts', defaultAccount)
          // eslint-disable-next-line prefer-destructuring
          const address = defaultAccount.split(':')[2]
          setAddress(address)
        }
      })
    }
  }

  public static readonly connectorName = 'walletconnect'

  public getConnectorName(): string {
    return WalletConnectConnector.connectorName
  }

  public isAvailable() {
    return true
  }

  protected async getProvider() {
    const provider = await UniversalProviderFactory.getProvider()

    return provider
  }

  public async signMessage(message: string) {
    const address = getAddress()
    if (!address) throw new Error('No signer connected')

    const signedMessage = await this.request('solana_signMessage', {
      message: base58.encode(new TextEncoder().encode(message)),
      pubkey: address
    })
    const { signature } = signedMessage

    return signature
  }

  public async signTransaction<Type extends TransactionType>(
    type: Type,
    params: TransactionArgs[Type]
  ) {
    const transaction = await this.constructTransaction(type, params)
    console.log('Made transaction', transaction)

    const transactionParams = {
      feePayer: transaction.feePayer?.toBase58() ?? '',
      instructions: transaction.instructions.map(instruction => ({
        data: base58.encode(instruction.data),
        keys: instruction.keys.map(key => ({
          isWritable: key.isWritable,
          isSigner: key.isSigner,
          pubkey: key.pubkey.toBase58()
        })),
        programId: instruction.programId.toBase58()
      })),
      recentBlockhash: transaction.recentBlockhash ?? ''
    }

    console.log('Formatted transaction', transactionParams)

    const res = await this.request('solana_signTransaction', transactionParams)
    transaction.addSignature(
      new PublicKey(getAddress() ?? ''),
      Buffer.from(base58.decode(res.signature))
    )

    const validSig = transaction.verifySignatures()

    if (!validSig) throw new Error('Signature invalid.')

    console.log({ res, validSig })

    return base58.encode(transaction.serialize())
  }

  public async signAndSendTransaction<Type extends TransactionType>(
    type: Type,
    params: TransactionArgs[Type]
  ) {
    return this.sendTransaction(await this.signTransaction(type, params))
  }

  /**
   * Connect to user's wallet.
   *
   * If `WalletConnectConnector` was configured with `qrcode = true`, this will
   * open a QRCodeModal, where the user will scan the qrcode and then this
   * function will resolve/return the address of the wallet.
   *
   * If `qrcode = false`, this will return the pairing URI used to generate the
   * QRCode.
   */
  public async connect() {
    const chosenCluster = getCluster()
    const clusterId = `solana:${chosenCluster.id}`
    const solanaNamespace = {
      solana: {
        chains: [clusterId],
        methods: ['solana_signMessage', 'solana_signTransaction'],
        events: [],
        rpcMap: {
          [clusterId]: chosenCluster.endpoint
        }
      }
    }

    const provider = await UniversalProviderFactory.getProvider()

    return new Promise<string>(resolve => {
      provider.on('display_uri', (uri: string) => {
        if (this.qrcode)
          QRCodeModal.open(uri, (data: unknown) => {
            console.log('Opened QRCodeModal', data)
          })
        else resolve(uri)
      })

      provider
        .connect({
          pairingTopic: undefined,
          namespaces: solanaNamespace
        })
        .then(providerResult => {
          if (this.qrcode) {
            if (!providerResult) throw new Error('Failed connection.')
            const address = providerResult.namespaces.solana.accounts[0].split(':')[2]

            setAddress(address)

            console.log({ rs: providerResult })

            resolve(address)
          }
        })
    })
  }
}
