Component({
    data: {
        formIdStatus: my.canIUse('form.report-submit')
    },
    props: {
        onCancel: () => console.log('取消按钮没有传递函数'),
        onComfirm: () => console.log('确定按钮没有传递函数'),
        onCancelModalContainer: () => console.log('点击空白处没有传递函数'),
        confirmText: '',
        cancelText: false,
        lineType: '',
        titleText: ''
    },
    methods: {
        cancelModal () {
            this.props.onCancel()
        },
        confirmModal (e) {
            this.props.onComfirm(e)
        },
        cancelModalContainer () {
            this.props.onCancelModalContainer()
        },

    }
})
