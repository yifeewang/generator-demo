import { getBurryInstance } from '../apis/api';
const plugin = requirePlugin("xh-banner");
const tool = require('/utils/tool');
const qs = tool.qs;
// 首页tab路径，需要进行my.switchTab处理
const firstPageTabList = [
    // "pages/index/index",
    // "pages/withDraw/index",
];
/* eslint-disable no-undef */
class Alipay {
    /**
     * 
     * @param {string} isIndex 
     * @returns 
     */
    static getAuthCode (isIndex) {
        // 获取用户信息,获取用户手机号,需要用户主动授权时候使用
        return new Promise((resolve, reject) => {
            my.getAuthCode({
                scopes:
                    isIndex == "topup_service" ? "topup_service" : "auth_user",
                success: resolve,
                fail: reject,
            });
        });
    }

    static getAuthCodeBase () {
        // 静默授权，md5携带authCode加密时使用
        return new Promise((resolve, reject) => {
            my.getAuthCode({
                scopes: "auth_base",
                success: resolve,
                fail: reject,
            });
        });
    }

    /**
     * 跳转判断
     * @param {string} url 
     * @param {boolean} isWebView 是否跳转至webview，注意需配置白名单
     * @returns 
     */
    static turnPage(url, isWebView) {
        // console.log('判断跳转=====',url)
        if (url == "" || !url || url == "#") {
            return;
        }
        setTimeout(() => {
            // webview
            if (isWebView) {
                return my.navigateTo({
                    url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
                });
            }
            // 跳自己
            if (/^alipays:\/\/platformapi\/startapp/.test(url)) {
                // 跳自己
                const pattern = /^alipays:\/\/platformapi\/startapp\?(.*)/;
                const query = url.match(pattern)[1];
                const options = qs.parse(query);
                if (options.appId === "<%= appid %>") {
                    // 当前小程序
                    // 处理全局参数

                    const params = qs.parse(decodeURIComponent(options.query));
                    getApp().globalData.query = params;

                    my.navigateTo({
                        url: `/${decodeURIComponent(options.page)}`,
                    });
                    return false;
                }
            }
            // 内链
            if (
                url.indexOf("../") === 0 ||
                url.indexOf("/pages") === 0
            ) {
                // 区分首页taburl和二级页面url
                const isTabUrl = firstPageTabList.find(
                    (item) => url.indexOf(item) !== -1
                );
                isTabUrl
                    ? my.switchTab({
                        url,
                    })
                    : my.navigateTo({
                        url,
                    });
                return;
            }
            // 其他
            plugin.navigate(url);
        }, 50);
    }

    // 大数据埋点
    /**
     * 
     * @param {object} options spm，action，events
     */
    static maidian (options) {
        getBurryInstance.burryData(options);
    }
}

module.exports = Alipay;
