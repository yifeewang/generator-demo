/**
 * 节流
 * @param {*} fn 
 * @param {*} timer 
 * @returns 
 */
export const throttle = (fn, timer = 500) => {
    let preTime;
    return function (params) {
        const nowTime = new Date();
        if (!preTime || nowTime - preTime > timer) {
            fn.call(this, params);
            preTime = nowTime;
        }
    };
};

/**
 * 函数防抖
 * @param {*} func 
 * @param {*} wait 
 * @returns 
 */
export const debounce = (func, wait) => {
    let timer;
    return function () {
        const context = this; // 注意 this 指向
        const args = arguments; // arguments中存着e

        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
};

// 判断版本
export const checkVersion = () => {
    try {
        const currentVersion = my.SDKVersion || {}; // 获取当前版本号
        const currVersionArray = currentVersion.split("."); // 分割成数组
        const BASE_VERSION = ["1", "8", "0"]; // 定义基础版本
        for (const index in BASE_VERSION) {
            if (Number(currVersionArray[index]) > Number(BASE_VERSION[index])) {
                return true;
            } else if (
                Number(currVersionArray[index]) === Number(BASE_VERSION[index])
            ) {
                if (index === BASE_VERSION.length - 1) {
                    return true;
                }
                continue;
            } else {
                return false;
            }
        }
    } catch (err) {
        return false;
    }
};

export const qs = {
    /**
     * 
     * @param {string} str url
     * @returns 
     */
    _parse: (str = "") => {
        const arr = str.split("?");
        const obj = {};
        arr.forEach((item) => {
            const index = item.indexOf("=");
            if (index == -1) {
                return true;
            }
            const key = item.slice(0, index);
            const val = item.slice(index + 1);
            obj[key] = val;
        });
        return obj;
    },
    /**
     * 
     * @param {string} str url
     * @returns 
     */
    parse: (str = "") => {
        const arr = str.split("&");
        const obj = {};
        arr.forEach((item) => {
            const index = item.indexOf("=");
            if (index == -1) {
                return true;
            }
            const key = item.slice(0, index);
            const val = item.slice(index + 1);
            obj[key] = val;
        });
        return obj;
    },
    /**
     * 
     * @param {string} str url
     * @returns 
     */
    parseUrl: (str = "") => {
        const query = str.split("?")[1];
        if (!query) {
            return {};
        }
        const obj = {};
        const arr = query.split('&');
        arr.forEach((item) => {
            const index = item.indexOf("=");
            if (index == -1) {
                return true;
            }
            const key = item.slice(0, index);
            const val = item.slice(index + 1);
            obj[key] = val;
        });
        return obj;
    },
    /**
     * 
     * @param {object} obj 
     * @returns
     */
    stringify: (obj = {}) => {
        const arr = [];
        for (const key in obj) {
            arr.push(key + "=" + obj[key]);
        }
        return arr.join("&");
    },
    /**
     * 
     * @param {object} obj 
     * @returns
     */
    encodeQuery: (obj = {}) => {
        return encodeURIComponent(qs.stringify(obj));
    },
    /**
     * 
     * @param {object} query 
     * @returns 
     */
    getFilterQuery: (query = {}) => {
        const newObj = { ...query };
        if (newObj.accessCode) {
            delete newObj.accessCode;
        }
        if (newObj.code) {
            delete newObj.code;
        }
        if (newObj.loginType) {
            delete newObj.loginType;
        }
        if (newObj.sysCode) {
            delete newObj.sysCode;
        }
        return qs.encodeQuery(newObj);
    }
};
// 日期格式化
/**
 * 
 * @param {Date} date 
 * @param {string} fmt YYYY-MM-dd HH:mm:ss
 * @returns 
 */
export const formatDate = (date, fmt = "YYYY-MM-dd HH:mm:ss") => {
    if (date == null) return null;
    if (typeof date === "string") {
        date = date.slice(0, 19).replace("T", " ").replace(/-/g, "/");
        date = new Date(date);
    } else if (typeof date === "number") {
        date = new Date(date);
    }
    const o = {
        "[Yy]+": date.getFullYear(), // 年
        "M+": date.getMonth() + 1, // 月份
        "[Dd]+": date.getDate(), // 日
        "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
        "H+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
    };
    const week = {
        0: "/u65e5",
        1: "/u4e00",
        2: "/u4e8c",
        3: "/u4e09",
        4: "/u56db",
        5: "/u4e94",
        6: "/u516d",
    };
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (RegExp.$1.length > 1
                ? RegExp.$1.length > 2
                    ? "/u661f/u671f"
                    : "/u5468"
                : "") + week[date.getDay() + ""]
        );
    }
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
};
//判断时间是否在本月
/**
 * 
 * @param {Date} inDate 
 * @returns 
 */
export const isSameMonth = function (inDate) { // inDate 是一个date对象
    let nowDate = new Date();
    return ((nowDate.getFullYear() == new Date(inDate).getFullYear()) &&
        (nowDate.getMonth() == new Date(inDate).getMonth())
    );
};

//判断时间是否在本周
export const isSameWeek = function (inDate) { // inDate 是一个date对象
    let inDateStr = new Date(inDate).toLocaleDateString(); // 获取如YYYY/MM/DD的日期
    let nowDate = new Date();
    let nowTime = nowDate.getTime();
    let nowDay = nowDate.getDay();
    for (let i = 0; i < 7; i++) {
        if (inDateStr == (new Date(nowTime + (i - nowDay) * 24 * 3600 * 1000)).toLocaleDateString()) return true;
    }
    return false;
};
//获取星期几
export const getWeekDate = (date) => {
    const day = new Date(date).getDay();
    const weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const week = weeks[day];
    return week;
};
//获取当天零点
export const getTodayZeroTime = (date) => {
    return new Date(new Date().toLocaleDateString()).getTime();
};
//判断时间是否在当天
export const isToday = (date) => {
    return new Date().toDateString() === new Date(date).toDateString();
};
//判断时间是否在昨天
export const isYestday = (theDate) => {
    const date = new Date();
    const yesterday = new Date(date - 1000 * 60 * 60 * 24);
    const test = new Date(theDate);
    if (yesterday.getYear() === test.getYear() && yesterday.getMonth() === test.getMonth() && yesterday.getDate() === test.getDate()) {
        return true;
    } else {
        return false;
    }
};

// 获取月份的天数
export const getMonthDays = (year, month) => {
    let stratDate = new Date(year, month - 1, 1);
    let endData = new Date(year, month, 1);
    let days = (endData - stratDate) / (1000 * 60 * 60 * 24);
    return days;
};

export const compare = (property) => {
    return function (a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value2 - value1;
    };
};

export const compareContrary = property => {
    return function (a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value1 - value2;
    };
};

// 验证身份证是否正确
export const validateSFZ = (str) => {
    if (!str) {
        return false;
    }
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!reg.test(str)) {
        return false;
    }
    return true;
};

export const checkIdCard = (idCard) => {
    // 检验身份证是否合法
    let res = false;
    let cardArray = idCard.split("");
    let lastId = cardArray[17];
    let idArray = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let sum = 0;
    let j = 0;
    for (let i = 0; i < cardArray.length - 1; i++) {
        sum += parseFloat(cardArray[i]) * parseFloat(idArray[i]);
        j = parseFloat(j) + parseFloat(1);
    }
    let ss = sum % 11;
    // 0－1－2－3－4－5－6－7－8－9－10
    // 1－0－X －9－8－7－6－5－4－3－2
    let checksArray = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    if (checksArray[ss] == lastId.trim()) {
        res = true;
    }
    return res;
};

// 比较版本号(多段式  xx.xx.xx, v1和v2长度一致即可)
export const compareVersion = (v1, v2) => {
    try {
        const arr1 = v1.split(".");
        const arr2 = v2.split(".");
        const len = arr1.length;

        for (let i = 0; i < len; i++) {
            const l1 = Number(arr1[i]);
            const l2 = Number(arr2[i]);
            if (l1 < l2) {
                return -1;
            } else if (l1 > l2) {
                return 1;
            }
        }
        return 0;
    } catch (err) {
        return 0;
    }
};

export const formatString = (target) => {
    if (!target) return null;
    return typeof target === 'string' ? JSON.parse(target) : target;
};
// 手机号校验
export const isPhoneNumber = (phoneNum) => {
    let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    return reg.test(phoneNum);
};

// 电信手机号校验
export const isDxPhoneNumber = (phoneNum) => {
    /*
      * 移动号码包括的号段：134/135/136/137,138,139；
    *                     147/148(物联卡号)；
    *                     150/151/152/157/158/159；
    *                     165（虚拟运营商）；
    *                     1703/1705/1706（虚拟运营商）、178；
    *                     182/183/184/187/188
    *                     198

    * 联通号段包括：130/131
    *               145
    *               155/156
    *               166/167(虚拟运营商)
    *               1704/1707/1708/1709、171
    *               186/186
    *
    * 电信号段包括： 133
    *                153
    *                162(虚拟运营商)
    *                1700/1701/1702(虚拟运营商)
    *                180/181/189
    *                191/199
    * */
    let reg = /(^189|^181|^180|^177|^153|^133|^1890|^1330|^1700|^173|^1701|^1702|^199|^191)\d{8}$/;
    return reg.test(phoneNum);
};

// 数组去重 arr：数组;key:根据数组中为key的键名去重
export const filterArr = (arr, key) => {
    let hash = {};
    return arr.reduce((ss, item) => {
        // eslint-disable-next-line no-unused-expressions
        hash[item[key]] ? '' : (hash[item[key]] = true && ss.push(item));
        return ss;
    }, []);
};

export const getCurrentPageUrl = () => {
    const pages = getCurrentPages(); //获取加载的页面
    const currentPage = pages[pages.length - 1] || {}; //获取当前页面的对象
    const url = currentPage.route; //当前页面url
    const channel = currentPage.data?.query?.channel || currentPage.data?.channel || '';
    const uid = currentPage.data?.uid || getApp().globalData?.uid;
    return { url, channel, uid };
};

export const sortByASCII = (obj) => {
    let arr = Object.keys(obj);
    let sortArr = arr.sort();
    let sortObj = {};
    for (let i in sortArr) {
        sortObj[sortArr[i]] = obj[sortArr[i]];
    }
    return sortObj;
};

// 推啊广告事件上报
export const reportAdvertisingEvents = async (event, item, choosePrizeInfo = {}) => {
    // 若item为空，则取choosePrizeInfo信息
    const { advertInfo, prizeExt2 } = item;
    const newAdvertInfo = choosePrizeInfo.advertInfo;
    const formatPrizeExt2 = formatString(prizeExt2);
    const newFormatPrizeExt2 = formatString(choosePrizeInfo.prizeExt2);
    const params = {
        event,
        orderId:
            (advertInfo && advertInfo.orderId) ||
            (newAdvertInfo && newAdvertInfo.orderId),
        projectId:
            (formatPrizeExt2 && formatPrizeExt2.projectId) ||
            (newFormatPrizeExt2 && newFormatPrizeExt2.projectId),
        advertId:
            (formatPrizeExt2 && formatPrizeExt2.advertId) ||
            (newFormatPrizeExt2 && newFormatPrizeExt2.advertId),
    };
    if (!advertInfo && !newAdvertInfo) return;
    const api = require('/apis/api');
    await api.reportAdvertisingEvents(params);
};

export const handleTuiAItem = (item) => {
    const isTuiAdevertising =
        item.prizeType === "TUIA_ADVERT" &&
        item.advertInfo; // 是否是推啊广告
    const isTuiDoudi =
        item.prizeType === "TUIA_ADVERT" &&
        !item.advertInfo; // 是否是推啊兜底
    const prize_AdvertInfo = {};
    prize_AdvertInfo.type = isTuiAdevertising
        ? "1"
        : isTuiDoudi
            ? "2"
            : "3"; // 用于区分埋点是否为推啊接口
    prize_AdvertInfo.name = isTuiAdevertising
        ? item.advertInfo.title
        : item?.prizeName;
    return {
        ...item,
        prizeExt2: item.prizeExt2
            ? JSON.parse(item.prizeExt2)
            : {},
        isTuiAdevertising,
        prize_AdvertInfo,
    };
};

// 将原始链接处理成转链链接
export const switchOriginLinkToJSONStr = (url) => {
    const urlType = validateUrl(url);
    let jsonStr = '';
    if (urlType === 'alipay') {
        const { appId, pageIndex, originalLink } = urlToKeyValue(url);
        if (appId && appId.length === 16) {
            jsonStr = JSON.stringify({
                linkType: 'ZFB_APPLET_LINK',
                appId,
                pageIndex,
                originalLink,
            });
        } else if (appId && appId.length === 8) {
            jsonStr = JSON.stringify({
                linkType: "H5_LINK",
                originalLink,
            });
        } else {

        }
    } else if (urlType === 'h5') {
        jsonStr = JSON.stringify({
            linkType: "H5_LINK",
            originalLink: url,
        });
    } else {

    }

    return jsonStr;
};
function urlToKeyValue(url2) {
    const url = decodeURIComponent(decodeURIComponent(url2));
    const appId = url.split('?')[1].split('&')[0].split('=')[1];
    const indexA = url.indexOf('&page='); // 查找&page=的位置
    const indexB = url.indexOf('&query='); // 查找&query=的位置
    let path = (indexB === -1 ? url.slice(indexA + 6) : url.slice(indexA + 6, indexB)).replace(/^\/+/, '');

    let query = '';
    if (indexB > -1) {
        query = encodeURIComponent(url.slice(indexB + 7));
    }

    let pathRoute, pathParam;
    if (path.indexOf('?') > -1) { // 如果有页面参数
        pathRoute = path.slice(0, path.indexOf('?'));
        pathParam = path.slice(path.indexOf('?') + 1);
    } else if (path.indexOf('&') > -1) {
        pathRoute = path.slice(0, path.indexOf('&'));
        pathParam = path.slice(path.indexOf('&') + 1);
    } else {
        pathRoute = path;
        pathParam = '';
    }

    pathParam = pathParam ? "?" + encodeURIComponent(pathParam) : "?" + encodeURIComponent('a=1');
    query = query ? "&query=" + query : "";

    const pageIndex = `${pathRoute}${pathParam}${query}`;

    return {
        appId,
        pageIndex,
        originalLink: `alipays://platformapi/startapp?appId=${appId}&page=${pageIndex}`
    };
}

function validateUrl(url) {
    if (/^(https|http):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(url)) {
        return 'h5';
    } else if (/^alipays:\/\/platformapi\/startapp/.test(url.toLowerCase())) {
        return 'alipay';
    } else {
        return '';
    }
}

function handleTaskData(tasks) {
  let list = []
  tasks.forEach(ele => {
    if (ele.outTaskCommonInfoList && ele.outTaskCommonInfoList.length) {
      ele.outTaskCommonInfoList.forEach(item => {
        if (item.taskType === 7) {
          list.push({
            ...ele,
            name: item.outTaskTitle || ele.taskSubject,
            desc: item.outTaskSubTitle || ele.taskSubSubject,
            image: ele.taskImgUrl,
            taskJumpUrl: item.jumpUrl || ele.taskJumpUrl,
            browseTime: item.browseTime || ele.browseTime,
            unionTaskInfo: item
          })
        } else if (item.taskType === 11) {
          list.push({
            ...ele,
            name: item.outTaskTitle || ele.taskSubject,
            desc: `浏览${item.browseTime}秒领取奖励`,
            image: item.outTaskImageUrl || ele.taskImgUrl,
            taskJumpUrl: item.jumpUrl || ele.taskJumpUrl,
            browseTime: item.browseTime || ele.browseTime,
            unionTaskInfo: item,
          })
        } else {
          list.push({
            ...ele,
            name: item.outTaskTitle || ele.taskSubject,
            desc: item.outTaskSubTitle || ele.taskSubSubject,
            image: item.outTaskImageUrl || ele.taskImgUrl,
            taskJumpUrl: item.jumpUrl || ele.taskJumpUrl,
            browseTime: item.browseTime || ele.browseTime,
            unionTaskInfo: item,
          })
        }
      })
    } else {
      list.push({
        ...ele,
        name: ele.taskSubject,
        desc: ele.taskSubSubject,
        image: ele.taskImgUrl,
      })
    }

  })

  // 对接任务插件-处理UI
  list = list.map(ele => {
    return {
      ...ele,
      itemBgColor: '#fff',
      btnColor: 'linear-gradient(90deg, #FF7D2F 0%, #FF4B19 100%), #D8D8D8;',
      textColor: '#fff',
      btnText: '去完成',
      btnTips: '锦鲤卡' + ele.sumRewardValue,
      taskDoneStyle: ''
    }
  })

  return list
}
