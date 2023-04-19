/// <reference path="./index.d.ts" />
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import fyService from '@gyjx/fy-sdk/dist/index.js'
import RouterMap from './routers';
import './index.less';
import store from './store'
import './utils/rem.js'

window.fy = fyService;

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
        <RouterMap />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);