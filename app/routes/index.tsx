import * as React from 'react';
import { Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IonicIcon from 'react-native-vector-icons/Ionicons';

//
import { navigation, navigationRef } from './rootNavigation';
import HomeScreen from '../scenes/home';
import ConfigurationScreen from '../scenes/configuration';
import GroupCmdScreen from '../scenes/groupCmds';
import TempCmdScreen from '../scenes/tempsCmds';
import routesNames from './routesNames';
import GroupCmdsListScreen from '../scenes/groupCmdsList';
import { useSerialStatus } from '../infrastructure/contexts/serialStatusContext';
import HeaderRight from '../components/Layout/HeaderRight';
import MacroCmdsListScreen from '../scenes/macroCmdsList';
import MacroCmdScreen from '../scenes/macrosCmds';
import CalCRCCmdScreen from '../scenes/calCRCCmds'; 
import RunCmdScreen from '../scenes/runCmds';

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
                    title: "Enviar Comandos",
                }} component={TempCmdScreen} />
                <Stack.Screen name={routesNames.GroupCmdsList.name} options={{
                    title: "Lista de grupos",
                }} component={GroupCmdsListScreen} />
                <Stack.Screen name="Configuration" options={{ title: "Configuracion" }} component={ConfigurationScreen} />
                <Stack.Screen name={routesNames.MacroCmdsList.name} options={{
                    title: "Lista de macros",
                }} component={MacroCmdsListScreen} />
                <Stack.Screen name={routesNames.MacroCmds.name} options={{
                    title: "Macro",
                }} component={MacroCmdScreen} />
                <Stack.Screen name={routesNames.CalCRCCmds.name} options={{
                    title: "Calculadora CRC",
                }} component={CalCRCCmdScreen} />
                <Stack.Screen name={routesNames.RunCmds.name} options={{
                    title: "Corriendo Comandos",
                }} component={RunCmdScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}