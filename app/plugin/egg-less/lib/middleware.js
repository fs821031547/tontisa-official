'use strict';

/* !
 * Less - middleware (adapted from the stylus middleware)
 *
 * Copyright(c) 2014 Randy Merrill <Zoramite+github@gmail.com>
 * MIT Licensed
 */

const extend = require('node.extend');
const fs = require('fs');
const less = require('less');
const mkdirp = require('mkdirp');
const path = require('path');
const url = require('url');
const utilities = require('./utilities');

// Import mapping with mtimes
let lessFiles = {};
let cacheFileInitialized = false;
// Allow tests to force flushing of cacheFile
let _saveCacheToFile = function() {};

// Check imports for changes.
const checkImports = function(path, next) {
  const nodes = lessFiles[path].imports;

  if (!nodes || !nodes.length) {
    return next();
  }

  let pending = nodes.length;
  const changed = [];

  nodes.forEach(function(imported) {
    fs.stat(imported.path, function(err, stat) {
      // error or newer mtime
      if (err || !imported.mtime || stat.mtime > imported.mtime) {
        changed.push(imported.path);
      }

      --pending || next(changed);
    });
  });
};

const initCacheFile = function(cacheFile, log) {
  cacheFileInitialized = true;
  let cacheFileSaved = false;
  _saveCacheToFile = function() {
    if (cacheFileSaved) { // We expect to only save to the cache file once, just before exiting
      log('cache file already appears to be saved, not saving again to', cacheFile);
      return;
    }
    cacheFileSaved = true;
    try {
      fs.writeFileSync(cacheFile, JSON.stringify(lessFiles));
      log('successfully cached imports to file', cacheFile);
    } catch (err) {
      log('error caching imports to file ' + cacheFile, err);
    }

  };
  process.on('exit', _saveCacheToFile);
  process.once('SIGUSR2', function() { // Handle nodemon restarts
    _saveCacheToFile();
    process.kill(process.pid, 'SIGUSR2');
  });
  process.once('SIGINT', function() {
    _saveCacheToFile();
    process.kill(process.pid, 'SIGINT'); // Let other SIGINT handlers run, if there are any
  });

  fs.readFile(cacheFile, 'utf8', function(err, data) {
    if (!err) {
      try {
        lessFiles = extend(JSON.parse(data), lessFiles);
      } catch (err) {
        log('error parsing cached imports in file ' + cacheFile, err);
      }
    } else {
      log('error loading cached imports file ' + cacheFile, err);
    }
  });
};

/**
 * Return Connect middleware with the given `options`.
 */
module.exports = less.middleware = function(source, options) {
  // Source dir is required.
  if (!source) {
    throw new Error('less.middleware() requires `source` directory');
  }

  // Override the defaults for the middleware.
  options = extend(true, {
    cacheFile: null,
    debug: false,
    dest: source,
    force: false,
    once: false,
    pathRoot: null,
    postprocess: {
      css(css, req) { return css; },
      sourcemap(sourcemap, req) { return sourcemap; },
    },
    preprocess: {
      less(src, req) { return src; },
      path(pathname, req) { return pathname; },
      importPaths(paths, req) { return paths; },
    },
    render: {
      compress: 'auto',
      yuicompress: false,
      paths: [],
    },
    storeCss(pathname, css, req, next) {
      mkdirp(path.dirname(pathname), 511 /* 0777 */, function(err) {
        if (err) return next(err);

        fs.writeFile(pathname, css, next);
      });
    },
    storeSourcemap(pathname, sourcemap, req) {
      mkdirp(path.dirname(pathname), 511 /* 0777 */, function(err) {
        if (err) {
          utilities.lessError(err);
          return;
        }

        fs.writeFile(pathname, sourcemap, function(err) {
          if (err) throw err;
        });
      });
    },
  }, options || {});

  // The log function is determined by the debug option.
  const log = (options.debug ? utilities.logDebug : utilities.log);

  if (options.cacheFile && !cacheFileInitialized) {
    initCacheFile(options.cacheFile, log);
  }

  // Expose for testing.
  less.middleware._saveCacheToFile = _saveCacheToFile;

  // Actual middleware.
  return function(req, res, next) {
    if (req.method.toUpperCase() != 'GET' && req.method.toUpperCase() != 'HEAD') { return next(); }

    let pathname = url.parse(req.url).pathname;

    // Only handle the matching files in this middleware.
    if (utilities.isValidPath(pathname)) {
      const isSourceMap = utilities.isSourceMap(pathname);

      // Translate source maps to a normal .css request which will update the associated source-map.
      if (isSourceMap) {
        pathname = pathname.replace(/\.map$/, '');
      }
      let lessPath = path.join(source, utilities.maybeCompressedSource(pathname));
      let cssPath = path.join(options.dest, pathname);

      if (options.pathRoot) {
        pathname = pathname.replace(options.dest, '');
        cssPath = path.join(options.pathRoot, options.dest, pathname);
        lessPath = path.join(options.pathRoot, source, utilities.maybeCompressedSource(pathname));
      }

      const sourcemapPath = cssPath + '.map';

      // Allow for preprocessing the source filename.
      lessPath = options.preprocess.path(lessPath, req);

      log('pathname', pathname);
      log('source', lessPath);
      log('destination', cssPath);

      // Ignore ENOENT to fall through as 404.
      const error = function(err) {
        return next(err.code == 'ENOENT' ? null : err);
      };

      const compile = function() {
        fs.readFile(lessPath, 'utf8', function(err, lessSrc) {
          if (err) {
            return error(err);
          }

          delete lessFiles[lessPath];

          try {
            const renderOptions = extend(true, {}, options.render, {
              filename: lessPath,
              paths: options.preprocess.importPaths(options.render.paths, req),
            });
            lessSrc = options.preprocess.less(lessSrc, req);

            less.render(lessSrc, renderOptions, function(err, output) {
              if (err) {
                utilities.lessError(err);
                return next(err);
              }

              // Determine the imports used and check modified times.
              const imports = [];
              output.imports.forEach(function(imported) {
                const currentImport = {
                  path: imported,
                  mtime: null,
                };

                imports.push(currentImport);

                // Update the mtime of the import async.
                fs.stat(imported, function(err, lessStats) {
                  if (err) {
                    return error(err);
                  }

                  currentImport.mtime = lessStats.mtime;
                });
              });

              // Store the less paths for simple cache invalidation.
              lessFiles[lessPath] = {
                mtime: Date.now(),
                imports,
              };

              if (output.map) {
                // Postprocessing on the sourcemap.
                const map = options.postprocess.sourcemap(output.map, req);

                // Custom sourcemap storage.
                options.storeSourcemap(sourcemapPath, map, req);
              }

              // Postprocessing on the css.
              const css = options.postprocess.css(output.css, req);

              // Custom css storage.
              options.storeCss(cssPath, css, req, next);
            });
          } catch (err) {
            utilities.lessError(err);
            return next(err);
          }
        });
      };

      // Force recompile of all files.
      if (options.force) {
        return compile();
      }

      // Only compile once, disregarding the file changes.
      if (options.once && lessFiles[lessPath]) {
        return next();
      }

      // Compile on (uncached) server restart and new files.
      if (!lessFiles[lessPath]) {
        return compile();
      }

      // Compare mtimes to determine if changed.
      fs.stat(lessPath, function(err, lessStats) {
        if (err) {
          return error(err);
        }

        fs.stat(cssPath, function(err, cssStats) {
          // CSS has not been compiled, compile it!
          if (err) {
            if (err.code == 'ENOENT') {
              log('not found', cssPath);

              // No CSS file found in dest
              return compile();
            }

            return next(err);
          }

          if (lessStats.mtime > cssStats.mtime) {
            // Source has changed, compile it
            log('modified', cssPath);

            return compile();
          } else if (lessStats.mtime > lessFiles[lessPath].mtime) {
            // This can happen if lessFiles[lessPath] was copied from
            // cacheFile above, but the cache file was out of date (which
            // can happen e.g. if node is killed and we were unable to write out
            // lessFiles on exit). Since imports might have changed, we need to
            // recompile.
            log('cache file out of date for', lessPath);

            return compile();
          }
          // Check if any of the less imports were changed
          checkImports(lessPath, function(changed) {
            if (typeof changed !== 'undefined' && changed.length) {
              log('modified import', changed);

              return compile();
            }

            return next();
          });

        });
      });
    } else {
      return next();
    }
  };
};
