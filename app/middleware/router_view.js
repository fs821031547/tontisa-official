'use strict';
const path = require('path');
const lessMiddleware = require('less-middleware');

module.exports = view => {
  return async function routerView(ctx, next) {
    const {
      locals,
      logger,
    } = ctx;
    const baseDir = ctx.app.baseDir;
    // console.log('baseDir:', baseDir);
    const options = {
      // src: path.join(baseDir, 'app/public/css'),
      dest: path.join(baseDir, 'app/public/css/'),
      prefix: '/css',
      force: true,
      debug: true,
    };
    // console.log('========options:', options);
    lessMiddleware(path.join(baseDir, 'app/view/css/demo.less'), options);
    // const contextFile = ctx.app.extend.context;
    if (typeof view === 'string') {
      locals.view = view;
    } else {
      await ctx.render(view.view);
    }
    // const renderArgs = [];
    // renderArgs.push(locals.view);
    logger.debug('routerView');
    await next();
  };
};
