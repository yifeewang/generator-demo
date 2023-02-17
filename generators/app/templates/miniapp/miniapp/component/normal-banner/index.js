const Alipay = require("/utils/Alipay");
const app = getApp();
Component({
    data: {
        // 组件内部数据
        indicatorDots: true,
        autoplay: true,
        vertical: false,
        interval: 4000,
        circular: true,
    },
    props: {
        /// /可给外部传入的属性添加默认值
        config: {},
        bannerList: [], // banner列表
        pageName: "",
        onChargeBtnClick: () => {},
        type: "", // 用于同一个页面不同banner位置的标记
    },
    didMount() {
        console.log("didMount", this.props.bannerList);
    },
    deriveDataFromProps(nextProps) {},
    methods: {
        // 自定义方法
        bannerClick(e) {
            this.$page.goPage(e);
            if (this.props.onBannerClick) {
                this.props.onBannerClick(e);
            }
        },
    },
});
