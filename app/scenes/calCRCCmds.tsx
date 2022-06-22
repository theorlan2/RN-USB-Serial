import { Picker } from '@react-native-picker/picker'
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useState } from 'react'
import { Button, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import {
    crc81wire,
    crc16modbus
} from 'crc';
//
import { RootStackParamList } from '../routes/routesNames';
import { useTheme } from '../infrastructure/contexts/themeContexts';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

type CalCRCCmdScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'CalCRCCmds'
>;

interface Props {
    navigation: CalCRCCmdScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'CalCRCCmds'>,
}

const CalCRCCmdScreen: FunctionComponent<Props> = (props) => {
    const { colors } = useTheme();
    const {} = useTranslation(['calculateCRC'])
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

    const styles = StyleSheet.create({
        contPrincipal: {
            flex: 1, flexDirection: 'column' 
        },
        titleInput: {
            fontWeight: 'bold', fontSize: 12, marginBottom: 5, color: colors.text 
        },
        contInputs:{
            marginVertical: 10
        },
        contInput:{
            backgroundColor: '#fff', elevation: 2
        },
        contResult:{
             flex: 1, marginTop: 20,
        },
        textResult: {
            backgroundColor: colors.background_3, padding: 10, fontSize: 20, textAlign: 'center', color: colors.text
        }

    })


    return (
        <View style={styles.contPrincipal} >
            <StatusBar backgroundColor={colors.headerAccent} barStyle="light-content" ></StatusBar>
            <View style={{ flex: 4, maxWidth: '96%', alignSelf: 'center', width: '100%' }}   >

                <View style={styles.contInputs} >
                    <Text style={styles.titleInput} >{t('calculateCRC:inputs.type')}</Text>
                    <View style={styles.contInput} >
                        <Picker
                            selectedValue={type}
                            style={{ height: 50, width: '100%' }}
                            onValueChange={(itemValue, itemIndex) => setType(itemValue.toString())}>
                            {types.map((item) => <Picker.Item key={'value-time-' + item} label={item.name} value={item.value} />)}
                        </Picker>
                    </View>
                </View>

                <View style={styles.contInputs} >
                    <Text style={styles.titleInput} >{t('calculateCRC:inputs.command')+':'}</Text>
                    <View style={styles.contInput} >
                        <TextInput
                            placeholder={t('calculateCRC:inputs.command')}
                            value={cmd}
                            onChangeText={value => setCmd(value)}
                            autoCapitalize='characters'
                        />
                    </View>
                </View>
                <View style={{ marginTop: 10, }} >
                    <Button color={colors.primary} onPress={() => calclulate()} title={t('calculateCRC:inputs.calculate')} ></Button>
                </View>
                <View style={styles.contResult} >
                    <Text style={styles.titleInput} >{t('calculateCRC:titles.result')}</Text>
                    <Text style={styles.textResult} >{result}</Text>
                    <View style={{ marginTop: 10, }} >
                        <Button color={colors.primary} onPress={() => calclulate()} title={t('calculateCRC:titles.copy')} ></Button>
                    </View>
                </View>

            </View>


        </View>
    );
}

export default CalCRCCmdScreen;