import dotenv from "dotenv";

dotenv.config();

export const chainInfo = {
  5: {
    name: "Goerli",
    chainId: 5,
    contract: "0x286b955Afe104e7F6E5f91bA56D0e2b7d948De3c",
    rpcUrl: process.env.GOERLI_RPC_URL,
    nativeToken : "ETH",
  },
  80001: {
    name: "Mumbai",
    chainId: 80001,
    contract: "0x77bf328050D367ea7A87E47358308C62A3a7b98d",
    rpcUrl: process.env.MUMBAI_RPC_URL,
    nativeToken : "MATIC",
  },
  97: {
    name: "BSC Testnet",
    chainId: 97,
    contract: "0xD000970fabc7f3626E8EF397865D6efBcCbE6c4F",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    nativeToken : "tBNB",
  },
};
