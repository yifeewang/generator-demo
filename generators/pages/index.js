"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");
const beautify = require("gulp-beautify");
const htmlbeautify = require("gulp-html-beautify");
const gulpif = require("gulp-if");

const { mkdirsSync, filterJsFile, filterHtmlFile } = require("../tool");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    // This makes `appname` a required argument.
    // 设置参数 this.options.appname获取
    // this.argument("appname", { type: String, required: true });
    // 指定参数名称 --coffee
    this.option("coffee");
    // And you can then access it later; e.g.
    this.log("iscoffee", this.options.coffee);
    // 当前运行脚本上下文环境路径
    this.log("this.contextRoot", this.contextRoot);
    // 生成文件的目的路径 默认是当前脚本运行上下文路径，可通过destinationRoot进行修改
    this.log("this.destinationRoot", this.destinationRoot());
    // 模板路径 默认是generators/app/templates，可通过sourceRoot进行修改
    // eg: this.sourceRoot('new/template/path')
    this.log("this.sourceRoot", this.sourceRoot());
    // 获取模板路径
    this.log("this.templatePath", this.templatePath());
  }

  initializing() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the GY-CreatePages ${chalk.red(
          "generator-gycli"
        )} generator!`
      )
    );
  }

  prompting() {
    const prompts = [
      {
        type: "input",
        name: "pageName",
        message: "please input the pageName?",
        default: "index",
        store: true
      },
      {
        type: "input",
        name: "pagePath",
        message: "please input the page path?",
        default: "miniapp/pages",
        store: true
      },
      {
        type: "checkbox",
        name: "model",
        choices: [
          {
            value: "starFire" // 星火
          },
          {
            value: "revisitGift" // 访问有礼
          },
          {
            value: "taskModule" // 任务插件
          },
          {
            value: "smartService" // 智能客服
          },
          {
            value: "yufao" // 扶摇
          },
          {
            value: "lightFire" // 灯火 猜你喜欢
          },
          {
            value: "rechargePlugin" // 充值插件
          },
          {
            value: "subscribe" // 订阅
          },
          {
            value: "lifeFllow" // 关注生活号
          }
        ],
        message: "请选择你需要的业务模块?",
        default: [
          "starFire",
          "revisitGift",
          "yufao",
          "lightFire",
          "rechargePlugin",
          "subscribe",
          "lifeFllow"
        ],
        store: true
      }
    ];

    return this.prompt(prompts).then(answers => {
      // To access props later use this.props.someAnswer;
      this.answers = answers;
    });
  }

  async writing() {
    const { pageName, pagePath } = this.answers;
    // This.sourceRoot() : templatesPath
    const templatesPath = this.templatePath();
    const that = this;
    // 判断是否已经存在文件夹
    mkdirsSync(pagePath);

    fs.readdir(templatesPath, function(err, data) {
      if (err) {
        return console.log("err---", err);
      }

      // Data为一个数组
      data.forEach(item => {
        console.log(
          111,
          that.templatePath(path.join(templatesPath, item)),
          that.destinationPath(`./${pagePath}/${pageName}${path.extname(item)}`)
        );
        that.fs.copyTpl(
          that.templatePath(path.join(templatesPath, item)),
          that.destinationPath(
            `./${pagePath}/${pageName}${path.extname(item)}`
          ),
          that.answers
        );
      });
    });

    // 通过流转换输出文件
    // Js beautify
    this.registerTransformStream(
      gulpif(
        filterJsFile,
        beautify({
          indent_size: 4,
          preserve_newlines: false,
          css: {
            indent_size: 4
          }
        })
      )
    );
    // Html beautify
    this.registerTransformStream(
      gulpif(
        filterHtmlFile,
        htmlbeautify({
          indent_size: 4,
          preserve_newlines: false,
          end_with_newline: true
        })
      )
    );
  }

  //   Install() {
  //     // This.installDependencies();
  //     this.npmInstall();
  //   }

  //   method1() {
  //     this.log("method 1 just ran");
  //   }

  //   _private_method2() {
  //     this.log("method 2 just ran");
  //   }
};
