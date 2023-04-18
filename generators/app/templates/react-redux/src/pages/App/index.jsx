import React, {useEffect} from 'react';
import fy from '@gyjx/fy-sdk/dist/index.js'
import config from '@/services/config'
import { deleteDisbaled } from '@/store/actions/appActions/appActionCreator'
import Login from '@/components/Login/Login';
import logo from '@/static/index_active.png';
import './App.less';
// 打开调试帮助
// fy.debug = true

function Index(props) {
    const {dispatch, navigate, useSelector} = props
    const state = useSelector((state) => {
        console.log(9999,state)
        return { app: state.app }
    });
    useEffect(() => {
        // 初始化海星配置
        hx.init({
            onConfig: (config) => {
                console.log(1111, config)
                //   store.commit('SET_APP_CONFIG', config.appConfig)
                //   store.commit('SET_PAGE_CONFIG', config.pageConfig)
                  dispatch(deleteDisbaled(10))
                // fy.setStore({
                //     appId: 'xxx',
                //       env: config.env, // 指定环境，默认prod
                //     // h5传uid; 小程序不用，接口会自动获取authCode
                //     uid: 'xxx',
                // })
                // fy.common.getActivityInfo(params, option)
            }
        })
    }, [])
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
