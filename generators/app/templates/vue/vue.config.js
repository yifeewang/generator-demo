const path = require('path');
const resolve = dir => path.join(__dirname, dir);

module.exports = {
  publicPath: './', // 公共路径
  // publicPath: process.env.NODE_ENV === "production" ? "/site/vue-demo/" : "/", // 公共路径
  // indexPath: "index.html", // 相对于打包路径index.html的路径
  // outputDir: 'dist', //生产环境构建文件的目录
  // assetsDir: "static", // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: true, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: false, // 生产环境关闭 source map
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修复热更新失效
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'));
    // 去除生产环境console
    config.optimization.minimizer('terser').tap(args => {
      args[0].terserOptions.compress.drop_console = true;
      return args;
    });
    // 配置less变量
    // config.module
    //   .rule('less')
    //   .oneOf('vue')
    //   .use('style-resource')
    //   .loader('less-loader')
    //   .options({
    //     patterns: [path.resolve(__dirname, './src/styles/index.less')],
    //   });
  },
  css: {
    loaderOptions: {
      // sass: {
      //   javascriptEnabled: true,
      // },
      postcss: {
        plugins: [
          require('autoprefixer')({
            // 配置使用 autoprefixer
            overrideBrowserslist: ['last 15 versions'],
          }),
          require('postcss-pxtorem')({
            rootValue: 75, // 换算的基数
            // 忽略转换正则匹配项。插件会转化所有的样式的px。比如引入了三方UI，也会被转化。目前我使用 selectorBlackList字段，来过滤
            //如果个别地方不想转化px。可以简单的使用大写的 PX 或 Px 。
            selectorBlackList: ['ig'],
            propList: ['*'],
            exclude: /node_modules/,
          }),
        ],
      },
    },
  },
  devServer: {
    // host: 'localhost',
    port: 8080, // 端口号
    open: true,
    proxy: {
      //配置跨域
      '/spm': {
        target: 'https://spm-sit.gyjxwh.com',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': '',
        // },
      },
    },
  },
};
