import CryptoJS from "crypto-js";
import Service from "./apis/Service";
import alipayUtils from "./utils/alipayUtils";
import { checkVersion } from "./utils/tool";
import { SUCESS_CODE } from "/common/constance";
import currency from "currency.js";
require("./mixins/mixins.js");
const Alipay = require("/utils/Alipay");
const md5 = require("/utils/md5.js");
const _KEV = "iHATLhQo0zln1508";
const _IV = "iHATLhQo0zln1508";

App({
    Service: Service,
    alipayUtils: alipayUtils,
    globalData: {
        appId: "<%= appid %>",
        apmbA: "",
        acCode: "", //测试 ac290e8b6c3f334916 生产 acfc145bd037f24733
        systemInfo: null,
        networkType: "",
        webViewUrl: null, //  webview页面链接
        uid: "", //  用户UID
        firstChannel: null, // 首次进页面的渠道
        isFirstInPage: true,
        query: {},
        leftIconType: ''//是否展示猜你喜欢插件,取值uiContent.leftIcon
    },
    onLaunch(options) {
        // 锁定请求，等到页面或全局请求userInfo后解锁，确保埋点等自动调用的接口等到拿到uid后再发出
        Service.lock();
        if (!checkVersion()) {
            // 查看当前基础库版本
            if (!my.canIUse("plugin") && !my.isIDE) {
                my.ap && my.ap.updateAlipayClient && my.ap.updateAlipayClient();
            }
            my.alert({
                content: "亲，您当前的版本过低，请升级至最新版本",
            });
            return;
        }
        this.getNetworkType();
        this.getSystemInfo();

        const { query = {}, referrerInfo = {} } = options;
        const channel =
            (query || {}).pageSource ||
            (query || {}).sourceId ||
            (query || {}).channel ||
            ((referrerInfo || {}).extraData || {}).channel;

        this.globalData.firstChannel = channel || null;
        this.globalData.query = options.query;
        console.log("=====onLaunch=====", options);
        // 当页面onLoad或者onShow中有调用getUserInfo时，添加notAutoUserInfo: true,
        // 页面外投时不自动调用userInfo；
        // 否则统一在onLaunch调用，防止lock导致页面锁死请求。
        const pages = getCurrentPages();
        const curPage = pages && pages.pop();
        if (!curPage || !curPage.notAutoUserInfo) {
            this.queryUserInfo(); // 调取用户信息， 首页单独调用
        }
    },

    onPageNotFound() {
        my.redirectTo({
            url: "/pages/index/index",
        });
    },
    onShow(options) {
        if (options.scene) {
            this.globalData.scene = options.scene;
        } else if (my.getLaunchOptionsSync) {
            this.globalData.scene = my.getLaunchOptionsSync().scene;
        }
        console.log("=====2222=====", options);
    },
    //获取用户uid
    async queryUserInfo(callback) {
        const { appId, query } = this.globalData;
        const { acCode } = query || {};
        const result = await Service.QUERY_USER_INFO({ acCode, appId });
        console.log("=====queryUserInfo=====", result);
        if (result.code === SUCESS_CODE) {
            this.globalData.uid = result.result;
            // this.globalData.uid = 2088232992437892;
        }
        const userStatus = {
            uid: result?.result || ""
        }
        callback && callback(userStatus);
        Service.unlock();
    },
    /**
     * 获取用户省份信息
     * @param {*} callBack 获取地理位置后的回调
     * 防止getProvinceInfo调用多次，callBack存入locationCallbacks， 等my.getLocation后一起调用
     */
    getProvinceInfo: function (callBack) {
        this.globalData.locationCallbacks.push(callBack);
        my.getStorage({
            key: "userProvince",
            success: (res) => {
                if (res.data) {
                    const {
                        userProvince,
                        userProvinceCode,
                        userProvinceTime,
                        userLongitude,
                        userLatitude,
                    } = res.data;

                    console.log("缓存的内容", userProvince, userProvinceCode);
                    const curTime = new Date().getTime();
                    // 缓存一周
                    if (curTime - userProvinceTime < 604800000) {
                        console.log("时间未过期");
                        this.globalData.showProvince = userProvince;
                        this.globalData.showProvinceCode = userProvinceCode;
                        this.globalData.longitude = userLongitude;
                        this.globalData.latitude = userLatitude;
                        callBack({
                            provinceCode: userProvinceCode,
                            provinceName: userProvince,
                            longitude: userLongitude,
                            latitude: userLatitude,
                        });
                    } else {
                        my.removeStorage({
                            key: "userProvince",
                        });
                        !this.globalData.isCallLocation && this.getLocation();
                    }
                } else {
                    !this.globalData.isCallLocation && this.getLocation();
                }
            },
            fail: () => {
                !this.globalData.isCallLocation && this.getLocation();
            },
        });
    },
    // getLocation
    getLocation() {
        this.globalData.isCallLocation = true;
        my.getLocation({
            type: 1,
            success: (res) => {
                console.log("getlocation:", res);
                this.globalData.isCallLocation = false;
                const curTime = new Date().getTime();
                my.setStorage({
                    key: "userProvince",
                    data: {
                        userProvince: res.province,
                        userProvinceCode: res.provinceAdcode,
                        userProvinceTime: curTime,
                        userLongitude: res.longitude,
                        userLatitude: res.latitude,
                    },
                });
                // 省份编码  provinceAdcode
                this.globalData.locationCallbacks.forEach((callBack) =>
                    callBack({
                        provinceCode: res.provinceAdcode,
                        provinceName: res.province,
                        longitude: res.longitude,
                        latitude: res.latitude,
                    })
                );
                this.globalData.locationCallbacks = [];
                this.globalData.showProvince = res.province;
                this.globalData.showProvinceCode = res.provinceAdcode;
            },
            fail: () => {
                // TODO 查默认应该是那个code
                this.globalData.isCallLocation = false;
                this.globalData.locationCallbacks.forEach((callBack) =>
                    callBack()
                );
                this.globalData.locationCallbacks = [];
                this.globalData.showProvince = "";
                this.globalData.showProvinceCode = "";
            },
        });
    },
    /**
     * 
     * @param {number} num1 
     * @param {number} num2 
     * @param {enum} opt (add,sub,mul,dis)
     * @param {number} precision 
     * @returns 
     */
    getCurrency(num1, num2, opt = "add", precision = 2) {
        // symbol: "¥"
        if (opt === "add") {
            return currency(num1, { symbol: "", precision: precision })
                .add(num2)
                .format();
        }
        if (opt === "sub") {
            return currency(num1, { symbol: "", precision: precision })
                .subtract(num2)
                .format();
        }
        if (opt === "mul") {
            return currency(num1, { symbol: "", precision: precision })
                .multiply(num2)
                .format();
        }
        if (opt === "dis") {
            return currency(num1, { symbol: "", precision: precision })
                .distribute(num2)
                .format();
        }
    },
    isAndroid: function () {},
    isIos: function () {},
    /**
     * md5加密
     * @param {*} data 
     * @returns 
     */
    encrypt(data = {}) {
        const key = CryptoJS.enc.Utf8.parse(_KEV);
        const iv = CryptoJS.enc.Utf8.parse(_IV);
        let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding,
        });
        return encrypted.toString(); // 返回的是base64格式的密文
    },
    /**
     * md5解密
     * @param {*} encrypted 
     * @returns 
     */
    decrypt(encrypted) {
        let key = CryptoJS.enc.Utf8.parse(_KEV);
        let iv = CryptoJS.enc.Utf8.parse(_IV);
        let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    },
    /**
     * md5
     * @param {*} content 
     * @param {*} time 
     * @returns 
     */
    md5ForFy(content, time) {
        const SALT = "3afn4UpdQzENHhZji1jC";
        const s = content + SALT + time;
        return md5.md5(s);
    },
    /**
     * 网络状态
     * @returns 
     */
    getNetworkType() {
        if (this.globalData.networkType) {
            return Promise.resolve(this.globalData.networkType);
        } else {
            return new Promise((resolve, reject) => {
                my.getNetworkType({
                    success: (res) => {
                        this.globalData.networkType = res.networkType;
                        resolve(res.networkType);
                    },
                    fail: (err) => {
                        reject(err);
                    },
                });
            });
        }
    },
    /**
     * 系统信息
     * @returns 
     */
    getSystemInfo() {
        if (this.globalData.systemInfo) {
            return Promise.resolve(this.globalData.systemInfo);
        } else {
            return new Promise((resolve, reject) => {
                my.getSystemInfo({
                    success: (res) => {
                        this.globalData.systemInfo = res || {};
                        console.log("getSystemInfo", res);
                        resolve(res);
                    },
                    fail: (err) => {
                        reject(err);
                    },
                });
            });
        }
    },
    /**
     * 字符串转base64
     * @param {string} str 
     * @returns 
     */
    strToBase64(str) {
        let wordArray = CryptoJS.enc.Utf8.parse(str);
        let base64 = CryptoJS.enc.Base64.stringify(wordArray);
        return base64;
    },
    /**
     * 获取uuid 10min内无操作则变更uuid，否则取缓存内uuid
     */
    getUuidv4() {
        const uuid_v4_info = alipayUtils.getStorageSync("uuid_v4_info");
        const { uuid_v4, uuid_timestamp } = uuid_v4_info || {};
        const nowTime = new Date().getTime();
        if (nowTime - uuid_timestamp < 10 * 60 * 1000 && uuid_v4) {
            alipayUtils.setStorageSync("uuid_v4_info", {
                uuid_v4,
                uuid_timestamp: new Date().getTime(), // 重置时间戳
            });
            return uuid_v4;
        }
        const newUuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                let r = (Math.random() * 16) | 0;
                let v = c == "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        );
        alipayUtils.setStorageSync("uuid_v4_info", {
            uuid_v4: newUuid,
            uuid_timestamp: new Date().getTime(), // 重置时间戳
        });
        return newUuid;
    }
});
