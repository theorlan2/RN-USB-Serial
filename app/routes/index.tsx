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
import MacroCmdScreen from '../scenes/macroCmds';
import CalCRCCmdScreen from '../scenes/calCRCCmds';
import RunCmdScreen from '../scenes/runCmds';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../infrastructure/contexts/themeContexts';

export default function App() {

    const Stack = createStackNavigator();
    const { statusConnection } = useSerialStatus();
    const { t } = useTranslation(['titleScenes'])
    const { colors } = useTheme();

    return (
        <NavigationContainer ref={navigationRef} >
            <Stack.Navigator
                initialRouteName={routesNames.Home.name}
                screenOptions={{
                    cardStyle: {
                        backgroundColor: colors.background
                    },
                    headerStyle: {
                        backgroundColor: colors.header,
                    },
                    headerTitleStyle: {
                        color: 'white',
                        fontSize: 16
                    },
                    headerTintColor: 'white',
                }}
            >
                <Stack.Screen name={routesNames.Home.name} options={{
                    title: t('titleScenes:titles.home'),
                    headerRight: () => <HeaderRight statusConnection={statusConnection} />
                }} component={HomeScreen} />
                <Stack.Screen name={routesNames.GroupCmds.name} options={{
                    headerRight: () => <Pressable style={{ padding: 10 }} onPress={() => { navigation.navigate('Configuration') }} ><IonicIcon name="trash-outline" size={20} color="white" /></Pressable>,
                    title: t('titleScenes:titles.groupCommands'),
                }} component={GroupCmdScreen} />
                <Stack.Screen name={routesNames.TempCmds.name} options={{
                    title: t('titleScenes:titles.sendTempCommands'),
                }} component={TempCmdScreen} />
                <Stack.Screen name={routesNames.GroupCmdsList.name} options={{
                    title: t('titleScenes:titles.commandList'),
                }} component={GroupCmdsListScreen} />
                <Stack.Screen name="Configuration" options={{
                    title: t('titleScenes:titles.configuration'),
                }} component={ConfigurationScreen} />
                <Stack.Screen name={routesNames.MacroCmdsList.name} options={{
                    title: t('titleScenes:titles.macroList'),
                }} component={MacroCmdsListScreen} />
                <Stack.Screen name={routesNames.MacroCmds.name} options={{
                    title: t('titleScenes:titles.macro'),
                }} component={MacroCmdScreen} />
                <Stack.Screen name={routesNames.CalCRCCmds.name} options={{
                    title: t('titleScenes:titles.calculateCrc'),
                }} component={CalCRCCmdScreen} />
                <Stack.Screen name={routesNames.RunCmds.name} options={{
                    title: t('titleScenes:titles.sendCommands'),
                }} component={RunCmdScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}