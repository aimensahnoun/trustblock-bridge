import dotenv from "dotenv";

dotenv.config();

export const chainInfo = {
  5: {
    name: "Goerli",
    chainId: 5,
    contract: "0xa9C1b7d568473DD8593048Ae116291BBACb146da",
    rpcUrl: process.env.GOERLI_RPC_URL,
  },
  80001: {
    name: "Mumbai",
    chainId: 80001,
    contract: "0x8c3489A994a9786767f227dD5b36129FdC1F809c",
    rpcUrl: process.env.MUMBAI_RPC_URL,
  },
};
