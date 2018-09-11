'use strict';

// const Controller = require('egg').Controller;
module.exports = app => {
  class HomeController extends app.ApiController {
    navInfo() {
      const arrNav = this.ctx.app.headerInfo;
      console.log('===========');
      console.log('arrNav:', arrNav);
      console.log('===========');
      return arrNav;
    }
    async index() {
      // this.ctx.body = 'hi, egg';
      await this.ctx.render('index');
    }

    async default() {
      // this.ctx.body = 'hi, egg';
      await this.ctx.render('default');
    }

    async websiteContent() {
      const { query } = this.ctx;
      const params = {
        pageNum: 1,
        pageSize: 10,
        navId: query.navId,
        tags: query.tags,
      };
      const res = await this.apiPost('/websiteContent/list', params);
      this.ctx.body = res.data;
    }
    // case-list
    async caseList() {
      const { query } = this.ctx;
      const params = {
        pageNum: query.page || 1,
        pageSize: 12,
        navId: 18,
        tags: query.tags || null,
      };
      const bannerParams = {
        pageNum: '1',
        pageSize: '10',
        navId: 17,
      };
      const tagParams = {
        pageNum: '1',
        pageSize: '10',
      };
      const res = await this.apiPost('/websiteContent/list', params);
      const bannerRes = await this.apiPost('/websiteContent/list', bannerParams);
      const tagRes = await this.apiPost('/websiteTag/list', tagParams);
      const websiteTag = {
        type: [],
        size: [],
        feature: [],
        target: [],
      };
      tagRes.data.data.list.forEach(item => {
        switch (item.type) {
          case 1:
            websiteTag.type.push(item);
            break;
          case 2:
            websiteTag.size.push(item);
            break;
          case 3:
            websiteTag.feature.push(item);
            break;
          default:
            websiteTag.target.push(item);
            break;
        }
      });
      res.data.data.list.forEach(item => {
        if (typeof item.content === 'string') {
          item.content = JSON.parse(item.content);
        }
      });
      bannerRes.data.data.list.forEach(item => {
        if (typeof item.content === 'string') {
          item.content = JSON.parse(item.content);
        }
      });
      console.log('\n bannerRes: \n', bannerRes.data.data.pages);
      const resData = {
        list: res.data.data.list,
        tagList: websiteTag,
        bannerList: bannerRes.data.data.list,
        page: res.data.data,
      };
      await this.ctx.render('case_list', resData);
    }

    // case-detail
    async caseDetail() {
      const parms = {
        pageNum: 1,
        pageSize: 10,
        navId: 17,
      };
      const res = await this.apiPost('/websiteContent/list', parms);
      res.data.data.list.forEach(item => {
        if (typeof item.content === 'string') {
          item.content = JSON.parse(item.content);
        }
      });
      await this.ctx.render('case_detail', res.data.data);
    }

    // recent-list
    async recentList() {
      await this.ctx.render('recent_list');
    }

    //cpy-news
    async cpyNews() {
      await this.ctx.render('cpy_news');
    }

    //product-news
    async productNews() {
      await this.ctx.render('product_news');
    }

    //erp-school
    async erpSchool() {
      await this.ctx.render('erp_school');
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
