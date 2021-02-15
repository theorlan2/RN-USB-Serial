import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { definitions } from 'react-native-serialport';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import ModalAddGroupFC from '../components/ModalAddGroupFC';
import ModalInfoFC from '../components/ModalInfoFC';
import { StatusConnectionEnum, useSerialStatus } from '../infrastructure/contexts/serialStatusContext';

//
import { ConectionSerial, startUsbListener, validateIsRun } from '../infrastructure/utils/serialConnection'
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
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [showModalAddGroup, setShowModalAddGroup] = useState(false);
    const [showModalAddMacro, setShowModalAddMacro] = useState(false);
    const { setConnectStatus } = useSerialStatus();

    useEffect(() => {
    }, []);

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
                setConfigurationData(result);
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
                    props.navigation.navigate(routesNames.GroupCmds.name, { id: id });
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
                    props.navigation.navigate(routesNames.MacroCmds.name, { id: id });
                }, 500);
            });
        });
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <ScrollView style={styles.mainCont} >
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
                <Pressable onPress={addGroup} style={styles.contBtn} >
                    <View style={styles.contTitleBtn} >
                        <IonicIcon name="add-outline" size={32} color="#444" />
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
                <Pressable onPress={addGMacro} style={styles.contBtn} >
                    <View style={styles.contTitleBtn} >
                        <IonicIcon name="add-outline" size={32} color="#444" />
                        <Text style={styles.titleBtn} >Crear Macro</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={{ fontWeight: '400', fontSize: 16, }} >Crear un grupo de comandos en un macro.</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate(routesNames.MacroCmdsList.name)} style={styles.contBtn} >
                    <View style={styles.contTitleBtn} >
                        <IonicIcon name="list-outline" size={32} color="#444" />
                        <Text style={styles.titleBtn} >Cargar Macro</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={{ fontWeight: '400', fontSize: 16, }} >Carga un grupo de comandos en un macro.</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate(routesNames.CalCRCCmds.name)} style={styles.contBtn} >
                    <View style={styles.contTitleBtn} >
                        <IonicIcon name="calculator-outline" size={32} color="#444" />
                        <Text style={styles.titleBtn} >Calcular CRC</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={{ fontWeight: '400', fontSize: 16, }} >Calcula CRC de los comandos.</Text>
                    </View>
                </Pressable>
            </ScrollView>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={"Cargando datos"} description={"Obteniendo datos de configuracion guardados..."} loading={true} />
            <ModalAddGroupFC title="Crear nuevo grupo" description="Escribe el nombre del grupo:" modalVisible={showModalAddGroup} closeModal={() => setShowModalAddGroup(false)} create={createGroup} />
            <ModalAddGroupFC title="Crear nuevo macro" description="Escribe el nombre del macro:" modalVisible={showModalAddMacro} closeModal={() => setShowModalAddMacro(false)} create={createMacro} />
        </View>
    );
}


export default HomeScreen;