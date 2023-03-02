/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import './App.css';

import {
  init,
  cardanoMainnetWalletConnect,
  WalletConnectConnector,
  FlintConnector,
  switchNetwork,
  cardanoPreprodWalletConnect,
  cardanoPreviewWalletConnect
  // setProjectId
} from '@dcspark/adalib';
import { ColorModeProvider, ChakraProvider } from '@chakra-ui/react';
import Home from './Home';

const PROJECT_ID = process.env.REACT_APP_NEXT_PUBLIC_PROJECT_ID;
console.log('PROJECT_ID', PROJECT_ID, process.env);
// switchNetwork(cardanoMainnetWalletConnect());

init(
  () => ({
    connectorName: WalletConnectConnector.connectorName(),
    connectors: [
      new FlintConnector(),
      new WalletConnectConnector({
        relayerRegion: `wss://relay.walletconnect.com`,
        metadata: {
          description: 'Test app for adalib',
          name: 'Test Adalib dApp',
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
          url: 'http://localhost:3030'
        },
        autoconnect: true,
        qrcode: true
      })
    ],
    chosenChain: cardanoMainnetWalletConnect()
  }),
  PROJECT_ID
);

function App() {
  return (
    <ChakraProvider>
      <ColorModeProvider>
        <Home />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
