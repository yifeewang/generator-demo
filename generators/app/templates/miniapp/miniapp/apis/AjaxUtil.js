const isPromise = (obj) => {
    return typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Promise]';
};
const getResolve = (obj) => {
    // console.log(Object.prototype.toString.call(obj))
    if (isPromise(obj)) {
        return obj;
    } else {
        return Promise.resolve(obj);
    }
};

class Interceptor {
    constructor (option) {
        this.use = (cb = null, errCb = null) => {
            option.cb = cb;
            option.errCb = errCb;
        };
        this.eject = null;
    }
}
class AjaxUtil {
    constructor (option = {}) {
    // 入参
        this.baseURL = option.baseURL || '';
        this.timeout = option.timeout || 30000;
        this.concurrency = option.concurrency || 6; // 并发请求数
        this.useMock = option.useMock;
        // 内部状态
        this.locking = option.locking || false;
        this.queue = [];
        this.subQueue = [];
        this.count = 0;
        this.requestConfig = {};
        this.responseConfig = {};

        this.interceptors = {
            request: new Interceptor(this.requestConfig),
            response: new Interceptor(this.responseConfig),
        };
    }
    /**
     * @param {string} baseURL 域名
     * @param {number} timeout 超时时间
     * @param {number} concurrency 并发请求数
     * @param {boolean} useMock 是否mock
     * @param {boolean} locking 是否开启请求所 开启后会暂停后续请求，解锁后会继续
     * @param {Array} queue 主队列
     * @param {Array} subQueue 副队列
     * 
     */
    static create (option) {
        return new AjaxUtil(option);
    }
}

// 遍历队列，依次发出请求
AjaxUtil.prototype.walk = function () {
    if (this.locking) return false;

    if (this.count < this.concurrency) {
        const left = this.concurrency - this.count;
        let min = Math.min(left, this.queue.length + this.subQueue.length);
        while (min--) {
            // console.log('出队')
            let request;
            if (this.queue.length) {
                request = this.queue.shift();
            } else {
                request = this.subQueue.shift();
            }
            this.count++;
            this.request(request.options)
                .then(res => {
                    request.success(res);
                })
                .catch(err => {
                    request.fail(err);
                });
        }
    }
};

// 收到请求，放到队列
AjaxUtil.prototype.http = function (options = {}) {
    // const page = getCurrentPages().pop()
    // let pageUrl = ''
    // if (page) {
    // pageUrl = page.route
    // }
    if (options.data == null) {
        options.data = {};
    }
    if (options.headers == null) {
        options.headers = {};
    }
    return new Promise((resolve, reject) => {
    // console.log('入队')
        let inQueue = this.queue;
        // console.log('入队')
        if (options.subQueue) {
            inQueue = this.subQueue;
        }
        // options.route = pageUrl
        inQueue.push({
            options,
            success: resolve,
            fail: reject,
        });
        this.walk();
    });
};

AjaxUtil.prototype.lock = function () {
    console.log('lock request: ' + new Date());
    this.locking = true;
};

AjaxUtil.prototype.unlock = function () {
    console.log('unlock request: ' + new Date());
    this.locking = false;
    this.walk();
};

// 封装请求
AjaxUtil.prototype.request = function (options) {
    const self = this;
    options = {
        method: 'GET',
        data: {},
        headers: {},
        baseURL: self.baseURL,
        timeout: self.timeout,
        ...options,
    };
    return new Promise((resolve, reject) => {
        if (my && my.request) {
            new Promise((resolve2, reject2) => {
                if (self.requestConfig.cb) {
                    getResolve(self.requestConfig.cb(options))
                        .then(obj => {
                            resolve2(obj);
                        })
                        .catch(err => {
                            reject2(err);
                        });
                } else {
                    resolve2(options);
                }
            })
                .then((options) => {
                    const {
                        route,
                        url,
                        baseURL,
                        loading,
                        subQueue,
                        ...params
                    } = options;
                    my.request({
                        url: baseURL + url,
                        ...params,
                        success: (res) => {
                            new Promise((resolve3, reject3) => {
                                if (self.responseConfig.cb) {
                                    getResolve(self.responseConfig.cb(res.data, options))
                                        .then(obj => {
                                            resolve3(obj);
                                        })
                                        .catch(err => {
                                            reject3(err);
                                        });
                                } else {
                                    resolve3(res.data);
                                }
                            })
                                .then(data => {
                                    self.count--;
                                    resolve(data);
                                    self.walk();
                                })
                                .catch(err => {
                                    if (self.responseConfig.errCb) {
                                        getResolve(self.responseConfig.errCb(err, options))
                                            .then(obj => {
                                                self.count--;
                                                resolve(obj);
                                                self.walk();
                                            })
                                            .catch(err => {
                                                self.count--;
                                                reject(err);
                                                self.walk();
                                            });
                                    } else {
                                        self.count--;
                                        reject(err);
                                        self.walk();
                                    }
                                });
                        },
                        fail: (err) => {
                            if (self.responseConfig.errCb) {
                                getResolve(self.responseConfig.errCb(err, options))
                                    .then(obj => {
                                        self.count--;
                                        resolve(obj);
                                        self.walk();
                                    })
                                    .catch(err => {
                                        self.count--;
                                        reject(err);
                                        self.walk();
                                    });
                            } else {
                                self.count--;
                                reject(err);
                                self.walk();
                            }
                        }
                    });
                })
                .catch(err => {
                    if (self.requestConfig.errCb) {
                        getResolve(self.requestConfig.errCb(err, options))
                            .then(obj => {
                                self.count--;
                                self.walk();
                                resolve(obj);
                            })
                            .catch(err => {
                                self.count--;
                                self.walk();
                                reject(err);
                            });
                    } else {
                        self.count--;
                        self.walk();
                        reject(err);
                    }
                });
        }
    });
};

AjaxUtil.prototype.get = function (options) {
    options.method = 'GET';
    return this.http(options);
};

AjaxUtil.prototype.post = function (options) {
    options.method = 'POST';
    return this.http(options);
};

module.exports = AjaxUtil;
