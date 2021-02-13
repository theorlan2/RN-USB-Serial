import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IonicIcon from 'react-native-vector-icons/Ionicons';

//
import { navigation, navigationRef } from './rootNavigation';
import HomeScreen from '../scenes/home';
import ConfigurationScreen from '../scenes/configuration';
import { Pressable, View } from 'react-native';
import GroupCmdScreen from '../scenes/groupCmds';
import TempCmdScreen from '../scenes/tempsCmds';
import routesNames from './routesNames';
import GroupCmdsListScreen from '../scenes/groupCmdsList';
import { useSerialStatus } from '../infrastructure/contexts/serialStatusContext';
import HeaderRight from '../components/Layout/HeaderRight';

export default function App() {

    const Stack = createStackNavigator();
    const { statusConnection } = useSerialStatus();

    return (
        <NavigationContainer ref={navigationRef} >
            <Stack.Navigator
                initialRouteName={routesNames.Home.name}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#00BBD3',
                    },
                    headerTintColor: 'white',
                }}>
                <Stack.Screen name={routesNames.Home.name} options={{
                    title: "Inicio",
                    headerRight: () => <HeaderRight statusConnection={statusConnection} />
                }} component={HomeScreen} />
                <Stack.Screen name={routesNames.GroupCmds.name} options={{
                    headerRight: () => <Pressable style={{ padding: 10 }} onPress={() => { navigation.navigate('Configuration') }} ><IonicIcon name="trash-outline" size={20} color="white" /></Pressable>,
                    title: "Grupo de comandos",
                }} component={GroupCmdScreen} />
                <Stack.Screen name={routesNames.TempCmds.name} options={{
                    title: "Envio de Comandos",
                }} component={TempCmdScreen} />
                <Stack.Screen name={routesNames.GroupCmdsList.name} options={{
                    title: "Lista de grupos",
                }} component={GroupCmdsListScreen} />
                <Stack.Screen name="Configuration" options={{ title: "Configuracion" }} component={ConfigurationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}