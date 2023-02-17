import React from 'react';
import './index.less';

class Loading extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        return (
            <div>
                {
                    this.props.isLoading && 
                    <div className="loading">
                        <div className="weui-loadmore">
                            <div className="weui-loading"></div>
                            <span className="weui-loadmore__tips">{this.props.proContent || '正在加载'}</span>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Loading