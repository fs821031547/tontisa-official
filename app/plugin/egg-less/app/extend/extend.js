'use strict';
const less = require('../../lib/middleware');

const LESS = Symbol('Application#Less');

module.exports = {
  get less() {
    if (!this[LESS]) {
      this[LESS] = less(this.config.src, this.config.dest);
    }
    return this[LESS];
  },
};
