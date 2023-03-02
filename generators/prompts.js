const commonPrompts = () => {
  return [
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
          value: "fuyao" // 扶摇
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
        "fuyao",
        "lightFire",
        "rechargePlugin",
        "subscribe",
        "lifeFllow"
      ],
      store: true
    }
  ];
};

const appPrompts = project => {
  return [
    {
      type: "input",
      name: "appName",
      message: "请输入你想创建的项目名称?",
      default: "my-app",
      store: true
    },
    {
      when: () => project === "miniapp",
      type: "input",
      name: "appid",
      message: "请输入小程序appid?",
      default: "appid",
      store: true
    },
    {
      type: "input",
      name: "gitSite",
      message: "请输入你创建的git仓库地址?",
      default: "",
      validate: value =>
        value.includes(".git") ? true : `please input correct git site`,
      store: true
    },
    ...commonPrompts(),
    {
      when: () => project === "miniapp",
      type: "confirm",
      name: "minidev",
      message: "do u need minidev into ur project?",
      default: true,
      store: true
    },
    {
      when: opts => opts.minidev,
      type: "input",
      name: "devPhone",
      message: "please input the developer's phone",
      default: "13642354445",
      store: true
    },
    {
      when: opts => opts.minidev,
      type: "input",
      name: "testPhone",
      message: "please input the tester's phone",
      default: "18966667777",
      store: true
    },
    {
      when: opts => opts.minidev,
      type: "input",
      name: "secret",
      message: "please input the dingding's SECRET",
      default:
        "SECcd107ee5bfbeb957f3ba88c822a47821c3fcb53a74bb97ed27b00b96b60b4349",
      store: false
    },
    {
      when: opts => opts.minidev,
      type: "input",
      name: "accessToken",
      message: "please input the dingding's access_token",
      default:
        "5d642c4b8bda5d8ec2472e0df10b7484eaea998df89647f1474e5442be9943ae",
      store: false
    }
  ];
};

const pagePrompts = () => {
  return [
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
    ...commonPrompts()
  ];
};

module.exports = {
  appPrompts,
  pagePrompts
};
