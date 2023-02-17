import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import { getNetWorkType, terminal, getUuidv4 } from '../utils/common';

const instance = axios.create({
    baseURL: config.fuyaoUrl,
    timeout: 8000,
});
// Request 拦截器
instance.interceptors.request.use(
    reqConfig => {
        // if (reqConfig.baseURL === config.fillPoint) {
        //   reqConfig.headers = {
        //     utrace: uuidv4(),
        //   };
        // }
        return reqConfig;
    },
    error => {
        return Promise.reject(error);
    },
);
// response拦截器
instance.interceptors.response.use(
    response => {
        return response.data;
    },
    err => {
        return Promise.reject(err);
    },
);
/*---------------------api接口--------------------  */

// 扶摇-获取uid
export const GET_UID = params => {
    return instance({
        url: '/app/user/info',
        method: 'GET',
        params,
    });
};
// 扶摇-查询扶摇活动详情
export const QUERY_INFO_ALL = params => {
    return instance({
        url: '/app/activity/info/all',
        method: 'GET',
        params,
    });
};
// POST请求
export const SEND_MSG = data => {
    return instance({
        url: '',
        method: 'POST',
        data,
    });
};
// 查询星火配置
export const QUERY_STAR_FIRE_CONF = params => {
    return instance({
        baseURL: config.xinghuoURL,
        url: '/gaoyang/rpOnlReceiptGeneralMulitService/dx/1.0/adBill',
        method: 'GET',
        params,
    });
};
// 查询兑换配置奖品列表
export const AWARD_QRY_LIST = params => {
    return instance({
        url: '/app/award/queryList',
        method: 'GET',
        params,
    });
};
// 积分抽奖
export const EXCH_DRAW = params => {
    return instance({
        url: '/app/activity/sign/exchange',
        // url: '/app/activity/sign/exchange-draw',
        method: 'GET',
        params,
    });
};
// 首页-签到区查询连续签到天数/周期内连续签到状态
export const QUERY_SIGN_INFO = params => {
    return instance({
        url: '/app/activity/sign/v1/queryUserSign',
        method: 'GET',
        params,
    });
};
// 抽奖
export const ACT_DRAW = params => {
    return instance({
        url: '/app/activity/draw',
        method: 'GET',
        params,
    });
};
// 获取我的抽奖
export const GET_PRIZE_LIST = params => {
    return instance({
        url: '/app/user/prize/info',
        method: 'GET',
        params,
    });
};

// 扶摇-ces
export const TEST = params => {
    return instance({
        baseURL: 'https://ctbizweb-dev.19ego.cn',
        url: '/api/ctQuery/v1/getBirth',
        method: 'GET',
        params,
    });
};
export const BURY_LOG = (data = {}) => {
    return instance({
        baseURL: config.fillPoint,
        url: '/spm/burydata',
        method: 'POST',
        headers: {
            utrace: getUuidv4(),
        },
        data,
        // data: {
        //   app_id: 'SF' + store.hxConfig.id,
        //   app_ver: store.hxConfig.version,
        //   tenant_code: '',
        //   uid: '',
        //   spm_value: '',
        //   action: '',
        //   spm_time: parseInt(new Date().getTime() / 1000),
        //   resource_spm: '',
        //   mobile: terminal(), //客户端机型信息
        //   browser: '', // 客户端浏览器信息
        //   browser_core: '', // 浏览器内核
        //   channel: '',
        //   channel2: '', //二级渠道
        //   other: '',
        //   device_brand: '',
        //   device_model: '',
        //   network: getNetWorkType(), // 网络类型
        //   os: navigator.platform, // 操作系统
        //   os_version: '', // 操作系统版本
        //   uri: '', //当前页面路径（绝对路径）
        //   user_agent: '',
        //   ...data,
        //   events: data.events ? JSON.stringify(data.events) : '',
        // },
    });
};
