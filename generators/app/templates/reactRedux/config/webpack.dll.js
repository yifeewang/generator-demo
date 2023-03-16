/*
    使用dll技术，对某些库（第三方库：jquery、react、vue...）进行单独打包
        当你运行webpack时，默认查看 webpack.config.js配置文件
        需求：需要运行 webpack.dll.js文件
          -->  webpack --config webpack.dll.js
*/ 
 
const { resolve } = require('path');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
 
module.exports = {
    entry:{
        // 最终打包生成的[name] -->react
        // ['react'] -->要打包的库是react
        "react": ['react', 'react-dom']
    },
    output:{
        filename: '[name].dll.js', 
        path: resolve(__dirname, 'dll'),
        library: '[name]_[hash:8]' //打包的库里面向外面暴露出去的内容叫什么名字
    },
    plugins:[
        // 打包生成一个 manifest.json --> 提供和jquery映射
        new webpack.DllPlugin({
            name: '[name]_[hash:8]', //映射库的暴露的内容名称
            path: resolve(__dirname, 'dll/manifest.json') //输出文件路径
        })
    ],
    // externals: externalsConfig,
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false, // 不在生成license
            })
        ]
    },
    mode: 'production'
}