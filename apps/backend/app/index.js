const Queue = require("bull");

const eventQueue = new Queue("events", {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
});

eventQueue.add({ name: "Aimen", age: 23 });

eventQueue.process(function (job, done) {
  job.progress(42);

  done();

  done(new Error("error transcoding"));

  done(null, { samplerate: 48000 /* etc... */ });

  throw new Error("some unexpected error");
});
