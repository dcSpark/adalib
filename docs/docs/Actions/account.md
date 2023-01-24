# Account Actions

The following actions are concerned with connecting and communicating
information about an account. They are convenience methods exposed to call
CIP-30 methods on the currently-active connector.

## Connection Management

### Connect

The `connect` function uses the connector defined in the `init` function, or a
connector that was switched to using `switchConnector`. Retrieving the address 
is done by watching it before the connect call.

```ts
import { connect } from '@dcspark/adalib'

await connect()
```

### Watch Address

`watchAddress` watches Adalib's state and updates when an address is either
connected *or disconnected*.

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

### Disconnect

`disconnect` does the necessary work to communicate with the wallet to
disconnect, and remove the address from state to help reflect changes on the UI
easier. Note, `watchAddress` will now call the callback with `''` for the
public key.

```ts
import { disconnect } from '@dcspark/adalib'

await disconnect()
```

### Get Address

`getAddress` returns the address connected in state in a synchronous manner.

```ts
import { getAddress } from '@dcspark/adalib'

const address = getAddress() // addr...
```

## Signatures

### Sign Message
With `signMessage`, there is no need to worry about how the user is connected or
what wallet they are using, `signMessage` will call the appropriate `Connector`
configured in `init` or chosen using `switchNetwork`.

```ts
import { signMessage } from '@walletconnect/solib'

const message = 'Some message'
const signature = await signMessage(message);
```

### Get Cip-30 Wallet API

```ts
import { getCardanoAPI } from '@dcspark/adalib'

// gets injected CIP-30 methods or emulated equivalent from wallet-connect.
const enabledAPI = await getCardanoAPI();
```

### Get Balance
`getBalance` retrieves the balance by communicating with the connector configured in `init` or chosen
using `switchConnector`.

```ts
import { getBalance } from '@walletconnect/solib'

// No need to supply an address as it will automatically use address connected.
const balance = await getBalance()
```

### Get Change Address
`getChangeAddress` retrieves the connected wallet's change address by communicating with the connector configured in `init` or chosen using `switchConnector`.

```ts
import { getChangeAddress } from '@dcspark/adalib'

const changeAddress = await getChangeAddress()
```

### Get Reward Address

`getRewardAddress` retrieves the connected wallet's reward address by communicating with the connector configured in `init` or chosen using `switchConnector`.

```ts
import { getRewardAddress } from '@dcspark/adalib'

const rewardAddress = await getRewardAddress()
```

### Get Reward Addresses

`getRewardAddresses` retrieves the connected wallet's reward addresses by communicating with the connector configured in `init` or chosen using `switchConnector`.

```ts
import { getRewardAddresses } from '@dcspark/adalib'

const rewardAddresses = await getRewardAddresses()
```

### Get Collateral

`getCollateral` retrieves the connected wallet's selected collateral by communicating with the connector configured in `init` or chosen using `switchConnector`.

```ts
import { getCollateral } from '@dcspark/adalib'

const collateral = await getCollateral()
```

### Get Used Addresses

`getUsedAddresses` retrieves the connected wallet's used addresses by communicating with the connector configured in `init` or chosen using `switchConnector`.

```ts
import { getUsedAddresses } from '@dcspark/adalib'

const usedAddresses = await getUsedAddresses()
```

### Get Network ID

`getNetworkId` retrieves the connected wallet's network ID by communicating with the connector configured in `init` or chosen using `switchConnector`.

```ts
import { getNetworkId } from '@dcspark/adalib'

const networkId = await getNetworkId()
```
