import Queue from "bull";

const eventQueue = new Queue("events", {
  redis: {
    port: parseInt(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
  },
});

function main() {
  console.log("Etherium Event Listener Started");
}

main();

eventQueue.add({ name: "Aimen", age: 23 });

eventQueue.process(function (job, done) {
  console.log(job.data);

  job.progress(42);

  done();

  throw new Error("some unexpected error");
});
