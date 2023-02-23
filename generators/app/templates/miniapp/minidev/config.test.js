const Auth = require('./config.auth')
const Req = require('request');

const request = Req.defaults({
    forever: false,
    pool: {
        maxSockets: Infinity
    }
})

const {
    minidev
} = require('minidev')

module.exports = (async function () {
    // 授权
    await Auth()
    const {
        qrcodeUrl,
        version
    } = await minidev.preview({
        appId: '2021003137662193',
        project: './dist',
    })
    // 预览二维码图片地址
    console.log(qrcodeUrl);
    // 生成的临时版本号，对于插件项目可以用于宿主进行插件联调
    console.log(version);
    sendCode(qrcodeUrl)
})()


function sendCode(url) {
    const URL = 'https://oapi.dingtalk.com/robot/send?access_token=d6edde84d659bcc7c04b3d660ca4adad7103fcd9275ca185b6b25642f8d0329e'
    request({
        url: URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: {
            "msgtype": "link",
            "link": {
                "text": "新功能来临，测试大佬们请速速验证验证~~~其实也不用验证",
                "title": "部署监控羊毛卡-小程序二维码来也~~~",
                "picUrl": "",
                "messageUrl": url
            },
        }
    })
}