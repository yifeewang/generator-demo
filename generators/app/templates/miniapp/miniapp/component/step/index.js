const Alipay = require('/utils/Alipay');
Component({
    props: {
        currentStep: 0,
        stepArr: [],
        onBoxClick: (e) => console.log("点击宝箱"),
    },
    methods: {
        onBoxClick: Alipay.throttle(function(e) {
            this.props.onBoxClick(e);
        }, 500)
    }
});
