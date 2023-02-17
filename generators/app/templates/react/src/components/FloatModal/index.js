import React from 'react';
import { RenderPrize } from '@/components'
import { titles } from '@/utils'
import './index.less';
// 弹窗组件
class FloatModal extends React.Component {
    constructor(props) {
        super(props);
        // eslint-disable-next-line no-console
        // console.log(props);
        this.state = {
            userName: '',
            userPhone: '',
            userAddress: '',
        };
    }
    render() {
        const { config } = this.props
        const { floatType, getPrizeList } = this.props.data
        const hasDrawItem = config.activity_draw_btns.find(item => item.type == '3')
        if (floatType == '0') { //关闭弹窗
            return <div className="none"></div>;
        }
        else if (floatType == '4' && getPrizeList) {//我的奖品
            if(getPrizeList.length === 1) {
                return (
                    <div className="dialog">
                        <div className="box-single">
                            <div className="closeImg delayShow" data-type='modal_prize' onClick={this.props.handleCloseModel}></div>
                            <div className='single_content'>
                                <img className='single_content_icon' src={getPrizeList[0].prizeImageUrl}/>
                                <div className='single_content_name'>{getPrizeList[0].prizeName}</div>
                                <div className='single_content_desc'>{getPrizeList[0].prizeDesc}</div>
                            </div>
                            <div 
                                className='single_btn'
                                data-url={getPrizeList[0].prizeVerifyUrl}
                                onClick={
                                    () => {
                                      this.props.handlePrizeType({
                                              prizeId: getPrizeList[0].userPrizeId || getPrizeList[0].id,
                                              prizeType: getPrizeList[0].prizeType,
                                              prizeItem: getPrizeList[0],
                                              prizeUrl: getPrizeList[0].prizeVerifyUrl
                                          })
                                      }
                                }
                            ></div>
                            <div 
                                className='more_btn'
                                src={hasDrawItem.image}
                                data-type='modal_prize'
                                data-url={hasDrawItem.link}
                                data-name='modal_prize'
                                onClick={this.props.handleBtnClick}
                            ></div>
                        </div>
                    </div>
                )
            }
            return (
                <div className="dialog dialog_bg">
                    <div className="box_new">
                        <div className="closeImg1" data-type='modal_prize' onClick={this.props.handleCloseModel}></div>
                        <div className="box_new_title"></div>
                        <div className="box_new_desc">请进入支付宝卡包查看</div>
                        <div className="box_new_light"></div>
                        <div className="prizeList_myPrize">
                            <RenderPrize
                                data={getPrizeList}
                                floatType={floatType}
                                handlePrizeType={this.props.handlePrizeType}
                            ></RenderPrize>
                        </div>
                        <div 
                            className='more_btn_2'
                            data-type='modal_prize'
                            data-url={hasDrawItem.link}
                            data-name='modal_prize'
                            onClick={this.props.handleBtnClick}
                        ></div>
                    </div>
                </div>
            );
        } else if (floatType == '5') {//填写信息 领实物大奖 
            return (
                <div className="dialog inputAddressDialog">
                    <div className="box">
                        <div className="closeImg" onClick={this.props.handleCloseModel}></div>
                        <div className="modal_title"><div>{titles.emailTitle}</div></div>
                        <div className="content-box">
                            <div className="content">
                                <div className="inpt-wrap">
                                    <img
                                        src="https://mdn.alipayobjects.com/merchant_appfe/afts/img/A*QwcfS4QZgIoAAAAAAAAAAAAADiR2AQ/.png"
                                        className="icon"
                                    />
                                    <input
                                        className="name"
                                        type="text"
                                        maxLength="15"
                                        defaultValue={this.state.userName}
                                        onChange={this.props.onChange}
                                        placeholder="请输入收件人姓名"
                                        data-ipttype="name"
                                    />
                                </div>
                                <div className="inpt-wrap">
                                    <img
                                        src="https://mdn.alipayobjects.com/merchant_appfe/afts/img/A*0gQZSadxkS0AAAAAAAAAAAAADiR2AQ/.png"
                                        className="icon"
                                    />
                                    <input
                                        className="phone"
                                        type="tel"
                                        maxLength="11"
                                        defaultValue={this.state.userPhone}
                                        onChange={this.props.onChange}
                                        placeholder="请输入手机号码"
                                        data-ipttype="phone"
                                    />
                                </div>
                                <div className="inpt-wrap">
                                    <img
                                        src="https://mdn.alipayobjects.com/merchant_appfe/afts/img/A*nGqiR7vnUBcAAAAAAAAAAAAADiR2AQ/.png"
                                        className="icon"
                                    />
                                    <input
                                        className="address"
                                        maxLength="30"
                                        type="text"
                                        placeholder="请输入收货地址"
                                        defaultValue={this.state.userAddress}
                                        onChange={this.props.onChange}
                                        data-ipttype="address"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal_bottom_bg">
                            <img
                                src='https://xiaojinhe-cdn.iyoudui.com/activity/MOREQ-440/submit_btn.webp'
                                data-type='3'
                                data-name='3'
                                data-prizeId={this.props.prizeId}
                                onClick={this.props.handleUserSend}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="dialog errDialog">
                    <div className="box">
                        <div className="closeImg" onClick={this.props.handleCloseModel}></div>
                        <div className="modal_title"><div>{floatType == '1' ? titles.emailErrTitle : titles.warmTitle}</div></div>
                        <div className="content-box">
                            <div className="content">
                                <div className="errDialog_msg">请稍后刷新再试</div>
                            </div>
                        </div>
                        <div className="err_bg">
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default FloatModal