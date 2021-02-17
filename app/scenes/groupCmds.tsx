import { Picker } from '@react-native-picker/picker'
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Button, Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native'
import IonicIcon from 'react-native-vector-icons/Ionicons';

//
import { addEventListenerReadData, sendData } from '../infrastructure/utils/serialConnection'
import { downPositionElement, runCmds, upPositionElement } from '../infrastructure/utils/utilsGroups';
import { getStoreData, setStoreData } from '../infrastructure/utils/utilsStore';
import routesNames, { RootStackParamList } from '../routes/routesNames';
import { CmdModelView } from '../infrastructure/modelViews/CmdModelView';
import { GroupCmdModelView } from '../infrastructure/modelViews/GroupCmd';
import CardCmd from '../components/GroupsCmd/CardCmd';
import ModalInfoFC from '../components/ModalInfoFC';
import { MacroCmdModelView } from '../infrastructure/modelViews/MacroCmd';

type GroupCmdScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'GroupCmds'
>;

interface Props {
    navigation: GroupCmdScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'GroupCmds'>,
}

const GroupCmdScreen: FunctionComponent<Props> = (props) => {

    const [times] = useState([25, 50, 100, 150, 200, 300, 400, 500, 1000, 2000]);
    const [cmds, setCmds] = useState([] as CmdModelView[]);
    const [macros, setMacros] = useState([] as MacroCmdModelView[]);
    const [eventChange, setEventChange] = useState('');
    //  Form 
    const [time, setTime] = useState(25)
    const [idCmd, setIdCmd] = useState(0)
    const [title, setTitle] = useState('');
    const [cmd, setCmd] = useState('');
    const [macro, setMacro] = useState(0);
    //
    const [showAddCmd, setShowAddCmd] = useState(false);
    const [showAddMacro, setShowAddMacro] = useState(false);
    const [haveChanges, setHaveChanges] = useState(false);
    const [isSaveCmd, setIsSave] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [showModalLoading, setShowModalLoading] = useState(false);

    useEffect(() => {
        if (props.route.params && props.route.params.id) {
            getDataFromStorage();
        }
    }, [])

    function addMacro() {
        let r = macros.find(item => item.id == macro);
        setCmds((prevState) => ([
            ...prevState,
            {
                id: Date.now(),
                timeOut: time,
                title: r.title,
                isMacro: true,
                listCmds: r.listCmds,
                idGroup: props.route.params.id,
            }
        ]));
        setTimeout(() => {
            setMacro(macros[0].id);
            setCmd('');
            setTime(25);
            setShowAddMacro(false);
        }, 100);


    }

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
            setTime(25);
        }, 100);
        setHaveChanges(true);
    }


    function editCmd(id: number) {
        setIsEdit(true);
        let r = cmds.find(item => item.id == id);
        setTitle(r?.title);
        setCmd(r?.cmd);
        setTime(r?.timeOut);
        setIdCmd(id);
        setShowAddCmd(true);
        setHaveChanges(true);
    }

    function saveEditCmd(id: number) {
        setCmds((prevState) => {
            let resultIndx = prevState.findIndex(item => item.id == id);
            prevState[resultIndx] = {
                id: id,
                title: title,
                cmd: cmd,
                timeOut: time,
                idGroup: props.route.params.id
            };
            return [
                ...prevState
            ];
        });
        setTitle('');
        setCmd('');
        setTime(25);
        setIdCmd(0);
        setIsEdit(false);
        setHaveChanges(true);
        setShowAddCmd(false);
    }

    function deleteCmd(id: number) {
        setCmds(cmds.filter(item => item.id != id));
        setHaveChanges(true);
    }

    function getDataFromStorage() {
        setIsSave(false);
        setShowModalLoading(true);
        getStoreData('groupsCmds').then(r => {
            if (r) {
                let listGroups = r;
                let result = listGroups.find(item => item.id == props.route.params.id);
                if (result) {
                    setCmds(result.listCmds);
                } else {
                    props.navigation.navigate(routesNames.Home.name);
                }
            }
        }).then(async () => {
            await getStoreData('macrosCmds').then((r) => {
                if (r) {
                    setMacros(r);
                    setMacro(r[0].id);
                }
            })
        }).then(() => {
            setShowModalLoading(false);
        }).then(() => {
        });
    }

    function saveGroup() {
        setIsSave(true);
        setHaveChanges(false);
        setShowModalLoading(true);
        getStoreData('groupsCmds').then((r: GroupCmdModelView[]) => {
            let listGroups = r ? r : [];
            let result = r.findIndex(item => item.id == props.route.params.id);
            if (result > -1) {
                listGroups[result].listCmds = cmds;
            }
            setStoreData("groupsCmds", listGroups);
            setShowModalLoading(false);
        })
    }


    function _upPositionElement(id: number) {
        upPositionElement(id, cmds, (result => { setCmds(result); }));
        setEventChange(Date.now().toString());
        setHaveChanges(true);
    }

    function _downPositionElement(id: number) {
        downPositionElement(id, cmds, (result => {
            setCmds(result);
        }));
        setEventChange(Date.now().toString());
        setHaveChanges(true);
    }

    function _runCmds() {
        props.navigation.navigate(routesNames.RunCmds.name, { id: props.route.params.id, run: true });
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <ScrollView style={{ flex: 4, maxWidth: '96%', alignSelf: 'center', width: '100%' }}   >

                {cmds.map((item, indx) => <CardCmd isMacro={item.isMacro} key={indx} position={indx} item={item} upPosition={_upPositionElement}
                    downPosition={_downPositionElement} editCmd={editCmd} deleteCmd={deleteCmd} />)}
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
                                <Button title="CANCELAR" onPress={() => setShowAddCmd(false)} color="red"   ></Button>
                            </View>
                            <View style={{ flex: 1, marginLeft: 5 }} >
                                <Button title="Guardar" onPress={() => isEdit ? saveEditCmd(idCmd) : addCmd()} color="#00BBD3"  ></Button>
                            </View>
                        </View>
                    </View>}
                    {showAddMacro && <View style={{ marginVertical: 10 }} >
                        <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5 }} >Tiempo de retraso:</Text>
                        <View style={{ backgroundColor: '#fff', elevation: 2 }} >
                            <Picker
                                selectedValue={macro}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => setMacro(+itemValue)}>
                                {macros.map((item) => <Picker.Item key={'value-macro-' + item.id} label={item.title} value={item.id} />)}
                            </Picker>
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
                                <Button title="CANCELAR" onPress={() => setShowAddMacro(false)} color="red"   ></Button>
                            </View>
                            <View style={{ flex: 1, marginLeft: 5 }} >
                                <Button title="Guardar" onPress={() => addMacro()} color="#00BBD3"  ></Button>
                            </View>
                        </View>
                    </View>}
                    {cmds.length < 1 && !showAddCmd && <View style={{ marginVertical: 10 }} >
                        <Text style={{ textAlign: 'center' }} >No hay Comandos creados</Text>
                    </View>}
                    {/*  */}
                </View>

                {!showAddCmd && !showAddMacro && <View style={{ marginVertical: 10, flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, marginRight: 5 }} >
                        <Button title="Agregar Comando" onPress={() => showAddCmd ? addCmd() : setShowAddCmd(true)} color="#00BBD3" ></Button>
                    </View>
                    <View style={{ flex: 1, marginLeft: 5 }} >
                        <Button title="Agregar Macro" onPress={() => setShowAddMacro(true)} color="#00BBD3" ></Button>
                    </View>
                </View>}
                {!showAddCmd && <View style={{ marginVertical: 10, flex: 1, flexDirection: 'column' }} >

                </View>}

            </ScrollView>
            <View style={{ position: 'absolute', bottom: 86, right: 16, }} >
                <Pressable onPress={saveGroup} style={{ backgroundColor: haveChanges ? '#FFCA28' : '#00BBD3', justifyContent: 'center', alignItems: 'center', borderRadius: 40, elevation: 4, width: 45, height: 45, alignSelf: 'flex-end' }} ><IonicIcon name="save-outline" size={24} color="#fff" /></Pressable>
            </View>
            <View style={{ position: 'absolute', bottom: 26, right: 16, }} >
                <Pressable onPress={_runCmds} style={{ backgroundColor: '#00BBD3', justifyContent: 'center', alignItems: 'center', borderRadius: 40, elevation: 4, width: 45, height: 45, alignSelf: 'flex-end' }} ><IonicIcon name="play-outline" size={24} color="#fff" /></Pressable>
            </View>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={isSaveCmd ? "Guardando datos" : "Cargando datos"} description={isSaveCmd ? "Guardando datos de configuracion..." : "Obteniendo datos de configuracion guardados..."} loading={true} />
        </View >
    );
}

export default GroupCmdScreen;