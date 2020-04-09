const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 抽离css
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 关联html文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //清理 /dist 文件夹
const path = require('path')
module.exports = {
  mode: 'development',
  entry: {
    home: path.resolve(__dirname, 'src/views/home/home.js'),
    // print: path.resolve(__dirname, 'src/views/home/print.js')
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/views/home/home.html'),
      filename: 'home.html',
      title: '首页'
    }),
    new webpack.HotModuleReplacementPlugin()
    // new MiniCssExtractPlugin({
    //   filename: "[name].css",
    //   chunkFilename: "[id].css"
    // })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    index: 'home.html', // 首页面
    hot: true
  }
}