const { src, dest, parallel, series, watch } = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const inquirer = require('inquirer');
const options = require('./configs/option.js');
const merge = require('deepmerge');
const Vinyl = require('vinyl');
const plugins = loadPlugins();

// gulp-cached 将构建过的文件，生成一个hash，缓存在内存中,只更新修改文件，而不再会一次性重新构建全部监控文件。
const SOURCE_CODE_PATH = './miniapp';
let OUTPUT_PATH = './dist';

let env;
let app;

const startTime = Date.now();

function existSync(aPath) {
    try {
        const stat = fs.statSync(aPath);
        return stat.isDirectory() || stat.isFile();
    } catch (e) {
        return false;
    }
}

// 递归创建目录 同步方法
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }

    if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
    }
}

function getOption () {
    const promptList = [
        {
            type: 'list',
            message: '请选择应用：',
            name: 'app',
            choices: options.apps
        },
        {
            type: 'list',
            message: '请选择环境：',
            name: 'env',
            choices: options.envs
        }
    ];
    return inquirer.prompt(promptList)
        .then(answer => {
            console.log(answer);
            app = answer.app;
            env = answer.env;
            OUTPUT_PATH = `./dist/${app}`;
            return answer;
        });
}

// 环境配置
function string_src (filename, string) {
    let src = require('stream').Readable({ objectMode: true });
    src._read = function () {
        this.push(new Vinyl({
            cwd: './',
            base: './',
            path: filename,
            contents: Buffer.from(string, 'utf-8')
        }));
        this.push(null);
    };
    return src;
}

const init = () => {
    return getOption();
}

const clean = (done) => {
    if (process.env.CLEAR_CACHE) {
        // 手动清理cache缓存
        plugins.cache.clearAll();
    }
    if (existSync(OUTPUT_PATH)) {
        return src([
            OUTPUT_PATH + '**/*',
            '!' + OUTPUT_PATH + '/.tea',
            '!' + OUTPUT_PATH + '/mini.project.json',
            '!' + OUTPUT_PATH + '/node_modules',
        ])
            .pipe(plugins.plumber())
            .pipe(plugins.clean());
    } else {
        done();
    }
};

const envs = () => {
    const baseConfig = require(`./configs/${app}/base.js`);
    const envConfig = require(`./configs/${app}/config.${env}.js`);
    const config = merge(baseConfig, envConfig);

    return string_src('config.json', JSON.stringify(config, null, 2))
        .pipe(plugins.rename(function (path) {
            path.extname = '.json';
        }))
        .pipe(dest(SOURCE_CODE_PATH));
};

const appJson = () => {
    return src(`./configs/${app}/app.json5`)
        .pipe(plugins.cached('json-cached'))
        .pipe(
            plugins.json5ToJson({
                beautify: true, // default
            })
        )
        .pipe(plugins.rename(function (path) {
            path.extname = '.json';
        }))
        .pipe(dest(SOURCE_CODE_PATH));
};

const index = () => {
    return src(`${OUTPUT_PATH}/pages/index-${app}/**/*`)
        .pipe(dest(`${OUTPUT_PATH}/pages/index`));
}

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

const checkDist = (done) => {
    mkdirsSync(OUTPUT_PATH);
    done();
}

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
    console.log(chalk.blue('当前环境是：' + env));
    console.log(
        chalk.green('编译用时' + (endTime - startTime) / 1000 + 's')
    );
    console.log(chalk.yellow('监听中'));
};

const main = parallel(html, js, json, sjs, style, image);

const dev = series(init, clean, envs, appJson, checkDist, main, index, startWatch, (cb) => {
    cb();
});

const build = series(init, clean, envs, appJson, checkDist, main, index, (cb) => {
    cb();
    const endTime = Date.now();
    console.log(chalk.blue('当前环境是：' + env));
    console.log(
        chalk.green('编译完成，用时' + (endTime - startTime) / 1000 + 's')
    );
});

module.exports = {
    dev,
    build
};
