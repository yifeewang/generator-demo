import React from "react";
import ReactDOM from "react-dom";
import Login from './components/Login.tsx';
import './utils/rem.js';
import './index.less';


export default function App() {
  return (
    <div>
      <h2>我是gy-react-app</h2>
      <Login />
    </div>
  )
}

const root = document.getElementById("root");
ReactDOM.render(<App />, root);