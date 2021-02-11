import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { Component, FunctionComponent, useEffect, useState } from 'react'
import { Alert, Button, DeviceEventEmitter, ScrollView, StatusBar, Text, TextInput, View } from 'react-native'
import { definitions, RNSerialport } from 'react-native-serialport';
import ModalInfoFC from '../components/ModalInfoFC';
import { startUsbListener } from '../infrastructure/utils/serialConnection';

const ConfigurationScreen: FunctionComponent = () => {

    const Options = {
        parity: [
            'None',
            'Odd',
            'Even',
        ],
        dataBits: [
            5, 6, 7, 8,
        ],
        stopsBits: [
            1, 1.5, 2
        ],

    }
    useEffect(() => {
        getDataFromStorage();
        return () => { };
    }, [])

    function getDataFromStorage() {
        setShowModalLoading(true);
        setIsSave(false);
        getData('configuration').then(r => {
            if (r) {
                setDataBits(r.data_bits);
                setStopsBits(r.stop_bits);
                setParity(r.parity);
                setBreakDuration(r.break_time);
                setBaudRate(r.baud_rate);
            }
        }).then(() => {
            setShowModalLoading(false);
        });
    }


    async function saveData() {
        setShowModalLoading(true);
        setIsSave(true);
        storeData('configuration', {
            data_bits: dataBits,
            stop_bits: stopsBits,
            parity: parity,
            break_time: breakDuration,
            baud_rate: baudRate
        }).then(() => {
            setShowModalLoading(false);
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
            result = jsonValue;
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
        return result;
    }

    const [parity, setParity] = useState('');
    const [dataBits, setDataBits] = useState(5)
    const [stopsBits, setStopsBits] = useState(1)
    const [time, setTime] = useState(0)
    const [breakDuration, setBreakDuration] = useState('')
    const [baudRate, setBaudRate] = useState('')
    const [isSave, setIsSave] = useState(true);
    const [showModalLoading, setShowModalLoading] = useState(true);

    return (
        <ScrollView style={{ maxWidth: '96%', alignSelf: 'center', width: '100%' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <View style={{ marginVertical: 10 }} >
                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Baud rate:</Text>
                <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                    <TextInput
                        placeholder="Baud rate"
                        style={{}}
                        keyboardType={'numeric'}
                        value={baudRate}
                        onChangeText={value => setBaudRate(value)}
                    />
                </View>
            </View>
            {/*  */}
            <View style={{ marginVertical: 10 }} >
                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Break duration (ms):</Text>
                <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                    <TextInput
                        placeholder="Break duration (ms)"
                        style={{}}
                        keyboardType={'numeric'}
                        value={breakDuration}
                        onChangeText={value => setBreakDuration(value)}
                    />
                </View>
            </View>
            {/*  */}
            <View style={{ marginVertical: 10 }} >
                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Parity:</Text>
                <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                    <Picker
                        selectedValue={time}
                        style={{ height: 50, width: '100%' }}
                        onValueChange={(itemValue, itemIndex) => setTime(+itemValue)}>
                        {Options.parity.map((item) => <Picker.Item key={'value-time-' + item} label={item} value={item} />)}
                    </Picker>
                </View>
            </View>
            <View style={{ marginVertical: 10 }} >
                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Data bits:</Text>
                <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                    <Picker
                        selectedValue={time}
                        style={{ height: 50, width: '100%' }}
                        onValueChange={(itemValue, itemIndex) => setDataBits(+itemValue)}>
                        {Options.dataBits.map((item) => <Picker.Item key={'value-time-' + item} label={item.toString()} value={item} />)}
                    </Picker>
                </View>
            </View>
            <View style={{ marginVertical: 10 }} >
                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Stop bits:</Text>
                <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                    <Picker
                        selectedValue={time}
                        style={{ height: 50, width: '100%' }}
                        onValueChange={(itemValue, itemIndex) => setStopsBits(+itemValue)}>
                        {Options.stopsBits.map((item) => <Picker.Item key={'value-time-' + item} label={item.toString()} value={item} />)}
                    </Picker>
                </View>
            </View>
            <Button title="Guardar" onPress={saveData} color="#00BBD3"   ></Button>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={isSave ? "Guardando datos" : "Cargando datos"} description={isSave ? "Guardando datos de configuracion..." : "Obteniendo datos de configuracion guardados..."} loading={true} />
        </ScrollView>
    );
}

export default ConfigurationScreen;