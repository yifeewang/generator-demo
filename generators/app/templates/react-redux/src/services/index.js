import axios from 'axios';
import qs from 'qs';
import config from './config'
import {encrypt, decrypt, md5ForFy} from '../utils'

axios.defaults.timeout = 10000;
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

export const getUrlParam = (name = '') => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const searchHash = window.location.href.split('?')[1] || '';
    const search = searchHash.split('#')[0] || '';
    const value = search.match(reg);
    if (value !== null) return decodeURI(value[2]);
    return null;
};
export const channel = getUrlParam('channel') || 'self'; // 渠道
// export const sourceFrom = getUrlParam('sourceFrom') || 'AJ_HW_APP'; // 来源
export const sceneGroupCode = getUrlParam('sceneGroupCode') || ''; // 展位码
export const alipayOpenId = getUrlParam('alipayOpenId') || ''; // uid

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
// 获取大奖用户信息，进行首页公告轮播
export const getLargerPrize = (params) => {
    return fuyaoRequest(
        '/app/statistics/winning-prize-info',
        'GET',
        params
    )
}
