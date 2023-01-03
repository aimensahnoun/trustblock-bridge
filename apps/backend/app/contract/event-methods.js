// Dependencies import
import dotenv from "dotenv";
import { ethers } from "ethers";

// Constants import
import { chainInfo } from "./chain-info.js";
import { ERC20Abi, BridgeABI } from "./contract-constants.js";

dotenv.config();

export const handleMinting = async (data) => {
  const { from, tokenAddress, targetChainId, amount } = data;

  let ERC20Name = "ETH";
  let ERC20Symbol = "ETH";

  //  If the token is not ETH, then fetch the name and symbol of the token
  if (tokenAddress !== "0x0000000000000000000000000000000000000001") {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20Abi, provider);

    ERC20Name = await tokenContract.name();
    ERC20Symbol = await tokenContract.symbol();
  }

  // Target chain provider
  const targetProvider = new ethers.providers.JsonRpcProvider(
    chainInfo[targetChainId].rpcUrl
  );

  // Relayer wallet
  const relayerWallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    targetProvider
  );

  // Target chain contract
  const targetContract = new ethers.Contract(
    chainInfo[targetChainId].contract,
    BridgeABI,
    relayerWallet
  );

  // Minting token on target chain
  const tx = await targetContract.mintToken(
    ERC20Symbol,
    ERC20Name,
    from,
    tokenAddress,
    amount
  );

  const receipt = await tx.wait();

  console.log(
    `Minting ${ERC20Symbol} on ${targetChainId} for user ${from} completed : ${receipt.transactionHash}`
  );
};
