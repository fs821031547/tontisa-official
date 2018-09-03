'use strict';
// const API_SERVICE = Symbol('Application#ApiService');
module.exports = app => {
  // const less = app.middleware.less;
  // less(app.config.less);
  app.beforeStart(async (ctx, next) => {
    // 应用会等待这个函数执行完成才启动
    const less = app.middlewares.less(app.config.less);
    less(app);
    // console.log('less:', less);
    // console.log('lessapp1:', app.config);
    // await next();
    // await less(app.config.less);
    // 也可以通过以下方式来调用 Service
    // const ctx = app.createAnonymousContext();
    // app.cities = await ctx.service.cities.load();
  });
};
