// import { GET_UID } from '@/api/api.js';
// import { Toast } from 'mint-ui';
//判断对象是否没有属性，如{}或者[]
export function isEmptyObj(o) {
  for (var attr in o) return !1;
  return !0;
}

export const switchTimeStamp = (timeStamp, fmt = '年月日') => {
  const time = new Date(timeStamp);
  const year = time.getFullYear(); //年
  const month = time.getMonth() + 1; //月
  const day = time.getDate(); // 日
  const hour = time.getHours();
  const minutes = time.getMinutes();
  const second = time.getSeconds();
  return `${year}年${month}月${day}日`;
};

function processArray(arr) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === null || arr[i] === undefined) arr.splice(i, 1);
    else if (typeof arr[i] == 'object') removeNullItem(arr[i], arr, i);
  }
  return arr.length == 0;
}

function proccessObject(o) {
  for (var attr in o) {
    if (!o[attr] || o[attr] == ' ') delete o[attr];
    else if (typeof o[attr] == 'object') {
      removeNullItem(o[attr]);
      if (isEmptyObj(o[attr])) delete o[attr];
    }
  }
}

function removeNullItem(o, arr, i) {
  var s = {}.toString.call(o);
  if (s == '[object Array]') {
    if (processArray(o) === true) {
      //o也是数组，并且删除完子项，从所属数组中删除
      if (arr) arr.splice(i, 1);
    }
  } else if (s == '[object Object]') {
    proccessObject(o);
    if (arr && isEmptyObj(o)) arr.splice(i, 1);
  }
}

//获取手机型号
export function terminal() {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    return 'android';
  } else {
    return 'ios';
  }
}
export function getNetWorkType() {
  var ua = navigator.userAgent;
  var res = ua.match(/\(nt:([^,\)]*)(,|\))/);
  if (res) {
    // MDN(res[1]);
    console.log(res);
    return res[1];
  } else {
    // MDN('other');
    return 'other';
  }
}

export function setTitle(title) {
  if (title) {
    document.title = title;
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/AlipayClient/i.test(userAgent) && ant) {
      ant.setTitle(title);
    }
  }
}

export const throttle = (fn, gapTime) => {
  if (gapTime == null || gapTime == undefined) gapTime = 1500;
  let _lastTime = null;
  return function () {
    // 返回新的函数
    let _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments); //将this和参数传给原函数
      _lastTime = _nowTime;
    }
  };
};

const ready = () => {
  return new Promise(resolve => {
    // 如果jsbridge已经注入则直接调用
    if (window.AlipayJSBridge) {
      resolve();
    } else {
      // 如果没有注入则监听注入的事件
      document.addEventListener('AlipayJSBridgeReady', resolve, false);
    }
  });
};

export const getAuthCodeBySdk = () => {
  return new Promise((resolve, reject) => {
    try {
      AlipayJSBridge.call(
        'getAuthCode',
        {
          scopeNicks: ['auth_base'], // 主动授权：auth_user，静默授权：auth_base
          appId: '2017052707365622', // 开放平台id，需要去开放平台配置域名白名单，才能使用，域名白名单不支持通配符
          showErrorTip: true, // 是否显示出错弹框，默认是true
        },
        function (result) {
          const authcode = result.authcode || result.authCode;
          console.log('获取authCode123: ', authcode);
          if (authcode) {
            resolve(authcode);
          } else {
            console.error('获取authcode失败', result);
            return Promise.reject(null);
          }
        },
      );
    } catch (err) {
      console.error('获取uid失败', err);
      return Promise.reject(null);
    }
  });
};

// 由authCode得到uid
export const getUidByAuthcode = async authCode => {
  console.log('通过authcode换取uid');
  try {
    let params = {
      appId: '2017052707365622',
      authCode: authCode,
      sourceFrom: 'YUEYOU_APP',
    };
    const res = await GET_UID(params);
    console.log(res);
    if (res && res.result) {
      console.log('获取uid成功: ', res.result);
      return res.result;
    } else {
      console.error('获取uid失败', res);
      return Promise.reject(null);
    }
  } catch (err) {
    console.error('获取uid失败', err);
    return Promise.reject(null);
  }
};

// 校验uid
export const validUid = (uid = '') => {
  if (typeof uid === 'string') {
    return /^\d{16}$/.test(uid);
  }
  return false;
};

// 获取uid
export const getUid = async (params = {}) => {
  console.log('获取uid123');
  // 先判断url传参
  if (params.alipayOpenId && validUid(params.alipayOpenId)) {
    console.log('alipayOpenId:', params.alipayOpenId);
    return params.alipayOpenId;
  }

  // 再判断storage
  const storageUid = localStorage.getItem('uid');
  if (storageUid && validUid(storageUid)) {
    console.log('storage.uid:', storageUid);
    return storageUid;
  }

  // 最后重新请求uid
  await ready();
  try {
    if (window.AlipayJSBridge) {
      console.log('通过支付宝sdk获取authcode123');
      const authcode = await getAuthCodeBySdk();
      console.log(887, authcode);
      // const uid = await getUidByAuthcode(authcode);
      // localStorage.setItem('uid', uid);
      // return uid;
    } else {
      console.log('非支付宝环境，无法获取uid');
      return Promise.reject(null);
    }
  } catch (err) {
    console.log(err);
    console.log('获取uid失败');
    return Promise.reject(null);
  }
};

// 整合任务列表数据-云码数据需要挑出来
export const handleTaskListData = taskListBefore => {
  let list = [];
  taskListBefore.map(ele => {
    if (ele.taskType === 7) {
      if (ele.unionTaskResultVOS) {
        ele.unionTaskResultVOS.map(item => {
          list.push({
            ...ele,
            unionTaskObj: item,
          });
        });
      } else {
        list.push(ele);
      }
    } else {
      list.push(ele);
    }
  });
  const taskList = list.map(item => {
    let taskStatus = '';
    if (item.taskStatus === 'DONE' && item.taskCircleCount <= item.finishCount) {
      taskStatus = 'DONE';
    } else {
      taskStatus = '';
    }
    return {
      ...item,
      taskStatus,
    };
  });

  return taskList;
};

export const showToast = msg => {
  Toast({
    message: msg,
    position: 'center',
    duration: 1000,
    className: 'large-font',
  });
};

// 获取DOM元素到顶部的高度，用于做指定滚到到某个元素的位置
export const heightToTop = ele => {
  //ele为指定跳转到该位置的DOM节点
  let root = document.body;
  let height = 0;
  do {
    height += ele.offsetTop;
    ele = ele.offsetParent;
  } while (ele !== root);
  return height;
};
// 根据prop进行指定位置排序
export const defineSort = (arr = [], prop) => {
  if (arr.length == 0) return;
  return arr.sort(function (a, b) {
    // order是规则  arr是需要排序的数du组
    var order = [1, 2, 3, 8, 4, 7, 6, 5];
    // var order = [1, 2, 3, 5, 8, 7, 6, 4];
    return order.indexOf(a[prop]) - order.indexOf(b[prop]);
  });
};
export const compare = property => {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
  };
};
export const uniqueFunc = (arr, uniId) => {
  let res = new Map();
  return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
};

// 日期格式化(YYYY-MM-dd HH:mm:ss-YYYY年MM月DD日)
export const formatDate = (date, fmt = 'YYYY年MM月DD日') => {
  if (date == null) return null;
  if (typeof date === 'string') {
    date = date.slice(0, 19).replace('T', ' ').replace(/-/g, '/');
    date = new Date(date);
  } else if (typeof date === 'number') {
    date = new Date(date);
  }
  const o = {
    '[Yy]+': date.getFullYear(), // 年
    'M+': date.getMonth() + 1, // 月份
    '[Dd]+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  const week = {
    0: '/u65e5',
    1: '/u4e00',
    2: '/u4e8c',
    3: '/u4e09',
    4: '/u56db',
    5: '/u4e94',
    6: '/u516d',
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') +
        week[date.getDay() + ''],
    );
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
    }
  }
  return fmt;
};

export const turnPage = url => {
  if (!url) return;

  try {
    AlipayJSBridge.call('pushWindow', {
      url: url,
      param: {
        readTitle: true,
        showOptionMenu: false,
      },
    });
  } catch (error) {
    console.log(error);
    window.location.href = url;
  }
};
/**
 * 获取uuid 10min内无操作则变更uuid，否则取缓存内uuid
 */
export const getUuidv4 = () => {
  const uuid_v4_info = JSON.parse(localStorage.getItem('uuid_v4_info') || '{}');
  const { uuid_v4, uuid_timestamp } = uuid_v4_info || {};
  const nowTime = new Date().getTime();
  if (nowTime - uuid_timestamp < 10 * 60 * 1000 && uuid_v4) {
    // localStorage.setItem('uuid_v4_info',{})
    localStorage.setItem(
      'uuid_v4_info',
      JSON.stringify({
        uuid_v4,
        uuid_timestamp: new Date().getTime(), // 重置时间戳
      }),
    );
    return uuid_v4;
  }
  const newUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0;
    let v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  localStorage.setItem(
    'uuid_v4_info',
    JSON.stringify({
      uuid_v4: newUuid,
      uuid_timestamp: new Date().getTime(), // 重置时间戳
    }),
  );
  return newUuid;
};
