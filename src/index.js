const path = require('path');
const fs = require('fs');
let directoryPath = path.resolve(process.cwd(), './node_modules/.cache/readme-original-loader') 
let filePath = path.resolve(process.cwd(), './node_modules/.cache/readme-original-loader/cache.json') 

class ReadmeCacheWebpackPlugin {
  constructor() {
  }
  apply(compiler) {
    this.compiler = compiler;
    const done = stats => {
      const actions = [];
      actions.push(() => this.cacheReadmeOriginalMap(stats.compilation.compiler.readmeOriginalMap));
      if (actions.length) {
        setImmediate(() => {
          actions.forEach(action => action());
        });
      }
    };
    const afterPlugins = compiler => {
      const actions = [];
      actions.push(() => this.readReadmeOriginalMap(compiler));
      if (actions.length) {
        setImmediate(() => {
          actions.forEach(action => action());
        });
      }
    };

    if (compiler.hooks) {
      compiler.hooks.done.tap('readme-cache-webpack-plugin', done);
      compiler.hooks.afterPlugins.tap('readme-cache-webpack-plugin', afterPlugins);
    } else {
      compiler.plugin('done', done);
      compiler.plugin('afterPlugins', afterPlugins);
    }

  }
  async cacheReadmeOriginalMap(readmeOriginalMap) {
    fs.exists(directoryPath,function(exists){
      if(!exists){
        fs.mkdir(directoryPath, (err) => {
          if (err){
            return;
          }
          readmeOriginalMap&&writeFile(filePath,JSON.stringify(readmeOriginalMap))
        });
      }else{
         readmeOriginalMap&&writeFile(filePath,JSON.stringify(readmeOriginalMap))
      }
    } 
  )}
  async readReadmeOriginalMap(compiler) {
    fs.exists(directoryPath, function (exists) {
      if(exists){
        fs.readFile(filePath, 'utf-8', function (err, data) {
          if(err){
            return;
          }else{
            if(data){
              compiler.readmeOriginalMap = JSON.parse(data)
            }
          }
        })
      }
    }) 
  } 
}

function writeFile(filePath,readmeOriginalMap){
  fs.writeFile(filePath, JSON.stringify(readmeOriginalMap), { encoding: 'utf8' }, err => {
    if (err){
      return;
    }
  })
}


module.exports = ReadmeCacheWebpackPlugin
