const express = require("express");
const bodyParser = require("body-parser");

const { validateBody } = require("./middleware");
const { authRouter } = require("./routers");

const createServer = () => {
  const app = express()  ;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(validateBody);
  app.use("/auth", authRouter);

  return app;
};

module.exports = {
  createServer,
};
