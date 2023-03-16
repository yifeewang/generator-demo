import { queryMixins } from '/mixins/index';
import { SUCESS_CODE } from "/common/constance";
import { reportAdvertisingEvents, handleTuiAItem, qs, throttle } from '/utils/tool';
const Alipay = require('/utils/Alipay');
const Tool = require('/utils/tool');
const app = getApp();
const hostConfig = require("/config.js");
<% if(model.includes('sparkBanner')) { %>
const XH_BANNER_ZWM = {
    dev: {
        center: "JJLWICHHFMEO"
    },
    test: {
        center: "JJLWICHHFMEO"
    },
    prod: {
        center: "L9DWGUTTR9SV"
    },
};
<% } %>
<% if(model.includes('chargePlugin')) { %>
const CHARGE_CODES = {
    dev: {
        CHARGE_CODE1: "",
        CHARGE_CODE2: "",
        CHARGE_CODE3: "",
    },
    test: {
        CHARGE_CODE1: "LUOH4E1LLURB",
        CHARGE_CODE2: "ATVPWWEU0VEP",
        CHARGE_CODE3: "GCIQJ60AFYVD",
    },
    prod: {
        CHARGE_CODE1: "OZVGM6IRLGBA", //充值首页
        CHARGE_CODE2: "OZILUXBW8YZJ", //充值记录页
        CHARGE_CODE3: "CDL3JY4QSFJV", //领券中心页
    },
};
<% } %>

Page({
    mixins: [queryMixins],
    notAutoUserInfo: true, //不自动调用用户信息接口
    data: {
        query: {},
        firstInPage: true,
        box_bg: '', // 弹窗后页面固定
        turnUrl: '',
        <% if(model.includes('subscribe')) { %>
        subStatus: false,
        <% } %>
        <% if(model.includes('sparkBanner')) { %>
        xhBannerZWM: `${XH_BANNER_ZWM[hostConfig.env].center}`, //星火banner展位码
        <% } %>
        <% if(model.includes('lifeFllow')) { %>
        // 生活号
        showFocus: true, //是否显示关注生活号按钮
        checkFollow: true, // 通过组件获取关注状态。
        <% } %>
        <% if(model.includes('fuyao-draw')) { %>
        // 扶摇
        prizeList: [], // 奖品列表
        dialogAddress: false, // 是否弹出收货地址弹窗
        gotPrizeInfo: {}, // 抽奖获取的奖品
        prizeAddressInfo: {
            nameVlaue: '',
            phoneValue: '',
            addressValue: '',
        }, // 实物奖品用户信息
        <% } %>
        <% if(model.includes('feeds')) { %>
        isFeedsShow: 0, //开关控制是否展示猜你喜欢
        <% } %>
        <% if(model.includes('visitGift')) { %>
        configMark: 'dttzxq', // 访问有礼 configMark
        <% } %>
        <% if(model.includes('taskPlugin')) { %>
        unionChannel: '',
        <% } %>
        <% if(model.includes('chargePlugin')) { %>
        chargeCode: `${CHARGE_CODES[hostConfig.env].CHARGE_CODE1},${
            CHARGE_CODES[hostConfig.env].CHARGE_CODE2
        },${CHARGE_CODES[hostConfig.env].CHARGE_CODE3}`,
        <% } %>
    },
    async onLoad (query) {
        const encodeQuery = qs.getFilterQuery(this.data.query);
        this.setData({
            turnUrl: `${this.data.turnUrl}&query=${encodeQuery}`,
            env: hostConfig.hostConfig,
            appId: app.globalData.appId
        });
        // 1. 需要支付宝授权 获取用户信息
        // this.initQryLoginInfo((userStatus) => {
        //     this.initPage(userStatus);
        // });
        // 2. 不需支付宝授权
        app.queryUserInfo((userStatus) => {
            this.initPage(userStatus);
        });
    },
    async onShow (query) {
        <% if(model.includes('sparkBanner')) { %>
        //手动查询banner数据
        this.xhRef && this.xhRef.resetQryBanner && this.xhRef.resetQryBanner();
        <% } %>
        <% if(model.includes('taskPlugin')) { %>
        //查询任务完成状态
        this.taskSaveRef && this.taskSaveRef.checkTaskIsDone && this.taskSaveRef.checkTaskIsDone();
        <% } %>
        if (!this.data.firstInPage && this.data.uid) {
        }
        this.setData({
            firstInPage: false
        });
    },
    <% if(model.includes('sparkBanner')) { %>
    //============================================ 星火banner相关 =================================================
    onXhSaveRef(ref) {
        this.xhRef = ref;
    },
    //onJumpOut 点击跳转回调
    onJumpOut(url,item) {
        //参数 跳转url，当前帧item
    },
    //onQueryBannerList 返回查询到的banner数据
    onQueryBannerList(list) {
        //参数list bannerList
    },
    <% } %>
    initPage(userStatus) {
        //存在uid
        if (userStatus.uid) {
            this.setData({
                uid: userStatus.uid,
            });
        }
        this.getActivityInfo();
    },
    //============================================ 扶摇相关 =================================================
    // 查询活动详情
    async getActivityInfo() {
        const {
            acCode,
        } = this.data.query;
        const { phoneNum, uid } = this.data;
        const params = {
            phone: phoneNum,
            uid: uid,
        };
        try {
            const result = await app.Service.GET_AC_INFO_ALL({ params, acCode }, { useGateWay: true });
            console.log('=====getActivityInfo-isMember-subStatus=====', result);
            if (result.code === SUCESS_CODE) {
                // const drawObj = (result.result || {}).isDrawVO || {};
                const acTitle = (result.result || {}).acTitle || {};
                my.setNavigationBar({
                    title: acTitle,
                });
                const uiContent = JSON.parse(result.result.uiContent || "{}");
                console.log("uiContent===", uiContent);
                <% if(model.includes('feeds')) { %>
                this.setData({
                    isFeedsShow: uiContent?.leftIcon?.type || 0, //开关(不显示0、显示1)
                })
                <% } %>
                <% if(model.includes('fuyao-draw')) { %>
                    // 查看奖品
                    this.getPrize();
                <% } %>
            }
        } catch (e) {
            console.log('=====getActivityInfo-error=====', e);
        }
    },
    <% if(model.includes('fuyao-draw')) { %>
    // 开始抽奖领取
    async startDraw() {
        const { appId, phoneNum } = this.data;
        const { acCode } = this.data.query;
        // 没有授权
        if (!phoneNum) {
            return;
        }
        const result = await app.Service.activityDraw({ acCode, appId, extData: phoneNum });
        if (result.code == SUCESS_CODE) {
            const goodsList = result?.result || {};
            const newGoodsList = handleTuiAItem(goodsList) || {};
            const { briefName } = newGoodsList?.prizeExt2 || {};
            console.log('=====json配置奖品：briefName=====', briefName);
            this.setData({
                showModalBtns,
                gotPrizeInfo: { ...newGoodsList }
            });
            if (newGoodsList.isTuiAdevertising) {
                // 推啊广告曝光
                reportAdvertisingEvents("show", newGoodsList);
            }
            this.getActivityInfo();
        }
        my.hideLoading();
    },
    hideView: function () {
        this.setData({
            dialogAddress: false, // 实物奖品弹窗
            box_bg: "",
        });
    },
    // 获取实物奖品抽奖人信息
    setInfoDetail: function (e) {
        const info = this.data.prizeAddressInfo;
        if (e.target.dataset.type === "name") {
            info.nameVlaue = e.detail.value;
        } else if (e.target.dataset.type === "phone") {
            info.phoneValue = e.detail.value;
        } else {
            info.addressValue = e.detail.value;
        }
        this.setData({
            prizeAddressInfo: info,
        });
    },
    // 领取实物奖品
    async gainPrize() {
        const phone = this.data.prizeAddressInfo.phoneValue;
        const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        const nameLength = this.data.prizeAddressInfo.nameVlaue.replace(
            /[^\u4e00-\u9fa5]/g,
            "xx"
        ).length;
        const addressLength = this.data.prizeAddressInfo.addressValue.replace(
            /[^\u4e00-\u9fa5]/g,
            "xx"
        ).length;
        if (nameLength < 2 || nameLength > 15) {
            my.showToast({
                type: "none",
                content: "请输入正确的姓名",
                duration: 3000,
            });
            return false;
        }
        if (!reg.test(phone)) {
            my.showToast({
                type: "none",
                content: "请输入正确的手机号",
                duration: 3000,
            });
            return false;
        }
        if (addressLength < 4 || addressLength > 40) {
            if (addressLength < 4) {
                my.showToast({
                    type: "none",
                    content: "地址信息太少，请输入有效地址",
                    duration: 3000,
                });
            } else {
                my.showToast({
                    type: "none",
                    content: "地址过长，请重新输入",
                    duration: 3000,
                });
            }
            return false;
        }

        const { acCode } = this.data.query;

        const params = {
            phone: this.data.prizeAddressInfo.phoneValue,
            name: this.data.prizeAddressInfo.nameVlaue,
            address: this.data.prizeAddressInfo.addressValue,
            id: this.data.gotPrizeInfo.handleId,
            drawType: "IN_KIND",
        };

        my.showLoading();
        const result = await app.Service.receiveGoods({ ...params, acCode }, { useGateWay: true });

        my.hideLoading();
        if (result.code === SUCESS_CODE) {
            this.hideModal();
            my.showToast({
                type: "success",
                content: "领取成功",
                duration: 3000,
            });

            this.getActivityInfo();
        } else {
            my.showToast({
                type: "fail",
                content: result.message,
                duration: 3000,
            });
        }
    },
    // 获取奖品
    async getPrize(e) {
        try {
            const { appId } = this.data;
            const { acCode } = this.data.query;
            const result = await app.Service.getPrizeList({ acCode, appId }, { useGateWay: true });
            if (result.code === SUCESS_CODE) {
                if (result.result.length === 0) {
                    return;
                }
                this.setData({
                    nowMonthPrizeList: this.getLatestPrize(result?.result) || [],
                    prizeList: result?.result || []
                });
            } else {
                my.showToast({
                    content: result.message,
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
    // 去使用/去领取
    toUse: async function (e) {
        const { item } = e.target.dataset;
        const { isTuiAdevertising, prizeType } = item;
        console.log('======useAndDraw======', item);
        if (prizeType === "IN_KIND") {
            // 实物奖品
            this.setData({
                dialogAddress: true,
                gotPrizeInfo: item,
                box_bg: "pos-fixed",
            });
            return;
        }
        // 广告事件上报
        if (isTuiAdevertising) {
            await reportAdvertisingEvents("click", item);
        }
        // 话费券
        if (prizeType == 4 || prizeType === "PHONE_COUPON") {
            // 领券地址
            // const couponUrl = `https://render.alipay.com/p/s/mygrace/ndetail.html?__webview_options__=sms%3DYES%26pd%3DNO&type=VOUCHER&id=${e.target.dataset.couponid}`

            const url = 'alipays://platformapi/startapp?appId=2021001107610820&page=pages/top-up/home/index?sourceId%3Dshop_866543608_cost12%26query%3DchInfo%3Dsearch\n';
            Alipay.turnPage(url);
        } else {
            //tuia || 普通券 立即使用
            Alipay.turnPage(isTuiAdevertising ? item.advertInfo.promoteUrl : item.prizeVerifyUrl);
        }
    },
    // 拿到本月奖品
    getLatestPrize(list) {
        const newList = list.map(item => {
            return {
                ...item,
                transTime: item.gmtCreate.replace(/年|月/g, '/').replace(/日/g, '')
            };
        });
        const findItem = newList.find(i => Tool.isSameMonth(i.transTime));
        console.log('======getLastedPrize======', newList, findItem);
        return findItem;
    },
    <% } %>
    <% if(model.includes('taskPlugin')) { %>
    //============================================ 任务插件相关 =================================================
    onTaskSaveRef(ref) {
        this.taskSaveRef = ref;
    },
    onTaskDone({ rewardValue, item }) { // 任务完成后toast或奖励弹窗在这里写
        // 任务完成
    },
    onTaskFail({ msg, item, result }) {
        // 任务未完成
        // msg 任务未完成理由说明
        // item 任务info
        // result 完成任务接口返回结果
    },
    <% } %>
    <% if(model.includes('feeds')) { %>
    onRenderSuccessAD() {
        console.log("onRenderSuccess");
    },
    onRenderFailAD() {
        console.log("onRenderFail");
    },
    onFeedsSaveRef(ref) {
        this.feedsRef = ref;
    },
    <% } %>
    <% if(model.includes('subscribe')) { %>
    //============================================ 订阅相关 =================================================
    async queryMsgSub() {
        const res = await app.Service.QUERY_MESSAGE_SUB({
            templateId: this.data.subScribeId,
            uid: this.data.uid,
        });
        if (res?.code == SUCESS_CODE) {
            this.setData({
                subStatus: res?.result[0]?.subscriptionType,
            });
        }
    },
    handleSubScribeMessage: throttle(function (e) {
        const {
            item
        } = e.target.dataset || {};
        this.handleBuryData({
            spm: 'a14.p250.m719.b1041',
            other: {
                ext_0: item.awardName
            },
        });
        // 调用方法，唤起订阅组件
        my.requestSubscribeMessage({
            // 模板id列表，最多3个
            entityIds: ['310d9b836cd24a57b7d4d7826bf6e76e'],
            success: async (res) => {
                if (res.behavior == "subscribe") {
                    my.showLoading();
                    const startTime = Tool.formatDate(item.beginTime, "YYYY-MM-dd HH:mm:ss");
                    const res1 = await app.Service.PRIZE_RESERVATION({
                        startTime,
                        activityId: item.activityId,
                        keyword1: '周五兑福利',
                        keyword2: item.transferStartTime,
                        keyword3: item.prizeName,
                        awardId: item.prizeId,
                        subscriptionType: 1
                    });
                    my.hideLoading();
                    console.log('消息订阅', res1);

                    if (parseInt(res1.code) === 10000) {
                        this.setData({
                            subStatus: true,
                        });
                        my.showToast({
                            content: "订阅成功",
                        });
                    } else {
                        my.showToast({
                            content: "订阅失败"
                        });
                    }
                }
            },
            fail: (res) => {
                my.showToast({
                    content: "订阅失败",
                });
            }
        });
    }, 1000),
    <% } %>
    <% if(model.includes('lifeFllow')) { %>
    //============================================ 关注生活号相关 =================================================
    checkFollowCb(e) {
        // e.detail对象里会有followed字段，可以用来判断关注状态
        console.log('*****checkFollowCb*****: ', e);
        const { followed } = e.detail;
        // 把checkFollow、showFocus都置为false
        this.setData({
            checkFollow: false,
            showFocus: false,
        });
        // 如果没有关注的话，展示组件
        if (!followed) {
            setTimeout(() => {
                this.setData({
                    showFocus: true,
                });
            });
        }
    },
    fllowLife () {
        // 关注点击埋点
        this.handleburyData({
            spm: 'a14.p138.m957.b1423',
            action: "1"
        });
        if (!my.canIUse('button.open-type.lifestyle')) {
            // 版本过低, 提示更新支付宝
            my.alert({
                title: '您的支付宝版本过低',
                content: '请更新',
                buttonText: '我知道了',
            });
        }
    },
    onFollowLifestyle(e) {
        const { followStatus } = e.detail;
        console.log("onFollowLifestyle:", followStatus);
        if (followStatus === 1) {
            this.setData({
                showFocus: false
            });
        }
    },
    <% } %>
    //============================================ 埋点相关 =================================================
    async handleBuryData (params) {
        const json = {
            uid: this.data.uid || app.globalData.uid,
            channel: this.data.query.channel || '',
            ...params
        };
        await Alipay.maidian(json);
        my.hideLoading();
    },
});
