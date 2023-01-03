// Dependencies import
import Queue from "bull";
import { ethers } from "ethers";
import dotenv from "dotenv";

// Constants import
import { BridgeABI } from "./contract/contract-constants.js";

// Methods imports
import { handleMinting } from "./contract/event-methods.js";

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
    "0xA35Fff838182f6E47F6121Dfb236Ee3D90144ae8",
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
        console.log("Event processed successfully");
      } catch (e) {
        console.log(
          `Something went wrong while minting ${tokenAddress} for ${from} on ${targetChainId} : ${e}`
        );
        // Add the event to the queue to be reprocessed
        await eventQueue.add("mint", data);
      }
    }
  );
}

main();

// Queue responsible for reproceeding the events in case of failure
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
