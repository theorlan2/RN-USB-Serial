import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//
import ModalInfoFC from '../components/ModalInfoFC';
import { DataBitsEnum, ParitiesEnum, StopBitsEnum } from '../infrastructure/enums/configurationDataEnum';
import { useTheme } from '../infrastructure/contexts/themeContexts';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes/routesNames';


type HomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Configuration'>;

interface Props {
    navigation: HomeScreenNavigationProp;
}


const ConfigurationScreen: FunctionComponent<Props> = (props) => {

    const { colors } = useTheme();
    const { t } = useTranslation(['defaultData']);
    const [parity, setParity] = useState(ParitiesEnum.PARITY_NONE);
    const [dataBits, setDataBits] = useState(DataBitsEnum.DATA_BITS_5)
    const [stopsBits, setStopsBits] = useState(StopBitsEnum.STOP_BITS_1)
    const [breakDuration, setBreakDuration] = useState('')
    const [baudRate, setBaudRate] = useState('9600')
    const [isSave, setIsSave] = useState(true);
    const [showModalLoading, setShowModalLoading] = useState(true);

    const Options = {
        parity: [
            { name: 'Even', value: ParitiesEnum.PARITY_EVEN },
            { name: 'None', value: ParitiesEnum.PARITY_NONE },
            { name: 'Mark', value: ParitiesEnum.PARITY_MARK },
            { name: 'Odd', value: ParitiesEnum.PARITY_ODD },
            { name: 'Space', value: ParitiesEnum.PARITY_SPACE }
        ],
        dataBits: [
            DataBitsEnum.DATA_BITS_5,
            DataBitsEnum.DATA_BITS_6,
            DataBitsEnum.DATA_BITS_7,
            DataBitsEnum.DATA_BITS_8,
        ],
        stopsBits: [
            { name: '1', value: StopBitsEnum.STOP_BITS_1 },
            { name: '1.5', value: StopBitsEnum.STOP_BITS_15 },
            { name: '2', value: StopBitsEnum.STOP_BITS_2 },
        ],
    }
    useEffect(() => {
        getDataFromStorage();
    }, []);

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


    const styles = StyleSheet.create({
        iconStyle: { fontSize: 45, color: colors.text },
        btn: { paddingVertical: 16, backgroundColor: colors.primary, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
        btnText: { color: 'white', fontSize: 16 },
    });


    return (
        <ScrollView style={{ maxWidth: '96%', alignSelf: 'center', width: '100%' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <View style={{ marginVertical: 10 }} >
                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5, color: colors.text }} >Baud rate:</Text>
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

            <View style={{ marginVertical: 10 }} >
                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5, color: colors.text }} >Parity:</Text>
                <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                    <Picker
                        selectedValue={parity}
                        style={{ height: 50, width: '100%' }}
                        onValueChange={(itemValue, itemIndex) => setParity(+itemValue)}>
                        {Options.parity.map((item) => <Picker.Item key={'value-time-' + item} label={item.name} value={item.value} />)}
                    </Picker>
                </View>
            </View>
            <View style={{ marginVertical: 10 }} >
                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5, color: colors.text }} >Data bits:</Text>
                <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                    <Picker
                        selectedValue={dataBits}
                        style={{ height: 50, width: '100%' }}
                        onValueChange={(itemValue, itemIndex) => setDataBits(+itemValue)}>
                        {Options.dataBits.map((item) => <Picker.Item key={'value-time-' + item} label={item.toString()} value={item} />)}
                    </Picker>
                </View>
            </View>
            <View style={{ marginVertical: 10 }} >
                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5, color: colors.text }} >Stop bits:</Text>
                <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                    <Picker
                        selectedValue={stopsBits}
                        style={{ height: 50, width: '100%' }}
                        onValueChange={(itemValue, itemIndex) => setStopsBits(itemValue)}>
                        {Options.stopsBits.map((item) => <Picker.Item key={'value-time-' + item} label={item.name} value={item.value} />)}
                    </Picker>
                </View>
            </View>
            <View
                style={{
                    alignSelf: 'center',
                    marginBottom: 10,
                    flexDirection: 'row',
                }}>
                <View style={{ flex: 1, margin: 5 }}>
                    <Pressable style={{ ...styles.btn, backgroundColor: 'transparent' }}
                        onPress={() => { props.navigation.goBack() }}>
                        <Icon
                            name="arrow-left"
                            color={colors.text}
                            style={{ fontSize: 20, marginRight: 5 }}
                        />
                        <Text style={{ ...styles.btnText, color: colors.text, textAlign: 'center', fontWeight: 'bold' }}>{t('defaultData:buttons.back')}</Text>
                    </Pressable>

                </View>
                <View style={{ flex: 1, margin: 5 }}>
                    <Pressable style={{ ...styles.btn, backgroundColor: colors.secondary }}
                        onPress={saveData}>
                        <Icon
                            name="content-save"
                            color="white"
                            style={{ fontSize: 20, marginRight: 5 }}
                        />
                        <Text style={styles.btnText}>{t('defaultData:buttons.save')}</Text>
                    </Pressable>
                </View>
            </View>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={isSave ? "Guardando datos" : "Cargando datos"} description={isSave ? "Guardando datos de configuracion..." : "Obteniendo datos de configuracion guardados..."} loading={true} />
        </ScrollView>
    );
}

export default ConfigurationScreen;