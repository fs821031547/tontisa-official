'use strict';
// const lessMiddlerWare = require('less-middleware');
// const path = require('path');

module.exports = view => {
  return async function routerView(ctx, next) {
    const {
      locals,
      logger,
    } = ctx;
    locals.view = view;
    // const baseDir = ctx.app.baseDir;
    // console.log('ctx:', path.join(baseDir, 'public/css'));
    logger.debug('routerView');
    // await lessMiddlerWare({
    //   dest: path.join(baseDir, 'app/public/css'),
    //   src: path.join(baseDir, ' app/public/css'),
    //   prefix: 'app/public/css'
    // });
    await next();
  };
};
