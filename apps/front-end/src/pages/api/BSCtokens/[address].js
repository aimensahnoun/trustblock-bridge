import { ethers } from "ethers";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

export default async function handler(req, res) {
  const version = await Moralis.EvmApi.utils.web3ApiVersion;

  // Check if Moralis is already initialized
  if (!version) {
    await Moralis.start({
      apiKey:
        "JftI0XSGn98d8aWm8jGDueHqqSTw1A9ahuSHdJxg02tVwHHp21QrkSg3iRBmGVGg",
    });
  }

  const { address } = req.query;

  const chain = EvmChain.BSC_TESTNET;

  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });

  const tokens = response.raw.map((token) => {
    return {
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      logo: token.logo,
      balance: ethers.utils.formatEther(token.balance),
      address: token.token_address,
    };
  });

  console.log(tokens);

  res.status(200).json(tokens);
}