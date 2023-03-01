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
    /**
     * @params project
     * @type {string}
     * miniapp
     * react
     * react-redux
     * vue2
     * vue3
     */
    this.option("project", {
      type: String,
      description: "project name",
      default: "miniapp",
      alias: "p",
      hide: true,
      storage: true
    });
  }

  /**
   * Help
   * @returns help message
   */
  help() {
    return `
    Usage:
        yo gycli [options] | yo gycli:pages [options]
    Options:
       -p   --project        # includes miniapp react react-redux vue2 vue3
       --help           # Print the generator's options and usage
       --version        # Print the generator's version
    `;
  }

  /**
   * Initializing
   */
  initializing() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the GY-CreateApp ${chalk.red("generator-gycli")} generator!`
      )
    );
  }

  /**
   * Prompting with user actions
   * @returns promise
   */
  prompting() {
    const prompts = appPrompts(this.options.project);

    return this.prompt(prompts).then(answers => {
      // To access props later use this.props.someAnswer;
      console.log("answers", answers);
      this.answers = answers;
    });
  }

  /**
   * Fs writing
   * copy template files to destination path
   */
  async writing() {
    const { appName } = this.answers;
    this.fs.copyTpl(
      this.templatePath(`${this.options.project}`),
      this.destinationPath(`${appName}`),
      this.answers
    );
    // 转换输出文件
    lintStyle(this);
  }

  /**
   * End
   * use shell to run commands
   * to link git ant install npm modules
   */
  end() {
    const { appName, gitSite } = this.answers;
    shell.cd(`${this.destinationRoot()}/${appName}`);
    this.log(`${chalk.yellow("正在连接git仓库===")}`);
    shell.exec(`
        git init && 
        git remote add origin ${gitSite} &&
        git add . &&
        git commit -m 'feat(创建项目): 初始化项目' --no-verify &&
        git push -u origin master
    `);
    this.log(`${chalk.green("仓库已连接 🌟🌟🌟")}`);
    this.log(`${chalk.blue("开始安装依赖===")}`);
    if (!shell.which("nrm")) {
      shell.exec(`
            npm install nrm -g &&
            nrm use taobao
        `);
    }

    shell.exec("npm install");
    this.log(`${chalk.green("依赖安装完毕 🌟🌟🌟")}`);
    if (this.options.project === "miniapp") {
      shell.cd(`./miniapp`);
      this.log(`${chalk.blue("开始安装miniapp依赖===")}`);
      shell.exec("npm install");
      this.log(`${chalk.green("miniapp依赖安装完毕 🌟🌟🌟")}`);
      shell.cd(`../`);
      this.log(`${chalk.blue("开始构建dist===")}`);
      shell.exec("npm run build:test");
      this.log(`${chalk.green("dist构建完毕 🌟🌟🌟")}`);
      shell.cd(`./dist`);
      this.log(`${chalk.blue("开始安装dist依赖===")}`);
      shell.exec("npm install");
      this.log(`${chalk.green("dist依赖安装完毕 🌟🌟🌟")}`);
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
