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
  let loop_len = 1;
  let startTime = new Date();

  for (let i = 0; i < loop_len; i++) {
    progressBar.progressBar(i, loop_len, startTime);
    const providerMumbai = new ethers.providers.JsonRpcProvider(
      process.env.MUMBAI_RPC_URL as string
    );

    // const providerMumbai = new ethers.providers.JsonRpcProvider(
    //   "https://eth-goerli.g.alchemy.com/v2/GmWT_7wLfGPFJvd43PSmwcrr3JlGCLYY"
    // );

    const walletMumbai = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      providerMumbai
    );

    const MumbaiBalance = await walletMumbai.getBalance();

    console.log("Mumbai Balance: ", ethers.utils.formatEther(MumbaiBalance));

    //   Get contract from address
    const mumbaiBridgeAddress = "0x8c3489A994a9786767f227dD5b36129FdC1F809c";
    // const mumbaiBridgeAddress = "0xa9C1b7d568473DD8593048Ae116291BBACb146da";

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
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
