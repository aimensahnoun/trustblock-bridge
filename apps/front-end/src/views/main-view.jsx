// React import
import { useState, useEffect } from "react";

// NextJs import
import Head from "next/head";

// Dependencies import
import {
  ConnectButton,
  useConnectModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useNetwork, useAccount, useBalance } from "wagmi";
import { If, Then, Else } from "react-if";

// Components import
import BridgeInput from "../components/bridge-input";
import TokenModal from "../components/token-modal";

// Assets import
import { AiOutlineArrowDown } from "react-icons/ai";
import { chainInfo } from "../utils/chain-info";
import { getAllERC20Tokens } from "../utils/ERC20-fetcher";

const MainView = () => {
  // Wagmi hooks
  const { chain, chains } = useNetwork();
  const { address: walletAddress, isConnected } = useAccount();
  const { data: nativeBalance } = useBalance({
    address: walletAddress,
    watch: true,
  });

  // Local State
  /// openModal can be "none", "token", "chain","bridging"
  const [openModal, setOpenModal] = useState("none");
  const [tokenList, setTokenList] = useState([
    {
      name: chainInfo[chain.id]?.token,
      symbol: chainInfo[chain.id]?.token,
      decimals: 18,
      logo: chainInfo[chain.id]?.tokenIcon,
      balance: nativeBalance.formatted,
      address: "0x0000000000000000000000000000000000000001",
    },
  ]);

  // Rainbowkit hooks
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();

  const remainingChains = chains.filter((c) => c?.id !== chain?.id);

  // useEffect
  useEffect(() => {
    if (!isConnected || chain.id === 97) return;
    (async () => {
      const tokens = await getAllERC20Tokens(walletAddress, chain.id);
      setTokenList([
        {
          name: chainInfo[chain.id]?.token,
          symbol: chainInfo[chain.id]?.token,
          decimals: 18,
          logo: chainInfo[chain.id]?.tokenIcon,
          balance: nativeBalance.formatted,
          address: "0x0000000000000000000000000000000000000001",
        },
        ...tokens,
      ]);
    })();
  }, [chain.id]);

  console.log(tokenList);

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
          chainOnClick={() => {
            if (!isConnected) return openConnectModal();
            openChainModal();
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
  );
};

export default MainView;
