const Router = require('@koa/router');

const router = new Router({ prefix: "/resources" });
router.all('/', (ctx, ) => {
  ctx.status = 200;
  ctx.body = {
    application: "ResourceServer v 1.0"
  };
});

module.exports = {
  resourcesRouter: router
}