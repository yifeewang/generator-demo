# generator-gycli [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> generator-gycli

## Installation

First, install [Yeoman](http://yeoman.io) and generator-gycli using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

已发布则进行如下步骤：
```bash
npm install -g yo
npm install -g generator-gycli
```

Then generate your new project:

 yo gycli === yo gycli -p miniapp === yo gycli --project miniapp

```bash
yo gycli // 小程序
//等同于
yo gycli -p miniapp // 小程序

//也可以是下面这样

yo gycli -p react // react

yo gycli -p vue // vue

```

未发布则：
```bash
npm install -g yo
npm link
```

Then generate your new project:

```bash
yo gycli
```
## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [yifeewang]()


[npm-image]: https://badge.fury.io/js/generator-gycli.svg
[npm-url]: https://npmjs.org/package/generator-gycli
[travis-image]: https://travis-ci.com/yifeewang/generator-gycli.svg?branch=master
[travis-url]: https://travis-ci.com/yifeewang/generator-gycli
[daviddm-image]: https://david-dm.org/yifeewang/generator-gycli.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/yifeewang/generator-gycli
