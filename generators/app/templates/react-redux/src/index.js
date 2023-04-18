import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import RouterMap from './routers';
import './index.less';
import store from './store'
import './utils/rem.js'

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
        <RouterMap />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);