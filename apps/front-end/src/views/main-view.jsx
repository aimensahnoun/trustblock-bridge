// NextJs import
import Head from "next/head";

// Dependencies import
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNetwork } from "wagmi";

// Components import
import BridgeInput from "../pages/components/bridge-input";

const MainView = () => {
  // Wagmi hooks
  const { chain, chains } = useNetwork();

  const remainingChains = chains.filter((c) => c.id !== chain.id);

  return (
    <main className="main-container">
      <Head>
        <title>TrustBlock Bridge</title>
      </Head>

      {/* Navbar */}
      <nav className="nav">
        <span className="title">
          <div className="dot" />
          Ponti
        </span>

        <ConnectButton />
      </nav>

      {/* Main body */}
      <body className="body">
        <span className="title">Crosschain Bridge</span>

        <BridgeInput label="From" chain={chain} />
        <BridgeInput label="To" chain={remainingChains[0]} />
      </body>
    </main>
  );
};

export default MainView;
