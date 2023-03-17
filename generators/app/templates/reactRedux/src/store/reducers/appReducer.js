import actionTypes from '../actions/appActions/appActionTypes';
const defaultState = {
    list: [],
    columns: [],
    editFlag: true,
    deleteFlag: true,
    pagination: {
        pageSize: 5,
        total: 0
    },
    loading: false,
    visible: false,//详情页
    isShowModal: false,//删除模态框
    selectedSize: 0
}
const appFunc = (state = defaultState, action) => {
    console.log("发布")
    console.log(actionTypes)
    console.log(action)
    if (action.type === actionTypes.DELETE_DISABLED) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.deleteFlag = action.value
        return newState;
    }
    if (action.type === actionTypes.EDIT_DISABLED) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.editFlag = action.value
        return newState;
    }
    if (action.type === actionTypes.DELETE_SHOW) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.isShowModal = action.value
        return newState;
    }
    if (action.type === actionTypes.DETAIL_SHOW) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.isShowModal = action.value
        return newState;
    }
    if (action.type === actionTypes.LOADING_SHOW) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.isShowModal = action.value
        return newState;
    }
    if (action.type === actionTypes.LIST_DATA) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.list = action.value
        console.log(newState)
        return newState;
    }
    if (action.type === actionTypes.COLUMN) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.columns = action.value
        return newState;
    }
    if (action.type === actionTypes.SELECTED_SIZE) {
        let newState = JSON.parse(JSON.stringify(state)) //深度拷贝state
        newState.selectedSize = action.value
        return newState;
    }
    return state
}

export default appFunc