import React from 'react';
import { withRouter } from "react-router-dom";
import './index.less';
import {
    MD,
    alipayOpenId,
    GET_PRIZE_LIST,
    handleUserInfo,
    channel,
    pushWindow,
    reportAdvertisingEvents
} from '@/services/index.js';
import {
    Loading,
    GiftItem,
    FloatModal
} from '@/components';
import {
    myLoading,
    myToast,
    SUCESS_CODE,
    throttle,
    isEmojiCharacter,
    validateMoblie,
    handleUrl
} from '@/utils'

class Gift extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prizeList: [],
            config: null,
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
            uid: ''
        }
    }

    componentDidMount() {
        // ======= this is iframe ===========
        GY.init({
            onConfig: config => {
                this.setState({
                    config: config.pageConfig || {},
                }, () => {
                    this.checkPrize()
                })
                this.setTitle(config.pageConfig.activity_top.prize_title)
            }
        })
    }

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

    // 查看我的奖品
    checkPrize = async () => {
        const { config } = this.state
        const { acCode } = config?.activity_top
        myLoading.showLoading()
        const result = await GET_PRIZE_LIST({ uid: alipayOpenId, acCode })
        myLoading.hideLoading()
        console.log('checkPrize', result)
        if (result?.code === SUCESS_CODE) {
            if (!result?.result?.length) {
                myToast.showToast('这里空空如也~T_T,快去抽奖吧！')
                return
            }
            let prizeList = []
            result.result.forEach(item => {
                if (item.prizeType === 'PRIZE_BAG') {
                    const prizeBagContentList = item.prizeBagContentList.map(i => {
                        return {
                            ...i,
                            gmtCreate: item.gmtCreate,
                            id: item.id
                        }
                    })
                    prizeList = [...prizeList, ...prizeBagContentList]
                } else {
                    prizeList.push(item)
                }
            })
            console.log('prizeList', prizeList)
            this.setState({
                prizeList
            })
        } else {
            myToast.showToast('暂无奖品信息')
        }
    };

    handleBtnClick = throttle((data) => {
        console.log("handleBtnClick", data)
        const {prizeType, prizeName, prizeVerifyUrl, remark, prizeId, advertInfo} = data
        let json = {
            spm_value: 'a70.p296.m905.b1341',
            action: '1',
            uid: alipayOpenId,
            other: {
                ext_0: this.state.config?.activity_top?.acCode || '未获取到',
                ext_1: prizeName
            }
        };
        if (prizeType === 'TUIA_ADVERT' && advertInfo) {
            reportAdvertisingEvents('click', data);
        } 
        if (prizeType === 'IN_KIND' && !remark) {
            //处理实物奖
            this.setState({
                floatList: {
                    floatType: '5'
                },
                prizeType,
                prizeId
            });
        } else if (prizeType === 'IN_KIND' && remark) {
            
        } else {
            json.other.source_url = handleUrl(prizeVerifyUrl, channel)
            const btnUrl1 = handleUrl(prizeVerifyUrl, channel);
            pushWindow(btnUrl1, this);
        }
        MD({...json});
    }, 1000)
    // 处理弹窗的关闭
    handleCloseModel = (e) => {
        this.setState({
            floatList: {
                floatType: '0',
            },
        });
    }
    // 处理用户提交中奖信息
    handleUserSend = throttle((e) => {
        const {prizeId, prizeType} = this.state;
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

    render() {
        const {prizeList, config} = this.state
        if(!config) return ''
        return (
            <div className="gift_wraper">
                {
                    prizeList.length
                    ?
                    <div className="gift_content">
                    {
                        prizeList.map((item, index) => {
                            return (
                                <GiftItem 
                                    key={index}
                                    data={item} 
                                    handleBtnClick={this.handleBtnClick}
                                ></GiftItem>
                            )
                        })
                    }
                    </div>
                    :
                    <div className="gift_no_prize">暂无奖品信息!</div>
                }
                <FloatModal
                    config={config}
                    data={this.state.floatList}
                    prizeId={this.state.prizeId}
                    handleCloseModel={this.handleCloseModel}
                    handleUserSend={this.handleUserSend}
                    onChange={this.onChange}
                ></FloatModal>
            </div>
        );
    }
}

export default withRouter(Gift);
