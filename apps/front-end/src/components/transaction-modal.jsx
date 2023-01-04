// React import
import { useEffect, useState } from "react";

// Dependencies import
import { useAtom } from "jotai";
import {
  useAccount,
  useContract,
  useNetwork,
  useProvider,
  useSigner,
} from "wagmi";

// Custom component import
import Modal from "./modal";

// Methods import
import { bridgeToken, burnToken } from "../utils/bridge-methods";

// utils import
import {
  selectedTokenState,
  amountState,
  bridgeMethodState,
  targetChainState,
} from "../utils/global-state";
import { If, Then } from "react-if";

const BridgeModal = ({ setIsOpen }) => {
  // Local state
  // Can be "none","bridging", "unwrapping","complete","error"
  const [loadingState, setLoadingState] = useState("none");
  const [hash, setHash] = useState(null);

  // Global state
  const [selectedToken] = useAtom(selectedTokenState);
  const [amount] = useAtom(amountState);
  const [bridgeMethod] = useAtom(bridgeMethodState);
  const [targetChain] = useAtom(targetChainState);

  // wagmi hooks
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: signer, isLoading: isLoadingSigner } = useSigner();
  const { data } = useProvider({
    chainId: chain.id,
  });

  useEffect(() => {
    if (
      !signer ||
      !amount ||
      !selectedToken ||
      !bridgeMethod ||
      !chain ||
      !targetChain ||
      isLoadingSigner ||
      loadingState !== "none"
    )
      return;

    (async () => {
      if (bridgeMethod === "bridge") {
        setLoadingState("bridging");
        const txHash = await bridgeToken({
          amount,
          selectedToken,
          signer,
          sourceNetwork: chain,
          targetNetwork: targetChain,
        });
        setHash(txHash);
        setLoadingState("complete");
      } else {
        setLoadingState("unwrapping");
        const txHash = await burnToken({
          amount,
          selectedToken,
          signer,
          targetNetwork: targetChain,
          sourceNetwork: chain,

          user: address,
        });
        setHash(txHash);
        setLoadingState("complete");
      }
    })();
  }, [
    signer,
    amount,
    selectedToken,
    bridgeMethod,
    chain,
    targetChain,
    isLoadingSigner,
  ]);

  return (
    <Modal>
      <If condition={loadingState === "bridging"}>
        <Then>
          <span className="title">Bridging Token...</span>
        </Then>
      </If>
      <If condition={loadingState === "unwrapping"}>
        <Then>
          <span className="title">UnWrapping Token...</span>
        </Then>
      </If>
      <If condition={loadingState === "complete"}>
        <Then>
          <span className="title">Bridging Complete!</span>
          <span className="subtitle">
            <span>hash : {hash}</span>

            <button
              className="button"
              onClick={() => {
                setIsOpen("none");
              }}
            >
              Close
            </button>
          </span>
        </Then>
      </If>
    </Modal>
  );
};

export default BridgeModal;
