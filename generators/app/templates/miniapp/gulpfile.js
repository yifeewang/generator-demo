const { src, dest, parallel, series, watch } = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const path = require('path');
const chalk = require('chalk');
const plugins = loadPlugins();

// gulp-cached 将构建过的文件，生成一个hash，缓存在内存中,只更新修改文件，而不再会一次性重新构建全部监控文件。
const CONFIG_PATH = './configs';
const SOURCE_CODE_PATH = './miniapp';
const OUTPUT_PATH = './dist';
const ENV = process.env.NODE_ENV || 'prod';

const startTime = Date.now();

const clean = () => {
    if (process.env.CLEAR_CACHE) {
        // 手动清理cache缓存
        plugins.cache.clearAll();
    }
    return src([
        OUTPUT_PATH + '**/*',
        '!' + OUTPUT_PATH + '/.tea',
        '!' + OUTPUT_PATH + '/mini.project.json',
        '!' + OUTPUT_PATH + '/node_modules',
    ])
        .pipe(plugins.plumber())
        .pipe(plugins.clean());
};
// 清空dist
const env = () => {
    return src(path.resolve(CONFIG_PATH, `./config.${ENV}.js`,))
        .pipe(
            plugins.rename(function (path) {
                path.basename = 'config';
            })
        )
        .pipe(dest(SOURCE_CODE_PATH));
};

const html = () => {
    return src([
        SOURCE_CODE_PATH + '/**/*.{axml,html}',
        '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
    ])
        .pipe(plugins.cached('html-cached'))
        .pipe(
            plugins.fileInclude({
                prefix: '@@',
                basepath: '@file',
            })
        )
        .pipe(
            plugins.rename(function (path) {
                path.extname = '.axml';
            })
        )
        .pipe(dest(OUTPUT_PATH));
};

const style = () => {
    return src([
        SOURCE_CODE_PATH + '/**/*.{less,css,acss}',
        '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
    ])
        .pipe(plugins.cached('style-cached'))
        .pipe(plugins.plumber())
        .pipe(
            plugins.styleAliases({
                '@common': './miniapp/common',
            })
        ) // less会把@import打包进来，使用真实项目路径；js和axml不用，模拟器读取dist目录根路径即为dist
        .pipe(
            plugins.less({
                outputStyle: 'compressed',
            })
        )
        .pipe(plugins.autoprefixer({ cascade: false }))
        .pipe(
            plugins.base64({
                extensions: ['svg', 'png', 'jpg', 'jpeg', 'webp'],
                exclude: [/https?/],
                maxImageSize: 8 * 1024, // bytes
                debug: false,
            })
        )
        .pipe(
            plugins.rename(function (path) {
                path.extname = '.acss';
            })
        )
        .pipe(dest(OUTPUT_PATH));
};

const js = () => {
    return src([
        SOURCE_CODE_PATH + '/**/*.js',
        '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
    ])
        .pipe(plugins.cached('js-cached'))
        .pipe(
            plugins.cache(
                plugins.babel({
                    plugins: [
                        '@babel/plugin-proposal-optional-chaining',
                        '@babel/plugin-proposal-class-properties',
                    ],
                }),
                {
                    name: 'js-cache',
                }
            )
        )
        .pipe(dest(OUTPUT_PATH));
};

const sjs = () => {
    return src([
        SOURCE_CODE_PATH + '/**/*.sjs',
        '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
    ])
        .pipe(plugins.cached('sjs-cached'))
        .pipe(dest(OUTPUT_PATH));
};

const json = () => {
    return src([
        SOURCE_CODE_PATH + '/**/*.{json,json5}',
        '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
    ])
        .pipe(plugins.cached('json-cached'))
        .pipe(
            plugins.json5ToJson({
                beautify: true, // default
            })
        )
        .pipe(dest(OUTPUT_PATH));
};

const image = () => {
    return src([
        SOURCE_CODE_PATH + '/**/*.{png,jpg,jpeg,gif,ico,svg,webp}',
        '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
    ])
        .pipe(plugins.cached('image-cached'))
        .pipe(dest(OUTPUT_PATH));
};

const startWatch = (cb) => {
    cb();
    watch(SOURCE_CODE_PATH + '/**/*.tmpl', html);
    watch(SOURCE_CODE_PATH + '/**/*.{html,axml}', html);
    watch(SOURCE_CODE_PATH + '/**/*.{less, acss, css}', style);
    watch(SOURCE_CODE_PATH + '/**/*.js', js);
    watch(SOURCE_CODE_PATH + '/**/*.sjs', sjs);
    watch(SOURCE_CODE_PATH + '/**/*.{json,json5}', json);
    watch(SOURCE_CODE_PATH + '/**/*.{png,jpg,jpeg,gif,ico,svg,webp}', image);
    const endTime = Date.now();
    console.log(chalk.blue('当前环境是：' + ENV));
    console.log(
        chalk.green('编译用时' + (endTime - startTime) / 1000 + 's')
    );
    console.log(chalk.yellow('监听中'));
};

const main = parallel(html, js, json, sjs, style, image);

const dev = series(env, main, startWatch, (cb) => {
    cb();
});

const build = series(clean, env, main, (cb) => {
    cb();
    const endTime = Date.now();
    console.log(chalk.blue('当前环境是：' + ENV));
    console.log(
        chalk.green('编译完成，用时' + (endTime - startTime) / 1000 + 's')
    );
});

module.exports = {
    dev,
    build
};
