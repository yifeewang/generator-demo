// const Mock = require('mockjs');
import Mock from 'mockjs';
const Random = Mock.Random; // 是一个工具类，用于生成各种随机数据

// 设置延时
Mock.setup({
  timeout: '200-600',
});

/* const data = Mock.mock({
  'list|1-10': [
    {
      'id|+1': 1,
      name: '张三',
    },
  ],
});

export default [
  {
    url: '/mock/data',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 0,
        data,
      };
    },
  },
]; */

// =============
const mockDate1 = function () {
  let data = []; // 用于接受生成数据的数组
  for (let i = 0; i < 10; i++) {
    // 可自定义生成的个数
    let template = {
      name: Random.name(), // 生成地址,
      string: Random.string(2, 10), // 生成2到10个字符之间的字符串
      date: Random.date(), // 生成一个随机日期,可加参数定义日期格式
    };
    data.push(template);
  }
  return {
    data: data,
  };
};
Mock.mock('/mock/data', 'get', mockDate1); // 根据数据模板生成模拟数据

// mock一组文章数据
const mockArticleData = function () {
  let articles = [];
  for (let i = 0; i < 10; i++) {
    let newArticleObject = {
      title: Random.csentence(5, 30), //  Random.csentence( min, max )
      thumbnail_pic_s: Random.dataImage('300x250', 'mock的图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
      author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
      date: Random.date() + ' ' + Random.time(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
    };
    articles.push(newArticleObject);
  }
  return {
    data: articles,
  };
};
Mock.mock('/mock/article', 'get', mockArticleData);
