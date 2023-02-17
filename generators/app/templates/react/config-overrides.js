const path = require('path');

const { override, babelInclude, addPostcssPlugins, addLessLoader, addWebpackAlias,addWebpackResolve, setWebpackPublicPath } = require('customize-cra');

module.exports = function (config, env) {
  return Object.assign(
    config,
    override(
      addWebpackResolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      }),
      addWebpackAlias({
        '@': path.resolve(__dirname, './src')
      }),
      babelInclude([
        /* transpile (converting to es5) code in src/ and shared component library */
        path.resolve('src'),
        path.resolve('../common'),
      ]),
      addLessLoader({
        lessOptions: {
          javascriptEnabled: true,
          localIdentName: '[local]--[hash:base64:5]',
        }
      }),
      addPostcssPlugins([require("postcss-px2rem")({ remUnit: 100 })]),
    //   setWebpackPublicPath('.')
    )(config, env)
  );
};