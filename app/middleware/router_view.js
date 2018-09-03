'use strict';
const path = require('path');

module.exports = view => {
  return async function routerView(ctx, next) {
    const {
      locals,
      logger,
    } = ctx;
    if (typeof view === 'string') {
      locals.view = view;
    } else {
      await ctx.render(view.view);
    }
    // const renderArgs = [];
    // renderArgs.push(locals.view);
    logger.debug('routerView');
    await next();
  };
};
