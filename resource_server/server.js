const logger = require('koa-logger')
const Koa = require("koa");

const { resourcesRouter } = require("./routers");
const { validateHeaders } = require("./middleware");

const createServer = () => {
  const app = new Koa();

  app.use(logger());
  app.use(validateHeaders);
  app.use(resourcesRouter.routes());
  app.use(resourcesRouter.allowedMethods());

  return app;
};

module.exports = {
  createServer,
};
