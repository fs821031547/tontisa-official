'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1535519227477_8304';

  // add your config here
  config.middleware = [];

  config.view = {
    mapping: {
      '.html': 'nunjucks',
    },
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.html',
  };
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

  return config;
};
