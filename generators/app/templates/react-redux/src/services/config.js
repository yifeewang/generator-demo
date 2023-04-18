const devConfig = {
    env: 'dev',
    starHot: 'https://ingateway-test.19ego.cn', // 星火展位-开发
    buryData: 'https://spm-dev.gyjxwh.com', // 埋点-开发
    starHotBuryData: 'https://log-d2v-web-test.19ego.cn/spm/burydata', // 星火埋点-开发
}

const testConfig = {
    env: 'test',
    starHot: 'https://ingateway-test.19ego.cn', // 星火展位-测试
    buryData: 'https://spm-sit.gyjxwh.com', // 埋点-测试
    starHotBuryData: 'https://log-d2v-web-test.19ego.cn/spm/burydata', // 星火埋点-测试
}

const prodConfig = {
    env: 'prod',
    starHot: 'https://ingateway-hx.19ego.cn', // 星火展位-生产
    buryData: 'https://spm.iyoudui.com', // 埋点-生产
    starHotBuryData: 'https://log-d2v-web.19ego.cn/spm/burydata', // 星火埋点-生产
}

const arrConfigs = [devConfig, testConfig, prodConfig];

const defaultConfig = arrConfigs.find(i => i.env === APP_ENV) || prodConfig;

export default defaultConfig