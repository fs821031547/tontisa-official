'use strict';
module.exports = {
  render(...args) {
    if (this.app.config.env === 'local' || this.app.config.env === 'pre') {
      if (this.query.hasOwnProperty('data')) {
        const body = {};
        if (typeof args[0] === 'object') {
          for (const arg of args) {
            Object.assign(body, arg);
          }
        } else {
          for (const arg of args.slice(1, args.length)) {
            Object.assign(body, arg);
          }
        }
        Object.assign(body, this.locals);
        Object.assign(body, this.app.locals);
        this.body = body;
        return;
      }
      if (this.query.hasOwnProperty('session')) {
        this.body = this.session;
        return;
      }
    }
    if (typeof args[0] !== 'string') {
      args.unshift(this.locals.view);
    }
    const renderArgs = [];
    if (typeof args[0] === 'string') {
      renderArgs.push(args[0]);
      renderArgs.push({});
      for (const arg of args.slice(1, args.length)) {
        Object.assign(renderArgs[1], arg);
      }
    }
    return this.renderView(...renderArgs).then(body => {
      // this.logger.debug('body', body);
      this.body = body;
    });
  },
};
