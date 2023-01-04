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
      "https://eth-goerli.g.alchemy.com/v2/GmWT_7wLfGPFJvd43PSmwcrr3JlGCLYY"
    );

    //  const providerMumbai = new ethers.providers.JsonRpcProvider(
    //   process.env.MUMBAI_RPC_URL as string
    // );

    const walletMumbai = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      providerMumbai
    );

    const MumbaiBalance = await walletMumbai.getBalance();

    console.log("Mumbai Balance: ", ethers.utils.formatEther(MumbaiBalance));

    //   Get contract from address
    const mumbaiBridgeAddress = "0xa9C1b7d568473DD8593048Ae116291BBACb146da";
    // const mumbaiBridgeAddress = "0x8c3489A994a9786767f227dD5b36129FdC1F809c";

    const bridgeMumbai = new ethers.Contract(
      mumbaiBridgeAddress,
      bridgeLibrary.abi,
      walletMumbai
    );

    //  get token factory address
    const tokenFactoryAddress = await bridgeMumbai.tokenFactory();

    console.log("Token Factory Address: ", tokenFactoryAddress);

    // Approve token factory to spend tokens
    const token = await ethers.getContractAt(
      "WrapperToken",
      "0x19636d85D0305096543F803De0A2770a57428532"
    );

    const approveTx = await token.approve(tokenFactoryAddress, 5);

    await approveTx.wait();

    console.log("Approve Tx Hash: ", approveTx.hash);

    // Initiate transaction in m\umbai
    // Fix cannot estimate gas errror

    // const burnToken = await bridgeMumbai.burnWrappedToken(
    //   "WETH",
    //   5,
    //   80001,
    //   walletMumbai.address
    // );
    const burnToken = await bridgeMumbai.burnWrappedToken(
      "WETH",
      5,
      80001,
      walletMumbai.address
    );

    await burnToken.wait();

    const mumbaiTxHash = burnToken.hash;

    console.log("Mumbai Tx Hash: ", mumbaiTxHash);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
