import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { definitions } from 'react-native-serialport';
import ButtonWithDescription from '../components/ButtonWithDescription';
//
import ModalAddGroupFC from '../components/ModalAddGroupFC';
import ModalInfoFC from '../components/ModalInfoFC';
import { useSerialStatus } from '../infrastructure/contexts/serialStatusContext';
import { useTheme } from '../infrastructure/contexts/themeContexts';
import {  ConectionSerial, validateIsRun } from '../infrastructure/utils/serialConnection'
import { RootStackParamList } from '../routes/routesNames';

type HomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Home'
>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: FunctionComponent<Props> = (props) => {

    const { colors } = useTheme();
    const { t } = useTranslation(['home']);
    //
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [showModalAddGroup, setShowModalAddGroup] = useState(false);
    const [showModalAddMacro, setShowModalAddMacro] = useState(false);
    const { connectDevice } = useSerialStatus();

    useEffect(() => {
        validateIsRun().then((r) => {
            if (!r) 
                getDataFromStorage();
        })
    }, [])


    function getDataFromStorage() {
        let result = null as unknown as ConectionSerial;
        let vm = this as any;
        setShowModalLoading(true);
        getData('configuration').then(r => {
            if (r) {
                result = {
                    interface: "-1",
                    baudRate: r.baud_rate,
                    parity: r.parity,
                    dataBits: r.data_bits,
                    stopBits: r.stop_bits,
                    returnedDataType: definitions.RETURNED_DATA_TYPES.HEXSTRING as any
                };
            }
            return r;
        }).then((r) => {
            setShowModalLoading(false);
            return r;
        }).then((r) => {
            connectDevice(vm,result);
        });
    }

    async function getData(key: string): Promise<any> {
        let result = null;
        try {
            const jsonValue = await AsyncStorage.getItem('@' + key)
            return jsonValue != null ? JSON.parse(jsonValue) : null; 
        } catch (e) {
            // error reading value
        }
        return result;
    }


    async function storeData(key: string, value: any) {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@' + key, jsonValue)
        } catch (e) {
            // saving error
            Alert.alert('Error guardando', 'Ha ocurrido un error guardando.')
        }
    }
 

    const styles = StyleSheet.create({
        mainCont: {
            flex: 1, flexDirection: 'column', width: '96%', alignSelf: 'center'
        },

    })

    function addGroup() {
        setShowModalAddGroup(true);
    }
    
    function addGMacro() {
        setShowModalAddMacro(true);
    }

    function createGroup(name: string) {
        setShowModalAddGroup(false);
        setShowModalLoading(true);

        let groupsCmdsData = [] as any;
        let id = Date.now();
        getData('groupsCmds').then(r => {
            if (r) {
                groupsCmdsData = r;
            }
        }).then(() => {
            groupsCmdsData.push({
                id: id,
                title: name,
                listCmds: []
            })
            storeData("groupsCmds", groupsCmdsData).then(() => {
                setShowModalLoading(false);
                setTimeout(() => {
                    props.navigation.navigate('GroupCmds', { id: id });
                }, 500);
            });
        });
    }

    function createMacro(name: string) {
        setShowModalAddMacro(false);
        setShowModalLoading(true);
        let groupsCmdsData = [] as any;
        let id = Date.now();
        getData('macrosCmds').then(r => {
            if (r) {
                groupsCmdsData = r;
            }
        }).then(() => {
            groupsCmdsData.push({
                id: id,
                title: name,
                listCmds: []
            })
            storeData("macrosCmds", groupsCmdsData).then(() => {
                setShowModalLoading(false);
                setTimeout(() => {
                    props.navigation.navigate('MacroCmds', { id: id });
                }, 500);
            });
        });
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={colors.headerAccent} barStyle="light-content" ></StatusBar>
            <ScrollView style={styles.mainCont} >
                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={() => props.navigation.navigate('TempCmds')} icon="list-outline" title={t('home:buttons.sendTemps.title')} description={t('home:buttons.sendTemps.description')} />

                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={addGroup} icon="add-outline" title={t('home:buttons.createGroup.title')} description={t('home:buttons.createGroup.description')} />

                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={() => props.navigation.navigate('GroupCmdsList')} icon="document-text-outline" title={t('home:buttons.loadGroup.title')} description={t('home:buttons.loadGroup.description')} />

                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={addGMacro} icon="add-outline" title={t('home:buttons.createMacro.title')} description={t('home:buttons.createMacro.description')} />

                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={() => props.navigation.navigate('MacroCmdsList')} icon="list-outline" title={t('home:buttons.loadMacro.title')} description={t('home:buttons.loadMacro.description')} />

                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={() => props.navigation.navigate('CalCRCCmds')} icon="calculator-outline" title={t('home:buttons.calculateCrc.title')} description={t('home:buttons.calculateCrc.description')} />

            </ScrollView>

            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={"Cargando datos"} description={"Obteniendo datos de configuracion guardados..."} loading={true} />
            <ModalAddGroupFC title={t('home:dialogs.createGroup.title')} description={t('home:dialogs.createGroup.description')} modalVisible={showModalAddGroup} closeModal={() => setShowModalAddGroup(false)} create={createGroup} />
            <ModalAddGroupFC title={t('home:dialogs.createMacro.title')} description={t('home:dialogs.createMacro.description')} modalVisible={showModalAddMacro} closeModal={() => setShowModalAddMacro(false)} create={createMacro} />
        </View>
    );
}


export default HomeScreen;