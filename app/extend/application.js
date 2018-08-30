'use strict';
const API_SERVICE = Symbol('Application#ApiService');

module.exports = {
  get ApiService() {
    if (!this[API_SERVICE]) {
      class ApiService extends this.Controller {
        sendBefore(method, api, body) {
          // this.ctx.app.logger.debug('api_req>>', method, api, ':\n', body);
        }
        sendAfter(method, api, result) {
          this.ctx.app.logger.debug('api_res<<', method, api, ':\n', result);
          if (result.status !== 200) {
            this.ctx.throw(502, `Request Api Data Get Fail Result in ${api}`, errors);
          }
        }
        async apiPost(api, data = {}, option) {
          const body = {
            method: 'POST',
            contentType: 'json',
            data,
            dataType: 'text',
          };
          if (option) Object.assign(body, option);
          this.sendBefore('POST', this.config.apiHost + api, body);
          const result = await this.ctx.curl(this.config.apiHost + api, body);
          this.sendAfter('POST', this.config.apiHost + api, result);
          return result;
        }
        async apiPut(api, data = {}, option) {
          const body = {
            method: 'PUT',
            contentType: 'json',
            data,
            dataType: 'text',
          };
          if (option) Object.assign(body, option);
          this.sendBefore('PUT', this.config.apiHost + api, body);
          const result = await this.ctx.curl(this.config.apiHost + api, body);
          this.sendAfter('PUT', this.config.apiHost + api, result);
          return result;
        }
        async apiDelete(api, data = {}, option) {
          const body = {
            method: 'DELETE',
            contentType: 'json',
            data,
            dataType: 'text',
          };
          if (option) Object.assign(body, option);
          this.sendBefore('DELETE', this.config.apiHost + api, body);
          const result = await this.ctx.curl(this.config.apiHost + api, body);
          this.sendAfter('DELETE', this.config.apiHost + api, result);
          return result;
        }
        async apiPatch(api, data = {}, option) {
          const body = {
            method: 'PATCH',
            contentType: 'json',
            data,
            dataType: 'text',
          };
          if (option) Object.assign(body, option);
          this.sendBefore('PATCH', this.config.apiHost + api, body);
          const result = await this.ctx.curl(this.config.apiHost + api, body);
          this.sendAfter('PATCH', this.config.apiHost + api, result);
          return result;
        }
        async apiGet(api, data = {}, option) {
          const body = {
            method: 'GET',
            data,
            dataType: 'text',
          };
          if (option) Object.assign(body, option);
          this.sendBefore('GET', this.config.apiHost + api, body);
          const result = await this.ctx.curl(this.config.apiHost + api, body);
          this.sendAfter('GET', this.config.apiHost + api, result);
          return result;
        }
      }
      this[API_SERVICE] = ApiService;
    }
    return this[API_SERVICE];
  },
};
