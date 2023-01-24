# Adalib Actions

The actions documented here boil down to Adalib state management. 

## Init
Init functions should be called only once and it sets the state and maintains
connectors. Connectors can only be defined here.

```ts
import { 
  init, 
  FlintConnector, 
  WalletConnectConnector, 
  InjectedConnector, 
  cardanoMainnetWalletConnect
} from '@dcspark/dcspark'

init({
  // The different connector methodologies that will be used.
  // PhantomConnector will interact with injected Phantom Wallet using browser
  // extension, while WalletConnectConnector can be used to interact with all
  // wallets that support the WalletConnect protocol.
  connectors: [
    new FlintConnector(),
    new InjectedConnector('window.cardano.flint'),
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
  // The name of the chain to use.
  // `WalletConnect` is the RPC server that will be used to do the communication
  chosenChain: cardanoMainnetWalletConnect()
}, PROJECT_ID)
```

## State management

### Switch Connector
`switchConnector` will determine the connector used to perform `connect`,
`disconnect`, `signMessage` and most actions that do not communicate with a
cluster. This effectively manipulates `connectorName` configured in `init`.

```ts
import { switchConnector, FlintConnector } from '@dcspark/adalib'

// After this, all function calls will use FlintConnector under the hood.
switchConnector(FlintConnector.connectorName())
```

### Switch Network
`switchNetwork` determines which WalletConnect RPC URL will be communicated with. This
effectively manipulates `chosenChain`.

```ts
import { switchConnector, cardanoMainnetWalletConnect, cardanoPreprodWalletConnect } from '@dcspark/adalib'

switchNetwork(cardanoMainnetWalletConnect()) 

switchNetwork(cardanoPreprodWalletConnect())
```

### Set and Get project Id
The functions here are conceded with manipulating `PROJECT_ID` (the second
argument in `init`.

```ts
import { getProjectId, setProjectId } from '@dcspark/adalib'

setProjectId('0x8s...')

const projectId = getProjectId() 

console.log(projectId) // 0x8s...
```

### Get Connector is available
`getConnectorIsAvailable` determines whether a specified connector is available.

```ts
import { getConnectorIsAvailable, FlintConnector } from '@dcspark/adalib'

const flintIsAvailable1 = getConnectorIsAvailable(FlintConnector.connectorName())

// OR

const phantomIsAvailable2 = getConnectorIsAvailable('injected-window.cardano.flint')

