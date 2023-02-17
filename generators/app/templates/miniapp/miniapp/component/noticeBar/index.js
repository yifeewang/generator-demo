Component({
    props: {
        isY: true,
        list: [
            // {
            //     title: "7分钟前 208***678提现了1元"
            // },
            // {
            //     title: "23分钟前 208***678提现了0.1元"
            // },
            // {
            //     title: "44分钟前 208***678提现了0.5元"
            // }
        ],
        notice: ""
    },
    didMount() {
        const { isY } = this.props;
        !isY && this.autoChangeX();
    },
    methods: {
        autoChangeX () {
            // 定义初始第一条的内容
            let index = 0;
            const { list } = this.props;
            this.setData({
                notice: list[0].title
            });
            index++;
            // 设置定时器，和动画时间间隔相等
            // 每隔6秒更换X轴公告的内容
            setInterval(() => {
                if (index === list.length - 1) {
                    this.setData({
                        notice: list[index].title
                    });
                    index = 0;
                } else {
                    this.setData({
                        notice: list[index].title
                    });
                    index++;
                }
            }, 1000 * 6);
        }
    }
});
