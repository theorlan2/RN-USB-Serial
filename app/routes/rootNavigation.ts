
import * as React from 'react';
import { StackActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

export const navigation = {
    navigate: function (name: string, params?: any) {
        navigationRef.current.navigate({ name, params });
    },
    replace: function (name: string, params?: any) {
        navigationRef.current.dispatch(StackActions.replace(name, params))
    },
    goBack: function () {
        navigationRef.current.goBack();
    }

} 
