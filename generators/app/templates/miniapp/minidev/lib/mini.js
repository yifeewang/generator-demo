const {
    minidev
} = require('minidev');

class Mini {
    /**
     * 授权
     */
    static async auth() {
        await minidev.config.useRuntime({
            'alipay.authentication.privateKey': 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCYjkOnhkepjHdhUFSslDk7BqaIyuH3IKONt+SSU1wmWRzQz4HdF502UU/4OuOlNLcunMdkG8hHDqG4MpE7hg51C/wXiaAg8Ybbzw9fg6+DsLzu4JekaWXISLeRT1e7hZtE3m179NOjArEEOXFqE7aZHIf0yvOCQl228GBKAuEQBlA8r3OGm+3QuDq8035z3YtoYnfJUVAmhGBO3VZ6IFO40lzk+hpIXyspTy19dNqZ66pjyNcFCj1Duo1c3OqvDAA/TQitTyIK854XQ7wUtOPj3jruLpxnFODun8txLh6krxlmTNjVyt99KflWlhCYe0lBgXpEtOfCP7XWjGDjuPtjAgMBAAECggEAODkOE/p4BLOA97tcSXIjGW7dB0MGPkaoID2qnobcSkHDTe175dijFvamq0xAw40HCcW78lgO2qk4zqLMRYylXVu6X45YFmwNEItiFgh5MeZ76umY2X4CherOxF3ibnjR/XKgFPPo34XJaU4mTzrOq+UI8h2t2s7MrPQv+HbRLU8kK6ma4jZq9NBNyRGL6zObKfB55vg3y011zLdB+6fOSZT9guxvXcgQub/kwOym1/vy+I1I1P/8ICsheMgC3stkHijXpnm/5jPs7vIFrRFL1fQAGdmb5oJ8EbnR6JW3PeDcZvohFwtri5bvj3o72UUm/vfDJ27GwcqMRFDcQdnnaQKBgQDW50O3XgdNlL7D73wh7jzEaCNGS3qlhSHSs0wc+bWcoaw5XKFdgoqEwf86fz692LAjSxJj3m0jNtQ7wxpYKiuZ+MzR6i4Dy+UsPgc9tmjdtXpEY7vOTf8iHKg53zyS4PbOvpjue5ULG/O1w/Lvm0fZYNh5UBMOZ6pSbbn39BzMzQKBgQC1urq5alAfRclWe0TYTQitKklkLqwwFrbbd395bPr4MlJ2looVbpMGj39dPYP3FDGg7ov5o8fFu6I5LmWMOamf0pmh79pzMtZn5butHAKwpNOXmH7OTwe/mi9olvX9IwPpx/NBQ10iqiDv3gqYAveBxIA9Ag0psxfnrVKRcCzo7wKBgCh5X+iOHgP/irouRYvCadF354TavFumKkubly8x3IGGdYBMMNwCtQHx45bp1jA9Olc7UVhb0OQ79FbZFQIb1yBlmnXCjC4M3bmqaQS3cSKohkGRIxLk37NWAFz97VOgaPthLD5mKhjwh8LpB70W2r5XHg4jBaPF5G8n2UmYwT/VAoGBAIxOsjHLkjbC47MAk2PI/iTsXCOcIVczglSpy2LNsGsGN0LV8aCgcaWEDxrHDucp0TNmWe4Q9IGG37X0S3TbZEpACFvN2sRMgNtQtPjvgmgtqiwGEglpXRsiiO3gd+XMLg5GUVqXDwZfgfSQY2+AAuZO94+i0NTcMF2wJOqjSBlDAoGBAKqxDMDaTZ8DCev6e8SDf3i05FIeww6M9UAZfS4nrXGj9O9f6OEITlBNQ6I9bNQlxWbDpn1Sbu9K5U6/HCmDjn/rzneqP9AEaijwdQ62Upgu3yptTx4foTnrEl2wLlO09YCd/nEZ8AhQYmGCxuJEFs1Gt8+W9oOQRrH5A5SpoxPQ',
            'alipay.authentication.toolId': '9b76929cb19c4af693a04a3a0acab9d0'
        });
        console.log('授权完毕');
    }

    /**
     * 生成测试二维码
     * @param {string} appId 小程序Id
     * @param {string} project 项目路径
     * @param {object} params
     */
    static async preview(appId, project, params) {
        let param = {
            appId: appId,
            project: project,
        };
        Object.assign(param, params || {});

        const {
            qrcodeUrl,
            version
        } = await minidev.preview(param);
        param = null;
        return {
            qrcodeUrl,
            version
        };
    }

    /**
     * 上传提审
     * @param {string} appId 小程序Id
     * @param {string} project 项目路径
     * @param {object} params
     */
    static async upload(appId, project, params) {
        let param = {
            appId: appId,
            project: project,
        };
        Object.assign(param, params || {});

        const uploadResult = await minidev.upload(param, {
            onLog: (data) => {
                // 输出日志
                console.log(data);
            }
        });
        param = null;
        // 打印上传版本
        console.log(uploadResult.version);
    }
}

module.exports = Mini;
