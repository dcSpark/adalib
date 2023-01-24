# Transaction Actions
The following actions are concerned with making and retrieving information about
transactions.

## Transaction format.

Since the Transaction object itself is complex and involved. (Eg, needing to
retrieve the most recent blockhash and formatting signatures, Solib provides a
simplified transaction format. 

### Transfer format

```ts
type Transaction = Cbor<'transaction'>

const transactionArgs = "exampleCBOR.........."
```

## Sending transactions

### Signing transactions
`signTransaction` signs the transaction using the `Connector` configured, but
does not submit any information to the nodes.

```ts
import { signTx } from '@dcspark/adalib'

const transactionSignature = await signTransaction(transactionArgs, partialSign);
```

### Sending transactions

Submit tx sends the transaction to whichever node the wallet uses, but does not wait for confirmation. It returns an ID that allows a dapp to track the transaction's success.

```ts
import { submitTx } from '@dcspark/adalib'

const sentTransaction = await submitTx(transactionSignature);
```

### Sign Data

 `signData` communicates with the `Connector` or "Wallet" specified in `init` or `switchConnector` to cryptographically sign a message.

```ts
import { signData } from '@dcspark/adalib'

const address = "exampleAddress"
const payload = "CBORPayload......"
const sentTransaction = await signData(address, payload);

```





