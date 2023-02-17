Page({
    data: {
        url: '', // 链接
    },
    onLoad (query) {
        console.log('query');
        console.log(query);
        this.setData({
            url: query.url
        });
    },
});
