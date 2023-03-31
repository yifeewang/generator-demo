

## 安装

安装开发依赖
````bash
yarn
````
安装运行依赖
````bash
cd src
yarn
````

## 注意（1）：
  ◦  域名白名单 包括接口请求，小金盒h5域名（跳转海星规则页）
  ◦  云码任务渠道 开发测试阶段用
  ◦  星火展位码（测试、生产两套）
  ◦  星火banner插件订购、设置联调版本
  ◦  appId （后端在扶摇配置渠道user/info才可以正常调用）
  ◦  小程序开发者（ 报支付宝账号给产品）
  ◦  埋点

## 注意（2）：
app.js 里面 globalData里面acCode仅供demo使用，需要手动替换

## 运行
````bash
# 编译并监听
$ npm run dev:dev
$ npm run dev:test
$ npm run dev:test2
$ npm run dev:prod 

# 清空dist目录，编译
$ npm run build:dev
$ npm run build:test
$ npm run build:test2
$ npm run build:prod
````

## 项目结构

### 分包

- pages 主包
  - index 首页
  - withDraw 提现
  
- packageList 分包目录
  - pages
    - record 收支明细



## 版本记录
见[VERSION.md](./VERSION.md)

