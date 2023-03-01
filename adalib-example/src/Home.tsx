/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  disconnect,
  getConnectorIsAvailable,
  WalletConnectConnector,
  getActiveConnector
} from '@dcspark/adalib';
import type { SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Flex, Heading, Input, useToast, Text, Image } from '@chakra-ui/react';
import { watchAddress } from '@dcspark/adalib';
import type { DataSignature, EnabledAPI } from '@dcspark/adalib/dist/types/CardanoInjected';
import { utils } from '@stricahq/typhonjs';

function hexEncode(str: string) {
  let hex, i;

  let result = '';
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += `000${hex}`.slice(-4);
  }

  return result;
}

function Home() {
  const toast = useToast();
  console.log('Flint is ready', getConnectorIsAvailable(WalletConnectConnector.connectorName()));
  const [address, setAddress] = useState<string | undefined>('');
  const [balance, setBalance] = useState<string | undefined>('');
  const [rawSignAddress, setRawSignAddress] = useState<string | undefined>('');
  const [usedAddresses, setUsedAddresses] = useState<string[]>([]);
  const [unusedAddresses, setUnusedAddresses] = useState<string[]>([]);
  const [changeAddress, setChangeAddress] = useState<string>('');
  const [collateral, setCollateral] = useState<string | undefined>('');
  const [signature, setSignature] = useState<DataSignature | undefined>(undefined);
  const [txSignResult, setTxSignResult] = useState<string | undefined>('');
  const [txSubmitResult, setTxSubmitResult] = useState<string | undefined>('');

  const [message, setMessage] = useState<string | undefined>('');

  const [txCBOR, setTxCBOR] = useState<string | undefined>('');

  const [enabledAPI, setEnabledAPI] = useState<EnabledAPI>();
  watchAddress((watchedAddress: SetStateAction<string | undefined>) => {
    console.log('watchAddress', watchedAddress);
    setAddress(watchedAddress);
  });
  useEffect(() => {
    if (enabledAPI) {
      enabledAPI.getRewardAddress().then(acc => {
        console.log('Reward Address:', acc);
        const decodedAddress = utils.getAddressFromHex(acc).getBech32();
        setAddress(decodedAddress);
      });
    }
  }, [enabledAPI, setAddress]);

  const enableConnector = useCallback(() => {
    getActiveConnector()
      .enable()
      .then(api => {
        console.log('CIP-30 API Created', { api });

        setEnabledAPI(api);
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
          const [cborAddr] = value;
          setRawSignAddress(cborAddr);
          const decodedAddresses = value.map(usedAddress =>
            utils.getAddressFromHex(usedAddress).getBech32()
          );
          setUsedAddresses(decodedAddresses);
        } else {
          setUsedAddresses(value ?? '');
        }
      });
    }
  }, [enabledAPI, setUsedAddresses, setRawSignAddress]);

  const getUnusedAddresses = useCallback(() => {
    if (enabledAPI) {
      console.log('getUnusedAddresses', enabledAPI);
      enabledAPI.getUnusedAddresses({ limit: 50, page: 1 }).then((value: string[]) => {
        console.log('Used addresses:', value);
        if (Array.isArray(value)) {
          const decodedAddresses = value.map(remoteUnusedAddresses =>
            utils.getAddressFromHex(remoteUnusedAddresses).getBech32()
          );
          setUnusedAddresses(decodedAddresses);
        } else {
          setUnusedAddresses(value ?? '');
        }
      });
    }
  }, [enabledAPI, setUnusedAddresses]);

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
      if (message2 && enabledAPI && rawSignAddress)
        enabledAPI.signData(rawSignAddress, hexEncode(message2)).then(signature2 => {
          setSignature(signature2 ?? undefined);
        });
    },
    [rawSignAddress, setSignature, enabledAPI]
  );

  const onSignTx = useCallback(() => {
    if (txCBOR && enabledAPI) {
      enabledAPI.signTx(txCBOR, false).then(resultID => {
        console.log('Tx signed', resultID);
        setTxSignResult(resultID ?? undefined);
      });
    }
  }, [enabledAPI, txCBOR]);

  const onSubmitTx = useCallback(() => {
    if (txSignResult && enabledAPI) {
      console.log('Tx submit', txSignResult);
      /**
         * Convert signed TX to CBOR:
         * const txCbor = Buffer.from(
          RustModule.WalletV4.Transaction.new(
            tx.body(),
            RustModule.WalletV4.TransactionWitnessSet.from_bytes(
              Buffer.from(txSignResult, 'hex')
            ),
            tx.auxiliary_data()
          ).to_bytes()
        ).toString('hex');
         */
      enabledAPI.submitTx(txSignResult).then(resultID => {
        console.log('Tx submitted', resultID);
        setTxSubmitResult(resultID ?? undefined);
      });
    }
  }, [txSignResult, setTxSubmitResult, enabledAPI]);

  return (
    <div className="App">
      <Flex width={'100%'} height="50px" mb="5em" justifyContent={'space-between'}>
        <Heading verticalAlign={'middle'}>Adalib Example </Heading>
        <Image
          alt="WalletConnect Logo"
          src="https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Badge/Blue/Badge%402x.png"
        ></Image>
      </Flex>
      <Flex gap="10" flexDirection="column" width={'100%'}>
        {!address && <Button onClick={enableConnector}>Connect</Button>}

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
            <Button
              onClick={() => {
                setEnabledAPI(undefined);
                setBalance(undefined);
                setUsedAddresses([]);
                setUnusedAddresses([]);
                setCollateral(undefined);
                setChangeAddress('');
                setTxSignResult('');
                disconnect();
              }}
            >
              Disconnect
            </Button>
          </Flex>
        )}
        {address && (
          <div>
            <Flex gap="5" flexDirection="column" alignItems={'flex-start'}>
              <Flex flexDirection="column" gap="3" width="100%">
                <Flex justifyContent="space-between" width="100%">
                  <Flex>
                    <Input
                      type="text"
                      placeholder="TX to sign..."
                      onChange={({ target }) => setTxCBOR(target.value)}
                    ></Input>
                  </Flex>
                  <Button onClick={() => onSignTx()}>Sign TX CBOR</Button>
                </Flex>
                <address>TX Sign Result: {txSignResult}</address>
              </Flex>
            </Flex>

            <Flex gap="5" flexDirection="column" alignItems={'flex-start'}>
              <Flex flexDirection="column" gap="3" width="100%">
                <Flex justifyContent="space-between" width="100%">
                  <Button disabled={!txSignResult} onClick={() => onSubmitTx()}>
                    Submit TX
                  </Button>
                </Flex>
                <address>TX Submit Result: {txSubmitResult}</address>
              </Flex>
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
          </div>
        )}
      </Flex>
    </div>
  );
}

export default Home;
