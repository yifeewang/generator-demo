

## 安装

安装开发依赖
````bash
yarn
````
安装运行依赖
````bash
cd miniapp
yarn
````
> 如果上传小程序时遇到Packed fail. "errorMessage": "使用tnpm安装依赖可能导致上传时构建失败，请使用 \"tnpm i --by=yarn\" 安装依赖"。可以用yarn安装mini-ali-ui不要用npm install。
> 现在改成在dist目录用小程序工具安装依赖，就不用再src目录安装了，也不会复制到dist。同时dist路径清空时忽略node_modules目录。
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

