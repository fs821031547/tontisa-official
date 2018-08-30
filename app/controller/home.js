'use strict';

// const Controller = require('egg').Controller;
module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      this.ctx.body = 'hi, egg';
    }
    async test() {
      // this.ctx.body = { a: 1 };
      const data = {
        username: '17603070560',
        appId: '50001',
        sign: '88888888',
        timestamp: '2018-05-07 15:04:12',
      };
      const user = await this.apiGet('http://vutest.op110.com.cn/usercenter-service/user/info', data);
      console.log('user=========:', user);
      await this.ctx.render({ a: 'pm 10点半' });
    }
  }
  return HomeController;
};
// module.exports = HomeController;
