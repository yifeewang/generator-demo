import React, {useEffect} from 'react';
import { AppType } from '@infras/shared/types';
import { sum } from '@infras/shared/utils';
import {Component as MyComponent} from '@infras/ui/react';
// import {useSelector, useDispatch} from 'react-redux';
import {selectedSize}  from '@/store/actions/appActions/appActionCreator'
import logo from '@/logo.svg';
import './App.css';

// useSelector useDispatch  navigate 统统在路由层处理传递下来

function Index(props) {
    const {dispatch, navigate, useSelector} = props
    const state = useSelector((state) => {
        console.log(9999,state)
        return { app: state.app }
    });
    const toRule = () => {
        navigate('/rules')
        // selectedSize(state.app.selectedSize + 1, dispatch)
    }
    console.log('index', props)
  return (
    <div className="App">
      <header className="App-header">
        <h2>Create React App</h2>
        <img src={logo} className="App-logo" alt="logo" />
        {state.app.selectedSize}
        <button onClick={toRule}>dianwo</button>
        <MyComponent />
        <p>
        AppType.Web is {AppType.Web}
        </p>
        <p>
        sum(1, 1) is {sum(1, 1)}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Index;
