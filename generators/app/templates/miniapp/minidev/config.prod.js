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
                '<%= testPhone %>', // 文缘
            ]
        };
        params.text = {
            'content': '@<%= testPhone %> 生产-赚小钱钱-上传成功'
        };
    } catch (error) {
        console.error(error);
        params.at = {
            "atMobiles": [
                "<%= devPhone %>", // wyf
            ]
        };
        params.text = {
            'content': `@<%= devPhone %> \n 生产-赚小钱钱-上传失败：${error && error.msg}`
        };
    } finally {
        const ding = new Ding();
        await ding.customSendMsg(params);
        params = null;
    }
})();
