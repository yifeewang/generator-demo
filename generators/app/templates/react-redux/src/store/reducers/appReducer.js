import actionTypes from '../actions/appActions/appActionTypes';
const defaultState = {
    selectedSize: 0
}
const appFunc = (state = defaultState, action) => {
    console.log("发布")
    console.log(actionTypes)
    console.log(action)
    if (action.type === actionTypes.DELETE_DISABLED) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.selectedSize = action.value
        return newState;
    }
    return state
}

export default appFunc