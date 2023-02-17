import React from 'react';
import './index.less';
// 抽奖按钮组件
class DrawBtn extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const {config, drawType} = this.props
      const hasDrawItem = config.activity_draw_btns.find(item => item.type == drawType)
      if(!hasDrawItem) return ''
      return (
        <div className={`index_btn moreGift`}>
          <img
            src={hasDrawItem.image}
            data-type={drawType}
            data-url={hasDrawItem.link}
            data-name={drawType}
            onClick={this.props.handleBtnClick}
          />
        </div>
      );
    }
  }

  export default DrawBtn