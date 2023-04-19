const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const WebpackBar = require("webpackbar");

const cdnConfig = {
    'react': 'https://cdn.staticfile.org/react/18.2.0/umd/react.development.js',
    'react-dom': 'https://cdn.staticfile.org/react-dom/18.2.0/umd/react-dom.development.js',
}

const externalsConfig = {
    "react": "React",
    "react-dom": "ReactDOM",
}

module.exports = {
    entry: path.join(__dirname, "../src/index.js"),
    output: {
        filename:"[name].[contenthash:8].js",
        path:path.join(__dirname, "../dist")
    },
    stats: {
        modules: false,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(css)$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                        modules: true
                    },
                    },
                    {
                    loader: "postcss-loader",
                    },
                ],
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader", 
                        options: {
                            importLoaders: 2,
                            modules: true
                        }
                    },
                    {
                        loader: "postcss-loader"
                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            {
                test: /\.(gif|png|webp|jpe?g)$/,
                exclude: /node_modules/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                },
                generator: {
                    filename: 'static/[contenthash:8].[name][ext]'
                }
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                exclude: /node_modules/,
                type: "asset/resource",
                generator: {
                  filename: "static/[contenthash:8][ext][query]",
                },
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "../public/index.html"),
            filename: "index.html",
        }),
        // 给process.env.NODE_ENV赋值
        new webpack.DefinePlugin({
            'APP_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        // 告诉webpack那些库不参与打包，同时使用时的名称也得变~
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, './dll/manifest.json')
        }),
        // 将某个文件打包输出去，并在html中自动引入该资源
        new AddAssetHtmlPlugin({
            // filepath:resolve(__dirname,'dll/jquery.js'),
            filepath: path.resolve(__dirname, './dll/react.dll.js'),
            outputPath: 'dll',
            publicPath: './dll',
        }),
        // 把css样式从js文件中提取到单独的css文件中
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[id].[contenthash:8].css',
        }),
        new WebpackBar()
    ],
    resolve: {
        // 配置解析模块路径别名: 优点简写路径 缺点路径没有提示
        alias: {
          '@': path.resolve(__dirname, "../src"),
        },
        // 配置省略文件路径的后缀名
        extensions: [".js", ".json", ".jsx", ".tsx", ".less"],
        // 告诉 webpack 解析模块是去找哪个目录
        modules: [path.resolve(__dirname, "../node_modules"), "node_modules"],
    },
    // externals: externalsConfig,
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false, // 不在生成license
            })
        ],
        //让webpack不会自动读取配置文件中的mode给process.env.NODE_ENV赋值
        // nodeEnv: false
    }
}