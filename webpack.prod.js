const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserJSPlugin = require('terser-webpack-plugin'); //js压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //css压缩
module.exports = merge(common, {
  mode: 'production',
  // devtool: 'source-map', //源码映射
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,//抽取出来的文件在压缩前的最小大小,大于30KB才单独分离成chunk,默认30000
      maxSize: 0,//抽取出来的文件在压缩前的最大大小，默认为 0，表示不限制最大大小；
      minChunks: 1, // 被引用次数，默认为1
      automaticNameDelimiter: '_',//抽取出来的文件的自动生成名字的分割符，默认为 ~；
      cacheGroups: {
        vendors: {
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName}`;
          },
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "all"
        },
      }
      // splitChunks: {
      //   chunks: 'all',
      //   minSize: 30000
      //   // 
      //   // minSize: 30000, //抽取出来的文件在压缩前的最小大小,大于30KB才单独分离成chunk
      //   // maxAsyncRequests: 5,
      //   // maxInitialRequests: 3,
      //   // name: true,
      //   // cacheGroups: {
      //   //   default: {
      //   //     priority: -20,
      //   //     reuseExistingChunk: true,
      //   //   },
      //   //   vendors: {
      //   //     name: 'vendors',
      //   //     test: /[\\/]node_modules[\\/]/,
      //   //     priority: -10,
      //   //     chunks: "all"
      //   //   },
      //   //   echarts: {
      //   //     name: 'echarts',
      //   //     chunks: 'all',
      //   //     // 对echarts进行单独优化，优先级较高
      //   //     priority: 20,
      //   //     test: function (module) {
      //   //       var context = module.context;
      //   //       return context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0)
      //   //     }
      //   //   }
      //   // }
      // }
    },
    // minimizer: [new OptimizeCSSAssetsPlugin()],
    // minimizer: [new TerserJSPlugin()],
  }, // 将公共的js提取
});