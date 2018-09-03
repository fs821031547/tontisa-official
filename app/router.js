'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const rv = app.middlewares.routerView;
  // const less = app.middlewares.less;
  const { router, controller } = app;
  console.log('app:', app);
  // await less();
  router.get('/', controller.home.default);
  router.get('/test', rv('index'), controller.home.test);
  router.get('/serve', controller.home.serveTest);
  router.get('/demo', controller.home.demo);

  router.get('/index', rv('default'), controller.home.default);
};
