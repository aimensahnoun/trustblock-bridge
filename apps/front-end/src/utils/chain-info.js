export const chainInfo = {
  5: {
    name: "Goerli",
    chainId: 5,
    contract: "0xa9C1b7d568473DD8593048Ae116291BBACb146da",
    rpcUrl: process.env.NEXT_PUBLIC_GOERLI_RPC_URL,
    token: "ETH",
    tokenIcon:
      "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024",
  },
  80001: {
    name: "Mumbai",
    chainId: 80001,
    contract: "0x8c3489A994a9786767f227dD5b36129FdC1F809c",
    rpcUrl: process.env.NEXT_PUBLIC_MUMBAI_RPC_URL,
    token: "Matic",
    tokenIcon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  },
  97: {
    name: "BSC Testnet",
    chainId: 97,
    contract: "0xe13B6ECB11ACE3CE9Bab9c7A6B1187bFB6f70556",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    token: "TBNB",
    tokenIcon:
      "https://seeklogo.com/images/B/binance-smart-chain-bsc-logo-9C34053D61-seeklogo.com.png",
  },
};
