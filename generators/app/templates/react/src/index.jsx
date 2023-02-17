import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RouterMap from './router/routerMap';
import './utils/rem.js'

(function () {
    var query_str = window.location.href;

    if(query_str.indexOf('debug=true')>0||query_str.indexOf('env=dev')>0||query_str.indexOf('env=test')>0||query_str.indexOf('env=prod')>0){

        var script = document.createElement('script');
        script.src="https://xiaojinhe-cdn.iyoudui.com/cdn/eruda.min.js";
        document.body.appendChild(script);
        script.onload = function () {
            eruda.init()
        }
    }
  })();

ReactDOM.render(
  <React.StrictMode>
    <RouterMap />
  </React.StrictMode>,
  document.getElementById('root')
);
