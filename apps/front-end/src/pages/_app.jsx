// Dependencies import
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  argentWallet,
  trustWallet,
  omniWallet,
  imTokenWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai, goerli, bscTestnet } from "wagmi/chains";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// Utils import
import { chainInfo } from "../utils/chain-info";

// CSS import
import "../styles/globals.scss";

const { chains, provider } = configureChains(
  [polygonMumbai, goerli, bscTestnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chainInfo[chain.id].rpcUrl,
      }),
    }),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ chains }),
      coinbaseWallet({ chains }),
      rainbowWallet({ chains }),
      walletConnectWallet({ chains }),
    ],
  },
  {
    groupName: "Other",
    wallets: [
      argentWallet({ chains }),
      trustWallet({ chains }),
      omniWallet({ chains }),
      imTokenWallet({ chains }),
      ledgerWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        coolMode={true}
        theme={darkTheme({
          accentColor: "#424549",
        })}
        chains={chains}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
