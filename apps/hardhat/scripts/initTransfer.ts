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
  let loop_len = 500;
  let startTime = new Date();

  for (let i = 0; i < loop_len; i++) {
    progressBar.progressBar(i, loop_len, startTime);

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
    const mumbaiBridgeAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const bridgeMumbai = new ethers.Contract(
      mumbaiBridgeAddress,
      bridgeLibrary.abi,
      walletMumbai
    );

    // Initiate transaction in m\umbai
    const initiateTx = await bridgeMumbai.initiateTransfer(
      "0x0000000000000000000000000000000000000001",
      5,
      5,
      {
        value: 5,
      }
    );

    await initiateTx.wait();

    const mumbaiTxHash = initiateTx.hash;

    console.log("Mumbai Tx Hash: ", mumbaiTxHash);

    // Timeout to prevent nonce error
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
