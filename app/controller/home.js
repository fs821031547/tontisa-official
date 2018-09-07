'use strict';

// const Controller = require('egg').Controller;
module.exports = app => {
  class HomeController extends app.ApiController {
    async index() {
      // this.ctx.body = 'hi, egg';
      await this.ctx.render('index');
    }

    async default() {
      // this.ctx.body = 'hi, egg';
      await this.ctx.render('default');
    }

    //case-list
    async caseList() {

      let parms = {
        pageNum: 1,
        pageSize: 10,
        navId: 18
      }
      let res = await this.apiPost('/websiteContent/list', parms);
      res.data.data.list.forEach(item => {
        if(typeof item.content == 'string') {
          item.content = JSON.parse(item.content)
        }
      })
      await this.ctx.render('case_list', res.data.data);
    }

    //case-detail
    async caseDetail() {
      let parms = {
        pageNum: 1,
        pageSize: 10,
        navId: 17
      }
      let res = await this.apiPost('/websiteContent/list', parms);
      res.data.data.list.forEach(item => {
        if(typeof item.content == 'string') {
          item.content = JSON.parse(item.content)
        }
      })
      await this.ctx.render('case_detail', res.data.data);
    }

    //recent-list
    async recentList() {
      await this.ctx.render('recent_list');
    }

    async errPage() {
      await this.ctx.render('404');
    }


    async test() {
      // this.ctx.body = { a: 1 };
      const data = {
        username: '17603070560',
        appId: '50001',
        sign: '88888888',
        timestamp: '2018-05-07 15:04:12',
      };
      const user = await this.apiPost('vutest.op110.com.cn/usercenter-service/user/info', data);
      console.log('user=========:', user);
      if (typeof user.data === 'string') {
        user.data = JSON.parse(user.data);
      }
      await this.ctx.render(user.data);
    }

    async demo() {
      // this.ctx.body = { a: 1 };
      const data = {
        username: '17603070560',
        appId: '50001',
        sign: '88888888',
        timestamp: '2018-05-07 15:04:12',
      };
      const user = await this.apiPost('vutest.op110.com.cn/usercenter-service/user/info', data);
      if (typeof user.data === 'string') {
        user.data = JSON.parse(user.data);
      }
      await this.ctx.render('index', user.data);
    }

    async serveTest() {
      // this.ctx.body = { a: 1 };
      console.log('====service');
      const data = await this.ctx.service.home.demo();
      await this.ctx.render('index', data);
    }
  }
  return HomeController;
};
// module.exports = HomeController;
