import { getInstance, lock, unlock } from './api';

const hostConfig = require("/config.js");

const Services = {
    lock,
    unlock,
    <% if(model.includes('sparkBanner')) { %>
    //---------------------------------------------星火---------------------------------------------------
    // 星火点击上报（防疲劳）
    XH_CLICK_LOG(data = {}) {
        return getInstance.http({
            baseURL: hostConfig.xinghuoURL,
            url: "/gaoyang/userStatisticsService/dx/1.0/adBill",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            encrypt: true, // 是否需要加密参数
            data,
        });
    },
    // 查询星火配置
    QUERY_STAR_FIRE_CONF(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.xinghuoURL,
            url: '/gaoyang/rpOnlReceiptGeneralMulitService/dx/1.0/adBill',
            method: 'GET',
            needNetWork: true,
            data,
            ...options,
        });
    },
    // 星火疲劳度上报
    USER_STATISTICS_SERVICE(data = {}, options = {}) {
        return getInstance.http({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            baseURL: hostConfig.xinghuoURL,
            url: '/gaoyang/userStatisticsService/dx/1.0/adBill',
            method: 'POST',
            encrypt: true, // 是否需要加密参数
            data,
            ...options,
        });
    },
    <% } %>
};
export default Services;
