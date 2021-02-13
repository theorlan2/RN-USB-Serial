/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import App from './app/routes/index';
import { SerialStatusProvider } from './app/infrastructure/contexts/serialStatusContext';
import { name as appName } from './app.json';

export default function Main() {

    return (
        <SerialStatusProvider>
            <App />
        </SerialStatusProvider>
    );
}


AppRegistry.registerComponent(appName, () => Main);
