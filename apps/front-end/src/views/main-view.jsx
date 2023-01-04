// React import
import { useState, useEffect, useRef } from "react";

// NextJs import
import Head from "next/head";

// Dependencies import
import {
  ConnectButton,
  useConnectModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import { useNetwork, useAccount, useBalance, useContractRead } from "wagmi";
import { If, Then } from "react-if";
import { useAtom } from "jotai";

// Components import
import BridgeInput from "../components/bridge-input";
import TokenModal from "../components/token-modal";
import ChainModal from "../components/chain-modal";
import BridgeModal from "../components/transaction-modal";

// Assets import
import { AiOutlineArrowDown } from "react-icons/ai";

// Utils import
import { BridgeABI, chainInfo } from "../utils/chain-info";
import { getAllERC20Tokens } from "../utils/ERC20-fetcher";
import {
  selectedTokenState,
  amountState,
  bridgeMethodState,
  targetChainState,
} from "../utils/global-state";
import { ethers } from "ethers";

const MainView = () => {
  // Wagmi hooks
  const { chain, chains } = useNetwork();
  // Filtering out the current chain from the list of chains
  const remainingChains = chains.filter((c) => c?.id !== chain?.id);

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
      name: chainInfo[chain?.id ? chain?.id : 5]?.token,
      symbol: chainInfo[chain?.id ? chain?.id : 5]?.token,
      decimals: 18,
      logo: chainInfo[chain?.id ? chain?.id : 5]?.tokenIcon,
      balance: nativeBalance?.formatted,
      address: "0x0000000000000000000000000000000000000001",
    },
  ]);
  const [selectedToken, setSelectedToken] = useState(tokenList[0]);
  const [tokenAmount, setTokenAmount] = useState("0.0");
  const [toChain, setToChain] = useState(
    chain?.id ? remainingChains[0] : { id: 5 }
  );

  // Checking if the selected has been bridged before
  const { data: nativeTokenAddress, isSuccess: gotNativeToken } =
    useContractRead({
      address: chainInfo[chain?.id]?.contract,
      abi: BridgeABI,
      functionName: "wrappedToNative",
      args: [selectedToken.address],
      watch: true,
    });

  // Global state
  const [_globalSelectedToken, setGlobalSelectedToken] =
    useAtom(selectedTokenState);
  const [_targetChain, setTargetChain] = useAtom(targetChainState);
  const [_amount, setAmount] = useAtom(amountState);
  const [_bridgeMethod, setBridgeMethod] = useAtom(bridgeMethodState);

  // Rainbowkit hooks
  /// responsible for opening the connect to wallet modal
  const { openConnectModal } = useConnectModal();
  /// responsible for opening the modal for selecting the chain
  const { openChainModal } = useChainModal();

  // useEffect
  useEffect(() => {
    // Responsible for fetching all ERC20 tokens in user's wallet for current chain
    if (!isConnected) return;
    (async () => {
      const tokens = await getAllERC20Tokens(walletAddress, chain.id);
      setTokenList([
        {
          name: chainInfo[chain?.id ? chain?.id : 5]?.token,
          symbol: chainInfo[chain?.id ? chain?.id : 5]?.token,
          decimals: 18,
          logo: chainInfo[chain?.id ? chain?.id : 5]?.tokenIcon,
          balance: nativeBalance?.formatted,
          address: "0x0000000000000000000000000000000000000001",
        },
        ...tokens,
      ]);
    })();
  }, [chain?.id]);

  useEffect(() => {
    // Responsibe for updating the native list when user changes the chain
    if (!isConnected) return;
    const nativeToken = {
      name: chainInfo[chain?.id ? chain?.id : 5]?.token,
      symbol: chainInfo[chain?.id ? chain?.id : 5]?.token,
      decimals: 18,
      logo: chainInfo[chain?.id ? chain?.id : 5]?.tokenIcon,
      balance: nativeBalance?.formatted,
      address: "0x0000000000000000000000000000000000000001",
    };

    // Replacing old tokens list with native token
    setTokenList([nativeToken]);

    // Setting the selected token to native token
    setSelectedToken(nativeToken);

    setToChain(chain?.id ? remainingChains[0] : { id: 5 });
  }, [chain?.id]);

  useEffect(() => {
    // get element with class "bridge-input" and set focus on it

    document.getElementsByClassName("bridge-input")[0].value = "";

    setTokenAmount("0.0");
  }, [selectedToken]);

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
      <div className="body">
        <span className="title">Crosschain Bridge</span>

        {/* From input */}
        <BridgeInput
          className="bridge-input"
          label="From"
          chain={chain ? chain : { id: 5 }}
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

        {/* To input */}
        <BridgeInput
          label="To"
          chain={toChain}
          token={selectedToken}
          isReadOnly={true}
          value={tokenAmount}
          chainOnClick={() => {
            if (!isConnected) return openConnectModal();
            setOpenModal("chain");
          }}
        />

        <div className="button-container">
          <button
            onClick={() => {
              if (!isConnected) return openConnectModal();
              setOpenModal("bridging");
              // Setting global state
              setGlobalSelectedToken(selectedToken);
              setTargetChain(toChain);
              setAmount(ethers.utils.parseEther(tokenAmount));
              setBridgeMethod("bridge");
            }}
            className="button"
          >
            {isConnected ? "Bridge" : "Connect your wallet"}
          </button>
          {gotNativeToken &&
            nativeTokenAddress?.tokenAddress !== ethers.constants.AddressZero &&
            parseInt(nativeTokenAddress.chainId.toString()) === toChain?.id && (
              <button
                onClick={() => {
                  if (!isConnected) return openConnectModal();
                  setOpenModal("bridging");
                  // Setting global state
                  setGlobalSelectedToken(selectedToken);
                  setTargetChain(toChain);
                  setAmount(ethers.utils.parseEther(tokenAmount));
                  setBridgeMethod("burn");
                }}
                className="button"
              >
                Unwrap
              </button>
            )}
        </div>
      </div>

      <If condition={openModal === "token"}>
        <Then>
          <TokenModal
            setIsOpen={setOpenModal}
            tokens={tokenList}
            setSelectedToken={setSelectedToken}
          />
        </Then>
      </If>

      <If condition={openModal === "chain"}>
        <Then>
          <ChainModal
            setIsOpen={setOpenModal}
            chains={remainingChains}
            setSelectedChain={setToChain}
          />
        </Then>
      </If>

      <If condition={openModal === "bridging"}>
        <Then>
          <BridgeModal setIsOpen={setOpenModal} />
        </Then>
      </If>
    </main>
  );
};

export default MainView;
