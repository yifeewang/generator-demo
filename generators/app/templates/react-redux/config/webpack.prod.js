const path = require("path");
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin")
const CopyPlugin = require('copy-webpack-plugin');

const IS_ANALYZER = process.env.IS_ANALYZER == 'analyzer'

const prodConfig = merge(common, {
  mode: "production",
  plugins: [
    new CleanWebpackPlugin(),
    // cssyasuo
    new CssMinimizerWebpackPlugin(),
    new CopyPlugin({
        patterns: [
            {
              from: path.resolve(__dirname, '../public'),
              to: path.resolve(__dirname, '../dist'),
              globOptions: {
                dot: true,
                gitignore: true,
                ignore: ["**/*.html"],
            }
            }
        ]
    })
  ]
})

if(IS_ANALYZER) {
    const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
    prodConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = prodConfig