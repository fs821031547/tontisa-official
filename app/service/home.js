'use strict';
module.exports = app => {
  class Home extends app.ApiService {
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
    async navList(query) {
      const data = {
        type: 0,
      };
      const user = await this.apiPost('192.168.110.16:9420/websiteNav/list', data);
      if (typeof user.data === 'string') {
        user.data = JSON.parse(user.data);
      }
      return user.data;
    }

  }
  return Home;
};
