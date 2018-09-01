'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {};
  // console.log('==============path:', path.join(appInfo.baseDir, 'app/public'));
  // console.log('===========path:', appInfo.baseDir);
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1535519227477_8304';

  // add your config here
  // config.middleware = [ 'less' ];
  // config.less = {
  //   src: path.join(appInfo.baseDir, 'app/view/less'),
  //   dest: path.join(appInfo.baseDir, 'app/public/css'),
  //   prefix: '/css',
  //   force: true,
  // };
  // config.sass = {
  //   // src: path.join(appInfo.baseDir, 'app/view/css'),
  //   dest: path.join(appInfo.baseDir, '/public/'),
  //   // prefix: '/css',
  //   // force: true,
  // };
  config.static = {
    prefix: '/public',
    // dir: '/public',
    dir: path.join(appInfo.baseDir, 'app/public'),
  };

  config.view = {
    mapping: {
      '.html': 'nunjucks',
    },
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.html',
  };
  config.apiHost = '';
  // config.logger = {
  //   dir: path.join(appInfo.baseDir, 'logs', appInfo.name),
  // };
  config.nunjucks = {
    autoescape: true, // 是否自动转义，默认自动转义
    throwOnUndefined: false, // true 当输出为 null 或 undefined 会抛出异常
    trimBlocks: true, // true 自动去除 block/tag 后面的换行符
    lstripBlocks: true, // true 自动去除 block/tag 签名的空格
    cache: true,
    tags: {
      blockStart: '<%',
      blockEnd: '%>',
      variableStart: '<$',
      variableEnd: '$>',
      commentStart: '<#',
      commentEnd: '#>',
    },
  };
  config.logger = {
    dir: '/',
  };

  return config;
};
