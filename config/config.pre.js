'use strict';
module.exports = () => {
  const config = {
    security: {},
    logger: {
      consoleLevel: 'DEBUG', // 所有日志输出到控制台
      level: 'NONE', // 关闭日志输出到文件
      dir: './logs',
    },
    session: {
      key: 'EGG_SESS',
      maxAge: 24 * 3600 * 1000, // session 1 小时过期
    },
    view: {
      cache: false,
    },
    apiHost: 'http://192.168.110.156:9420',
    isEnable: 'false',
  };
  return config;
};
