const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const { authRouter } = require("./routers");

const createServer = () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan("common"));

  app.use("/auth", authRouter);

  return app;
};

module.exports = {
  createServer,
};
