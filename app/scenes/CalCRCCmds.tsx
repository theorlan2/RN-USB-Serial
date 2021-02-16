import { Picker } from '@react-native-picker/picker'
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useState } from 'react'
import { Button, StatusBar, Text, TextInput, View } from 'react-native'
import {
    crc81wire,
    crc16modbus
} from 'crc';
//
import routesNames, { RootStackParamList } from '../routes/routesNames';

type CalCRCCmdScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'CalCRCCmds'
>;

interface Props {
    navigation: CalCRCCmdScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'CalCRCCmds'>,
}

const CalCRCCmdScreen: FunctionComponent<Props> = (props) => {

    const [types] = useState([
        { name: 'CRC8 / MAXIM', value: 'crc8Mixim' },
        { name: 'CRC16 / Modbus', value: 'crc16Modbus' },
    ]);
    const [type, setType] = useState('');
    const [cmd, setCmd] = useState('');
    const [result, setResult] = useState('');



    function calclulate() {
        var Buffer = require('buffer').Buffer;
        let r = new Buffer(cmd, 'hex');
        let _result = "";
        switch (type) {
            case 'crc8Mixim':
                _result = crc81wire(r).toString(16);
                break;

            case 'crc16Modbus':
                _result = crc16modbus(r).toString(16);
                break;
            default:
                break;
        }

        setResult(_result)
    }


    return (
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <View style={{ flex: 4, maxWidth: '96%', alignSelf: 'center', width: '100%' }}   >

                <View style={{ marginVertical: 10 }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Tipo:</Text>
                    <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                        <Picker
                            selectedValue={type}
                            style={{ height: 50, width: '100%' }}
                            onValueChange={(itemValue, itemIndex) => setType(itemValue)}>
                            {types.map((item) => <Picker.Item key={'value-time-' + item} label={item.name} value={item.value} />)}
                        </Picker>
                    </View>
                </View>

                <View style={{ marginVertical: 10, paddingBottom: 15, }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Comando en Hexadecimal:</Text>
                    <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                        <TextInput
                            placeholder="Comando en Hexadecimal (sin espacios)"
                            value={cmd}
                            onChangeText={value => setCmd(value)}
                            autoCapitalize='characters'
                        />
                    </View>
                </View>
                <View style={{ marginTop: 10, }} >
                    <Button color="#0096A6" onPress={() => calclulate()} title="Calcular" ></Button>
                </View>
                <View style={{ flex: 1, marginTop: 20, }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Resultado:</Text>
                    <Text style={{ backgroundColor: '#CFD8DC', padding: 10, fontSize: 20, textAlign: 'center' }} >{result}</Text>
                    <View style={{ marginTop: 10, }} >
                        <Button color="#0096A6" onPress={() => calclulate()} title="Copiar" ></Button>
                    </View>
                </View>

            </View>


        </View>
    );
}

export default CalCRCCmdScreen;