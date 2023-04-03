# generator-gyc 
> generator-gyc
## Installation

已发布则进行如下步骤：
**安装**
```bash
npm install -g yo
npm install -g generator-gyc
```

**使用generator创建项目**
```bash
yo gyc // 默认是小程序

//也可以指定框架
yo gyc -p miniapp // 小程序
yo gyc -p react // react
yo gyc -p vue // vue
```

**使用sub-generator创建页面**
yo gyc:pages


**notice**:
>   1.使用cli前 建议先创建好小程序因为需要填写appid

>   2.如果要使用minidev

>       先在钉钉添加机器人，准备好 access_token（token） 和 密钥（SECRET）

>       准备好开发和测试手机号码

>       如果没准备好的话，可以乱填，不过后续就得手动修改了

## Getting To Know Yeoman
 * [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [yifeewang]()


[npm-image]: https://badge.fury.io/js/generator-gyc.svg
[npm-url]: https://npmjs.org/package/generator-gyc
[travis-image]: https://travis-ci.com/yifeewang/generator-gyc.svg?branch=master
[travis-url]: https://travis-ci.com/yifeewang/generator-gyc
[daviddm-image]: https://david-dm.org/yifeewang/generator-gyc.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/yifeewang/generator-gyc
