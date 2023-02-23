const Auth = require('./config.auth')
const {
    minidev
} = require('minidev')

module.exports = (async function () {
    // 授权
    await Auth()
    const uploadResult = await minidev.upload({
        appId: '2021003137662193',
        project: './dist'
    }, {
        onLog: (data) => {
            // 输出日志
            console.log(data);
        }
    })
    // 打印上传版本
    console.log(uploadResult.version);
})()