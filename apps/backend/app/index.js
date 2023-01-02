import Queue from "bull";
import { ethers } from "ethers";
import { abi } from "./contract/contract-constants.js";
import { chainInfo } from "./contract/chain-info.js";

const eventQueue = new Queue("events", {
  redis: {
    port: parseInt(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
  },
});

function main() {

  const mumbaiProvider = new ethers.providers.JsonRpcProvider(
    process.env.MUMBAI_RPC_URL
  );

  /// Connect to contract using the provider and the contract ABI (MUMBAI)
  const mumbaiContract = new ethers.Contract(
    "0xA35Fff838182f6E47F6121Dfb236Ee3D90144ae8",
    abi,
    mumbaiProvider
  );

  // Listen for InitiateTransfer event on Mumbai
  mumbaiContract.on(
    "TransferInitiated",
    (
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
        sourceChainId: sourceChainId.toString(),
        targetChainId: targetChainId.toString(),
        amount: amount.toString(),
        timestamp: timestamp.toString(),
      };

      console.table(data);
    }
  );
}

main();

/// Queue responsible for processing events
eventQueue.process(function (job, done) {
  console.log(job.data);

  // Process the job here

  job.progress(42);

  done();

  throw new Error("some unexpected error");
});
