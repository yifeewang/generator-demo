# generator-gyc [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> generator-gyc

## Installation

First, install [Yeoman](http://yeoman.io) and generator-gyc using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

已发布则进行如下步骤：
```bash
npm install -g yo
npm install -g generator-gyc
```

Then generate your new project:

 yo gyc === yo gyc -p miniapp === yo gyc --project miniapp

```bash
yo gyc // 小程序
//等同于
yo gyc -p miniapp // 小程序

//也可以是下面这样

yo gyc -p react // react

yo gyc -p vue // vue

```

未发布则：
```bash
npm install -g yo
npm link
```

Then generate your new project:

```bash
yo gyc
```
## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [yifeewang]()


[npm-image]: https://badge.fury.io/js/generator-gyc.svg
[npm-url]: https://npmjs.org/package/generator-gyc
[travis-image]: https://travis-ci.com/yifeewang/generator-gyc.svg?branch=master
[travis-url]: https://travis-ci.com/yifeewang/generator-gyc
[daviddm-image]: https://david-dm.org/yifeewang/generator-gyc.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/yifeewang/generator-gyc
