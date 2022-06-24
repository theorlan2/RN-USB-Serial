/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { AppearanceProvider } from 'react-native-appearance';
import { name as appName } from './app.json';
//
import App from './app/routes/index';
import './app/infrastructure/i18n/index';
import { SerialStatusProvider } from './app/infrastructure/contexts/serialStatusContext';
import { ThemeProvider } from './app/infrastructure/contexts/themeContexts';

export default function Main() {

    return (
        <SerialStatusProvider>
            <AppearanceProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </AppearanceProvider>
        </SerialStatusProvider>
    );
}


AppRegistry.registerComponent(appName, () => Main);
