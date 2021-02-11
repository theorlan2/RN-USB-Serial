import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IonicIcon from 'react-native-vector-icons/Ionicons';

//
import { navigation, navigationRef } from './rootNavigation';
import HomeScreen from '../scenes/home';
import ConfigurationScreen from '../scenes/configuration';
import { Pressable } from 'react-native';

export default function App() {

    const Stack = createStackNavigator();

    return (
        <NavigationContainer ref={navigationRef} >
            <Stack.Navigator
                initialRouteName={'Home'}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#00BBD3',
                    },
                    headerTintColor: 'white',
                }}>
                <Stack.Screen name="Home" options={{
                    title: "Inicio",
                    headerRight: () => <Pressable style={{ padding:10 }} onPress={() => { navigation.navigate('Configuration') }} ><IonicIcon name="settings-outline" size={20} color="white" /></Pressable>
                }} component={HomeScreen} />
                <Stack.Screen name="Configuration" options={{ title: "Configuracion" }} component={ConfigurationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}