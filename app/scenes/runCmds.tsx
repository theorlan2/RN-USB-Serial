import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Pressable, ScrollView, StatusBar, Text, TextInput, View } from 'react-native'
import IonicIcon from 'react-native-vector-icons/Ionicons';
import CardCmd from '../components/GroupsCmd/CardCmd';
import ModalInfoFC from '../components/ModalInfoFC';
import { CmdModelView } from '../infrastructure/modelViews/CmdModelView';
import { GroupCmdModelView } from '../infrastructure/modelViews/GroupCmd';
import { MacroCmdModelView } from '../infrastructure/modelViews/MacroCmd';
//
import { addEventListenerReadData, sendData } from '../infrastructure/utils/serialConnection'
import { downPositionElement, runCmds, stopTimeout, upPositionElement } from '../infrastructure/utils/utilsGroups';
import { getStoreData } from '../infrastructure/utils/utilsStore';
import routesNames, { RootStackParamList } from '../routes/routesNames';

type RunCmdScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'RunCmds'
>;

interface Props {
    navigation: RunCmdScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'RunCmds'>,
}

let listCmdsY = [];
const RunCmdScreen: FunctionComponent<Props> = (props) => {

    const [cmds, setCmds] = useState([] as CmdModelView[]);
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [logCMD, setLogCMD] = useState([] as any[]);
    const [groupData, setGroupData] = useState({} as GroupCmdModelView);
    const [listMacros, setListMacros] = useState([] as MacroCmdModelView[]);
    const [eventChange, setEventChange] = useState('');
    const [isStart, setIsStart] = useState(false);
    const [scrollViewRef, setScrollView] = useState({} as ScrollView);
    const [scrollViewRef1, setScrollViewRef1] = useState({} as ScrollView);

    useEffect(() => {
        if (props.route.params && props.route.params.id) {
            getDataFromStorage();
            eventOnRead();
        }
    }, []);

    useEffect(() => {
        if (props.route.params && props.route.params.run) {
            if ((cmds.length > 0 || listMacros.length > 0) && !isStart) {
                setIsStart(true);
                _runCmds();
            }
        }
    }, [cmds, listMacros]);

    function getDataFromStorage() {
        setShowModalLoading(true);
        getStoreData('groupsCmds').then(r => {
            if (r) {
                let listGroups = r;
                let result = listGroups.find(item => item.id == props.route.params.id);
                if (result) {
                    setCmds(result.listCmds);
                    setGroupData(result);
                } else {
                    props.navigation.navigate(routesNames.Home.name);
                }
            }
        }).then(() => {
            getStoreData('macrosCmds').then(r => {
                if (r) {
                    let listMacros = r as MacroCmdModelView[];
                    if (listMacros) {
                        setListMacros(listMacros);
                    }
                }
            }).then(() => {
                setShowModalLoading(false);
            })
        }).then(() => { });
    }


    function eventOnRead(this: any) {
        addEventListenerReadData((data) => {
            setLogCMD((prevState) => ([
                ...prevState,
                { isSend: false, cmd: data.payload }
            ] as any));
            scrollViewRef.scrollToEnd({ animated: true })
        }, this);
    }

    function _stopCmds() {
        let lastIndex = 5;
        stopTimeout(lastIndex, cmds);
        setIsStart(false);
    }

    function _runCmds() {
        let count = 0;
        setIsStart(true);
        runCmds(cmds, (cmd: string) => {
            if (listCmdsY[count]) {
                scrollViewRef1.scrollTo({
                    animated: true,
                    y: listCmdsY[count]
                });
            }
            stopTimeout(count);
            count++;
            sendCmd(cmd);
            setLogCMD((prevState) => ([
                ...prevState,
                { isSend: true, cmd: cmd }
            ] as any));
            scrollViewRef.scrollToEnd({ animated: true });
        })
    }


    function _upPositionElement(id: number) {
        upPositionElement(id, cmds, (result => { setCmds(result); }));
        setEventChange(Date.now().toString());
    }

    function _downPositionElement(id: number) {
        downPositionElement(id, cmds, (result => {
            console.log('r', result);
            setCmds(result);
        }));
        setEventChange(Date.now().toString());
    }


    function clearLog() {
        setLogCMD([]);
    }

    function sendCmd(_cmd: string) {
        sendData('HEX', _cmd);
    }


    return (
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <ScrollView ref={ref => { setScrollViewRef1(ref); }} style={{ flex: 4, maxWidth: '96%', alignSelf: 'center', width: '100%' }}   >
                {cmds.map((item, indx) => <View key={indx} onLayout={event => {
                    const { layout } = event.nativeEvent;
                    listCmdsY.push(layout.y);
                }} ><CardCmd item={item} downPosition={_downPositionElement} upPosition={_upPositionElement} position={indx} /></View>)}
                <View>
                    {cmds.length < 1 && <View style={{ marginVertical: 10 }} >
                        <Text style={{ textAlign: 'center' }} >No hay Comandos creados</Text>
                    </View>}
                    {/*  */}
                </View>
            </ScrollView>
            <ScrollView ref={ref => { setScrollView(ref); }} style={{ flex: 1, width: '100%', backgroundColor: '#CFD8DC' }} onContentSizeChange={() => { }} >
                <Text style={{ margin: 10 }} >Log:</Text>
                {logCMD.map((item, indx) => <Text style={{ margin: 10 }} key={indx + item.cmd} ><Text style={{ fontWeight: 'bold' }} >{item.isSend ? 'Enviado:' : 'Recibido'}</Text>{item.cmd}</Text>)}
            </ScrollView>
            {logCMD.length > 10 && <View style={{ position: 'absolute', width: 40, height: 40, bottom: isStart ? 76 : 96, right: 20, }} >
                <Pressable onPress={clearLog} style={{ backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 40, elevation: 4, width: 50, height: 50, alignSelf: 'flex-end' }} ><IonicIcon name="trash-outline" size={24} color="red" /></Pressable>
            </View>}
            {isStart && <View style={{ position: 'absolute', width: 40, height: 40, bottom: 26, right: 20, }} >
                <Pressable onPress={_stopCmds} style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderRadius: 40, elevation: 4, width: 50, height: 50, alignSelf: 'flex-end' }} ><IonicIcon name="stop-outline" size={24} color="#fff" /></Pressable>
            </View>}
            {!isStart && <View style={{ position: 'absolute', width: 60, height: 60, bottom: 16, right: 16, }} >
                <Pressable onPress={_runCmds} style={{ backgroundColor: '#00BBD3', justifyContent: 'center', alignItems: 'center', borderRadius: 40, elevation: 4, width: 60, height: 60, alignSelf: 'flex-end' }} ><IonicIcon name="play-outline" size={24} color="#fff" /></Pressable>
            </View>}
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={"Cargando datos"} description={"Obteniendo datos de configuracion guardados..."} loading={true} />
        </View >
    );
}

export default RunCmdScreen;