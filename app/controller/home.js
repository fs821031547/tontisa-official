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
      const pageInfo = this.ctx.app.pageInfo;
      const headerInfo = this.ctx.app.headerInfo;
      const actionData = headerInfo.find(x => {
        return x.name === '客户案例';
      });
      const navIdArr = [];
      pageInfo.forEach(x => {
        if (x.parentId === actionData.id) {
          switch (x.name) {
            case '轮播':
              navIdArr[0] = x.id;
              break;
            case '列表':
              navIdArr[1] = x.id;
              break;
            default:
              break;
          }
        }
      });
      const bannerParams = {
        navId: navIdArr[0],
      };
      const params = {
        pageNum: query.page || 1,
        pageSize: 12,
        navId: navIdArr[1],
        tags: query.tags || null,
      };

      const tagParams = {

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
      const url = this.ctx.request.url;
      const id = url.split('/')[url.split('/').length - 1];
      console.log('AAAAAA=============BBBBBBBBBBB', this.ctx.request.url);
      const parms = {
        id,
      };
      const res = await this.apiPost('/websiteContent/detail', parms);
      if (typeof res.data.data.content === 'string') {
        res.data.data.content = JSON.parse(res.data.data.content);
      }
      await this.ctx.render('case_detail', res.data.data);
    }

    // recent-list
    async recentList() {
      const { query } = this.ctx;
      const pageInfo = this.ctx.app.pageInfo;
      const headerInfo = this.ctx.app.headerInfo;
      const actionData = headerInfo.find(x => {
        return x.name === '最新动态';
      });
      const navIdArr = [];
      pageInfo.forEach(x => {
        if (x.parentId === actionData.id) {
          switch (x.name) {
            case '轮播':
              navIdArr[0] = x.id;
              break;
            case '企业新闻':
              navIdArr[1] = x.id;
              break;
            case '同业专访':
              navIdArr[2] = x.id;
              break;
            case '产品资讯':
              navIdArr[3] = x.id;
              break;
            default:
              break;
          }
        }
      });
      // 轮播
      const bannerParams = {
        navId: navIdArr[0],
        pageNum: 1,
        pageSize: 8,
      };
      // 企业新闻
      const newsParams = {
        pageNum: query.page || 1,
        pageSize: 12,
        navId: navIdArr[1],
      };
      // 同业专访
      const viewParams = {
        pageNum: query.page || 1,
        pageSize: 12,
        navId: navIdArr[2],
      };
      // 产品资讯
      const productParams = {
        pageNum: query.page || 1,
        pageSize: 12,
        navId: navIdArr[3],
      };
      const newsRes = await this.apiPost('/websiteContent/list', newsParams);
      const viewRes = await this.apiPost('/websiteContent/list', viewParams);
      const productRes = await this.apiPost('/websiteContent/list', productParams);
      const bannerRes = await this.apiPost('/websiteContent/list', bannerParams);
      const resData = {
        newsList: newsRes.data.data.list,
        viewList: viewRes.data.data.list,
        productList: productRes.data.data.list,
        bannerList: bannerRes.data.data.list,
      };
      await this.ctx.render('recent_list', resData);
    }

    // cpy-news
    async cpyNews() {
      await this.ctx.render('cpy_news');
    }

    // product-news
    async productNews() {
      await this.ctx.render('product_news');
    }

    // erp-school
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
