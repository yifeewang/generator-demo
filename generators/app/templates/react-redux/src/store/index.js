import { createStore } from 'redux'  //  引入createStore方法
import allReducer from './reducers/index.js'
const store = createStore(allReducer) // 创建数据存储仓库
export default store   // 暴露出去