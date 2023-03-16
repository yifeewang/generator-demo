"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const shell = require("shelljs");
const fs = require("fs");
const lintStyle = require("../lintStyle");
const { appPrompts } = require("../prompts");
const { mkdirsSync } = require("../tool");
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
    /**
     * 可忽视该方法
     * .开头的文件 copyTpl 无法复制 需要特殊处理
     * 已通过 globOptions 解决
     */
    this.fileTask = () => {
      const { appName } = this.answers;
      const tp = this.templatePath(`other/${this.options.project}`);
      const dp = this.destinationPath(`${appName}`);
      const files = fs.readdirSync(tp);
      if (!files) return;
      files.forEach(file => {
        const tp1 = `${tp}/${file}`;
        const dp1 = `${dp}/${file}`;
        // 递归判断是否已经存在文件夹
        mkdirsSync(dp);
        fs.copyFileSync(tp1, dp1);
      });
      mkdirsSync(dp);
    };
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
      this.answers = answers;
    });
  }

  /**
   * Fs writing
   * copy template files to destination path
   */
  async writing() {
    const { appName, minidev } = this.answers;
    this.fs.copyTpl(
      this.templatePath(`${this.options.project}`),
      this.destinationPath(`${appName}`),
      this.answers,
      {},
      {
        globOptions: {
          dot: true,
          ignore: minidev
            ? []
            : [
                `${this.templatePath(`${this.options.project}`)}/minidev/**/*`,
                `${this.templatePath(`${this.options.project}`)}/.gitlab-ci.yml`
              ]
        }
      }
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
      this.log(`${chalk.blue("开始构建dist===")}`);
      shell.exec("npm run build:prod");
      this.log(`${chalk.green("dist构建完毕 🌟🌟🌟")}`);
      shell.cd(`./dist`);
      this.log(`${chalk.blue("开始安装dist依赖===")}`);
      shell.exec("npm install");
      this.log(`${chalk.green("dist依赖安装完毕 🌟🌟🌟")}`);
      shell.cd(`../`);
    }
  }
};
