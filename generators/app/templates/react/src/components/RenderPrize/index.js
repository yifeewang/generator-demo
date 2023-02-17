import React from 'react';
import './index.less';

// 渲染奖品组件
class RenderPrize extends React.Component {
    constructor(props) {
      super(props);
      // console.log('renderPrize',props)
    }
    render() {
      const {floatType} = this.props
      const prizeList = this.props.data.map((item, index) => {
        if(item.special) {
            return (
                <div className='special_wraper' key={index}>
                    <div className='special_left_star'></div>
                    <div className='special_right_star'></div>
                    <div className='special_item'>
                        {/* <img className="special_prizeImg" src={item.prizeImageUrl} /> */}
                        <div className="special_left">
                            <div>{item.prizeExt}</div>
                            <div>元</div>
                        </div>
                        <div className='line_white'></div>
                        <div className="special_prizeWord">
                            <div className="special_prizeName">{item.prizeName}</div>
                            <div className="special_prizeDesc">{item.prizeDesc}</div>
                        </div>
                        <div
                            className="special_btn"
                            data-url={item.prizeVerifyUrl}
                            onClick={
                                () => {
                                    this.props.handlePrizeType({
                                            prizeId: item.userPrizeId || item.id,
                                            prizeType: item.prizeType,
                                            prizeItem: item,
                                            prizeUrl: item.prizeVerifyUrl
                                        })
                                    }
                            }
                        ></div>
                    </div>
                </div>
            )
        }
        return (
          <div className={!item.remark ? 'prizeInfoBg' : 'prizeInfoBg1'} key={index}>
            <div className={'prizeinfo1'} key={index}>
              <img className="prizeImg" src={item.prizeImageUrl} />
              <div className="prizeWord">
                <div className="prizeName">{item.prizeName}</div>
                <div className="prizeDesc">{item.prizeDesc}</div>
              </div>
              {(item.prizeType == 'IN_KIND' || item.prizeType == 'PHONE_RED_PACKET') ? (
                !item.remark ? (
                  <div
                    className="getBtn"
                    data-prizeId={item.userPrizeId || item.id}
                    onClick={
                        () => {
                          this.props.handlePrizeType({
                                  prizeId: item.userPrizeId || item.id,
                                  prizeType: item.prizeType,
                                  prizeItem: item,
                                  prizeUrl: item.prizeVerifyUrl
                              })
                          }
                    }
                    data-item={item}
                  >
                    <div>去领取</div>
                  </div>
                ) : (
                  <div className="usedBtn">
                      <div>已领取</div>
                  </div>
                )
              ) : (
                <div
                  className="prizeBtn"
                  data-url={item.prizeVerifyUrl}
                  onClick={
                      () => {
                        this.props.handlePrizeType({
                                prizeId: item.userPrizeId || item.id,
                                prizeType: item.prizeType,
                                prizeItem: item,
                                prizeUrl: item.prizeVerifyUrl
                            })
                        }
                  }
                >
                  <div>去使用</div>
                </div>
              )}
            </div>
          </div>
        );
      });
      return <div className='prize_wraper'>{prizeList}</div>;
    }
}

export default RenderPrize