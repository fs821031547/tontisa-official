'use strict';
const lessMiddleware = require('less-middleware');
const path = require('path');
module.exports = options => {
  return async function(ctx, next) {
    // options = {
    //   src: '../view/less',
    //   dest: '../../public',
    //   prefix: '/public',
    //   force: true,
    // };
    const baseDir = ctx.app.baseDir;
    console.log('baseDir:', baseDir);
    options = {
      // src: path.join(baseDir, 'app/public/css'),
      dest: path.join(baseDir, 'app/public/css'),
      prefix: path.join(baseDir, 'app/public/css'),
      force: true,
      debug: true,
    };
    console.log('========options:', options);
    lessMiddleware(path.join(baseDir, 'app/view/css'), options);
    await next();
  };
  // return lessMiddleware(options.dest);
};
