import actionTypes from '../actions/appActions/appActionTypes';
const defaultState = {
    appId: '2021003181689195',
    uid: '',
    urlParams: {},
    hxConfig: {}
}
const appFunc = (state = defaultState, action) => {
    console.log("*****dispatch*****")
    console.log(action)
    if (action.type === actionTypes.SET_HX_CONFIG) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.hxConfig = {...action.value}
        return newState;
    }
    if (action.type === actionTypes.SET_URL_PARAMS) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.urlParams = {...action.value}
        return newState;
    }
    if (action.type === actionTypes.SET_UID) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.uid = action.value
        return newState;
    }
    return state
}

export default appFunc