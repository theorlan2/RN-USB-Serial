import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, Button, Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native'
import { definitions, RNSerialport } from 'react-native-serialport';
import IonicIcon from 'react-native-vector-icons/Ionicons';

//
import { ConectionSerial, sendData, startUsbListener } from '../infrastructure/utils/serialConnection'

const HomeScreen: FunctionComponent = () => {

    const [times] = useState([25, 50, 100, 150, 200, 300, 400, 500, 1000, 2000]);

    const [cmds, setCmds] = useState([]);

    const [configurationData, setConfigurationData] = useState({} as ConectionSerial)
    const [time, setTime] = useState(0)
    const [cmd, setCmd] = useState('')
    const [disabledAdd, setDisabledAdd] = useState(false)
    const [showAddCmd, setShowAddCmd] = useState(false)
    const [logCMD, setLogCMD] = useState([]);
    const [showModalLoading, setShowModalLoading] = useState(true);
    const [serviceStart, setServiceStart] = useState(false);

    useEffect(() => {
        getDataFromStorage();
        return () => { };
    }, [configurationData])


    function addCmd() {
        setCmds((prevState) => ([
            ...prevState,
            {
                id: cmd + cmds.length,
                cmd: cmd,
                time: time
            }
        ]));

        setTimeout(() => {
            setCmd('');
            setTime(10);
        }, 100);
    }


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
        }).then(() => {
            setShowModalLoading(false);
        }).then(() => {
            connectDevice();
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

    function doSetTimeout(cmd: string, time: number) {
        setTimeout(function () {
            sendCmd(cmd);
            setLogCMD((prevState) => ([
                ...prevState,
                { isSend: true, cmd: cmd }
            ] as any));
        }, time);
    }

    function runCmds() {
        let _time_count = 0;
        for (let i = 0; i < cmds.length; ++i) {
            _time_count += cmds[i].time;
            doSetTimeout(cmds[i].cmd, _time_count);
        }
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
                setTimeout(() => {
                    setLogCMD((prevState) => ([
                        ...prevState,
                        { isSend: false, cmd: data.payload }
                    ] as any));
                }, 500);
            },
            // onConnect
            (data) => {
                Alert.alert("Connect", "connexion a usb serial");
            },
            // OnDisconnect
            (data) => {

            },
            // onError
            (data) => {

            },
            // on StartService 
            (data) => {
                setServiceStart(true);
            })
    }

    function sendCmd(_cmd: string) {
        sendData('HEX', _cmd);
    }

    function editCmd() {

    }


    return (
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <ScrollView style={{ flex: 4, maxWidth: '96%', alignSelf: 'center', width: '100%' }}   >
                <Text style={{ fontSize: 15 }} >Estatus:{serviceStart ? ' Iniciado.' : ' No Iniciado.'}</Text>

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
                    {showAddCmd && <View style={{ marginVertical: 10 }} >
                        <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }} >AGREGAR COMANDO</Text>
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
                            <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Comando en Hexadecimal:</Text>
                            <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                                <TextInput
                                    placeholder="Comando en Hexadecimal"
                                    style={{}}
                                    value={cmd}
                                    onChangeText={value => setCmd(value)}
                                />
                            </View>
                        </View>
                    </View>}
                    {cmds.length < 1 && <View style={{ marginVertical: 10 }} >
                        <Text style={{ textAlign: 'center' }} >No hay Comandos creados</Text>
                    </View>}
                    {/*  */}
                </View>

                <View style={{ marginVertical: 10, flex: 1, flexDirection: 'row' }} >
                    {showAddCmd && <View style={{ flex: 1, marginRight: 5 }} >
                        <Button title="CANCELAR" onPress={() => setShowAddCmd(false)} color="red" disabled={disabledAdd} ></Button>
                    </View>}
                    <View style={{ flex: 1, marginLeft: 5 }} >
                        <Button title="Agregar Comando" onPress={() => showAddCmd ? addCmd() : setShowAddCmd(true)} color="#00BBD3" disabled={disabledAdd} ></Button>
                    </View>
                </View>
            </ScrollView>
            <ScrollView style={{ flex: 1, width: '100%', backgroundColor: '#CFD8DC' }} contentContainerStyle={{}} >
                <Text style={{ margin: 10 }} >Log:</Text>
                {logCMD.map((item, indx) => <Text style={{ margin: 10 }} key={indx + item.cmd} ><Text style={{ fontWeight: 'bold' }} >{item.isSend ? 'Enviado:' : 'Recibido'}</Text>{item.cmd}</Text>)}
            </ScrollView>
            <View style={{ position: 'absolute', width: 60, height: 60, bottom: 16, right: 16, }} >
                <Pressable onPress={runCmds} style={{ backgroundColor: '#00BBD3', justifyContent: 'center', alignItems: 'center', borderRadius: 40, elevation: 4, width: 60, height: 60, alignSelf: 'flex-end' }} ><IonicIcon name="play-outline" size={24} color="#fff" /></Pressable>
            </View>
        </View>
    );
}

export default HomeScreen;