### webpack 多文件打包
> 为了学习webpack,和提高多页面开发效率

### 开发和生产环境区别
1. 开发环境注重编译速度，代码调试，开启本地服务，不需要每次打包，修改代码后，自动更新
2. 生产环境注重代码体积，css压缩，js压缩，代码分离，异步加载，去掉未使用的代码(tree shaking)

### css 自动兼容添加前缀
1. 安装插件 npm i postcss-loader autoprefixer -D
2. webpack.common.js 配置 modules模块，配置如下
  ```js
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
  ```
> <font color=red>注意</font>：如果未指定兼容的浏览器版本，是是不起作用的，可以在package.json文件中配置 "browserslist"字段，也可以在postcss.config.js文件中配置

### js es6转换成es6,并使用比较新的函数及对象
1. 安装插件 npm i babel-loader @babel/preset-env @babel/polyfill -D
2. 配置webpack.common.js 的module 模块，具体配置如下
```js
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
```
>注意配置options的presets时，是一个数组中还有一个数组，不然会报错，亲身体验

### 多页面配置
>多页面配置主要是改变entry,及模板html
1. 动态获取入口文件及HTML模板
```js
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
```
2. 替换原来的地方
` entry: getEntry()`和`plugins: [...htmlPluginArray,]`
> 这里主要注意你文件的结构和查找文件路径