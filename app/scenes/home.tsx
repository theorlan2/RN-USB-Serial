import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, Button, Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native'
import { definitions } from 'react-native-serialport';
import IonicIcon from 'react-native-vector-icons/Ionicons';

//
import { ConectionSerial, sendData, startUsbListener } from '../infrastructure/utils/serialConnection'

const HomeScreen: FunctionComponent = () => {

    useEffect(() => {
        getDataFromStorage();

        return () => { };
    }, [])

    const [times] = useState([25, 50, 100, 150, 200, 300]);

    const [cmds, setCmds] = useState([
        {
            id: 'A502030001BD',
            cmd: 'A502030001BD',
            time: 10
        }
    ]);

    const [configurationData, setConfigurationData] = useState({} as ConectionSerial)
    const [time, setTime] = useState(0)
    const [cmd, setCmd] = useState('')
    const [disabledAdd, setDisabledAdd] = useState(false)
    const [logCMD, setLogCMD] = useState([
        { isSend: false, hex: '' }
    ]);

    const [isSave, setIsSave] = useState(true);
    const [showModalLoading, setShowModalLoading] = useState(true);

    function addCmd() {
        setCmds((prevState) => ({
            ...prevState,
        }));
    }


    function getDataFromStorage() {
        setShowModalLoading(true);
        setIsSave(false);
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
        }).then(() => {
            setShowModalLoading(false);
        }).then(() => {
        //    connectDevice();
        });
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
                dataBits: configurationData.dataBits,
                stopBits: configurationData.stopBits,
                parity: configurationData.parity,
                returnedDataType: definitions.RETURNED_DATA_TYPES.HEXSTRING as any
            },
            //OnRead
            (data) => {

            },
            // onConnect
            (data) => {

            },
            // OnDisconnect
            (data) => {

            },
            // onError
            (data) => {

            })
    }

    function sendCmd() {
        sendData('HEX', cmd);
    }

    function editCmd() {

    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <ScrollView style={{ flex: 1, maxWidth: '96%', alignSelf: 'center', width: '100%' }}   >
                {cmds.map((item, indx) => <View key={indx} style={{ marginVertical: 5, backgroundColor: '#fff', elevation: 2, padding: 10, }} >
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ flex: 1 }} >
                            <Text style={{ fontWeight: '500', fontSize: 18 }} >{item.cmd}</Text>
                        </View>

                        <View style={{ flex: 1 }} >
                            <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'right' }} >{item.time + ' ms'}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <View style={{ flex: 1, justifyContent: 'center' }} >
                            <Text style={{ fontWeight: 'bold', fontSize: 16, }} >{'Comando No. ' + (indx + 1)}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }} >
                            <Pressable style={{ padding: 10, alignSelf: 'flex-end' }} onPress={() => { }} ><IonicIcon name="create-outline" size={24} color="#444" /></Pressable>
                        </View>
                    </View>
                </View>)}
                <View>
                    {/*  */}
                    <View style={{ marginVertical: 10 }} >
                        <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Tiempo de retraso:</Text>
                        <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                            <Picker
                                selectedValue={time}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => setTime(+itemValue)}>
                                {times.map((item) => <Picker.Item key={'value-time-' + item} label={item + 'ms'} value={item} />)}
                            </Picker>
                        </View>
                    </View>
                    <View style={{ marginVertical: 10, paddingBottom: 15, borderBottomColor: '#444', borderBottomWidth: 1 }} >
                        <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Tiempo de retraso:</Text>
                        <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                            <TextInput
                                placeholder="Comando en Hexadecimal"
                                style={{}}
                                value={cmd}
                                onChangeText={value => setCmd(value)}
                            />
                        </View>
                    </View>
                    {/*  */}
                </View>


                <Button title="Agregar Comando" onPress={addCmd} color="#00BBD3" disabled={disabledAdd} ></Button>
            </ScrollView>
            <ScrollView style={{ width: '100%', backgroundColor: '#CFD8DC' }} contentContainerStyle={{}} >
                <Text style={{ margin: 10 }} >Log:</Text>

            </ScrollView>
        </View>
    );
}

export default HomeScreen;