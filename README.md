# Adalib

**Cardano** friendly API

Adalib implements a `Connector` interface that complies with WalletConnect's standards.

It attempts to closely emulate the CIP-30 standard within the connectors. A dapp developer can use these connectors to retrieve the enabled CIP-30 API, and benefit from the included typings this library provides.

You will need a Walletconnect Project ID to use this library. You can get one by signing up and registering a dapp at https://walletconnect.com/.

For an examples, see `App.tsx` and `Home.tsx` in [example project](adalib-example/) in this repo.

For further docs, see [docs](docs/docs).
### API

- Connect Wallet:
  - Flint
  - WalletConnect
  - Injected Connector

### Init

The init function needs to be called to prepare `adalib` to be able to call all
the functions in its API.

```ts
import { 
  init, 
  cardanoMainnetWalletConnect,
  FlintConnector, 
  WalletConnectConnector 
} from 'adalib'

init(
  {
    // The different connector methodologies that will be used.
    // FlintConnector will interact with injected Flint Wallet using browser
    // extension, while WalletConnectConnector can be used to interact with all
    // wallets that support the WalletConnect protocol.
    connectors: [
      new FlintConnector(),
      new WalletConnectConnector({
        relayerRegion: 'wss://relay.walletconnect.com',
        metadata: {
          description: 'Test app for adalib',
          name: 'Test Adalib dApp',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
          url: 'http://localhost:3000'
        },
        autoconnect: true,
        qrcode: true
      })
    ],
    // Name of the connector to be used.
    // The connector needs to be registered in the connectors field above.
    // This can be switched later using `switchConnector` function.
    connectorName: WalletConnectConnector.connectorName(),
    // The name of the chain and network to use.
    // Here, `mainnet` refers to the cardano mainnet network.
    chosenChain: cardanoMainnetWalletConnect()
  },
  WALLETCONNECT_PROJECT_ID
)
```

### Connect Wallet

The connect function can be used to connect a wallet to a dApp. The wallet
chosen needs to be configured in the `init` function above.

```ts
import { connect, getActiveConnector } from 'adalib'

const address = await connect()

// OR

getActiveConnector()
      .enable()
      .then(api => {
        console.log('CIP-30 API Created', { api });
        // Store the enabled CIP-30 api in state and make subsequent calls to it
        setEnabledAPI(api);
      });
```

### Watch Address

Instead of retrieving the address once on the connect function, one can globally
watch address changes using the `watchAddress` API.

```ts
import { watchAddress, connect } from 'adalib'

watchAddress(address => {
  console.log({ address })
})

// calls `enable` on the active connector
connect()
```


### Switch Connector

```ts
import { switchConnector, FlintConnector, connect } from 'adalib'

switchConnector(FlintConnector.connectorName)

const flintWalletAPI = await connect()
```



<!-- # Folders
 -->
## Example

Example app written in react, for testing in the adalib-example folder.

