const Ding = require('./lib/ding');
const Mini = require('./lib/mini');

module.exports = (async function () {
    let params = {
        'at': {},
        'text': {},
        'msgtype': 'text'
    };
    try {
        // 授权
        await Mini.auth();
        await Mini.upload('<%= appid %>', './dist', null);

        params.at = {
            "atMobiles": [
                '15727168217', // 文缘
            ]
        };
        params.text = {
            'content': '@15727168217 生产-赚小钱钱-上传成功'
        };
    } catch (error) {
        console.error(error);
        params.at = {
            "atMobiles": [
                "13642354445", // wyf
            ]
        };
        params.text = {
            'content': `@13642354445 \n 生产-赚小钱钱-上传失败：${error && error.msg}`
        };
    } finally {
        const ding = new Ding();
        await ding.customSendMsg(params);
        params = null;
    }
})();
