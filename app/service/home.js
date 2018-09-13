'use strict';
module.exports = app => {
  class Home extends app.ApiService {
    async headerInfo(query) {
      const data = {
        type: 0,
      };
      const navData = await this.apiPost('/websiteNav/list', data);
      if (typeof navData.data === 'string') {
        navData.data = JSON.parse(navData.data);
        return navData.data;
      }
      const list = navData.data.data.list;
      const arr = [];

      list.forEach(item => {
        item.subMenu = [];
        if (item.parentId === 0) {
          arr.push(item);
        }
      });
      list.forEach(item => {
        if (item.parentId !== 0) {
          const parentId = item.parentId;
          arr.forEach(i => {
            if (i.id === parentId) {
              i.subMenu.push(item);
            }
          });
        }
      });
      return arr;

    }
    async pageInfo(query) {
      const pageParams = {
        type: 1,
      };
      const pageData = await this.apiPost('/websiteNav/list', pageParams);
      if (typeof pageData.data === 'string') {
        pageData.data = JSON.parse(pageData.data);
        return pageData.data;
      }
      const pageList = pageData.data.data.list;
      return pageList;
    }


    async demo(query) {
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
      return user.data;
    }

  }
  return Home;
};
