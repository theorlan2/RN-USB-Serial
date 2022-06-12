import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { definitions } from 'react-native-serialport';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import ButtonWithDescription from '../components/ButtonWithDescription';
//
import ModalAddGroupFC from '../components/ModalAddGroupFC';
import ModalInfoFC from '../components/ModalInfoFC';
import { StatusConnectionEnum, useSerialStatus } from '../infrastructure/contexts/serialStatusContext';
import { ConectionSerial, startUsbListener, validateIsRun } from '../infrastructure/utils/serialConnection'
import { RootStackParamList } from '../routes/routesNames';

type HomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Home'
>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: FunctionComponent<Props> = (props) => {

    const [showModalLoading, setShowModalLoading] = useState(false);
    const [showModalAddGroup, setShowModalAddGroup] = useState(false);
    const [showModalAddMacro, setShowModalAddMacro] = useState(false);
    const { setConnectStatus } = useSerialStatus();

    useEffect(() => {
        validateIsRun().then((r) => {
            if (!r)
                getDataFromStorage();
        })
    }, [])


    function getDataFromStorage() {
        let result = {} as any;
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
            connectDevice(result);
        });
    }

    async function getData(key: string): Promise<any> {
        let result = null;
        try {
            const jsonValue = await AsyncStorage.getItem('@' + key)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
            result = jsonValue;
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

    function connectDevice(this: any, configuration: ConectionSerial) {
        startUsbListener(this,
            {
                baudRate: configuration.baudRate,
                interface: configuration.interface,
                dataBits: +configuration.dataBits,
                stopBits: +configuration.stopBits,
                parity: +configuration.parity,
                returnedDataType: definitions.RETURNED_DATA_TYPES.HEXSTRING as any
            },
            //OnRead
            (data) => {

            },
            // onConnect
            (data) => {
                setConnectStatus(StatusConnectionEnum.DEVICE_CONNECT);
            },
            // OnDisconnect
            (data) => {
                setConnectStatus(StatusConnectionEnum.SERVICE_START);
            },
            // onError
            (data) => { },
            // on StartService 
            (data) => {
                setConnectStatus(StatusConnectionEnum.SERVICE_START);
            })
    }


    const styles = StyleSheet.create({
        mainCont: {
            flex: 1, flexDirection: 'column', width: '96%', alignSelf: 'center'
        },
        contBtn: {
            marginVertical: 10, backgroundColor: '#fff', elevation: 2, padding: 10,
        },
        contTitleBtn: {
            flexDirection: 'row', alignItems: 'center', marginVertical: 5
        },
        titleBtn: {
            fontWeight: 'bold', fontSize: 18, marginLeft: 10
        }
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
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <ScrollView style={styles.mainCont} >
                <ButtonWithDescription onPress={() => props.navigation.navigate('TempCmds')} icon="list-outline" title="Iniciar temporal" description="Envia comandos de manera exporadica. (Lo que hagas aqui no se guardara)" />

                <ButtonWithDescription onPress={addGroup} icon="add-outline" title="Crear Grupo" description="Crea un grupo de comandos que podras guardar." />

                <ButtonWithDescription onPress={() => props.navigation.navigate('GroupCmdsList')} icon="document-text-outline" title="Cargar Grupo" description="Carga un grupo de comandos guardados." />

                <ButtonWithDescription onPress={addGMacro} icon="add-outline" title="Crear Macro" description="Crear un grupo de comandos en un macro." />

                <ButtonWithDescription onPress={() => props.navigation.navigate('MacroCmdsList')} icon="list-outline" title="Cargar Macro" description="Carga un grupo de comandos en un macro." />

                <ButtonWithDescription onPress={() => props.navigation.navigate('CalCRCCmds')} icon="calculator-outline" title="Calcular CRC" description="Calcula CRC de los comandos." />

            </ScrollView>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={"Cargando datos"} description={"Obteniendo datos de configuracion guardados..."} loading={true} />
            <ModalAddGroupFC title="Crear nuevo grupo" description="Escribe el nombre del grupo:" modalVisible={showModalAddGroup} closeModal={() => setShowModalAddGroup(false)} create={createGroup} />
            <ModalAddGroupFC title="Crear nuevo macro" description="Escribe el nombre del macro:" modalVisible={showModalAddMacro} closeModal={() => setShowModalAddMacro(false)} create={createMacro} />
        </View>
    );
}


export default HomeScreen;