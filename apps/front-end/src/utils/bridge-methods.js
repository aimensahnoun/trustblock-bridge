// Dependencies import
import { ethers } from "ethers";

// Utils import
import { BridgeABI, chainInfo, ERC20ABI } from "./chain-info";

export const bridgeToken = async ({
  sourceNetwork,
  targetNetwork,
  selectedToken,
  amount,
  signer,
}) => {
  if (!signer) throw new Error("Signer not found");

  if (!selectedToken || !amount || !sourceNetwork || !targetNetwork)
    throw new Error("Invalid parameters");

  const bridgeContractAddress = chainInfo[sourceNetwork.id].contract;


  const bridgeContract = new ethers.Contract(
    bridgeContractAddress,
    BridgeABI,
    signer
  );

  const tokenFactory = await bridgeContract?.tokenFactory();


  const tokenAddress = selectedToken.address;

  if (tokenAddress !== "0x0000000000000000000000000000000000000001") {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, signer);

    const approvalTransaction = await tokenContract?.approve(
      bridgeContractAddress,
      amount
    );

    const receipt = await approvalTransaction.wait();

    return receipt.transactionHash;
  }



  const bridgeTransaction = await bridgeContract?.initiateTransfer(
    tokenAddress,
    parseInt(targetNetwork.id),
    amount,
    {
      value:
        tokenAddress === "0x0000000000000000000000000000000000000001"
          ? amount
          : 0,
    }
  );

  await bridgeTransaction.wait();
};
