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
  const [selectedToken, setSelectedToken] = useState(tokenList[0]);
  const [tokenAmount, setTokenAmount] = useState("0.0");

  // Rainbowkit hooks
  /// responsible for opening the connect to wallet modal
  const { openConnectModal } = useConnectModal();
  /// responsible for opening the modal for selecting the chain
  const { openChainModal } = useChainModal();

  const remainingChains = chains.filter((c) => c?.id !== chain?.id);

  // useEffect
  useEffect(() => {
    // Responsible for fetching all ERC20 tokens in user's wallet for current chain
    if (!isConnected) return;
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

  useEffect(() => {
    // Responsibe for updating the native list when user changes the chain
    if (!isConnected) return;
    const nativeToken = {
      name: chainInfo[chain.id]?.token,
      symbol: chainInfo[chain.id]?.token,
      decimals: 18,
      logo: chainInfo[chain.id]?.tokenIcon,
      balance: nativeBalance.formatted,
      address: "0x0000000000000000000000000000000000000001",
    };

    // Replacing old tokens list with native token
    setTokenList([nativeToken]);

    // Setting the selected token to native token
    setSelectedToken(nativeToken);
  }, [chain.id]);

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
          token={selectedToken}
          tokenOnClick={() => {
            if (!isConnected) return openConnectModal();
            setOpenModal("token");
          }}
          chainOnClick={() => {
            if (!isConnected) return openConnectModal();
            openChainModal();
          }}
          onChange={(e) => {
            if (parseFloat(e.target.value) < 0)
              e.target.value = Math.abs(parseFloat(e.target.value)).toString();
            if (parseFloat(e.target.value) > parseFloat(selectedToken.balance))
              e.target.value = selectedToken.balance;

            setTokenAmount(e.target.value);
          }}
          isReadOnly={false}
        />
        <AiOutlineArrowDown className="arrow" />
        <BridgeInput
          label="To"
          chain={remainingChains[0]}
          token={selectedToken}
          isReadOnly={true}
          value={tokenAmount}
        />
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
          <TokenModal
            setIsOpen={setOpenModal}
            tokens={tokenList}
            setSelectedToken={setSelectedToken}
          />
        </Then>
      </If>
    </main>
  );
};

export default MainView;
