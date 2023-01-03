// NextJs import
import Head from "next/head";

// Dependencies import
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useNetwork, useAccount } from "wagmi";

// Components import
import BridgeInput from "../pages/components/bridge-input";

// Assets import
import { AiOutlineArrowDown } from "react-icons/ai";

const MainView = () => {
  // Wagmi hooks
  const { chain, chains } = useNetwork();
  const { isConnected } = useAccount();

  // Rainbowkit hooks
  const { openConnectModal } = useConnectModal();

  const remainingChains = chains.filter((c) => c?.id !== chain?.id);

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
        <AiOutlineArrowDown className="arrow" />
        <BridgeInput label="To" chain={remainingChains[0]} />
        <button
          onClick={() => {
            if (!isConnected) return openConnectModal();
          }}
          className="button"
        >
          {isConnected ? "Bridge" : "Connect your wallet"}
        </button>
      </body>
    </main>
  );
};

export default MainView;
