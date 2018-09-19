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
    /**
     * 客户案例列表
     */
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
        // pageSize: 12,
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
      const resData = {
        list: res.data.data.list.slice(0, 12),
        tagList: websiteTag,
        bannerList: bannerRes.data.data.list,
        page: res.data.data,
        listStr: JSON.stringify(res.data.data.list),
      };
      await this.ctx.render('case_list', resData);
    }
    /**
     * 客户案例详情
     */
    // case-detail
    async caseDetail() {
      const url = this.ctx.request.url;
      const id = url.split('/')[url.split('/').length - 1];
      const parms = {
        id,
      };
      const res = await this.apiPost('/websiteContent/detail', parms);
      if (typeof res.data.data.content === 'string') {
        res.data.data.content = JSON.parse(res.data.data.content);
      }
      await this.ctx.render('case_detail', res.data.data);
    }
    /**
     * 最新动态
     */
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
      const { query } = this.ctx;
      const pageInfo = this.ctx.app.pageInfo;
      const headerInfo = this.ctx.app.headerInfo;
      const actionData = headerInfo.find(x => {
        return x.name === '小强学院';
      });
      const paramsValue = '10000';
      const navIdArr = [ paramsValue, paramsValue, paramsValue, paramsValue, paramsValue ];
      pageInfo.forEach(x => {
        if (x.parentId == actionData.id) {
          switch (x.name) {
            case '轮播':
              navIdArr[0] = x.id;
              break;
            case '课程':
              navIdArr[1] = x.id;
              break;
            case '优秀学员':
              navIdArr[2] = x.id;
              break;
            case '精彩图集':
              navIdArr[3] = x.id;
              break;
            case '课程回顾':
              navIdArr[4] = x.id;
              break;
            default:
              break;
          }
        }
      });
      const navIdArrChild = [];
      pageInfo.forEach(x => {
        if (x.parentId == navIdArr[3]) {
          navIdArrChild.push(x.id);
        }
      });
      const bannerParams = {
        pageNum: query.page || 1,
        // pageSize: 12,
        navId: navIdArr[0],
        tags: query.tags || null,
      };
      const params = {
        pageNum: query.page || 1,
        // pageSize: 12,
        navId: navIdArr[1],
        tags: query.tags || null,
      };
      const paramsTwo = {
        pageNum: query.page || 1,
        // pageSize: 12,
        navId: navIdArr[2],
        tags: query.tags || null,
      };
      const paramsThree = {
        // pageNum: query.page || 1,
        // pageSize: 12,
        navId: navIdArr[3],
        // tags: query.tags || null,
      };
      const paramsFour = {
        pageNum: query.page || 1,
        // pageSize: 12,
        navId: navIdArr[4],
        tags: query.tags || null,
      };

      const bannerRes = await this.apiPost('/websiteContent/list', bannerParams);
      const res = await this.apiPost('/websiteContent/list', params);
      const resTwo = await this.apiPost('/websiteContent/list', paramsTwo);
      const resThree = await this.apiPost('/websiteContent/list', paramsThree);
      const resFour = await this.apiPost('/websiteContent/list', paramsFour);
      bannerRes.data.data.list.forEach(item => {
        if (typeof item.content === 'string') {
          item.content = JSON.parse(item.content);
        }
      });
      res.data.data.list.forEach(item => {
        if (typeof item.content === 'string') {
          item.content = JSON.parse(item.content);
        }
      });

      const resData = {
        list: res.data.data.list,
        twoList: resTwo.data.data.list,
        threeList: resThree.data.data.list,
        fourList: resFour.data.data.list,
        bannerList: bannerRes.data.data.list,
        navIdArrChild,
      };
      await this.ctx.render('erp_school', resData);
    }

    // trust-circle
    async trustCircle() {
      await this.ctx.render('trust_circle');
    }

    // information-train
    async inforTrain() {
      await this.ctx.render('infor_train');
    }

    // team-build
    async teamBuild() {
      await this.ctx.render('team_build');
    }

    // news-detail
    async newsDetail() {
      await this.ctx.render('news_detail');
    }

    // view-detail
    async viewDetail() {
      await this.ctx.render('interview_detail');
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
