const Req = require('request');

const request = Req.defaults({
    forever: false,
    pool: {
        maxSockets: Infinity
    }
});

class Request {
    _ajax (options) {
        return new Promise(function (resolve, reject) {
            const start = new Date().getTime();
            request(options, function (error, response, body) {
                const end = new Date().getTime();
                const cost = (end - start) / 1000;
                console.log('==>Get cost', cost + 's');
                if (error) {
                    return reject(error);
                }
                return resolve(response);
            });
        });
    }
}

module.exports = Request;
