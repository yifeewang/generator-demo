"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const { promisify } = require("util");
const rename = require("gulp-rename");
const beautify = require("gulp-beautify");
const htmlbeautify = require("gulp-html-beautify");
const gulpif = require("gulp-if");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    // This makes `appname` a required argument.
    // 设置参数 this.options.appname获取
    // this.argument("appname", { type: String, required: true });
    // 指定参数名称 --coffee
    this.option("coffee");
    // And you can then access it later; e.g.
    // this.log("iscoffee", this.options.coffee);
    // 当前运行脚本上下文环境路径
    // this.log("this.contextRoot", this.contextRoot);
    // 生成文件的目的路径 默认是当前脚本运行上下文路径，可通过destinationRoot进行修改
    // this.log("this.destinationRoot", this.destinationRoot());
    // 模板路径 默认是generators/app/templates，可通过sourceRoot进行修改
    // eg: this.sourceRoot('new/template/path')
    // this.log("this.sourceRoot", this.sourceRoot());
    // 获取模板路径
    // this.log("this.templatePath", this.templatePath());
  }

  initializing() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the GY-CreateApp ${chalk.red("generator-demo")} generator!`
      )
    );
  }

  prompting() {
    const prompts = [
      {
        type: "rawlist",
        name: "appType",
        choices: [
          {
            value: "react"
          },
          {
            value: "vue"
          },
          {
            value: "miniapp"
          }
        ],
        message: "请选择你要使用的框架?",
        default: "miniapp",
        store: true
      },
      {
        type: "input",
        name: "appName",
        message: "请输入你想创建的项目名称?",
        default: "my-app",
        store: true
      },
      {
        type: "input",
        name: "gitSite",
        message: "请输入你想连接的git地址?",
        default: "",
        validate: value =>
          value.includes(".git") ? true : `please input correct git site`,
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
          }
        ],
        message: "请选择你需要的业务模块?",
        default: [
          "starFire",
          "revisitGift",
          "yufao",
          "lightFire",
          "rechargePlugin",
          "subscribe"
        ],
        store: true
      }
    ];

    return this.prompt(prompts).then(answers => {
      // To access props later use this.props.someAnswer;
      console.log("answers", answers);
      this.answers = answers;
    });
  }

  async writing() {
    const { appName, appType } = this.answers;
    // This.sourceRoot() : templatesPath
    this.fs.copyTpl(
      this.templatePath(`${appType}`),
      this.destinationPath(`${appName}`),
      this.answers
    );
    // Beautify 优化文件
    const conditionJs = function(file) {
      // { dirname: '.', basename: 'index', extname: '.html' }
      console.log(222, JSON.stringify(file).includes(".js"));
      // TODO: 添加业务逻辑
      return JSON.stringify(file).includes(".js");
    };

    const conditionHtml = function(file) {
      // { dirname: '.', basename: 'index', extname: '.html' }
      console.log(111, JSON.stringify(file).includes(".html"));
      // TODO: 添加业务逻辑
      return JSON.stringify(file).includes(".html");
    };

    // 通过流转换输出文件
    // Js beautify
    this.registerTransformStream(
      gulpif(
        conditionJs,
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
        conditionHtml,
        htmlbeautify({
          indent_size: 4,
          preserve_newlines: false,
          end_with_newline: true
        })
      )
    );
  }

  end() {
    const { appName, appType, gitSite } = this.answers;
    shell.cd(`${this.destinationRoot()}/${appName}`);
    this.log(`${chalk.yellow("正在连接git仓库===")}`);
    shell.exec(`
        git init && 
        git remote add origin ${gitSite} &&
        git add . &&
        git push -u origin master
    `);
    this.log(`${chalk.green("仓库已连接 🌟🌟🌟")}`);
    this.log(`${chalk.blue("开始安装依赖===")}`);
    shell.exec("npm install");
    this.log(`${chalk.green("依赖安装完毕 🌟🌟🌟")}`);
    // Shell.exec(`git remote add origin ${gitSite}`);
    // shell.exec("git add .");
    // shell.exec("git commit -m 'Initial commit'");
    // shell.exec("git push -u origin master");
    // shell.exec("npm install");
    if (appType === "miniapp") {
      shell.cd(`./miniapp`);
      this.log(`${chalk.blue("开始安装miniapp依赖===")}`);
      shell.exec("npm install");
      this.log(`${chalk.green("miniapp依赖安装完毕 🌟🌟🌟")}`);
      shell.cd(`../`);
    }
  }

  //   Method1() {
  //     this.log("method 1 just ran");
  //   }

  //   _private_method2() {
  //     this.log("method 2 just ran");
  //   }
};
