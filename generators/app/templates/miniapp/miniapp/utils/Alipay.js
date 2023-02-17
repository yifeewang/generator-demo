import { getBurryInstance } from '../apis/api';
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
     * 
     * @param {string} str 小程序链接
     * @returns 
     */
    static getUrlParamObject2 (str = "") {
        str = decodeURIComponent(str);
        console.log('***********');
        console.log(str);
        const keywordstr = '&query=';
        const list = str.split(keywordstr);
        const page = list[0];
        if (!list[1]) return { page };
        const arr = str.split(keywordstr)[1].split('&'); // 先通过？分解得到？后面的所需字符串，再将其通过&分解开存放在数组里
        const obj = {};
        for (const i of arr) {
            obj[i.split('=')[0]] = i.split('=')[1]; // 对数组每项用=分解开，=前为对象属性名，=后为属性值
        }
        if (str.split('?').length == 1 && str.split('&').length == 2) {
            str = str.split('&')[0];
        }
        return {
            page: str,
            data: obj
        };
    }
    /**
     * 
     * @param {string} str 小程序链接
     * @returns 
     */
    static getUrlParamObject (str = "") {
        let appIdStr = str.split("&page=")[0];

        let appId = appIdStr.split("appId=")[1];
        str = str.split("&page=")[1];

        str = decodeURIComponent(str);

        const keywordstr = "&query=";
        const list = str.split(keywordstr);
        const page = list[0];
        if (!list[1]) {
            return {
                page,
                appId,
            };
        }
        const arr = str.split(keywordstr)[1].split("&"); // 先通过？分解得到？后面的所需字符串，再将其通过&分解开存放在数组里
        const obj = {};
        for (const i of arr) {
            obj[i.split("=")[0]] = i.split("=")[1]; // 对数组每项用=分解开，=前为对象属性名，=后为属性值
        }
        if (str.split("?").length == 1 && str.split("&").length == 2) {
            str = str.split("&")[0];
        }
        console.log(str);
        console.log(obj);
        return {
            page: str,
            data: obj,
            appId,
        };
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
            if (isWebView) {
                // } else if (url.indexOf("https") === 0 && url.indexOf("alipay") == -1) {
                my.navigateTo({
                    url: `/pages/webview/webview?url=${encodeURIComponent(url)}`,
                });
            } else if (
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
            } else if (url.indexOf("ctclient") === 0) {
                // 跳端 目前只跳电信APP
                // console.log(url);
                my.openOtherApplication({
                    url: url,
                    success: () => {
                        // console.log('Success');
                    },
                    fail: (e) => {
                        // console.log(e);
                    },
                });
            } else if (/^alipays:\/\/platformapi\/startapp/.test(url)) {
                const pattern = /^alipays:\/\/platformapi\/startapp\?(.*)/;
                const query = url.match(pattern)[1];
                const options = qs.parse(query);
                options.query = qs.parse(decodeURIComponent(options.query));
                console.log(1111, options);
                my.navigateToMiniProgram({
                    appId: options.appId,
                    path: options.page,
                    query: options.query,
                    success: (res) => {
                        console.log(res);
                    },
                    fail: (error) => {
                        console.log("跳转失败", error);
                    },
                });
            } else {
                my.navigateToMiniProgram({
                    appId: "2019092467813194", // 小金盒小程序的appid，固定值请勿修改2019092467813194-tt2018122562686742
                    path: "pages/index-coupon/index-coupon?linkUrl=" + encodeURI(url), // 收藏有礼跳转地址和参数
                    success: (res) => {
                        console.log(res);
                    },
                    fail: (error) => {
                        // 跳转失败
                        console.log("跳转失败", error);
                    },
                });
            }
        }, 50);
    }

    // 外链跳转 linkUrl 默认链接;
    // linkUrlS=== "{"originalLink":"http:www.baidu.com.cn","linkType":"H5_LINK","linkName":"百度链接"}"
    // linkType链接类型:h5链接H5_LINK，支付宝小程序链接ZFB_APPLET_LINK，支付宝域内链接ZFB_LINK
    /**
     * 
     * @param {string} linkUrl url链接
     * @param {string} linkUrlS  json格式化字符串
     * @returns 
     */
    static leaveMiniApp(linkUrl, linkUrlS = '{}') {
        try {
            const linkUrlObj = JSON.parse(linkUrlS || '{}');
            const { linkType, originalLink, appId, pageIndex } = linkUrlObj;
            console.log("跳转链接=====", linkUrlObj);
            if ((linkType === 'H5_LINK' || linkType === 'ZFB_LINK') && originalLink) {
                console.log('天天领券h5调整');
                // console.log(originalLink)
                // my.ap.navigateToAlipayPage({
                //     path:encodeURIComponent(`https://ds.alipay.com/?scheme=https://baidu.com`)
                // })
                // return
                my.navigateToMiniProgram({
                    appId: '2019092467813194', // 小金盒小程序的appid，固定值请勿修改2019092467813194
                    path: 'pages/index-coupon/index-coupon?linkUrl=' + encodeURI(originalLink), // 小金盒跳转地址和参数
                    success: (res) => {
                        console.log(res);
                    },
                    fail: (error) => {
                        // 跳转失败
                        console.log('跳转失败');
                        console.log(error);
                    }
                });
                return;
            }
            if (linkType === 'ZFB_APPLET_LINK' && appId && pageIndex) {
                console.log('小程序链接');
                const isOuterLink = pageIndex.indexOf('appId') > -1;
                const { page, data = {} } = isOuterLink ? this.getUrlParamObject(pageIndex) : this.getUrlParamObject2(pageIndex);
                console.log("isOuterLink====", isOuterLink);
                console.log("page====", page);
                console.log("data====", data);
                my.navigateToMiniProgram({
                    appId: appId, // 目标小程序的appid，固定值请勿修改
                    path: page, // 目标跳转地址和页面参数
                    extraData: data,
                    query: data,
                    success: (res) => {
                        console.log(res);
                    },
                    fail: (error) => {
                        // 跳转失败
                        console.log(error);
                    }
                });
                return;
            }
            if (linkUrl) {
                console.log(linkUrl);
                this.turnPage(linkUrl);
            }
        } catch (e) {
            console.log(e);
        }
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
