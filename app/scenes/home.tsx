import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import { definitions } from 'react-native-serialport';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { StatusConnectionEnum, useSerialStatus } from '../infrastructure/contexts/serialStatusContext';

//
import { ConectionSerial, sendData, startUsbListener } from '../infrastructure/utils/serialConnection'
import routesNames, { RootStackParamList } from '../routes/routesNames';


type HomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Home'
>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: FunctionComponent<Props> = (props) => {

    const [configurationData, setConfigurationData] = useState({} as ConectionSerial)
    const [showModalLoading, setShowModalLoading] = useState(true);
    const { setConnectStatus } = useSerialStatus();

    useEffect(() => {
        getDataFromStorage();
        if (!configurationData.baudRate) {
        }
        return () => { };
    }, [configurationData])


    function getDataFromStorage() {
        setShowModalLoading(true);
        getData('configuration').then(r => {
            if (r) {
                setConfigurationData({
                    interface: "-1",
                    baudRate: r.baud_rate,
                    parity: r.parity,
                    dataBits: r.data_bits,
                    stopBits: r.stop_bits,
                    returnedDataType: definitions.RETURNED_DATA_TYPES.HEXSTRING as any
                });
            }
            return r;
        }).then((r) => {
            setShowModalLoading(false);
            return r;
        }).then((r) => {
            console.log('r', r);
            connectDevice();
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

    function connectDevice(this: any) {
        startUsbListener(this,
            {
                baudRate: configurationData.baudRate,
                interface: configurationData.interface,
                dataBits: +configurationData.dataBits,
                stopBits: +configurationData.stopBits,
                parity: +configurationData.parity,
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
                console.log('SERVICE_START')
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

    return (
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <View style={styles.mainCont} >
                <Pressable onPress={() => props.navigation.navigate(routesNames.TempCmds.name)} style={styles.contBtn} >
                    <View style={styles.contTitleBtn} >
                        <IonicIcon name="list-outline" size={32} color="#444" />
                        <Text style={styles.titleBtn} >Iniciar temporal</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={{ fontWeight: '400', fontSize: 16, }} >Envia comandos de manera exporadica. (Lo que hagas aqui no se guardara)</Text>
                    </View>
                </Pressable>
                {/* Btn 2 */}
                <Pressable onPress={() => props.navigation.navigate(routesNames.GroupCmds.name)} style={styles.contBtn} >
                    <View style={styles.contTitleBtn} >
                        <IonicIcon name="document-outline" size={32} color="#444" />
                        <Text style={styles.titleBtn} >Iniciar Nuevo Grupo</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={{ fontWeight: '400', fontSize: 16, }} >Crea un grupo de comandos que podras guardar.</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate(routesNames.GroupCmdsList.name)} style={styles.contBtn} >
                    <View style={styles.contTitleBtn} >
                        <IonicIcon name="document-text-outline" size={32} color="#444" />
                        <Text style={styles.titleBtn} >Cargar Grupo</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={{ fontWeight: '400', fontSize: 16, }} >Carga un grupo de comandos guardados.</Text>
                    </View>
                </Pressable>
            </View>


        </View>
    );
}


export default HomeScreen;