const { createServer } = require("./server");

const runPort = process.env.PORT || 4000;
createServer().listen(runPort, () => {
  console.log(
    `Started AuthService :: Date: ${new Date().toUTCString()}, Port: ${runPort}.`
  );
});
