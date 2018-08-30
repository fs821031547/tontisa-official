'use strict';
module.exports = view => {
  return async function routerView(ctx, next) {
    const {
      locals,
      logger,
    } = ctx;
    locals.view = view;
    logger.debug('routerView');
    await next();
  };
};
