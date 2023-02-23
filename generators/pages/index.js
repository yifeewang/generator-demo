"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");

const { mkdirsSync } = require("../tool");
const { pagePrompts } = require("../prompts");
const lintStyle = require("../lintStyle");

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
    const prompts = pagePrompts();

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
    // 递归判断是否已经存在文件夹
    mkdirsSync(pagePath);

    fs.readdir(templatesPath, function(err, data) {
      if (err) {
        return console.log("err---", err);
      }

      // Data为一个数组
      data.forEach(item => {
        that.fs.copyTpl(
          that.templatePath(path.join(templatesPath, item)),
          that.destinationPath(
            `./${pagePath}/${pageName}${path.extname(item)}`
          ),
          that.answers
        );
      });
    });
    // 转换输出文件
    lintStyle(this);
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
