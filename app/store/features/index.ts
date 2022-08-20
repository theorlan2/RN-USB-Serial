import { combineReducers } from "redux";
import configurationReducer from "./configurationSlice";
import groupReducer from "./groupSlice";
import macroReducer from "./macroSlice";

export default combineReducers({
    configuration: configurationReducer, 
    group: groupReducer,
    macro: macroReducer
});
