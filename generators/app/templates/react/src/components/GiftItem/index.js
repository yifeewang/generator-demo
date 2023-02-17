import React from 'react';
import {
    myToast
} from '@/utils'
import './index.less';

class GiftItem extends React.Component {
    //h5复制文本到剪切板
    copyContentH5 = (content) => {
        var copyDom = document.createElement('div');
        copyDom.innerText = content;
        copyDom.style.position = 'absolute';
        copyDom.style.top = '0px';
        copyDom.style.right = '-9999px';
        document.body.appendChild(copyDom);
        //创建选中范围
        var range = document.createRange();
        range.selectNode(copyDom);
        //移除剪切板中内容
        window.getSelection().removeAllRanges();
        //添加新的内容到剪切板
        window.getSelection().addRange(range);
        //复制
        var successful = document.execCommand('copy');
        copyDom.parentNode.removeChild(copyDom);
        try {
            var msg = successful ? "successful" : "failed";
            myToast.showToast('复制成功！')
            console.log('Copy command was : ' + msg);
        } catch (err) {
            console.log('Oops , unable to copy!');
            myToast.showToast('复制失败，请稍后再试！')
        }
    }

    render() {
        const { data, handleBtnClick } = this.props
        const hasExchange = data.prizeType === 'IN_KIND' && data.remark
        return (
            <div className="gift_item">
                <div className="gift_item_top">
                    <img className="gift_item_img" src={data.prizeImageUrl}></img>
                    <div className="gift_item_content">
                        <div>{data.prizeName}</div>
                        <div>{data.prizeDesc}</div>
                        <div>抽奖时间：{data.gmtCreate}</div>
                    </div>
                    <div
                        className={`gift_item_btn ${hasExchange ? 'gift_item_over' : ''}`}
                        onClick={() => {
                            handleBtnClick(data)
                        }}
                    >
                        <div>
                            {
                                data.prizeType === 'IN_KIND'
                                    ?
                                    (!hasExchange ? '去领取' : '已领取')
                                    :
                                    '立即查看'
                            }
                        </div>
                    </div>
                </div>
                <div className="gift_item_bottom">
                    <div>订单编号：{data.id}</div>
                    <div onClick={() => {this.copyContentH5(data.id)}}>复制</div>
                </div>
            </div>
        );
    }
}

export default GiftItem