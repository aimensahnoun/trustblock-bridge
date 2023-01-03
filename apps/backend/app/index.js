// Dependencies import
import Queue from "bull";
import { ethers } from "ethers";
import dotenv from "dotenv";

// Constants import
import { BridgeABI } from "./contract/contract-constants.js";

// Methods imports
import { handleBurn, handleMinting } from "./contract/event-methods.js";
import { chainInfo } from "./contract/chain-info.js";

dotenv.config();

// Queue to handle the events in case of failure
const eventQueue = new Queue("events", {
  redis: {
    port: parseInt(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
  },
});

function main() {
  // Handling mumbai events
  const mumbaiProvider = new ethers.providers.JsonRpcProvider(
    process.env.MUMBAI_RPC_URL
  );

  /// Connect to contract using the provider and the contract ABI (MUMBAI)
  const mumbaiContract = new ethers.Contract(
    chainInfo[80001].contract,
    BridgeABI,
    mumbaiProvider
  );

  // Listen for InitiateTransfer event on Mumbai
  mumbaiContract.on(
    "TransferInitiated",
    async (
      from,
      tokenAddress,
      sourceChainId,
      targetChainId,
      amount,
      timestamp,
      event
    ) => {
      const data = {
        from,
        tokenAddress,
        sourceChainId,
        targetChainId,
        amount,
        timestamp,
      };

      try {
        await handleMinting(data);
        console.log("Event processed successfully | MUMBAI\n");
      } catch (e) {
        console.log(
          `Something went wrong while minting ${tokenAddress} for ${from} on ${targetChainId} : ${e}`
        );
        // Add the event to the queue to be reprocessed
        await eventQueue.add("mint", data);
      }
    }
  );

  // Listen for BurnedToken event on Goerli
  mumbaiContract.on(
    "BurnedToken",
    async (
      userInfo,
      tokenAddress,
      amount,
      sourceChainId,
      targetChainId,
      timestamp,
      event
    ) => {
      const data = {
        userInfo,
        tokenAddress,
        amount,
        sourceChainId,
        targetChainId,
        timestamp,
      };

      try {
        await handleBurn(data);
        console.log("Event processed successfully | MUMBAI\n");
      } catch (e) {
        console.log(
          `Something went wrong while burning ${tokenAddress} for ${userInfo} on ${sourceChainId} : ${e}`
        );
        // Add the event to the queue to be reprocessed
        await eventQueue.add("burn", data);
      }
    }
  );

  // ================================================
  // Handling goerli events
  const goerliProvider = new ethers.providers.JsonRpcProvider(
    process.env.GOERLI_RPC_URL
  );

  /// Connect to contract using the provider and the contract ABI (GOERLI)
  const goerliContract = new ethers.Contract(
    chainInfo[5].contract,
    BridgeABI,
    goerliProvider
  );

  // Listen for InitiateTransfer event on Goerli
  goerliContract.on(
    "TransferInitiated",
    async (
      from,
      tokenAddress,
      sourceChainId,
      targetChainId,
      amount,
      timestamp,
      event
    ) => {
      const data = {
        from,
        tokenAddress,
        sourceChainId,
        targetChainId,
        amount,
        timestamp,
      };

      try {
        await handleMinting(data);
        console.log("Event processed successfully | GOERLI\n");
      } catch (e) {
        console.log(
          `Something went wrong while minting ${tokenAddress} for ${from} on ${targetChainId} : ${e}`
        );
        // Add the event to the queue to be reprocessed
        await eventQueue.add("mint", data);
      }
    }
  );

  // Listen for BurnedToken event on Goerli
  goerliContract.on(
    "BurnedToken",
    async (
      userInfo,
      tokenAddress,
      amount,
      sourceChainId,
      targetChainId,
      timestamp,
      event
    ) => {
      const data = {
        userInfo,
        tokenAddress,
        amount,
        sourceChainId,
        targetChainId,
        timestamp,
      };

      try {
        await handleBurn(data);
        console.log("Event processed successfully | GOERLI\n");
      } catch (e) {
        console.log(
          `Something went wrong while burning ${tokenAddress} for ${userInfo} on ${sourceChainId} : ${e}`
        );
        // Add the event to the queue to be reprocessed
        await eventQueue.add("burn", data);
      }
    }
  );

   // ================================================
  // Handling BSC Testnet events
  const BSCProvider = new ethers.providers.JsonRpcProvider(
    chainInfo[97].rpcUrl
  );

  /// Connect to contract using the provider and the contract ABI (GOERLI)
  const BSCContract = new ethers.Contract(
    chainInfo[97].contract,
    BridgeABI,
    BSCProvider
  );

  // Listen for InitiateTransfer event on Goerli
  BSCContract.on(
    "TransferInitiated",
    async (
      from,
      tokenAddress,
      sourceChainId,
      targetChainId,
      amount,
      timestamp,
      event
    ) => {
      const data = {
        from,
        tokenAddress,
        sourceChainId,
        targetChainId,
        amount,
        timestamp,
      };

      try {
        await handleMinting(data);
        console.log("Event processed successfully | BSC Testnet\n");
      } catch (e) {
        console.log(
          `Something went wrong while minting ${tokenAddress} for ${from} on ${targetChainId} : ${e}`
        );
        // Add the event to the queue to be reprocessed
        await eventQueue.add("mint", data);
      }
    }
  );

  // Listen for BurnedToken event on Goerli
  BSCContract.on(
    "BurnedToken",
    async (
      userInfo,
      tokenAddress,
      amount,
      sourceChainId,
      targetChainId,
      timestamp,
      event
    ) => {
      const data = {
        userInfo,
        tokenAddress,
        amount,
        sourceChainId,
        targetChainId,
        timestamp,
      };

      try {
        await handleBurn(data);
        console.log("Event processed successfully | BSC Testnet\n");
      } catch (e) {
        console.log(
          `Something went wrong while burning ${tokenAddress} for ${userInfo} on ${sourceChainId} : ${e}`
        );
        // Add the event to the queue to be reprocessed
        await eventQueue.add("burn", data);
      }
    }
  );
}

main();

// Queue responsible for reproceeding the events in case of failure (mint)
eventQueue.process("mint", async function (job, done) {
  try {
    await handleMinting(job.data);
    console.log("Event reprocessed successfully");
    done();
  } catch (e) {
    console.log(e);
    throw new Error("some unexpected error");
  }
});

// Queue responsible for reproceeding the events in case of failure (burn)
eventQueue.process("burn", async function (job, done) {
  try {
    await handleBurn(job.data);
    console.log("Event reprocessed successfully");
    done();
  } catch (e) {
    console.log(e);
    throw new Error("some unexpected error");
  }
});
