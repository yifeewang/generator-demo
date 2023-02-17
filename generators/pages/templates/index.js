import { queryMixins, userAuth } from '/mixins/index';
import { SUCESS_CODE } from "/common/constance";
import { reportAdvertisingEvents, handleTuiAItem, qs } from '/utils/tool';
import {
    receiveGoods,
    GET_AC_INFO_ALL,
    activityDraw,
    getPrizeList
} from "/apis/api";
const Alipay = require('/utils/Alipay');
const Tool = require('/utils/tool');
const api = Alipay.api;
const app = getApp();
const hostConfig = require("/config.js");
const XH_BANNER_ZWM = {
    dev: {
        center: "RBKIV3BNLSVJ"
    },
    test: {
        center: "RBKIV3BNLSVJ"
    },
    prod: {
        center: "BHXEQLLWMG7Z"
    },
};

Page({
    mixins: [queryMixins, userAuth],
    notAutoUserInfo: true, //不自动调用登录信息接口
    data: {
        query: {},
        firstInPage: true,
        // 登录
        loginStatus: false,
        phoneNum: '',
        uid: '',
        queryLoginStatusToShowLoginDialog: false, // 根据登录状态显示登录弹窗
        // banner
        showXHBanner: false, // 是否显示星火banner
        xhBannerList: [], // 星火banner
        normalBannerList: [], // 普通banner
        areaCodes: '011401', // 区域码
        // 生活号
        showFocus: true, //是否显示关注生活号按钮
        checkFollow: true, // 通过组件获取关注状态。
        // 扶摇
        prizeList: [], // 奖品列表
        dialogAddress: false, // 是否弹出收货地址弹窗
        gotPrizeInfo: {}, // 抽奖获取的奖品
        prizeAddressInfo: {
            nameVlaue: '',
            phoneValue: '',
            addressValue: '',
        }, // 实物奖品用户信息
        box_bg: '', // 弹窗后页面固定
        turnUrl: '',
    },
    async onLoad (query) {
        const encodeQuery = qs.getFilterQuery(this.data.query);
        this.setData({
            turnUrl: `${this.data.turnUrl}&query=${encodeQuery}`
        });
        // 1. 需要支付宝授权 获取用户信息
        this.initQryLoginInfo((userStatus) => {
            this.initPage(userStatus);
        });
        // 2. 不需支付宝授权
        // app.queryLoginInfo((userStatus) => {
        //     this.initPage(userStatus);
        // });
    },
    async onShow (query) {
        if (!this.data.firstInPage && this.data.uid) {
            this.queryXHBanner();
        }
        this.setData({
            firstInPage: false
        });
    },
    initPage(userStatus) {
        //存在uid
        if (userStatus.uid) {
            this.setData({
                uid: userStatus.uid,
            });
        }

        if (userStatus.loginStatus === true) { //已经登录
            this.setData({
                loginStatus: true,
                phoneNumber: userStatus.phoneNumLock,
                phoneNum: userStatus.phoneNum,
                isLoading: false,
            });
        } else { // 未登录
            this.setData({
                loginStatus: false, // 用户是否登录
                queryLoginStatusToShowLoginDialog: true
            });
        }
        // 获取地理位置
        app.getProvinceInfo(({ provinceCode }) => {
            this.queryProvinceBanner(provinceCode);
        });
        this.getActivityInfo();
        this.queryXHBanner();
    },
    //============================================ banner相关 =================================================
    <% if(model.includes('xh')) { %>
    //查询星火banner
    async queryXHBanner() {
        const { center } = XH_BANNER_ZWM[hostConfig.env];
        const res = await app.Service.QUERY_STAR_FIRE_CONF({
            sceneGroupCode: `${center}`,
            userId: this.data.uid,
            receiptType: "SERVICE_C_0101",
            terminal:
                app.globalData.systemInfo && app.globalData.systemInfo.platform,
        });
        const data = Object.keys(res.data || {});
        if (data.indexOf(center) > -1 && res.data[center].length) {
            this.setData({
                xhBannerList: res.data[center],
                showXHBanner: true,
            });
        }
    },
    <% } %>
    // 根据省份和code码获取banner集合
    async queryProvinceBanner(provinceCode = '') {
        console.log("省份code:", provinceCode);
        const { areaCodes } = this.data;
        try {
            const getResult = await app.Service.getBannerListProvince({ areaCode: areaCodes, provinceCode });
            const { code, data: getData = {} } = getResult.data || {};

            if (parseInt(code) != 10000) {
                return;
            }
            console.log("省份code:getData", getData);
            for (const key in getData) {
                switch (key) {
                    case "011401":
                        //  腰封banner
                        this.setData({
                            normalBannerList: getData[key],
                        });
                        break;
                    default:
                        break;
                }
            }
        } catch (err) {
            console.log(1111, err);
        }
    },
    // 点击banner
    async goPage(e) {
        const { title, sort, type, url } = e.target.dataset;
        let spm;
        // 业务埋点
        if (type == "topBanner") {
            spm = "a14.p130.m325.b379";
        }
        this.handleburyData({
            spm,
            other: {
                ext_0: sort,
                ext_1: this.data.showProvince || "未获取到省份",
                ext_2: title,
                source_url: url,
            },
        });
        Alipay.turnPage(url);
    },
    <% if(model.includes('login')) { %>
    //============================================ 登录相关 =================================================
    //免密登录 回调
    onAutoLogin(result = {}) {
        if (result.code === "10000") {
            const data = result.data || {};
            this.setData({
                loginStatus: true,
                phoneNum: data.realPhoneNumber,
                phoneNumber: data.realPhoneNumber,
                phoneNumShow: data.realPhoneNumber,
                isLoading: false,
            });
            const userStatus = {
                loginStatus: true,
                phoneNum: data.realPhoneNumber,
                phoneNumLock: data.phoneNumber,
                uid: data.outUid,
                loginIn: data.loginIn
            };
            this.initPage(userStatus);
        } else {
            this.setData({
                isLoading: false,
            });
        }
    },

    // 使用其他手机号登录
    async otherLogin(result) {
        const data = result.data || {};

        if (parseInt(result.code) === 10000) {
            this.setData({
                loginStatus: true,
                phoneNum: data.realPhoneNumber,
                phoneNumber: data.realPhoneNumber,
                phoneNumShow: data.realPhoneNumber,
                uid: data.outUid,
            });
            const userStatus = {
                loginStatus: true,
                phoneNum: data.realPhoneNumber,
                phoneNumLock: data.phoneNumber,
                uid: data.outUid,
                loginIn: data.loginIn
            };
            this.initPage(userStatus);
        } else {
            this.setData({
                loginStatus: false,
            });
        }
    },

    // 登录成功回调
    zfbLogin(result = {}) {
        if (+result.code === 10000) {
            const data = result.data || {};

            this.setData({
                loginStatus: true,
                phoneNum: data.realPhoneNumber,
                phoneNumber: data.realPhoneNumber,
                phoneNumShow: data.realPhoneNumber,
                uid: data.outUid,
            });
            const userStatus = {
                loginStatus: true,
                phoneNum: data.realPhoneNumber,
                phoneNumLock: data.phoneNumber,
                uid: data.outUid,
                loginIn: data.loginIn
            };
            this.initPage(userStatus);
        }
    },

    // 退出登录回调
    logout(result = {}) {
        if (+result.code === 10000) {
            const data = result.data || {};

            this.setData({
                loginStatus: false,
                phoneNum: null,
                phoneNumber: null,
                phoneNumShow: null,
                uid: data.outUid,
            });
            const userStatus = {
                loginStatus: false,
                phoneNum: null,
                phoneNumLock: null,
                uid: data.outUid,
                loginIn: false
            };
            this.initPage(userStatus);
        }
    },
    saveRef(ref) {
        console.log("login-dialog", ref);
        this.loginDialogRef = ref;
        // 手动免密登录
        const query = this.data.query || {};
        if (query.loginType === "ctAvoidSecret") {
            console.log(111);
        } else {
            console.log(222);
        }
    },
    <% } %>
    <% if(model.includes('fy')) { %>
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
            const result = await GET_AC_INFO_ALL({ params, acCode }, { useGateWay: true });
            console.log('=====getActivityInfo-isMember-subStatus=====', result);
            if (result.code === SUCESS_CODE) {
                // const drawObj = (result.result || {}).isDrawVO || {};
                const acTitle = (result.result || {}).acTitle || {};
                my.setNavigationBar({
                    title: acTitle,
                });
                const uiContent = JSON.parse(result.result.uiContent || "{}");
                console.log("uiContent===", uiContent);
                // 查看奖品
                this.getPrize();
            }
        } catch (e) {
            console.log('=====getActivityInfo-error=====', e);
        }
    },
    // 开始抽奖领取
    async startDraw() {
        const { appId, phoneNum } = this.data;
        const { acCode } = this.data.query;
        // 没有授权
        if (!phoneNum) {
            return;
        }
        const result = await activityDraw({ acCode, appId, extData: phoneNum });
        if (result.code == SUCESS_CODE) {
            const goodsList = result?.result || {};
            const newGoodsList = handleTuiAItem(goodsList) || {};
            const unfinishedItem = this.data.taskList.find(item => !item.taskFinishStatus);
            const isShowUseAndDrawBtns = this.data.drawCount > 1 || unfinishedItem;
            let showModalBtns;
            if (newGoodsList.prizeType === 'IN_KIND') {
                showModalBtns = '3';
            } else {
                showModalBtns = isShowUseAndDrawBtns ? '1' : '2';
            }
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
            showNoChoose: false,
            showSuccess: false,
            showFailSubscribeMessage: false,
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
        const result = await receiveGoods({ ...params, acCode }, { useGateWay: true });

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
            const result = await getPrizeList({ acCode, appId }, { useGateWay: true });
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
        this.setData({
            showNoChoose: false,
            showSuccess: false,
            showFailSubscribeMessage: false
        });
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
    <% if(model.includes('dy')) { %>
    //============================================ 订阅相关 =================================================
    handleSubScribeMessage: Alipay.throttle(function (e) {
        const {
            item
        } = e.target.dataset || {};
        const { subActivityId, fridayLink } = this.data;
        const { activityId } = this.data.query;
        const nowPageUrl = `${fridayLink}?activityId=${activityId}`;
        const _this = this;
        this.handleBuryData({
            spm: 'a14.p250.m719.b1041',
            other: {
                ext_0: item.awardName
            },
        });
        // 模板id
        const templateList = ["310d9b836cd24a57b7d4d7826bf6e76e"];
        // 调用方法，唤起订阅组件
        my.requestSubscribeMessage({
            // 模板id列表，最多3个
            entityIds: templateList,
            success: async (res) => {
                if (res.behavior == "subscribe") {
                    my.showLoading();
                    const startTime = Tool.formatDate(item.beginTime, "YYYY-MM-dd HH:mm:ss");
                    const getResult = await Alipay.getUrl(
                        `${api.prizeReservation}?startTime=${startTime}&keyword1=周五兑福利&keyword2=${item.transferStartTime}&keyword3=${item.awardName}&url=${nowPageUrl}&activityId=${subActivityId}&awardId=${item.awardId}`,
                        true
                    );
                    my.hideLoading();
                    const {
                        code,
                        data: getData = {},
                        // msg,
                    } = getResult.data || {};
                    if (parseInt(code) === 10000 && getData === true) {
                        my.showToast({
                            content: "订阅成功",
                        });
                        _this.getProduct();
                    } else {
                        my.showToast({
                            content: res.data.msg,
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
    <% if(model.includes('gz')) { %>
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
