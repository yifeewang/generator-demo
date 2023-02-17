import axios from 'axios';
import qs from 'qs';
import {devConfig, testConfig, prodConfig} from './config'
import {encrypt, md5ForFy, myToast} from '../utils'

axios.defaults.timeout = 15000;
axios.interceptors.response.use((res) => {
    return res && res.data;
});
axios.interceptors.request.use((config) => {
    //encrypt === true 处理参数
  if (config.encrypt === true) {
      const config_ = { //需要的参数content、sign、timestamp
        content:'',//AES加密后的字符串
        sign:'', // 签名sign  md5ForFy获取
        timestamp:'' //当前时间戳
      };
      const timestamp = new Date().getTime(); //当前时间戳
      const content = encrypt(config.data?.params);// aes加密
      const sign = md5ForFy(content, timestamp); // 获取签名sign参数
      
        // 组合参数
        config_.timestamp = timestamp;
      config_.content = content;
      config_.sign = sign;
    
      config.data = qs.stringify(config_);
      return config;
  }
  return config;
});

let env_info = ''; // 双V
let env_data = ''; // 埋点
let env_bury = ''; // 星火展位埋点
let env_ad = '';   // 星火展位
let env_fuyao = '' // 扶摇
let nomal_bury = '' // 扶摇
let star_bury = '' // 扶摇

export const rootId = '86SmallAmount';
export const rootIdDY = 'MemberDay_1'  //订阅相关接口用的活动id
export const templateId = 'd9d9340b914643d49d70929297883e4d'  //订阅相关接口用的模板id
export let lunaSessionId = '' // 存在lunaSessionId后则不需传入参uid
export const setLunaSessionId = (val) => {
    lunaSessionId = val
}
export const saveBuryUrl = (obj) => {
    nomal_bury = obj.buryUrl
    star_bury = obj.starBuryUrl
}
export const getUrlParam = (name = '') => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const searchHash = window.location.href.split('?')[1] || '';
    const search = searchHash.split('#')[0] || '';
    const value = search.match(reg);
    if (value !== null) return decodeURI(value[2]);
    return null;
};
export const channel = getUrlParam('channel') || 'self'; // 渠道
export const alipayOpenId = getUrlParam('alipayOpenId') || ''; // uid

export const pushWindow = (url, that) => {
    if (url.indexOf('/') == 0) {
        return that.props.history.push(url)
    } else {
        console.log('pushAlipay', url)
        if (!window.AlipayJSBridge) {
            return myToast.showToast('不是支付宝环境，无法完成跳转')
        } else {
            return window.AlipayJSBridge.call('pushWindow', {
                url,
            });
        }
    }
};

export const envPath = () => {
    const ENV = process.env.REACT_APP_ENV || 'prod';
    switch (ENV) {
        case 'dev':
            env_info = devConfig.doubleV;
            env_data = devConfig.buryData;
            env_ad = devConfig.starHot;
            env_bury = devConfig.starHotBuryData;
            env_fuyao = devConfig.fuyao;
            break;
        case 'test':
            env_info = testConfig.doubleV;
            env_data = testConfig.buryData;
            env_ad = testConfig.starHot;
            env_bury = testConfig.starHotBuryData;
            env_fuyao = testConfig.fuyao;
            break;
        case 'prod':
            env_info = prodConfig.doubleV;
            env_data = prodConfig.buryData;
            env_ad = prodConfig.starHot;
            env_bury = prodConfig.starHotBuryData;
            env_fuyao = prodConfig.fuyao;
            break;
        default:
            env_info = prodConfig.doubleV;
            env_data = prodConfig.buryData;
            env_ad = prodConfig.starHot;
            env_bury = prodConfig.starHotBuryData;
            env_fuyao = prodConfig.fuyao;
            break;
    }
    return { env_info, env_data, env_ad, env_bury, env_fuyao };
};

// 获取不同环境banner码
export const getBannerCode = () => {
    let middleBanner = [];
    let bottomBanner = [];
    let adBanner = ''
    let floatBanner = ''
    const env = process.env.REACT_APP_ENV || 'prod';
    switch (env) {
        case 'dev':
            middleBanner = devConfig.middle_banner_code
            bottomBanner = devConfig.bottom_banner_code
            adBanner = devConfig.ad_banner_code
            floatBanner = devConfig.float_banner_code
            break;
        case 'test':
            middleBanner = devConfig.middle_banner_code
            bottomBanner = devConfig.bottom_banner_code
            adBanner = devConfig.ad_banner_code
            floatBanner = devConfig.float_banner_code
            break;
        case 'prod':
            middleBanner = prodConfig.middle_banner_code
            bottomBanner = prodConfig.bottom_banner_code
            adBanner = prodConfig.ad_banner_code
            floatBanner = prodConfig.float_banner_code
            break;
        default:
            middleBanner = prodConfig.middle_banner_code
            bottomBanner = prodConfig.bottom_banner_code
            adBanner = prodConfig.ad_banner_code
            floatBanner = prodConfig.float_banner_code
            break;
    }
    return { middleBanner, bottomBanner, adBanner, floatBanner }
}
// 扶摇
export const fuyaoRequest = (url, type, params, needHandleUid=true) => {
    const newParams = {...params}
    if(lunaSessionId && needHandleUid) {
        newParams.lunaSessionId = lunaSessionId
        delete newParams.uid
    }
    return axios({
        baseURL: envPath().env_fuyao + url,
        method: type,
        params: {
            rootId,
            ...newParams,
        },
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json',
            charset: 'utf-8',
        },
    });
};
// 查询星火广告位
export const SvAdRequest = (url, type, params = {}, options={}, headers = {}) => {
    return axios({
        baseURL: envPath().env_ad + url,
        method: type,
        params: {
            ...params,
        },
        headers: {
            'Content-Type': 'application/json',
            charset: 'utf-8',
            ...headers,
        },
        ...options
    });
};
// 埋点
export const MD = (param) => {
    const def_param = {
        app_id: '86SmallAmount',
        mobile: 'none',
        browser: 'none',
        spm_time: parseInt(new Date().getTime() / 1000),
        resource_spm: param.spm_value,
        channel,
        other: {
        },
    };
    param.other = JSON.stringify({ ...def_param.other, ...param.other });
    const params = JSON.stringify({ ...def_param, ...param });
    return axios({
        baseURL: nomal_bury,
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
// 星火展位埋点
export const adMD = (param) => {
    console.log('adMD', param)
    const def_param = {
        app_id: '86SmallAmount',
        mobile: 'none',
        browser: 'none',
        spm_time: parseInt(new Date().getTime() / 1000),
        resource_spm: param.spm_value,
        channel,
        other: {
        },
    };
    param.other = JSON.stringify({ ...def_param.other, ...param.other });
    const params = JSON.stringify({ ...def_param, ...param });
    return axios({
        baseURL: star_bury,
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
// 用户疲劳度点击同步接口
export const couponBillJson = (data = {}, options = {}) => {
    return axios({
        baseURL: envPath().env_ad + '/gaoyang/userStatisticsService/dv/1.0/adBill',
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        encrypt: true,
        ...options
    });
}
// 活动相关信息
export const HANDLE_ENCRYPT_UID = (params) => {
    return fuyaoRequest(
        '/app/s/encryption/uid',
        'GET',
        params,
        false
    )
}
// 判断是否是会员
export const JUDGE_IS_MEMBER = (params, headers) => {
    return SvRequest(
        '/user/base/info',
        'GET',
        params,
        headers
    )
}
export const formatString = (target) => {
    if (!target) return null;
    return typeof target === 'string' ? JSON.parse(target) : target;
};
// 推啊广告事件上报
export const fetchReportAdvertisingEvents = (params) => {
    return fuyaoRequest(
        '/app/advert/eventReport',
        'GET',
        params
    )
}
// 推啊广告事件上报
export const reportAdvertisingEvents = async (event, model) => {
    console.log('推啊广告事件上报');
    console.log(model);

    const { advertInfo, prizeExt2 } = model;
    console.log(advertInfo, prizeExt2);

    const formatPrizeExt2 = formatString(prizeExt2) || '';

    const params = {
        event,
        orderId: advertInfo && advertInfo.orderId,
        projectId: formatPrizeExt2 && formatPrizeExt2.projectId,
        advertId: formatPrizeExt2 && formatPrizeExt2.advertId,
    };
    console.log('*************');
    console.log(params);
    // if (!advertInfo) return;
    await fetchReportAdvertisingEvents(params);
}
// （前置规则接口）1双v会员，2查询用户关注生活号接口
export const GET_FOCUS = (url, type, params, needHandleUid, headers) => {
    const newParams = {...params}
    if(lunaSessionId && needHandleUid) {
        newParams.lunaSessionId = lunaSessionId
        delete newParams.uid
    }
    return axios({
        baseURL: url,
        method: type,
        params: {
            rootId,
            ...newParams,
        },
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json',
            charset: 'utf-8',
            ...headers
        },
    });
}
// 活动相关信息
export const GET_AC_INFO_ALL = (params) => {
    return fuyaoRequest(
        '/app/activity/info/all',
        'GET',
        params
    )
}
// 获取奖品列表
export const GET_PRIZE_LIST = (params) => {
    return fuyaoRequest(
        '/app/user/prize/info',
        'GET',
        params
    )
}
// 任务查询接口
export const QUERY_TASK_STATUS = (params) => {
    return fuyaoRequest(
        '/app/task/query/task',
        'GET',
        params
    )
}
// 完成任务接口
export const GO_FINISH_TASK = (params) => {
    return fuyaoRequest(
        '/app/task/urlgenerate',
        'GET',
        params
    )
}
// 抽奖接口
export const activityDraw = (params) => {
    return fuyaoRequest(
        '/app/activity/draw',
        'GET',
        params
    )
}
// 准点抢话费余量接口
export const queryRemainingNum = (params) => {
    return fuyaoRequest(
        '/app/award/queryList',
        'GET',
        params
    )
}
// 获取抽奖人数
export const getDrawUserCount = (params) => {
    return fuyaoRequest(
        '/app/statistics/winning-count',
        'GET',
        params
    )
}
// 提交用户信息（电话 姓名 地址等）
export const handleUserInfo = (params) => {
    return fuyaoRequest(
        '/app/user/prize/add/winning-info',
        'GET',
        params
    )
}
// 获取大奖用户信息，进行首页公告轮播
export const getLargerPrize = (params) => {
    return fuyaoRequest(
        '/app/statistics/winning-prize-info',
        'GET',
        params
    )
}
