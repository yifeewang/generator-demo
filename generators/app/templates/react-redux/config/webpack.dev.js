const path = require("path");
const { merge } = require("webpack-merge")
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const common = require("./webpack.common.js")

module.exports = merge(common, {
  mode: "development",
  devServer: {
    static: {
        directory: path.join(__dirname, '../public'),
    },
    compress: true,
    host: "localhost",
    port: "3000",
	historyApiFallback:true  //缺少该配置，会出现路由访问错误
  },
  plugins: []
})