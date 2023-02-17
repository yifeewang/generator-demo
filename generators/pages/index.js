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
        `Welcome to the GY-CreateApp ${chalk.red("generator-demo")} generator!`
      )
    );
  }

  prompting() {
    const prompts = [
      {
        type: "input",
        name: "appName",
        message: "please input the appName?",
        default: "my-app",
        store: true
      },
      {
        type: "rawlist",
        name: "primaryPath",
        choices: [
          {
            value: "pages"
          },
          {
            value: "packageList"
          },
          {
            value: "packages"
          }
        ],
        message: "please select the dir path?",
        default: "packageList",
        store: true
      },
      {
        type: "input",
        name: "secondPath",
        message: "please input the second dir path?",
        default: "",
        store: true
      },
      {
        type: "checkbox",
        name: "model",
        choices: [
          {
            value: "xh"
          },
          {
            value: "fy"
          },
          {
            value: "dy"
          },
          {
            value: "gz"
          }
        ],
        message: "please select the model?",
        default: ["xh", "fy", "dy", "gz"],
        store: true
      },
      {
        type: "confirm",
        name: "gz",
        message: "do u need focus?",
        default: true,
        store: true
      }
    ];

    return this.prompt(prompts).then(answers => {
      // To access props later use this.props.someAnswer;
      this.answers = answers;
    });
  }

  async writing() {
    const { appName, primaryPath, secondPath, model } = this.answers;
    // This.sourceRoot() : templatesPath
    const templatesPath = path.join(__dirname, "templates");
    const destinationPath = this.destinationPath(
      `./${primaryPath}/${secondPath}`
    );
    const that = this;
    // 判断是否已经存在文件夹
    const isFileExists = await promisify(fs.exists)(primaryPath);
    console.log(1111, isFileExists);
    if (!isFileExists) {
      // 重新创建
      await promisify(fs.mkdir)(`${primaryPath}`);
    }

    const isFileExists2 = await promisify(fs.exists)(
      primaryPath + "/" + secondPath
    );
    console.log(2222, isFileExists2);
    if (!isFileExists2) {
      shell.cd(`./${primaryPath}`);
      // 重新创建
      await promisify(fs.mkdir)(`${secondPath}`);
      shell.cd(`../`);
    }

    fs.readdir(templatesPath, function(err, data) {
      if (err) {
        return console.log("22222", err);
      }

      // Data为一个数组
      data.forEach(item => {
        console.log(
          111,
          that.templatePath(path.join(templatesPath, item)),
          that.destinationPath(
            `./${primaryPath}/${secondPath}/${
              that.answers.appName
            }${path.extname(item)}`
          )
        );
        that.fs.copyTpl(
          that.templatePath(path.join(templatesPath, item)),
          that.destinationPath(
            `./${primaryPath}/${secondPath}/${
              that.answers.appName
            }${path.extname(item)}`
          ),
          that.answers
        );
      });
    });
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
