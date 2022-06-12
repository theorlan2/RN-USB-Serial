import { Picker } from '@react-native-picker/picker'
import React, { FunctionComponent, useRef, useState } from 'react'
import { Button, Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native'
import IonicIcon from 'react-native-vector-icons/Ionicons';
import CardCmd from '../components/GroupsCmd/CardCmd';

//
import { sendData } from '../infrastructure/utils/serialConnection'
import { CmdModelView } from '../infrastructure/modelViews/CmdModelView';
import { downPositionElement, runCmds, stopTimeout, upPositionElement } from '../infrastructure/utils/utilsGroups';


let listCmdsY = [] as string[];
const TempCmdScreen: FunctionComponent = () => {

    const [times] = useState([25, 50, 100, 150, 200, 300, 400, 500, 1000, 2000]);

    const [cmds, setCmds] = useState([] as CmdModelView[]);
    const [eventChange, setEventChange] = useState('');
    const [time, setTime] = useState(0)
    const [title, setTitle] = useState('');
    const [cmd, setCmd] = useState('')
    const [disabledAdd, setDisabledAdd] = useState(false)
    const [showAddCmd, setShowAddCmd] = useState(false)
    const [logCMD, setLogCMD] = useState([] as any);
    const scrollViewRef = useRef({} as ScrollView);
    const scrollViewRef2 = useRef({} as ScrollView);


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
    }


    function editCmd(id: number) {
        let r = cmds.find(item => item.id == id);
        if (r && r?.cmd) {
            setTitle(r?.title);
            setCmd(r?.cmd);
            setTime(r?.timeOut);
            setShowAddCmd(true);
        }
    }

    function deleteCmd(id: number) {
        setCmds(cmds.filter(item => item.id != id));
    }


    function _runCmds() {
        let count = 0;
        runCmds(cmds, (cmd: string) => {
            if (listCmdsY[count]) {
                scrollViewRef2.current.scrollTo({
                    animated: true,
                    y: +listCmdsY[count]
                });
            }
            stopTimeout(count);
            count++;
            sendCmd(cmd);
            setLogCMD((prevState: { isSend: boolean, cmd: CmdModelView }[]) => ([
                ...prevState,
                { isSend: true, cmd: cmd }
            ] as any));
            scrollViewRef.current.scrollToEnd({ animated: true });
        })
    }

    function sendCmd(_cmd: string) {
        sendData('HEX', _cmd);
    }


    function _upPositionElement(id: number) {
        upPositionElement(id, cmds, (result => { setCmds(result); }));
        setEventChange(Date.now().toString());
    }

    function _downPositionElement(id: number) {
        downPositionElement(id, cmds, (result => {
            setCmds(result);
        }));
        setEventChange(Date.now().toString());
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <ScrollView style={{ flex: 4, maxWidth: '96%', alignSelf: 'center', width: '100%' }}   >

                {cmds.map((item, indx) => <CardCmd isMacro={item.isMacro ? true : false} key={indx} item={item} position={indx} editCmd={editCmd} deleteCmd={deleteCmd} upPosition={_upPositionElement} downPosition={_downPositionElement} />)}

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
                                <Button title="Agregar Comando" onPress={addCmd} color="#00BBD3" disabled={disabledAdd} ></Button>
                            </View>
                        </View>
                    </View>}
                    {cmds.length < 1 && <View style={{ marginVertical: 10 }} >
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
                <Text style={{ margin: 10 }} >Log de comandos:</Text>
                {logCMD.map((item: { isSend: boolean, cmd: CmdModelView }, indx: number) => <Text style={{ margin: 10 }} key={indx + 'log-cmd'} ><Text style={{ fontWeight: 'bold' }} >{item.isSend ? 'Enviado:' : 'Recibido'}</Text>{item.cmd}</Text>)}
            </ScrollView>
            <View style={{ position: 'absolute', width: 60, height: 60, bottom: 16, right: 16, }} >
                <Pressable onPress={_runCmds} style={{ backgroundColor: '#00BBD3', justifyContent: 'center', alignItems: 'center', borderRadius: 40, elevation: 4, width: 60, height: 60, alignSelf: 'flex-end' }} ><IonicIcon name="play-outline" size={24} color="#fff" /></Pressable>
            </View>
        </View>
    );
}

export default TempCmdScreen;