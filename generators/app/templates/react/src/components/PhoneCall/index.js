import React from 'react';
import './index.less';
// 客服组件
class PhoneCall extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      const {config} = this.props
      if (this.props.data) {
        return (
          <div className="bot_fixedbg" onClick={this.props.handleCloseCall}>
            <div className="bot_fixed bot_fixed_tel_transform_show" id="bot_fixed">
              <ul className="bot_fixed_ul">
                <li className="bot_fixed_tel">
                  <img src={config.service.serviceIcon} className="bot_fixed_tel_icon" />
                  <a href={'tel:' + config.service.serviceTel}>
                    {config.service.serviceTel}
                    <span>（{config.service.serviceTime}）</span>
                  </a>
                </li>
                <li className="bot_fixed_close jscloseserver" onClick={this.props.handleCloseCall}>
                  取消
                </li>
              </ul>
            </div>
          </div>
        );
      }
      return <div></div>;
    }
  }

  export default PhoneCall