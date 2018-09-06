'use strict';
// const API_SERVICE = Symbol('Application#ApiService');
module.exports = app => {
  // const less = app.middleware.less;
  // less(app.config.less);
  app.beforeStart(async () => {
    // 应用会等待这个函数执行完成才启动
    const less = app.middlewares.less(app.config.less);
    less(app);
    const ctx = app.createAnonymousContext();
    // await next();
    // await less(app.config.less);
    // 也可以通过以下方式来调用 Service
    // const ctx = app.createAnonymousContext();
    app.navList = await ctx.service.home.navList();
  });
};
