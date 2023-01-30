/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  connect,
  // signTx,
  disconnect,
  getBalance,
  // submitTx,
  FlintConnector,
  // getCollateral,
  // getCardanoAPI,
  // getNetworkId,
  // getUsedAddresses,
  // getChangeAddress,
  getRewardAddress,
  signData,
  // getRewardAddresses,
  // switchConnector,
  getConnectorIsAvailable,
  WalletConnectConnector,
  getActiveConnector
} from '@dcspark/adalib';
import { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Flex,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useToast
} from '@chakra-ui/react';
import type { DataSignature, EnabledAPI } from '@dcspark/adalib/dist/types/CardanoInjected';
import { decodeHexAddress } from '@cardano-foundation/cardano-connect-with-wallet';

import { watchAddress } from '@dcspark/adalib';

function Home() {
  const toast = useToast();
  console.log('Flint is ready', getConnectorIsAvailable(WalletConnectConnector.connectorName()));
  const [address, setAddress] = useState<string | undefined>('');
  const [balance, setBalance] = useState<string | undefined>('');
  const [signature, setSignature] = useState<DataSignature | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>('');
  const [toAddress, setToAddress] = useState<string | undefined>('');
  const [amount, setAmount] = useState<number>(0);
  const [enabledAPI, setEnabledAPI] = useState<EnabledAPI>();
  watchAddress(watchedAddress => {
    console.log('watchAddress', watchedAddress);
    setAddress(watchedAddress);
  });
  useEffect(() => {
    console.log('ya hey');
    if (enabledAPI) {
      enabledAPI.getRewardAddress().then(acc => {
        console.log('Reward Address:', acc);
        const decodedAddress = decodeHexAddress(acc);
        setAddress(decodedAddress);
      });
    }
  }, [enabledAPI, setAddress]);

  // balance is a CML / CSL serialized `Value`
  useEffect(() => {
    if (address) {
      // Get balance of the current wallet
      if (enabledAPI) {
        enabledAPI.getBalance().then((value: any) => {
          console.log('Wallet enabled');

          console.log('Balance:', value);
          setBalance(value ?? '');
        });
      }

      // getBalance().then(value => {
      //   console.log('Balance:', value);
      //   setBalance(value ?? '');
      // });
    }
  }, [address, setAddress, enabledAPI]);

  const onClick = useCallback(() => {
    getActiveConnector()
      .enable()
      .then(api => {
        console.log('API CREATED', { api });

        if (api) setEnabledAPI(api);
      });
  }, [setEnabledAPI]);

  const getBalance = useCallback(() => {
    if (address && enabledAPI) {
      // Get balance of the current wallet
      enabledAPI.getBalance().then((value: any) => {
        console.log('Balance:', value);
        setBalance(value ?? '');
      });
    }
  }, [address, setAddress, enabledAPI]);

  const onSign = useCallback(
    (message2: string | undefined) => {
      if (message2 && address)
        signData(address, message2).then(signature2 => {
          setSignature(signature2 ?? undefined);
        });
    },
    [address, setSignature]
  );

  return (
    <div className="App">
      <Heading mb="5em">Adalib Example</Heading>
      <Flex gap="10" flexDirection="column" width={'100%'}>
        {!address && <Button onClick={onClick}>Connect</Button>}
        {address && <Button onClick={getBalance}>Get Balance</Button>}

        {address && (
          <Flex gap="5" flexDirection="column" alignItems={'flex-start'}>
            <Badge fontSize="1em" fontStyle={'italic'}>
              Address {address}
            </Badge>
            <Badge fontSize="1em" fontStyle={'italic'}>
              Balance: {balance}
            </Badge>
            <Button onClick={async () => disconnect()}>Disconnect</Button>
          </Flex>
        )}
        {address && (
          <Flex gap="5" flexDirection="column" alignItems={'flex-start'}>
            <Flex justifyContent="space-between" alignItems="center" width="100%">
              <Flex gap="2" flexDirection="column">
                <Input
                  type="text"
                  placeholder="Send to.."
                  onChange={({ target }) => {
                    setToAddress(target.value);
                  }}
                ></Input>
                <NumberInput
                  placeholder="Amount to send"
                  onChange={(_, value) => {
                    setAmount(value);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              {/* <Button onClick={() => onSendTransaction(toAddress ?? '', amount)}>
                Send Transaction
              </Button> */}
            </Flex>
            <Flex flexDirection="column" gap="3" width="100%">
              <Flex justifyContent="space-between" width="100%">
                <Flex>
                  <Input
                    type="text"
                    placeholder="Message to sign..."
                    onChange={({ target }) => setMessage(target.value)}
                  ></Input>
                </Flex>
                <Button onClick={() => onSign(message)}>Sign Message</Button>
              </Flex>
              <address>Signature: {signature?.signature}</address>
            </Flex>
          </Flex>
        )}
      </Flex>
    </div>
  );
}

export default Home;
