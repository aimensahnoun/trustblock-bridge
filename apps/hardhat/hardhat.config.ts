import * as dotenv from "dotenv";

import { HardhatUserConfig, subtask, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";

dotenv.config();

const config: HardhatUserConfig = {
  networks: {
    localhost: {
      allowUnlimitedContractSize: true,
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY as string],
      allowUnlimitedContractSize: true,
    },
    goerli: {
      url: process.env.ALCHEMY_GOERELI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY as string],
      allowUnlimitedContractSize: true,
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [process.env.PRIVATE_KEY as string],
      allowUnlimitedContractSize: true,
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYSCAN || "",
      goerli: process.env.ETHERSCAN || "",
      bscTestnet: process.env.BSCSCAN || "",
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 500,

        details: {
          yul: true,
        },
      },
    },
  },
};

export default config;
