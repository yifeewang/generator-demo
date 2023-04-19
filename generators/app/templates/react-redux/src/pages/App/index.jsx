import React, { useEffect } from 'react';
import config from '@/services/config'
import { set_url_params, set_hx_config, set_uid } from '@/store/actions/appActions/appActionCreator'
import Login from '@/components/Login/Login';
import logo from '@/static/index_active.png';
import style from './App.less';
// 打开调试帮助
// fy.debug = true

function Index(props) {
    const { dispatch, navigate, useSelector } = props
    const state = useSelector((state) => {
        console.log(1111, state)
        return { app: state.app }
    });
    // 扶摇
    const initData = (acCode) => {
        console.log("*****initData-fy*****", fy)
        console.log("*****initData-state*****", state)
        fy.common.getActivityInfo({acCode})
    }
    // 初始化sdk 海星配置
    const _init = (uid = '') => {
        // 初始化扶摇sdk
        fy.setStore({
            appId: state.app.appId,
            env: config.env, // 指定环境，默认prod
            // h5传uid; 小程序不用，接口会自动获取authCode
            uid,
        })
        // 访问埋点
        hx.log({
            action: 2, // 必传, 默认空字符串
            spm_value: 'aSF1.p1.m1.b1',
            events: {}, // 事件对象
        })
        // 请求配置文件
        hx.init({
            onConfig: (config) => {
                dispatch(set_hx_config(config));
                hx.setTitle(config.title);
            },
        });
    }
    // 初始化banner
    useEffect(() => {
        if(state.app.uid) {
            console.log("*****xinghuoBanner*****", state)
            // 初始化星火banner
            new xinghuobanner('.box', {
                appId: state.app.appId,
                uid: state.app.uid,
                env: config.env,
                projectType: "dx",
                channel: state.app.urlParams.channel,
                xhBannerZWM: '0JFMLVX2T4B5',
                mdValue: 'aST20230203175528871.p1.m6.b1'
            })
        }
    }, [state.app.uid])
    // 请求接口
    useEffect(() => {
        if(state.app.hxConfig.acCode) {
            initData(state.app.hxConfig.acCode)
        }
    }, [state.app.hxConfig.acCode])
    // 初始化参数，uid
    useEffect(() => {
        dispatch(set_url_params(hx.getParams()));
        // 获取uid
        hx.getUid()
            .then((res) => {
                console.log('uid-success', res)
                if(res) {
                    localStorage.setItem('uid', res)
                }
                dispatch(set_uid(res))
                _init(res);
            })
            .catch((err) => {
                console.log('uid-err', err)
                const cacheUid = localStorage.getItem('uid')
                _init(cacheUid);
            });
    }, [])
    const toRule = () => {
        navigate('/rules')
    }

    return (
        <div className={style.app_wraper}>
            <h2>Create React App</h2>
            <div className='box' style={{width: '6rem', height: '3rem'}}></div>
            <img src={logo} className={style.app_logo} alt="logo" />
            <div className={style.app_desc}>{state.app.hxConfig.desc}</div>
            <button onClick={toRule}>go to rule</button>
            <Login />
        </div>
    );
}

export default Index;
