const appPrompts = () => {
  return [
    {
      type: "rawlist",
      name: "appType",
      choices: [
        {
          value: "react"
        },
        {
          value: "react-redux"
        },
        {
          value: "vue2"
        },
        {
          value: "vue3"
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
      message: "请输入你创建的git仓库地址?",
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

module.exports = {
  appPrompts,
  pagePrompts
};
