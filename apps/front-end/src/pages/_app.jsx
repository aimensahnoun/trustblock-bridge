// Dependencies import
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider , darkTheme} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai, goerli , bscTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

// CSS import
import "../styles/globals.scss";

const { chains, provider } = configureChains(
  [polygonMumbai, goerli,bscTestnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_MUMBAI_API }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_GOERLI_API }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "TrustBlock Bridge",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider coolMode={true} theme={darkTheme({
        accentColor: "#424549",
      })} chains={chains}>
        <Component {...pageProps} />;
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;