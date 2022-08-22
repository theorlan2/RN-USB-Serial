import { applyMiddleware, createStore } from '@reduxjs/toolkit'
import rootReducer from './features';
import { persistStore, persistReducer } from 'redux-persist';
import MMKVStorage from "react-native-mmkv-storage";


const storage = new MMKVStorage.Loader().withInstanceID('rn_usb_serial').initialize();

const persistConfig = {
    key: 'rn_usb_serial',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer)
const middlewares = [];
if (__DEV__) { // eslint-disable-line
    const createDebugger = require('redux-flipper').default;
    middlewares.push(createDebugger());
}

export const store = createStore(persistedReducer, applyMiddleware(...middlewares));
export const persistor = persistStore(store);


//
export type RootState = ReturnType<typeof store.getState>
//
export type AppDispatch = typeof store.dispatch