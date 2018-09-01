'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const rv = app.middlewares.routerView;
  const { router, controller } = app;
  console.log('app:', app);
  router.get('/', controller.home.index);
  router.get('/test', rv('index'), controller.home.test);
  router.get('/serve', controller.home.serveTest);
  router.get('/demo', controller.home.demo);
  router.get('/a', rv('index'));
};
