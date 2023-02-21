import { getInstance, lock, unlock } from './api';

const hostConfig = require("/config.js");

const Services = {
    lock,
    unlock,
    <% if(model.includes('fuyao')) { %>
    //---------------------------------------------扶摇---------------------------------------------------
    // 查询用户信息
    QUERY_USER_INFO(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/user/info",
            method: "GET",
            useInstance2: true,
            data,
            ...options,
        });
    },

    // 查询活动信息
    GET_AC_INFO_ALL(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/activity/info/all",
            method: "GET",
            // encrypt: true,
            data,
            ...options,
        });
    },

    // 首页-查询积分明细
    GET_INTEGRAL_QUERY(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/integral/query",
            method: "GET",
            data,
            ...options,
        });
    },
    // 首页-签到区查询连续签到天数/周期内连续签到状态
    QUERY_USER_SIGN(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/activity/sign/queryUserSign",
            method: "GET",
            data,
            ...options,
        });
    },
    // 任务多个完成情况指定任务查询接口
    QUERY_TASK_STATUS(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/task/query/task",
            method: "GET",
            data,
            ...options,
        });
    },
    // 任务单个任务完成情况指定任务查询接口
    QUERY_ONE_TASK_STATUS(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/task/query/task-one",
            method: "GET",
            data,
            ...options,
        });
    },
    // 签到接口
    TASK_FINISH(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/task/finish",
            method: "GET",
            data,
            ...options,
        });
    },
    // 兑换页-查询兑换奖品列表
    AWARD_QRY_LIST(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/award/queryList",
            method: "GET",
            data,
            ...options,
        });
    },
    // 查询总积分
    QUERY_CREDITJF(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/activity/sign/queryCreditBalance",
            method: "GET",
            data,
            ...options,
        });
    },
    // 去完成普通任务
    GO_FINISH_TASK(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/task/urlgenerate",
            method: "GET",
            data,
            ...options,
        });
    },

    // 查询积分余额
    QUERY_CREDIT_BALANCE(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/activity/sign/queryCreditBalance",
            method: "GET",
            data,
            ...options,
        });
    },
    // 查询灯火feeds插件任务的商品的浏览次数
    QUERY_STATISTICS_NUMBER(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/jjqb/queryStatisticsNumber",
            method: "GET",
            data,
            ...options,
        });
    },
    // 兑换奖品列表
    AWARD_QUERY_LIST(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/award/queryList",
            method: "GET",
            data,
            ...options,
        });
    },
    // 查看商品详情
    AWARD_QUERY_INFO(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/award/queryDetail",
            method: "GET",
            data,
            ...options,
        });
    },
    // 奖品兑换接口
    AWARD_EXCHANGE(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/activity/sign/exchange",
            method: "GET",
            data,
            ...options,
        });
    },
    // 获取我的抽奖
    getPrizeList(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/user/prize/info",
            method: "GET",
            data,
            ...options,
        });
    },
    // 获取抽奖人数
    getActivityNum(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/statistics/winning-count",
            method: "GET",
            data,
            ...options,
        });
    },
    // 话费券领取
    receiveGoods(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/user/prize/add/winning-info",
            method: "GET",
            data,
            ...options,
        });
    },
    // 抽奖
    activityDraw(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/activity/draw",
            method: "GET",
            data,
            ...options,
        });
    },
    // 推啊广告事件上报
    reportAdvertisingEvents(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/advert/eventReport",
            method: "GET",
            data,
            ...options,
        });
    },
    // 新增订阅消息第二版
    ADD_MESSAGE_SUB(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/MessageSubscription/v2/add",
            method: "GET",
            data,
            ...options,
        });
    },
    // 查询订阅消息第二版
    QUERY_MESSAGE_SUB(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/MessageSubscription/v2/query",
            method: "GET",
            data,
            ...options,
        });
    },
    // 新增订阅消息第一版
    ADD_MESSAGE_SUB_V1(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/MessageSubscription/add",
            method: "GET",
            data,
            ...options,
        });
    },
    // 删除订阅消息第一版
    DELETE_MESSAGE_SUB_V1(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/MessageSubscription/delete",
            method: "GET",
            data,
            ...options,
        });
    },
    // 查询现金余额
    QUERY_CREDIT_BALABCE(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/activity/sign/queryCreditBalance",
            method: "GET",
            data,
            ...options,
        });
    },
    // 获取用户当天完成任务次数
    QUERY_FREQUENCY(data = {}, options = {}) {
        return getInstance.http({
            baseURL: hostConfig.fuyaoUrl,
            url: "/app/task/getUserTaskFinshedCount",
            method: "GET",
            data,
            ...options,
        });
    },
    <% } %>
    <% if(model.includes('starFire')) { %>
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
