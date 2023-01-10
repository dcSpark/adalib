import '../styles/globals.css';
import type { AppProps } from 'next/app';
import {
  init,
  cardanoMainnetWalletConnect,
  WalletConnectConnector,
  FlintConnector
} from '@dcspark/adalib';
import { ColorModeProvider, ChakraProvider } from '@chakra-ui/react';

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

init(
  () => ({
    connectorName: FlintConnector.connectorName(),
    connectors: [
      new FlintConnector()
      // new WalletConnectConnector({
      //   relayerRegion: 'wss://relay.walletconnect.com',
      //   metadata: {
      //     description: 'Test app for adalib',
      //     name: 'Test Adalib dApp',
      //     icons: ['https://avatars.githubusercontent.com/u/37784886'],
      //     url: 'http://localhost:3030'
      //   },
      //   autoconnect: true,
      //   qrcode: true
      // })
    ],
    chosenChain: cardanoMainnetWalletConnect()
  }),
  PROJECT_ID
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ColorModeProvider>
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
