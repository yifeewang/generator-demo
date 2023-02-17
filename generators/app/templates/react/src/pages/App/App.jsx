/* eslint-disable react/prop-types */
import React from 'react';
import { withRouter } from "react-router-dom";
import './App.less';
import {
    Loading,
    PhoneCall,
    Rule,
    FloatModal,
    DrawBtn
} from '@/components'
import {
    SvAdRequest,
    MD,
    adMD,
    channel,
    saveBuryUrl,
    lunaSessionId,
    setLunaSessionId,
    alipayOpenId,
    GET_PRIZE_LIST,
    GET_AC_INFO_ALL,
    activityDraw,
    handleUserInfo,
    couponBillJson,
    pushWindow,
    reportAdvertisingEvents
} from '@/services/index.js';
import {
    myLoading,
    myToast,
    formatDate,
    SUCESS_CODE,
    terminal,
    isEmojiCharacter,
    validateMoblie,
    handleUrl,
    throttle
} from '@/utils'
import Swiper,{SwipeRef} from 'react-tiga-swiper'
import 'react-tiga-swiper/dist/index.css';
// import './services/alipayjsapi.min.js'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFirstInPage: true, // 是否是第一次访问页面
            config: {},
            drawType: '0', // 0不展示 2（查看更多权益） 1抽奖（立即领取）
            floatList: {
                floatType: '0', // 0不展示 1领取失败 2温馨提示 4奖品弹窗 5填写实物大奖 
                getPrizeList: [], //抽奖所获得的奖品
                myPrizeList: [], //用户已获取的奖品,
                desc: '',
                titleUrl: '', //普通弹框需要传
                prizeInfo: ''
            },
            // 实物领取
            userName: '', //姓名
            userPhone: '', //电话
            userAddress: '', //地址
            prizeId: '', //奖品id
            prizeType: '', // 奖品类型
            // 星火banner位
            middleBannerInfo: [], // 腰部banner
        };
    }

    componentDidMount() {
        // ======= this is iframe ===========
        const { editor } = GY.getParams()
        GY.init({
            onConfig: config => {
                this.setState({
                    config: config.pageConfig || {},
                })
                saveBuryUrl(config.pageConfig.activity_top)
                this.setTitle(config.pageConfig.activity_top.activity_title)
                // 要确保拿到config才能调用后续接口
                this.alipayAction();
                if (editor) return
                // let json = {
                //     spm_value: 'a70.p296',
                //     action: '2',
                //     uid: alipayOpenId,
                //     other: {
                //         ext_0: config?.pageConfig?.activity_top?.acCode || '未获取到'
                //     }
                // };
                // MD(json);
            }
        })
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    alipayAction = () => {
        //不是支付宝环境则进行渲染
        const self = this
        setTimeout(() => {
            if (!window.AlipayJSBridge) {
                this.init();
            }
        }, 1000);
        // document.addEventListener(
        //     'pageResume',
        //     (e) => {
        //         console.log('*****pageResume*****', e);
        //         self.init();
        //     },
        //     false,
        // );
        document.addEventListener(
            'resume',
            (e) => {
                console.log('*****pageResume*****', e);
                self.init();
            },
            false,
        );

        function ready(callback) {
            if (window.AlipayJSBridge) {
                console.log('*****AlipayJSBridge******');
                callback && callback();
            } else {
                console.log('*****notAlipayJSBridge******');
                // 如果没有注入则监听注入的事件
                document.addEventListener('AlipayJSBridgeReady', callback, false);
            }
        }
        ready(function () {
            console.log('*****resume******');
            self.init();
        });
    };

    setTitle = (title) => {
        if (title) {
            console.log('setTitle', title)
            document.title = title;
            const userAgent = window.navigator.userAgent.toLowerCase();
            if (/AlipayClient/i.test(userAgent) && ant) {
                ant.setTitle(title);
            }
        }
    }
    // 查询活动详情
    getActivityInfo = async () => {
        const acCode = this.state.config.activity_top?.acCode
        // myLoading.showLoading()
        // ============获取用户信息，主要获取时间 标题 lunasessionid，=============
        const result = await GET_AC_INFO_ALL({ acCode, uid: alipayOpenId })
        if (result?.code != SUCESS_CODE || !result?.result) {
            myLoading.hideLoading()
            myToast.showToast(result?.message || '请稍后再试')
            return
        }
        // 保存lunaSessionId， 存在后续则不用传uid
        if (!lunaSessionId) {
            setLunaSessionId(result?.lunaSessionId)
        }
        const { acStartTime, acEndTime } = (result?.result) || {}
        // 活动时间结束
        if (acEndTime && (new Date() > new Date(acEndTime))) {
            myToast.showToast('敬请期待下期活动！')
            return
        }
        // 活动还没开始
        if (acStartTime && (new Date() < new Date(acStartTime))) {
            myToast.showToast(`活动开始时间：${formatDate(acStartTime, 'YYYY年MM月dd日')}`)
            return
        }
        // ======== 根据remainingCount来判断用户是否抽过奖 ===========
        if (result?.result?.isDrawVO?.remainingCount) {
            this.setState({
                drawType: '1' // 立即领取
            })
        } else {
            this.setState({
                drawType: '2' // 更多福利
            })
        }
        if (this.state.isFirstInPage) {
            let json1 = {
                spm_value: 'a70.p296',
                action: '2',
                uid: alipayOpenId,
                other: {
                    ext_0: acCode || '未获取到'
                }
            };
            MD(json1);
            this.setState({
                isFirstInPage: false
            })
        }
        myLoading.hideLoading()
    }
    // handleOnLoad = (e) => {
    //     console.log('handleOnLoad')
    //     const url = e.currentTarget.getAttribute('data-url');
    //     const type = e.currentTarget.getAttribute('data-type');
    //     const index = e.currentTarget.getAttribute('data-index') || '';
    //     const ideaId = e.currentTarget.getAttribute('data-ideaid');
    //     const sceneCode = e.currentTarget.getAttribute('data-code');
    //     const viewUrl = e.currentTarget.getAttribute('data-viewurl');
    //     const { config } = this.state;
    //     const { mid_see_burySpm } = config?.sceneGroupCode || {}
    //     if (type == 'banner') {
    //         let json = {
    //             spm_value: mid_see_burySpm ? mid_see_burySpm : 'a70.p296.m907.b1343',
    //             action: '3',
    //             uid: alipayOpenId,
    //             other: {
    //                 ad_idea_id: ideaId,
    //                 ad_unit_id: sceneCode,
    //                 item_text: viewUrl,
    //                 site_id: Number(index) + 1,
    //                 ext_0: this.state.config?.activity_top?.acCode || '未获取到',
    //                 source_url: handleUrl(url, channel)
    //             },
    //         };
    //         adMD({...json});
    //     }
    // };
    handleLinkBtn = throttle((e) => {
        const url = e.currentTarget.getAttribute('data-url');
        const type = e.currentTarget.getAttribute('data-type');
        const index = e.currentTarget.getAttribute('data-index') || '';
        const ideaId = e.currentTarget.getAttribute('data-ideaid');
        const sceneCode = e.currentTarget.getAttribute('data-code');
        const viewUrl = e.currentTarget.getAttribute('data-viewurl');
        const sceneGroupCode = e.currentTarget.getAttribute('data-codes');
        const isNotice = e.currentTarget.getAttribute('data-isnotice');
        const {
            middleBannerInfo,
            config
        } = this.state;
        const { banner_click_burySpm } = config?.sceneGroupCode || {}
        if (type == 'banner') {
            let json = {
                spm_value: banner_click_burySpm ? banner_click_burySpm : 'a70.p296.m907.b1343',
                action: '1',
                uid: alipayOpenId,
                other: {
                    ad_idea_id: ideaId,
                    ad_unit_id: sceneCode,
                    item_text: viewUrl,
                    site_id: Number(index) + 1,
                    ext_0: this.state.config?.activity_top?.acCode || '未获取到',
                    source_url: handleUrl(url, channel)
                },
            };
            const paramData = {  //只是一个例子 参数任意js对象
                sceneCode: sceneCode,
                operation: 'click',
                sceneGroupCode: sceneGroupCode,
                uid: alipayOpenId,
                nth: 1
            };
            (isNotice == '1') && couponBillJson({ params: paramData });
            adMD(json);
            const btnUrl = handleUrl(url, channel);
            pushWindow(btnUrl, this);
        }
    }, 1000);
    // 点击主按钮
    handleBtnClick = throttle((e) => {
        const btnType = e.currentTarget.getAttribute('data-type');
        const btnName = e.currentTarget.getAttribute('data-name');
        const btnUrl = e.currentTarget.getAttribute('data-url');
        console.log('handleBtnClick', btnType)
        let json = {
            spm_value: btnType === 'modal_prize' ? 'a70.p296.m906.b1342' : 'a70.p296.m904.b1340',
            action: '1',
            uid: alipayOpenId,
            other: {
                ext_0: this.state.config?.activity_top?.acCode || '未获取到',
                ext_1: btnName === 'modal_prize' ? '3' : btnName
            },
        };
        if (btnName === 'modal_prize') {
            json.other.ext_2 = '查看更多权益'
        }
        if (btnType != '1') {
            json.other.source_url = handleUrl(btnUrl, channel)
        }
        MD({ ...json });
        if (btnType != '1') {
            const btnUrl1 = handleUrl(btnUrl, channel);
            pushWindow(btnUrl1, this);
        } else {
            // 执行抽奖
            this.startDraw();
        }
    }, 1000);
    // 打开客服组件
    showPhoneCall = throttle((e) => {
        this.setState({
            visible: true,
        });
    }, 1000);
    // 关闭客服组件
    handleCloseCall = (e) => {
        this.setState({
            visible: false,
        });
    };
    // 处理弹窗的关闭
    handleCloseModel = (e) => {
        const btnType = e.currentTarget.getAttribute('data-type');
        if (btnType === 'modal_prize') {
            let json = {
                spm_value: 'a70.p296.m906.b1342',
                action: '1',
                uid: alipayOpenId,
                other: {
                    ext_0: this.state.config?.activity_top?.acCode || '未获取到',
                    ext_1: '2',
                    ext_2: '关闭'
                },
            };
            MD(json);
        }
        this.setState({
            floatList: {
                floatType: '0',
            },
        });
    };

    // 处理弹窗弹窗不同事件
    handlePrizeType = ({ prizeId, prizeType, prizeItem, prizeUrl }) => {
        let json = {
            spm_value: 'a70.p296.m906.b1342',
            action: '1',
            uid: alipayOpenId,
            other: {
                ext_0: this.state.config?.activity_top?.acCode || '未获取到',
                ext_1: prizeType === 'IN_KIND' ? '1' : '0',
                ext_2: prizeItem.prizeName
            },
        };
        (prizeType !== 'IN_KIND') && (json.other.source_url = handleUrl(prizeUrl, channel))
        MD({...json});
        if (prizeType === 'TUIA_ADVERT' && prizeItem.advertInfo) {
            reportAdvertisingEvents('click', prizeItem);
        } 
        if (prizeType === 'IN_KIND') {
            //处理实物奖
            this.setState({
                floatList: {
                    floatType: '5'
                },
                prizeId,
                prizeType
            });
        } else {
            const btnUrl = handleUrl(prizeUrl, channel);
            pushWindow(btnUrl, this);
        }
    };
    // input框value变化
    onChange = (e) => {
        const ipttype = e.currentTarget.getAttribute('data-ipttype');
        if (ipttype == 'name') {
            this.setState({
                userName: e.currentTarget.value,
            });
        }
        if (ipttype == 'phone') {
            this.setState({
                userPhone: e.currentTarget.value.slice(0, 11),
            });
        }
        if (ipttype == 'address') {
            this.setState({
                userAddress: e.currentTarget.value,
            });
        }
    };
    // 处理用户提交中奖信息
    handleUserSend = throttle((e) => {
        const prizeId = e.currentTarget.getAttribute('data-prizeId');
        const prizeType = e.currentTarget.getAttribute('data-type');
        console.log('prizeId', prizeId, prizeType);
        console.log('点击提交');
        console.log(this.state.userName, this.state.userPhone, this.state.userAddress);
        console.log('提交结束');
        if (
            (
                !this.state.userName.trim() ||
                this.state.userName.length < 2 ||
                this.state.userName.length > 15 ||
                isEmojiCharacter(this.state.userName)
            ) && prizeType != '13'
        ) {
            console.log('姓名有误');
            myToast.showToast('请输入正确的姓名');
            return;
        }
        if (!this.state.userPhone.trim() || !validateMoblie(this.state.userPhone)) {
            console.log('手机号有误');
            myToast.showToast('请输入正确的手机号');
            return;
        }
        if (
            (
                !this.state.userAddress.trim() ||
                this.state.userAddress.length < 5 ||
                this.state.userAddress.length > 30
            ) && prizeType != '13'
        ) {
            console.log('地址有误');
            myToast.showToast('请输入正确的地址');
            return;
        }
        this.saveAddressInfo();
    }, 1000);
    // 根据展位码查询星火的广告
    queryStarHot = () => {
        const { banner_sceneCode, float_sceneCode } = this.state.config?.sceneGroupCode || {}
        let codeArr = [banner_sceneCode, float_sceneCode]
        codeArr = codeArr.filter(item => item)
        const sceneGroupCode = codeArr.join(',')
        const queryParams = {
            sceneGroupCode: sceneGroupCode.replace(/_/g, ','),
            userId: alipayOpenId,
            receiptType: 'SERVICE_C_0101',
            terminal: terminal()
        }
        SvAdRequest('/gaoyang/rpOnlReceiptGeneralMulitService/dv/1.0/adBill', 'get', queryParams).then((res) => {
            // const { middleBanner, bottomBanner, adBanner, floatBanner } = getBannerCode()
            const { data, code } = res || {}
            const resKeys = Object.keys(data || {})
            if (code && parseInt(code) === 10000) {
                if(!resKeys.length) {
                    this.setState({
                        middleBannerInfo: []
                    })
                    return
                }
                resKeys.forEach(item => {
                    if (banner_sceneCode.includes(item)) {
                        const { config } = this.state
                        const middleBannerInfo = [...data[item]]
                        const { banner_see_burySpm } = config?.sceneGroupCode || {}
                        // 曝光埋点
                        middleBannerInfo.forEach((ite, index) => {
                            let json = {
                                spm_value: banner_see_burySpm ? banner_see_burySpm : 'a70.p296.m907.b1343',
                                action: '3',
                                uid: alipayOpenId,
                                other: {
                                    ext_0: this.state.config?.activity_top?.acCode || '未获取到',
                                    ad_idea_id: ite.ideaId,
                                    ad_unit_id: ite.sceneCode,
                                    item_text: ite.ideaUrl?.viewUrl,
                                    source_url: ite.ideaUrl?.viewUrl,
                                    site_id: Number(index) + 1
                                },
                            };
                            adMD({...json});
                        })
                        this.setState({
                            middleBannerInfo,
                        })
                    }
                })
            } else {
                // myToast.showToast(res.msg);
            }
        });
    }
    // 初始化
    init = async () => {
        console.log('init', alipayOpenId)
        // 主活动
        await this.getActivityInfo()
        // 查星火广告
        this.queryStarHot()
    };
    // 查看我的奖品
    checkPrize = async () => {
        let json = {
            spm_value: 'a70.p296.m904.b1339',
            action: '1',
            uid: alipayOpenId,
            other: {
                ext_0: this.state.config?.activity_top?.acCode || '未获取到'
            }
        };
        MD(json);
        pushWindow('/gifts', this);
    };
    // 抽奖
    startDraw = async () => {
        const { config } = this.state
        const acCode = config?.activity_top?.acCode
        let params = {
            acCode,
            uid: alipayOpenId,
            drawPosition: 0,
            appFlowType: 3
        };
        myLoading.showLoading('正在抽奖')
        // 奖品包规则，多个奖品 只需调用一次即可
        const result = await activityDraw(params)
        console.log('startDraw', result)
        myLoading.hideLoading()
        if (parseInt(result?.code) === SUCESS_CODE) {
            let getPrizeList = result?.result?.prizeBagContentList || [result?.result] || []
            // const findSpecialIndex = getPrizeList.findIndex(i => i.prizeName === '购物补贴金')
            // const findSpecial = getPrizeList.find(i => i.prizeName === '购物补贴金')
            const filterSpecialLists = getPrizeList.filter(i => i.prizeName === '购物补贴金')
            const filterNormalLists = getPrizeList.filter(i => i.prizeName !== '购物补贴金')
            getPrizeList = [...filterSpecialLists, ...filterNormalLists];
            getPrizeList.forEach(item => {
                if (item.prizeType === 'TUIA_ADVERT' && item.advertInfo) { // 推啊奖品
                    reportAdvertisingEvents(
                        'show',
                        item
                    );
                } 
                if(item.prizeName === '购物补贴金') {
                    item.special = true
                }
            })
            console.log('startDraw-getPrizeList', getPrizeList)
            this.setState({
                floatList: {
                    floatType: '4',
                    getPrizeList
                },
            });
        } else {
            myToast.showToast(result?.message || '请稍后再试');
        }
        this.getActivityInfo()
    };
    // 填写领奖信息saveAddressInfo
    saveAddressInfo = async () => {
        myLoading.showLoading()
        let params = {
            id: this.state.prizeId,
            phone: this.state.userPhone,
            name: this.state.userName,
            address: this.state.userAddress,
            drawType: this.state.prizeType,
        };
        const result = await handleUserInfo(params)
        myLoading.hideLoading()
        if (parseInt(result.code) === SUCESS_CODE) {
            myToast.showToast('提交成功');
            this.setState({
                floatList: {
                    floatType: '0',
                },
            });
        } else {
            this.setState({
                floatList: {
                    floatType: '1',
                },
                userPhone: '',
                userName: '',
                userAddress: ''
            });
        }
    };
    render() {
        const { config, middleBannerInfo } = this.state;
        if (JSON.stringify(config) === '{}') {
            return <Loading isLoading={true} proContent={'正在加载...'} />
        }
        return (
            <div className="pos_fixed" style={{ backgroundColor: config.activity_top.backgroundColor }}>
                {/* 头部抽奖区块 */}
                <div className="header" style={{ backgroundImage: `url(${config.activity_top.backgroundImage})` }}>
                    <div className="ac_title" style={{ backgroundImage: `url(${config.activity_top.titleImage})` }} />

                    <div className="make-call" onClick={() => this.showPhoneCall()}>
                        <img src={config.activity_top.phone_icon} />
                    </div>

                    <div className="myPrize" onClick={() => { this.checkPrize() }}>
                        <img src={config.activity_top.myPrize_icon} />
                    </div>
                    <DrawBtn config={config} drawType={this.state.drawType} handleBtnClick={this.handleBtnClick}>
                    </DrawBtn>
                </div>
                {/* 腰部星火banner */}
                {
                    middleBannerInfo.length 
                    ?
                    <Swiper
                        autoPlay={3000}
                        selectedIndex={0}
                        showIndicators={false}
                        showDots={middleBannerInfo.length > 1 ? true : false}
                        loop={middleBannerInfo.length > 1 ? true : false}
                        indicator={null}
                        dots={null}
                        // ref={swiperRef}
                        className="middle_banner_swiper"
                        onChange={(c, p) => {}}
                    >
                        {
                            middleBannerInfo.map((item,index) => {
                                return (
                                    <img
                                        key={item.ideaId + index}
                                        className="banner"
                                        src={item.picUrl}
                                        data-url={item.ideaUrl && item.ideaUrl.viewUrl}
                                        data-index={index}
                                        data-ideaid={item.ideaId}
                                        data-code={item.sceneCode}
                                        data-viewurl={item.ideaUrl?.viewUrl}
                                        data-codes={item.sceneGroupCode}
                                        data-isnotice={item.isNotice}
                                        data-type="banner"
                                        onClick={this.handleLinkBtn}
                                        // onLoad={this.handleOnLoad}
                                    />
                                )
                            })
                        }
                    </Swiper>
                    :
                    ""
                }
                {/* 规则区块 */}
                <Rule config={config}></Rule>
                <FloatModal
                    config={config}
                    data={this.state.floatList}
                    prizeId={this.state.prizeId}
                    handleCloseModel={this.handleCloseModel}
                    handlePrizeType={this.handlePrizeType}
                    handleUserSend={this.handleUserSend}
                    cancelMessageStatus={this.cancelMessageStatus}
                    handleBtnClick={this.handleBtnClick}
                    onChange={this.onChange}
                ></FloatModal>
                <PhoneCall data={this.state.visible} config={config} handleCloseCall={this.handleCloseCall}></PhoneCall>
                <Loading isLoading={myLoading.isLoading} proContent={myLoading.myContent} />
            </div>
        );
    }
}
export default withRouter(App);
