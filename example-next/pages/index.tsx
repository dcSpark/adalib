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
  getActiveConnector,
  getUsedAddresses,
  switchNetwork,
  cardanoMainnetWalletConnect
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
  useToast,
  Text
} from '@chakra-ui/react';
import type { DataSignature, EnabledAPI } from '@dcspark/adalib/dist/types/CardanoInjected';
import { decodeHexAddress } from '@cardano-foundation/cardano-connect-with-wallet';
import { utils } from '@stricahq/typhonjs';

import { watchAddress } from '@dcspark/adalib';
function Home() {
  const toast = useToast();
  console.log('Flint is ready', getConnectorIsAvailable(WalletConnectConnector.connectorName()));
  const [address, setAddress] = useState<string | undefined>('');
  const [balance, setBalance] = useState<string | undefined>('');
  const [usedAddresses, setUsedAddresses] = useState<string[]>([]);
  const [unusedAddresses, setUnusedAddresses] = useState<string[]>([]);
  const [changeAddress, setChangeAddress] = useState<string>('');
  const [collateral, setCollateral] = useState<string | undefined>('');
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

  const onClick = useCallback(() => {
    getActiveConnector()
      .enable()
      .then(api => {
        console.log('API CREATED', { api });

        if (api) setEnabledAPI(api);
      });
  }, [setEnabledAPI]);

  const getBalance = useCallback(() => {
    if (enabledAPI) {
      // Get balance of the current wallet
      enabledAPI.getBalance().then((value: any) => {
        console.log('Balance:', value);
        setBalance(value ?? '');
      });
    }
  }, [enabledAPI, setBalance]);

  const getUsedAddresses = useCallback(() => {
    if (enabledAPI) {
      console.log('getUsedAddresses', enabledAPI);

      enabledAPI.getUsedAddresses({ limit: 50, page: 1 }).then((value: string[]) => {
        console.log('Used addresses:', value);
        if (Array.isArray(value)) {
          const decodedAddresses = value.map(usedAddress =>
            utils.getAddressFromHex(usedAddress).getBech32()
          );
          setUsedAddresses(decodedAddresses);
        } else {
          setUsedAddresses(value ?? '');
        }
      });
    }
  }, [enabledAPI, setUsedAddresses]);

  const getUnusedAddresses = useCallback(() => {
    if (enabledAPI) {
      console.log('getUnusedAddresses', enabledAPI);
      enabledAPI.getUnusedAddresses({ limit: 50, page: 1 }).then((value: string[]) => {
        console.log('Used addresses:', value);
        if (Array.isArray(value)) {
          const decodedAddresses = value.map(unusedAddresses =>
            utils.getAddressFromHex(unusedAddresses).getBech32()
          );
          setUnusedAddresses(decodedAddresses);
        } else {
          setUnusedAddresses(value ?? '');
        }
      });
    }
  }, [enabledAPI, setUsedAddresses]);

  const getChangeAddress = useCallback(() => {
    if (enabledAPI) {
      enabledAPI.getChangeAddress().then((value: string) => {
        console.log('Change address:', value);
        const decodedAddress = utils.getAddressFromHex(value).getBech32();

        setChangeAddress(decodedAddress);
      });
    }
  }, [enabledAPI, setChangeAddress]);

  const getCollateral = useCallback(() => {
    if (enabledAPI) {
      enabledAPI.getCollateral().then((value: any) => {
        console.log('Collateral:', value);
        setCollateral(value ?? '');
      });
    }
  }, [enabledAPI, setCollateral]);

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

        {address && (
          <Flex gap="5" flexDirection="column" alignItems={'flex-start'}>
            <Badge fontSize="1em" fontStyle={'italic'}>
              Address
            </Badge>
            <Text>{JSON.stringify(address)}</Text>
            <Badge fontSize="1em" fontStyle={'italic'}>
              Balance:
            </Badge>
            <Text>{JSON.stringify(balance)}</Text>

            <Badge fontSize="1em" fontStyle={'italic'}>
              Used Addresses:
            </Badge>
            <Text>{JSON.stringify(usedAddresses)}</Text>

            <Badge fontSize="1em" fontStyle={'italic'}>
              Unused Addresses:
            </Badge>
            <Text>{JSON.stringify(unusedAddresses)}</Text>

            <Badge fontSize="1em" fontStyle={'italic'}>
              Change Address:
            </Badge>
            <Text>{JSON.stringify(changeAddress)}</Text>

            <Badge fontSize="1em" fontStyle={'italic'}>
              Collateral:
            </Badge>
            <Text>{JSON.stringify(collateral)}</Text>

            <Button onClick={getBalance}>Get Balance</Button>
            <Button onClick={getUsedAddresses}>Get Used Addresses</Button>
            <Button onClick={getUnusedAddresses}>Get Unused Addresses</Button>
            <Button onClick={getChangeAddress}>Get Change Address</Button>
            <Button onClick={getCollateral}>Get Collateral</Button>
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
