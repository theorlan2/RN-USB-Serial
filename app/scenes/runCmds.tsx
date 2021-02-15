import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, Button, Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native'
import IonicIcon from 'react-native-vector-icons/Ionicons';
import CardCmd from '../components/GroupsCmd/CardCmd';
import ModalInfoFC from '../components/ModalInfoFC';
import { CmdModelView, GroupCmdModelView } from '../infrastructure/modelViews/GroupCmd';

//
import { addEventListenerReadData, sendData } from '../infrastructure/utils/serialConnection'
import routesNames, { RootStackParamList } from '../routes/routesNames';

type GroupCmdScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'GroupCmds'
>;

interface Props {
    navigation: GroupCmdScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'GroupCmds'>,
}

const MacroCmdScreen: FunctionComponent<Props> = (props) => {

    const [times] = useState([25, 50, 100, 150, 200, 300, 400, 500, 1000, 2000]);
    const [cmds, setCmds] = useState([] as CmdModelView[]);
    const [groupData, setGroupData] = useState({} as GroupCmdModelView)
    const [time, setTime] = useState(0)
    const [idCmd, setIdCmd] = useState(0)
    const [title, setTitle] = useState('');
    const [cmd, setCmd] = useState('');
    const [disabledAdd, setDisabledAdd] = useState(false);
    const [showAddCmd, setShowAddCmd] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [logCMD, setLogCMD] = useState([]);
    const [showModalLoading, setShowModalLoading] = useState(false);

    useEffect(() => {
        if (props.route.params && props.route.params.id) {
            getDataFromStorage();
            eventOnRead();
        }
    }, [])

    function addCmd() {
        setCmds((prevState) => ([
            ...prevState,
            {
                id: Date.now(),
                cmd: cmd,
                timeOut: time,
                title: title,
                idGroup: 0,
            }
        ]));

        setTimeout(() => {
            setTitle('');
            setCmd('');
            setTime(10);
        }, 100);
        setTimeout(() => {
            saveGroup();
        }, 500);
    }


    function editCmd(id: number) {
        setIsEdit(true);
        let r = cmds.find(item => item.id == id);
        setTitle(r?.title);
        setCmd(r?.cmd);
        setTime(r?.timeOut);
        setIdCmd(id);
        setShowAddCmd(true);
    }

    function saveEditCmd(id: number) {
        setCmds((prevState) => {
            let resultIndx = prevState.findIndex(item => item.id == id);
            prevState[resultIndx] = {
                id: id,
                title: title,
                cmd: cmd,
                timeOut: time,
                idGroup: props.route.params.id.toString()
            };

            return [
                ...prevState
            ];
        });
        setIdCmd(0);
        setIsEdit(false);
    }

    function deleteCmd(id: number) {
        setCmds(cmds.filter(item => item.id != id));
    }

    function getDataFromStorage() {
        setShowModalLoading(true);
        getData('macrosCmds').then(r => {
            if (r) {
                let listGroups = r;
                let result = listGroups.find(item => item.id == props.route.params.id);
                console.log(result);
                if (result) {
                    setCmds(result.listCmds);
                    setGroupData(result);
                } else {
                    props.navigation.navigate(routesNames.Home.name);
                }
            }
        }).then(() => {
            setShowModalLoading(false);
        }).then(() => {
        });
    }

    function saveGroup() {
        getData('macrosCmds').then((r: GroupCmdModelView[]) => {
            let listMacros = r ? r : [];
            let result = r.findIndex(item => item.id == props.route.params.id);
            if (result > -1) {
                listMacros[result].listCmds = cmds;
            }
            storeData("macrosCmds", listMacros);
        })
    }

    function eventOnRead(this: any) {
        addEventListenerReadData((data) => {
            setLogCMD((prevState) => ([
                ...prevState,
                { isSend: false, cmd: data.payload }
            ] as any));
        }, this);
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
            _time_count += cmds[i].timeOut;
            doSetTimeout(cmds[i].cmd, _time_count);
        }
    }


    function sendCmd(_cmd: string) {
        sendData('HEX', _cmd);
    }



    return (
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <ScrollView style={{ flex: 4, maxWidth: '96%', alignSelf: 'center', width: '100%' }}   >

                {cmds.map((item, indx) => <CardCmd key={indx} item={item} editCmd={editCmd} deleteCmd={deleteCmd} key={indx} />)}
                <View>
                    {/*  */}
                    {showAddCmd && <View style={{ marginVertical: 10 }} >
                        <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }} >AGREGAR COMANDO</Text>
                        <View style={{ marginVertical: 10, paddingBottom: 15, }} >
                            <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Nombre:</Text>
                            <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                                <TextInput
                                    placeholder="Nombre"
                                    value={title}
                                    onChangeText={value => setTitle(value)}
                                />
                            </View>
                        </View>
                        <View style={{ marginVertical: 10, paddingBottom: 15, }} >
                            <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Comando en Hexadecimal:</Text>
                            <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                                <TextInput
                                    placeholder="Comando en Hexadecimal"
                                    value={cmd}
                                    onChangeText={value => setCmd(value)}
                                    autoCapitalize='characters'
                                />
                            </View>
                        </View>
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
                        <View style={{ marginVertical: 10, flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1, marginRight: 5 }} >
                                <Button title="CANCELAR" onPress={() => setShowAddCmd(false)} color="red" disabled={disabledAdd} ></Button>
                            </View>
                            <View style={{ flex: 1, marginLeft: 5 }} >
                                <Button title="Guardar" onPress={() => isEdit ? saveEditCmd(idCmd) : addCmd()} color="#00BBD3" disabled={disabledAdd} ></Button>
                            </View>
                        </View>
                    </View>}
                    {cmds.length < 1 && !showAddCmd && <View style={{ marginVertical: 10 }} >
                        <Text style={{ textAlign: 'center' }} >No hay Comandos creados</Text>
                    </View>}
                    {/*  */}
                </View>

                {!showAddCmd && <View style={{ marginVertical: 10, flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, marginLeft: 5 }} >
                        <Button title="Agregar Comando" onPress={() => showAddCmd ? addCmd() : setShowAddCmd(true)} color="#00BBD3" disabled={disabledAdd} ></Button>
                    </View>
                </View>}
            </ScrollView>
            <ScrollView style={{ flex: 1, width: '100%', backgroundColor: '#CFD8DC' }} contentContainerStyle={{}} >
                <Text style={{ margin: 10 }} >Log:</Text>
                {logCMD.map((item, indx) => <Text style={{ margin: 10 }} key={indx + item.cmd} ><Text style={{ fontWeight: 'bold' }} >{item.isSend ? 'Enviado:' : 'Recibido'}</Text>{item.cmd}</Text>)}
            </ScrollView>
            <View style={{ position: 'absolute', width: 60, height: 60, bottom: 16, right: 16, }} >
                <Pressable onPress={runCmds} style={{ backgroundColor: '#00BBD3', justifyContent: 'center', alignItems: 'center', borderRadius: 40, elevation: 4, width: 60, height: 60, alignSelf: 'flex-end' }} ><IonicIcon name="play-outline" size={24} color="#fff" /></Pressable>
            </View>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={isSave ? "Guardando datos" : "Cargando datos"} description={isSave ? "Guardando datos de configuracion..." : "Obteniendo datos de configuracion guardados..."} loading={true} />
        </View>
    );
}

export default MacroCmdScreen;