import React from 'react';
import './index.less';

class Rule extends React.Component {
    render() {
        const {config} = this.props
        return (
          <div className="rule_wraper" style={{backgroundColor: config.activity_rule.backgroundColor}}>
            <img className="rule_title" src={config.activity_rule.title}></img>
            <div className="rule_content_wraper">
                <p className="rule_content" dangerouslySetInnerHTML = {{ __html: config.activity_rule.content }}></p>
            </div>
          </div>
        );
  } 
}

  export default Rule