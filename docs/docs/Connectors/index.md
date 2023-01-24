# Connectors

Connectors are what Adalib uses to communicate with all the different wallets it
supports.

## Current Connectors

### WalletConnectConnector 
`WalletConnectConnector` is used to communicate with the plethora of wallets
that support WalletConnect like Spot, Math Wallet and many others.

#### Creation
```ts
new WalletConnectConnector({
  relayerRegion: 'wss://relay.walletconnect.com', // which relay to use
  metadata: {
    description: 'Test app for adalib',
    name: 'Test Adalib dApp',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    url: 'http://localhost:3000'
  },
  // Should the connector automatically connect if a pairing was made before
  autoconnect: true, 
  // Should WalletConnectConnector automatically display a qrcode modal for the user
  qrcode: true
})

```

### InjectedConnector 
`InjectedConnector` is used to support wallets that are used as browser
extensions. Eg: `flint` or `eternl`.

#### Creation
To create an InjectedConnector, simply give it a cardano wallet window path. An example would be `window.cardano.flint`. 

```ts
import { InjectedConnector }  from '@dcspark/adalib'

new InjectedConnector('window.cardano.flint');
```

### Flint Connector
Flint Connector is simply an `InjectedConnector` with Flint's window
path preloaded for convenience.

#### Creation

```ts
new FlintConnector()
```

