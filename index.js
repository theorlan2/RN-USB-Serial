/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { AppearanceProvider } from 'react-native-appearance';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
//
import App from './app/routes/index';
import './app/infrastructure/i18n/index';
import { SerialStatusProvider } from './app/infrastructure/contexts/serialStatusContext';
import { ThemeProvider } from './app/infrastructure/contexts/themeContexts';
import { store, persistor } from './app/store';

export default function Main() {

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SerialStatusProvider>
                    <AppearanceProvider>
                        <ThemeProvider>
                            <App />
                        </ThemeProvider>
                    </AppearanceProvider>
                </SerialStatusProvider>
            </PersistGate>
        </Provider>
    );
}


AppRegistry.registerComponent(appName, () => Main);
