'use strict';
const sass = require('koa-sass');
const path = require('path');
module.exports = options => {
  return async function(ctx, next) {
    // options = {
    //   src: '../view/less',
    //   dest: '../../public',
    //   prefix: '/public',
    //   force: true,
    // };
    console.log('koasass');
    const baseDir = ctx.app.baseDir;
    // console.log('baseDir:', baseDir);
    options = {
      // src: path.join(baseDir, 'app/public/css'),
      dest: path.join(baseDir, 'app/public'),
      // prefix: path.join(baseDir, 'app/public/css'),
      // force: true,
      // debug: true,
    };
    // console.log('========options:', options);
    sass(path.join(baseDir, 'app/view'), options);
    await next();
  };
  // return lessMiddleware(options.dest);
};
