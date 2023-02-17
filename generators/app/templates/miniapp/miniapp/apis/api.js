import { SUCESS_CODE } from '../common/constance';
import alipayUtils from '../utils/alipayUtils';
import { getCurrentPageUrl } from '../utils/tool';

const Ajax = require("./AjaxUtil");
const hostConfig = require("/config.js");

// const useMock = true
const useMock = false;
const addResponseTime = 0; // 增加返回时间，模拟网络差

const instance = Ajax.create({
    useMock,
    baseURL: hostConfig.fuyaoUrl, //电信baseURL
    timeout: 10000,
    concurrency: 6,
});

// 实例2用于lock时发送请求
const instance2 = Ajax.create({
    useMock,
    baseURL: hostConfig.fuyaoUrl,
    timeout: 10000,
    concurrency: 6,
});

const sleep = (time = 0) => {
    return new Promise((resolve, reject) => {
        if (time) {
            setTimeout(() => {
                resolve();
            }, time);
        } else {
            resolve();
        }
    });
};

// 埋点 拦截request
const requestInterceptorFunc = (config) => {
    const app = getApp();
    if (config.baseURL === hostConfig.newBuryUrl && !config.data.uid) {
        config.data.uid = app.globalData.uid || app.globalData.alipayUid || "";
    }
    return config;
};
// 拦截request
const requestInterceptorFuncWrapper = (config) => {
    console.log("====config==========", config);

    // 大数据埋点请求
    if (config.baseURL === hostConfig.newBuryUrl) {
        return Promise.resolve(requestInterceptorFunc(config));
    }

    // 扶摇接口加密
    if (config.encrypt === true && config.data && config.data.params) {
        const app = getApp();
        config.data.params.uid = config.data.params.uid || app.globalData.uid || "";
        const { acCode } = config.data;
        console.log("params参数=======", config.data.params);
        const config_ = { acCode };
        const timestamp = new Date().getTime();
        const content = app.encrypt(config.data.params);
        const sign = app.md5ForFy(content, timestamp);
        config_.timestamp = timestamp;
        config_.content = content;
        config_.sign = sign;
        config.data = config_;
        return config;
    }

    if (config.baseURL === hostConfig.fuyaoUrl || config.baseURL === hostConfig.fuyaoGateWayUrl) {
        config.headers.business = "ctccmini";
        // 获取lunaSessionId
        return getBaseAuthCode()
            .then(({ authCode, lunaSessionId }) => {
                const app = getApp();
                const { acCode } = config.data;
                const { appId } = app.globalData;
                const config_data = { authCode, appId, acCode };
                if (lunaSessionId) {
                    // 如果存在lunaSessionId 删除authCode
                    config_data.lunaSessionId = lunaSessionId;
                    delete config_data.authCode;
                }
                if (config.method === 'POST' && config.querAuthCode) {
                    config.url = config.url + `?authCode=${config_data.authCode}`;
                    delete config_data.authCode;
                }

                config.data = {
                    ...config_data,
                    ...config.data,
                };
                console.log('requestInterceptorFuncWrapper', config);
                return config;
            })
            .catch((err) => {
                console.log('requestInterceptorFuncWrapper', err);
                return config;
            });
    }

    // 默认采用AuthCode授权
    return getUseAuthCode()
        .then(({ authCode }) => {
            config.data = {
                ...config.data,
                authCode
            };

            if (config.noAuthCode === true || config.url.indexOf('authCode') > -1) {
                delete config.data.authCode;
                delete config.noAuthCode;
            }

            return config;
        })
        .catch((err) => {
            console.log(err);
            return config;
        });
};
// Request 拦截器
instance.interceptors.request.use(requestInterceptorFuncWrapper);
// response 拦截器
const responseInterceptorFunc = (response = {}, config) => {
    const app = getApp();

    // 扶摇
    if (config.baseURL === hostConfig.fuyaoUrl || config.baseURL === hostConfig.fuyaoGateWayUrl) {
        if (response.code === SUCESS_CODE && response.lunaSessionId) {
            app.globalData.lunaSessionId = response.lunaSessionId;
            app.globalData.lunaBuryUid = response.lunaBuryUid;
        } else if (response.code !== SUCESS_CODE) {
            my.showToast({
                content: response.message
            });
        }
    }

    if (config.loading && !config.subQueue) {
        my.hideLoading();
    }

    return Promise.resolve(response);
};
const responseInterceptorFuncWrapper = (response = {}, config) => {
    if (addResponseTime) {
        return sleep(addResponseTime).then(() => {
            return responseInterceptorFunc(response, config);
        });
    } else {
        return responseInterceptorFunc(response, config);
    }
};
const responseInterceptorErrFunc = (err, config = {}) => {
    my.hideLoading();
    if (addResponseTime) {
        return sleep(addResponseTime).then(() => {
            return Promise.resolve(err);
        });
    } else {
        return Promise.resolve(err);
    }
};
instance.interceptors.response.use(
    responseInterceptorFuncWrapper,
    responseInterceptorErrFunc
);

instance2.interceptors.request.use(requestInterceptorFuncWrapper);
instance2.interceptors.response.use(
    responseInterceptorFuncWrapper,
    responseInterceptorErrFunc
);

const getBaseAuthCode = () => {
    // 判断缓存
    const lunaSessionId = getApp().globalData.lunaSessionId;
    if (lunaSessionId) {
        return Promise.resolve({ lunaSessionId });
    } else {
        console.log("getbaseAuthCode");
        return new Promise((resolve, reject) => {
            my.getAuthCode({
                scopes: "auth_base",
                success: (res) => {
                    const { authCode } = res;
                    if (!authCode || typeof authCode !== "string") {
                        my.hideLoading();
                        reject({ message: "获取用户信息失败" });
                    } else {
                        console.log("authCode: " + authCode);
                        getApp().globalData.authCode = authCode;
                        resolve({ authCode });
                    }
                },
                fail: () => {
                    my.hideLoading();
                    reject({ message: "获取用户信息失败" });
                },
            });
        });
    }
};

const getUseAuthCode = () => {
    const app = getApp();
    const useSession = app.globalData.useSession || true;
    return new Promise((resolve, reject) => {
        my.getAuthCode({
            scopes: "auth_base",
            success: (res) => {
                const { authCode } = res;
                if (!authCode || typeof authCode !== "string") {
                    my.hideLoading();
                    reject({ message: "获取用户信息失败" });
                } else {
                    console.log("authCode: " + authCode);
                    app.globalData.authCode = authCode;
                    resolve({ authCode, useSession });
                }
            },
            fail: () => {
                my.hideLoading();
                reject({ message: "获取用户信息失败" });
            },
        });
    });
};

const getInstance = {
    get(options = {}) {
        options.method = "GET";
        return getInstance.http((options = {}));
    },
    post(options = {}) {
        options.method = "POST";
        return getInstance.http((options = {}));
    },
    http(options = {}) {
        const { useInstance2, ...others } = options;
        if (options.useInstance2) {
            return instance2.http(others);
        } else {
            return instance.http(others);
        }
    }
};

const getBurryInstance = {
    // 大数据埋点
    burryData({ uid, channel, spm, other, events, ...params }) {
        const app = getApp();
        const { apmbA, systemInfo, networkType, app_ver } = app.globalData;
        const { channel: currentChannel, uid: currentUid } = getCurrentPageUrl();
        // 模板消息是内链参数 需要特殊处理
        if (app.globalData.isFirstInPage) {
            app.globalData.isFirstInPage = false;
            app.globalData.firstChannel = app.globalData.firstChannel || currentChannel || "self";
        }
        const newParams = {
            spm_value: spm || params.spm_value, // 兼容之前的写法
            action: "1",
            channel: app.globalData.firstChannel || "self",
            channel2: currentChannel || channel || "self",
            resource_spm: spm || params.resource_spm || params.spm_value,
            tenant_code: "",
            spm_time: parseInt((new Date()).getTime() / 1000),
            other: JSON.stringify(other || {}),
            app_id: apmbA,
            app_ver: app_ver,
            mobile: systemInfo?.model, //客户端机型信息
            browser: systemInfo?.app, // 客户端浏览器信息
            browser_core: systemInfo?.version, // 浏览器内核
            device_brand: systemInfo?.brand,
            device_model: systemInfo?.model,
            network: networkType, // 网络类型
            os: systemInfo?.platform, // 操作系统
            os_version: systemInfo?.system, // 操作系统版本
            uid: currentUid || app.globalData.uid || uid || app.globalData.alipayUid || '',
            events: JSON.stringify(events || {}),
            ...params,
        };
        // console.log('burydata', newParams);

        return getInstance.http({
            baseURL: hostConfig.newBuryUrl,
            url: "/spm/burydata",
            method: "POST",
            headers: {
                "utrace": app.getUuidv4(),
            },
            data: newParams,
            subQueue: true,
        });
    },
};

module.exports = {
    getInstance,
    getBurryInstance,
    lock() {
        return instance.lock();
    },
    unlock() {
        return instance.unlock();
    },
    baseURI() {
        return hostConfig.fuyaoUrl;
    },
};
