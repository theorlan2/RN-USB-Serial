import { combineReducers } from "redux";
import configurationReducer from "./configurationSlice";


export default combineReducers({
    configuration: configurationReducer, 
});
