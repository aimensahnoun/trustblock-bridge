// React import
import { useState } from "react";

// NextJs import
import Head from "next/head";

// Dependencies import
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useNetwork, useAccount } from "wagmi";
import { If, Then, Else } from "react-if";

// Components import
import BridgeInput from "../components/bridge-input";
import TokenModal from "../components/token-modal";

// Assets import
import { AiOutlineArrowDown } from "react-icons/ai";

const MainView = () => {
  // Local State
  /// openModal can be "none", "token", "chain","bridging"
  const [openModal, setOpenModal] = useState("none");

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

        <BridgeInput
          label="From"
          chain={chain}
          tokenOnClick={() => {
            if (!isConnected) return openConnectModal();
            setOpenModal("token");
          }}
        />
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

      <If condition={openModal === "token"}>
        <Then>
          <TokenModal setIsOpen={setOpenModal} />
        </Then>
      </If>
    </main>
  )
};

export default MainView;
