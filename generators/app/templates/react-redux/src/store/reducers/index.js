import {combineReducers} from 'redux';
 
import appReducer from './appReducer';
import ruleReducer from './ruleReducer';
 
const allReducer = combineReducers({
    app: appReducer,
    rule: ruleReducer
});
export default allReducer;