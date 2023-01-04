import hre, { ethers } from "hardhat";

import bridgeLibrary from "../artifacts/contracts/Bridge.sol/Bridge.json";
// Remove ts check
// @ts-ignore
import progressBar from "progress-bar-cli";

const amount = ethers.utils.parseEther("25");

let name: string;
let symbol: string;

const targetAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

async function main() {
  const providerMumbai = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545"
  );

  const walletMumbai = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    providerMumbai
  );

  const MumbaiBalance = await walletMumbai.getBalance();

  console.log("Mumbai Balance: ", ethers.utils.formatEther(MumbaiBalance));

  //   Get contract from address
  const mumbaiBridgeAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const bridgeMumbai = new ethers.Contract(
    mumbaiBridgeAddress,
    bridgeLibrary.abi,
    walletMumbai
  );

  const RELAYER = await bridgeMumbai.RELAYER();

  console.log("RELAYER: ", RELAYER);

  const tx = await bridgeMumbai.grantRole(
    RELAYER,
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  );

  await tx.wait();

  // Initiate transaction in m\umbai
  // const initiateTx = await bridgeMumbai.initiateTransfer(
  //   "0x0000000000000000000000000000000000000001",
  //   5,
  //   5,
  //   {
  //     value: 5,
  //   }
  // );

  // await initiateTx.wait();

  // const mumbaiTxHash = initiateTx.hash;

  // console.log("Mumbai Tx Hash: ", mumbaiTxHash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
