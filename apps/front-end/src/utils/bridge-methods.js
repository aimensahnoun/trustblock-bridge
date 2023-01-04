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

  const tokenAddress = selectedToken.address;

  if (tokenAddress !== "0x0000000000000000000000000000000000000001") {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, signer);

    const approvalTransaction = await tokenContract?.approve(
      bridgeContractAddress,
      amount
    );

    const receipt = await approvalTransaction.wait();

    console.log(receipt.transactionHash);
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

  const receipt = await bridgeTransaction.wait();
  return receipt.transactionHash;
};

export const burnToken = async ({
  selectedToken,
  amount,
  targetNetwork,
  sourceNetwork,
  user,
  signer,
}) => {
  if (!signer) throw new Error("Signer not found");

  if (!selectedToken || !amount || !targetNetwork || !user)
    throw new Error("Invalid parameters");

  const tokenSymbol = selectedToken.symbol;
  const tokenAddress = selectedToken.address;

  // Connect to token contract
  const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, signer);

  // Connect to bridge contract
  const bridgeContract = new ethers.Contract(
    chainInfo[sourceNetwork.id].contract,
    BridgeABI,
    signer
  );




  const tokenFactory = await bridgeContract?.tokenFactory();

  console.log("Token Factory: ", tokenFactory)



  // Approve token transfer
  const approvalTransaction = await tokenContract?.approve(
    tokenFactory,
    amount
  );

  const receipt1 = await approvalTransaction.wait();

  console.log(receipt1.transactionHash);

  // Burn token
  const burnTransaction = await bridgeContract?.burnWrappedToken(
    tokenSymbol,
    amount,
    targetNetwork.id,
    user
  );

  const receipt2 = await burnTransaction.wait();

  return receipt2.transactionHash;
};
