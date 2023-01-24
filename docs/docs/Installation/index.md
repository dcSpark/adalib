# Install Adalib

Install Adalib using the following

### NPM
```bash
npm install --save @@dcspark/adalib
```

### Yarn
```bash
yarn add @@dcspark/adalib
```

### Note on QRCodes and Web3Modal's standalone modal
If you plan on setting `qrcode: false` and handling QRCode display yourself when
using `WalletConnectConnector`, be sure to mark the web3modal dependencies as external in the rollup or webpack config.
They are peer dependencies and are not downloaded automatically, and need to be
marked as such to avoid import analysis tools false flagging them.

Example in vite
```json
export default defineConfig({
  rollupOptions: {
    external: ["@web3modal/core", "@web3modal/ui"]
  },
  plugins: [react()],
});

```
