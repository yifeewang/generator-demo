"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const shell = require("shelljs");
const lintStyle = require("../lintStyle");
const { appPrompts } = require("../prompts");
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    // This makes `appname` a required argument.
    // 设置参数 this.options.appname获取
    // this.argument("appname", { type: String, required: true });
    // 指定参数名称 --coffee
    this.option("coffee");
    this.log("iscoffee", this.options);
  }

  initializing() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the GY-CreateApp ${chalk.red("generator-gycli")} generator!`
      )
    );
  }

  prompting() {
    const prompts = appPrompts();

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
    // 转换输出文件
    lintStyle(this);
  }

  end() {
    const { appName, appType, gitSite } = this.answers;
    shell.cd(`${this.destinationRoot()}/${appName}`);
    this.log(`${chalk.yellow("正在连接git仓库===")}`);
    shell.exec(`
        git init && 
        git remote add origin ${gitSite} &&
        git add . &&
        git commit . &&
        git push -u origin master
    `);
    this.log(`${chalk.green("仓库已连接 🌟🌟🌟")}`);
    this.log(`${chalk.blue("开始安装依赖===")}`);
    shell.exec("npm install");
    this.log(`${chalk.green("依赖安装完毕 🌟🌟🌟")}`);
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
