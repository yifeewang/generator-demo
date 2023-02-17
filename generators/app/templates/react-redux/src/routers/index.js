import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
// import { KeepaliveRouterSwitch ,KeepaliveRoute ,addKeeperListener } from 'react-keepalive-router'
import App from '../pages/App'
import Rule from '../pages/Rule'

// 由于useNavigate 等hooks不能再class组件中引入，所以只能通过props穿进去
const WrapComps = (props)=> {
    const dispatch = useDispatch()
    let navigate = useNavigate();
    let params = useParams();
    let Element = props.el
    return <Element dispatch={dispatch} params={params} navigate={navigate} useSelector={useSelector} {...props} />
  }

 const routerMap =  (props) => {
     console.log('routerMap',props)
    return (
      <Router history={props.history}>
          <Routes>
            <Route exact path="/" element={<WrapComps el={App}/>} />
            <Route exact path="/rules" element={<WrapComps el={Rule}/>} />
          </Routes>
      </Router>
    )
};

export default routerMap;