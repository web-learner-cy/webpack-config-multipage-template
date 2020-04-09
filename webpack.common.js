
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 关联html文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //清理 /dist 文件夹
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css样式
const path = require('path')

const webpack = require("webpack");
const glob = require("glob");
const htmlPluginArray = [];
function getEntry() {
  const entry = {};
  //读取src目录所有page入口
  // console.log(glob.sync('./src/views/*/*.js')) // 找到src/view/*/*.js文件
  glob.sync('./src/views/*/*.js')
    .forEach(function (filePath) {
      var name = filePath.match(/\/views\/(.+)\/(.+)\.js/);
      // console.log(name)
      name = name[1];
      entry[name] = filePath;
      // 实例化插件
      htmlPluginArray.push(new HtmlWebpackPlugin({
        filename: './' + name + '.html',
        template: './src/views/' + name + '/' + name + '.html',
        chunks: ['vendors', name],// 输出的html文件引入的入口chunk
      }))
    });
  // console.log(htmlPluginArray)
  return entry;
};
module.exports = {
  entry: getEntry(),
  output: {
    path: path.resolve(__dirname, 'dist'), //打包目录
    filename: "js/[name].[hash:8].js", // 入口文件打包后名称
    chunkFilename: 'vendors/[name].js', //分离出来的模块名称
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除该目录下的所有代码
        loader: "babel-loader", //处理es6语法 
        options: {
          'presets': [
            [
              '@babel/preset-env', {
                'useBuiltIns': 'usage', //根据需求自动加载@babel/polyfill--在低版本浏览器中翻译比较新的对象和函数
                'targets': {
                  edge: '17', // edge高于17的版本
                  firefox: '60', // firefox 高于60的版本
                  chrome: '67'  // chrome高于67的版本
                }
              }
            ]
          ] //将ES6 代码翻译成向后兼容版本的代码
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },

    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, 'src/views/home/home.html'),
    //   filename: 'home.html',
    //   title: '首页'
    // }),
    ...htmlPluginArray,
    new MiniCssExtractPlugin({
      // 类似 webpackOptions.output里面的配置 可以忽略
      filename: './css/[name].css',
      chunkFilename: './css/[id].css',
    }),
  ],
}