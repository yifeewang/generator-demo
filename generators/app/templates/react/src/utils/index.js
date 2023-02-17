import CryptoJS from 'crypto-js';
import md5 from 'js-md5';
// #定义常量key、iv 此常量后端提供
const _KEV = 'iHATLhQo0zln1508';
const _IV = 'iHATLhQo0zln1508';

// #定义AES加密方法 
// #返回加密后的字符串 后续接口参数content要用到
// #参数data 需要加密的js对象 例如{a:2,b:'code'}
export const encrypt = (data = {}) => {
  const key = CryptoJS.enc.Utf8.parse(_KEV);
  const iv = CryptoJS.enc.Utf8.parse(_IV);
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key,
    {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return encrypted.toString(); // 返回的是base64格式的密文 
}

// #定义AES解密方法 
// #参数encrypted 需要解密的字符串
export const decrypt = (encrypted) => {
  const key = CryptoJS.enc.Utf8.parse(_KEV);
  const iv = CryptoJS.enc.Utf8.parse(_IV);
  const decrypted = CryptoJS.AES.decrypt(encrypted, key,
    {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// #md5加密 后续接口签名参数sign需要用到
// #返回content+盐(常量)+时间戳拼接起来然后md5转化后的字符串；
// #参数content AES加密后的字符串
// #time 时间戳
export const md5ForFy = (content, time) => {
  const SALT = '3afn4UpdQzENHhZji1jC';//加盐 此常量后端提供
  const s = content + SALT + time;
  return md5(s);
}

export const SUCESS_CODE = 100000
export const REFRESH_CODES = [110100, 110709, 110705, 110704, 110402, 110700]

class initLoading {
    constructor() {
        this.isLoading = false
        this.myContent = ''
    }
    showLoading(text = '') {
        this.isLoading = true
        this.myContent = text
    }
    hideLoading() {
        this.isLoading = false
        this.myContent = ''
    }
}

class initToast {
    showToast(msg, duration) {
        duration = isNaN(duration) ? 2000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "max-width:80%; background: #000; opacity: 0.6; height: auto; min-height: 30px; color: #fff; line-height: 30px; text-align: center; border-radius: 4px; position: fixed;top: 45%; left: 50%; transform: translateX(-50%); font-size: 16px;padding: 5px 10px;z-index: 9999;"
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
            m.style.webkitTransition = 'opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    }
}

export const myLoading = new initLoading()
export const myToast = new initToast()

// 日期格式化
export const formatDate = (date, fmt = 'YYYY-MM-dd HH:mm:ss') => {
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
        'S': date.getMilliseconds() // 毫秒
    };
    const week = {
        '0': '/u65e5',
        '1': '/u4e00',
        '2': '/u4e8c',
        '3': '/u4e09',
        '4': '/u56db',
        '5': '/u4e94',
        '6': '/u516d'
    };
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[date.getDay() + '']);
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};

export const terminal = () => {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        return 'android'
    } else {
        return 'ios'
    }
}
export const getImageUrl = (name) => {
    return `../../images/${name}`
};

export const titles = { //弹窗标题
    "title1": "https://mdn.alipayobjects.com/merchant_appfe/afts/img/A*GKdsS6PCJF0AAAAAAAAAAAAADiR2AQ/.png", // 亲，活动尚未开始
    "myGiftTitle": "恭喜获得", // 我的奖品
    "emailTitle": "填写收货信息", // 活动太火爆了
    "emailErrTitle": "领取失败", // 红包抢光啦
    "warmTitle": "温馨提示", // 恭喜获得
}

export const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// 函数节流
export const throttle = (fn, gapTime) => {
    if (gapTime == null || gapTime == undefined) {
        gapTime = 1500;
    }
    let _lastTime = null;
    // 返回新的函数
    return function () {
        const _nowTime = +new Date();
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments); // 将this和参数传给原函数
            _lastTime = _nowTime;
        }
    };
}
// 非法字符校验
export const isEmojiCharacter = (substring, type) => {
    if (substring) {
        var reg = new RegExp('[~#^$@%&!?%*]', 'g');
        if (substring.match(reg) && type === 1) {
            return true;
        }

        var regExp = /^[\u4e00-\u9fa5_a-zA-Z0-9\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]+$/;
        if (!regExp.test(substring)) {
            return true;
        }

        for (var i = 0; i < substring.length; i++) {
            var hs = substring.charCodeAt(i);
            if (0xd800 <= hs && hs <= 0xdbff) {
                if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        return true;
                    }
                }
            } else if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                if (ls == 0x20e3) {
                    return true;
                }
            } else {
                if (0x2100 <= hs && hs <= 0x27ff) {
                    return true;
                } else if (0x2b05 <= hs && hs <= 0x2b07) {
                    return true;
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    return true;
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true;
                } else if (
                    hs == 0xa9 ||
                    hs == 0xae ||
                    hs == 0x303d ||
                    hs == 0x3030 ||
                    hs == 0x2b55 ||
                    hs == 0x2b1c ||
                    hs == 0x2b1b ||
                    hs == 0x2b50
                ) {
                    return true;
                }
            }
        }
    }
};

// 手机号校验
export const validateMoblie = (str) => {
    const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
    if (!str) {
        return false;
    }
    if (str.length < 11 || !reg.test(str)) {
        // myToast.showToast('请输入正确的手机号');
        return false;
    }
    return true;
};

export const handleUrl = (url, channel) => {
    if (!url) {
        return ''
    }
    if (url.indexOf('FromSource') != -1 || url.indexOf('sourceId') != -1) {
        return url
    }
    if (url.indexOf('alipays') != -1 && url.indexOf('query') != -1) {
        return url + `%26FromSource%3D${channel}`
    }
    if (url.indexOf('alipays') != -1 && url.indexOf('query') == -1) {
        return url + `&query=FromSource%3D${channel}`
    }
    if (url.indexOf('?') != -1) {
        return url + `&FromSource=${channel}`
    }
    return url + `?FromSource=${channel}`
}