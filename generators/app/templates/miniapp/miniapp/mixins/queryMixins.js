// queryMixins.js
const app = getApp();

/**
 * 区分渠道，处理query相关逻辑
 */

export default {
    data: {
        query: {}
    },
    onLoad(query) {
        console.log('*****query******', query, app.globalData);
        const myQuery = { ...query };
        const isQueryEmpty = JSON.stringify(myQuery) === '{}';
        const globalQuery = app.globalData.query ? { ...app.globalData.query } : {};
        // 合并globalquery
        const handleQuery = isQueryEmpty ? globalQuery : { ...globalQuery, ...myQuery };
        if (!Object.keys) {
            Object.keys = function (obj) {
                let k = [];
                for (let p in obj) {
                    if (!Object.prototype.hasOwnProperty.call(obj, p)) continue;
                    k.push(p);
                }
                return k;
            };
        }
        // 处理渠道
        const hasPageSource = Object.keys(handleQuery).find(item => item === 'pageSource' || item === 'sourceId');
        if (hasPageSource) {
            handleQuery.channel = handleQuery[hasPageSource];
            delete handleQuery[hasPageSource];
        }
        // 不能让globalData.query的渠道码干扰二级页面渠道，所以要剔除globalQuery的渠道码
        // app.globalData.query = {};
        console.log('*****handleQuery******', handleQuery, app.globalData);
        // 统一存入query
        this.setData({
            query: {
                acCode: app.globalData.acCode,
                ...handleQuery
            }
        });
    },
};
