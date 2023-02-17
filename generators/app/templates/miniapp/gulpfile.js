const gulp = require('gulp');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const fileInclude = require('gulp-file-include');
const less = require('gulp-less');
const base64 = require('gulp-base64');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const json5 = require('gulp-json5-to-json');
const chalk = require('chalk');
// const fs = require('fs')
const aliases = require('gulp-style-aliases');
const babel = require('gulp-babel');
const cache = require('gulp-cache');
// 将构建过的文件，生成一个hash，缓存在内存中,只更新修改文件，而不再会一次性重新构建全部监控文件。
const cached = require('gulp-cached');

const SOURCE_CODE_PATH = './miniapp';
const OUTPUT_PATH = './dist';
const ENV = process.env.NODE_ENV || 'prod';

const startTime = Date.now();

// 清空dist
gulp.task('clean', (done) => {
    if (process.env.CLEAR_CACHE) {
        // 手动清理cache缓存
        cache.clearAll();
    }
    return gulp
        .src([
            OUTPUT_PATH + '**/*',
            '!' + OUTPUT_PATH + '/.tea',
            '!' + OUTPUT_PATH + '/mini.project.json',
            '!' + OUTPUT_PATH + '/node_modules',
        ])
        .pipe(plumber())
        .pipe(clean());
});

// 环境配置。先编译到src目录，稍后一同copy到dist目录
gulp.task('env', (done) => {
    return gulp
        .src('./gulpfile.' + ENV + '.js')
        .pipe(
            rename(function (path) {
                path.basename = 'config';
            })
        )
        .pipe(gulp.dest(SOURCE_CODE_PATH));
});

// 复制node_modules
// gulp.task('npm', done => {
//     return gulp.src([
//         SOURCE_CODE_PATH + '/node_modules/**/*',
//     ])
//         .pipe(gulp.dest(OUTPUT_PATH + '/node_modules'))
// })

// 处理文件
gulp.task('html', (done) => {
    return gulp
        .src([
            SOURCE_CODE_PATH + '/**/*.{axml,html}',
            '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
        ])
        .pipe(cached('html-cached'))
        .pipe(
            fileInclude({
                prefix: '@@',
                basepath: '@file',
            })
        )
        .pipe(
            rename(function (path) {
                path.extname = '.axml';
            })
        )
        .pipe(gulp.dest(OUTPUT_PATH));
});

gulp.task('style', (done) => {
    return gulp
        .src([
            SOURCE_CODE_PATH + '/**/*.{less,css,acss}',
            '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
        ])
        .pipe(cached('style-cached'))
        .pipe(plumber())
        .pipe(
            aliases({
                '@common': './src/common',
            })
        ) // less会把@import打包进来，使用真实项目路径；js和axml不用，模拟器读取dist目录根路径即为dist
        .pipe(
            less({
                outputStyle: 'compressed',
            })
        )
        .pipe(autoprefixer({ cascade: false }))
        .pipe(
            base64({
                extensions: ['svg', 'png', 'jpg', 'jpeg', 'webp'],
                exclude: [/https?/],
                maxImageSize: 8 * 1024, // bytes
                debug: false,
            })
        )
        .pipe(
            rename(function (path) {
                path.extname = '.acss';
            })
        )
        .pipe(gulp.dest(OUTPUT_PATH));
});

gulp.task('js', (done) => {
    return gulp
        .src([
            SOURCE_CODE_PATH + '/**/*.js',
            '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
        ])
        .pipe(cached('js-cached'))
        .pipe(
            cache(
                babel({
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
        .pipe(gulp.dest(OUTPUT_PATH));
});
gulp.task('sjs', (done) => {
    return gulp
        .src([
            SOURCE_CODE_PATH + '/**/*.sjs',
            '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
        ])
        .pipe(cached('sjs-cached'))
        .pipe(gulp.dest(OUTPUT_PATH));
});

gulp.task('json', (done) => {
    return gulp
        .src([
            SOURCE_CODE_PATH + '/**/*.{json,json5}',
            '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
        ])
        .pipe(cached('json-cached'))
        .pipe(
            json5({
                beautify: true, // default
            })
        )
        .pipe(gulp.dest(OUTPUT_PATH));
});

gulp.task('image', (done) => {
    return gulp
        .src([
            SOURCE_CODE_PATH + '/**/*.{png,jpg,jpeg,gif,ico,svg,webp}',
            '!' + SOURCE_CODE_PATH + '/node_modules/**/*',
        ])
        .pipe(cached('image-cached'))
        .pipe(gulp.dest(OUTPUT_PATH));
    // done()
});

// 主任务
gulp.task('main', gulp.parallel('html', 'style', 'js', 'sjs', 'json', 'image'));

// 监听
gulp.task('watch', (done) => {
    gulp.watch(SOURCE_CODE_PATH + '/**/*.tmpl', gulp.series('html'));
    gulp.watch(SOURCE_CODE_PATH + '/**/*.{html,axml}', gulp.series('html'));
    gulp.watch(
        SOURCE_CODE_PATH + '/**/*.{less, acss, css}',
        gulp.series('style')
    );
    gulp.watch(SOURCE_CODE_PATH + '/**/*.js', gulp.series('js'));
    gulp.watch(SOURCE_CODE_PATH + '/**/*.sjs', gulp.series('sjs'));
    gulp.watch(SOURCE_CODE_PATH + '/**/*.{json,json5}', gulp.series('json'));
    gulp.watch(
        SOURCE_CODE_PATH + '/**/*.{png,jpg,jpeg,gif,ico,svg,webp}',
        gulp.series('image')
    );
    done();
});

// 开发编译
gulp.task(
    'dev',
    gulp.series('env', 'main', 'watch', (done) => {
        done();
        const endTime = Date.now();
        console.log(chalk.blue('当前环境是：' + ENV));
        console.log(
            chalk.green('编译用时' + (endTime - startTime) / 1000 + 's')
        );
        console.log(chalk.yellow('监听中'));
    })
);

// 生产编译
gulp.task(
    'build',
    gulp.series('clean', 'env', 'main', (done) => {
        done();
        const endTime = Date.now();
        console.log(chalk.blue('当前环境是：' + ENV));
        console.log(
            chalk.green('编译完成，用时' + (endTime - startTime) / 1000 + 's')
        );
    })
);

// 默认任务
gulp.task(
    'default',
    gulp.series('main', 'watch', (done) => {
        done();
        console.log(chalk.blue('不修改当前环境，启动监听'));
        console.log(chalk.yellow('监听中'));
    })
);
