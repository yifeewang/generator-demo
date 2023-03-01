const Request = require('./request');

class GYRequest extends Request {
    constructor () {
        super();
    }

    async doRequest (url, method, data, header) {
        const headers = {
            'Content-Type': 'application/json'
        };
        Object.assign(headers, header || {});
        const options = {
            url: url,
            method: method || 'post',
            headers: headers,
            json: data
        };
        console.log(options);
        const res = await this._ajax(options);
        return res.body;
    }
}

module.exports = GYRequest;
