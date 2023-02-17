import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import RouterMap from './routers';
import './index.css';
import store from './store'
import reportWebVitals from './reportWebVitals';
import './utils/rem.js'

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
        <RouterMap />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
