const { createServer } = require("./server");

const runPort = process.env.PORT || 5000;
createServer().listen(runPort, () => {
  console.log(
    `Started ResourceServer :: Date: ${new Date().toUTCString()}, Port: ${runPort}.`
  );
});
