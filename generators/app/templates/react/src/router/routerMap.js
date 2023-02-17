import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import App from '../pages/App/App'
import Gift from '../pages/Gift'

class ReactMap extends React.Component {

  render() {
    return (
      <Router history={this.props.history}>
        <Route exact path="/" component={App} />
        <Route exact path="/gifts" component={Gift} />
      </Router>
    )
  }
}

export default ReactMap;