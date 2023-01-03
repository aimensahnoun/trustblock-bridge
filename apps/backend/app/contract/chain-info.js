import dotenv from "dotenv";

dotenv.config();

export const chainInfo = {
  5: {
    name: "Goerli",
    chainId: 5,
    contract: "0x2C91A013EFf03BC134d891888977365cBCA07285",
    rpcUrl: process.env.GOERLI_RPC_URL,
  },
  80001: {
    name: "Mumbai",
    chainId: 80001,
    contract: "0xA35Fff838182f6E47F6121Dfb236Ee3D90144ae8",
    rpcUrl: process.env.MUMBAI_RPC_URL,
  },
};
