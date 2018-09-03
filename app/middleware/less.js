'use strict';
const fs = require('fs'); // 引入 fs 文件读写模块
const less = require('less'); // 引入 less 模块
const path = require('path'); // 引入 path 路径模块
module.exports = options => {
  return function(app) {
    // lessMiddleware(path.join(baseDir, 'app/view/css'), options);
    // const baseDir = ctx.app.baseDir;
    const optionsSrc = options.src;
    const optionsDist = options.dist;
    // const srcPath = path.join(baseDir, 'app/view/less/');
    // const distPath = path.join(baseDir, 'app/public/css/');
    function writeFile(srcPath, distPath) {
      // readFile 第二个参数，可以指定编码类型
      // 指定编码类型后，得到的数据会自动转换
      fs.readFile(srcPath, 'utf8', (err, data) => {
        // data.toString()
        if (err) {
          throw err;
        }
        // 读取 less 文件内容
        // console.log( data )
        // 在代码中调用 less
        less.render(data, (err, css) => {
          if (err) {
            throw err;
          }

          // 得到 less 编译后的 css 内容
          // console.log( css.css )
          // 下面就是要将 css.css 写入到文件中
          fs.writeFile(distPath, css.css, err => {
            if (err) {
              throw err;
            }
            // 输出 success 编译写入成功
            console.log('success');
          });

        });

      });
    }

    function watchFile(srcPath, distPath) {
      // console.log('srcPath:', srcPath);
      // console.log('distPath:', app.env);
      fs.exists(distPath, function(exists) {
        if (!exists) {
          writeFile(srcPath, distPath);
        }
      });
      if (app.env === 'local') {
        // 监听目录 自动编译less文件
        fs.watch(options.src, {
          interval: 500, // 每 500 毫秒监视检查文件 一次
        }, (eventType, filename) => {
          try {
            if (path.extname(filename) === '.less') {
              const srcStr = path.join(options.src, filename);
              const distStr = path.join(options.dist, path.basename(filename, '.less') + '.css');
              if (filename) {
                writeFile(srcStr, distStr);
              }
            }
          } catch (error) {
            console.log('异常错误！');
            throw error;
          }
        });
        // 监视文件
        fs.watchFile(srcPath, {
          interval: 500, // 每 500 毫秒监视检查文件 一次
        },
        (curr, prev) => {
          writeFile(srcPath, distPath);
        }
        );
      }
    }

    function transformToCss(rootPath, targetPath) {
      // 取得当前绝对路径
      rootPath = path.resolve(rootPath);
      // 目标路径绝对路径
      targetPath = path.resolve(targetPath);
      // 判断目录是否存在
      fs.exists(rootPath, function(exists) {
        // 路径存在
        if (exists) {
          // 获取当前路径下的所有文件和路径名
          const childArray = fs.readdirSync(rootPath);
          if (childArray.length) {
            for (let i = 0; i < childArray.length; i++) {
              const currentFilePath = path.resolve(rootPath, childArray[i]);
              const currentTargetPath = path.resolve(targetPath, childArray[i]);
              // 读取文件信息
              const stats = fs.statSync(currentFilePath);
              // 若是目录则递归调用
              if (stats.isDirectory()) {
                transformToCss(currentFilePath, currentTargetPath);
              } else {
                // 判断文件是否为less文件
                if (path.extname(currentFilePath) === '.less') {
                  const newFilePath = path.resolve(targetPath, path.basename(currentFilePath, '.less') + '.css');
                  // const newFilePath = targetPath;
                  if (!fs.existsSync(targetPath)) {
                    fs.mkdirSync(targetPath);
                  }
                  watchFile(currentFilePath, newFilePath);
                  // exec('lessc -x ' + currentFilePath + ' > ' + newFilePath);
                }
              }
            }
          }
        } else {
          console.log('directory is not exists');
        }
      });
    }
    // watchFile();
    transformToCss(optionsSrc, optionsDist);
    // await next();
  };
};
