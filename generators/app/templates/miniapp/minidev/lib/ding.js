const crypto = require('crypto');
const GYRequest = require('./gy_request');

class Ding extends GYRequest {
    constructor() {
        super();
        this.URL = 'https://oapi.dingtalk.com';
        this.SECRET = '<%= secret %>';
    }

    /**
     * 自定义机器人消息
     * @param {object} params
     * @returns
     */
    async customSendMsg(params) {
        const {
            timestamp,
            sign
        } = this.encrypt();
        const URL = `${this.URL}/robot/send?access_token=<%= accessToken %>&timestamp=${timestamp}&sign=${sign}`;
        return await this.doRequest(URL, 'POST', params, {});
    }

    /**
     * 加密
     * @returns
     */
    encrypt() {
        const timestamp = Date.now();
        const str = timestamp + '\n' + this.SECRET;

        const sign = crypto.createHmac('sha256', this.SECRET).update(str).digest('base64');
        const sign_encodeUrl = encodeURIComponent(sign);

        return {
            timestamp: timestamp,
            sign: sign_encodeUrl
        };
    }
}

module.exports = Ding;
