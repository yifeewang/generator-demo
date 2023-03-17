import React, {useEffect} from 'react';
import Login from '@/components/Login/Login';

import logo from '@/static/index_active.png';
import './App.less';

function Index(props) {
    const {dispatch, navigate, useSelector} = props
    const state = useSelector((state) => {
        console.log(9999,state)
        return { app: state.app }
    });
    const toRule = () => {
        navigate('/rules')
    }
    console.log('index', props)
  return (
    <div className="App">
      <header className="App-header">
        <h2>Create React App</h2>
        <img src={logo} className="App-logo" alt="logo" />
        {state.app.selectedSize}
        <button onClick={toRule}>go to rule</button>
        <Login />
      </header>
    </div>
  );
}

export default Index;
