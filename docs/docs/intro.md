---
sidebar_position: 1
slug: /
title: Getting Started
---


# Adalib

Adalib is a friendly, easy to use Cardano API. All the functionality needed to interact with Cardano is baked into Adalib, including connecting wallets, signing messages, sending transactions, interacting with Bonafida's name service  and more.

## Getting started

Getting started with Adalib is as simple as calling a couple of functions. No
need to worry about managing clients or state, all of it is handled in the
background.

## Installation

Instal Adalib using the following

```bash npm2yarn
npm install --save @dcspark/adalib
```

## Initializing Adalib

The init function needs to be called to prepare adalib to be able to call all the functions in its API.

```ts
import { 
  init, FlintConnector, WalletConnectConnector, 
  InjectedConnector, mainnetBetaWalletConnect
} from '@dcspark/adalib'

init({
  // The different connector methodologies that will be used.
  // FlintConnector will interact with injected Flint Wallet using browser
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
  connectorName: WalletConnectConnector.connectorName,
  // The name of the cluster and network to use.
  // Here, `mainnetBeta` refers to the mainnetBeta Cardano network, while
  // `WalletConnect` is the RPC server that will be used to do the communication
  chosenCluster: cardanoMainnetWalletConnect()
}, PROJECT_ID)
```

## Establish connection
Once the `init` function is called successfully somewhere in the app, the next
step is establishing a connection with a wallet.

```ts
import { connect, watchAddress } from '@dcspark/adalib'


watchAddress(address => {
  if (address) {
    // update UI to reflect successful connection
  }
  else {
    // Failed connection.
  }
})

await connect()
```

## Start interacting with clusters and the wallet.
After a public key / address is retrieved, all functions are now available for
usage.

```ts
import { getBalance, signMessage } from '@dcspark/adalib'

// `getBalance` retrieves the balance by communicating with the connector configured in `init` or chosen
// using `switchConnector`.
const balance = await getBalance();

// This communicates with the `Connector` or "Wallet" specified in `init` or `switchConnector` to cryptographically sign a message.

import { signData } from '@dcspark/adalib'

const address = "exampleAddress"
const payload = "CBORPayload......"
const sentTransaction = await signData(address, payload);
```







