import { Picker } from '@react-native-picker/picker'
import React, { FunctionComponent, useRef, useState } from 'react'
import { Button, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import IonicIcon from 'react-native-vector-icons/Ionicons';
import CardCmd from '../components/GroupsCmd/CardCmd';

//
import { sendData } from '../infrastructure/utils/serialConnection'
import { CmdModelView } from '../infrastructure/modelViews/CmdModelView';
import { downPositionElement, runCmds, stopTimeout, upPositionElement } from '../infrastructure/utils/utilsGroups';
import { useTheme } from '../infrastructure/contexts/themeContexts';
import { useTranslation } from 'react-i18next';


let listCmdsY = [] as string[];
const TempCmdScreen: FunctionComponent = () => {
    const { colors } = useTheme();
    const { t } = useTranslation(['sendTempCmds', 'defaultData']);

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
        setDisabledAdd(true);
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
            if (count == cmds.length) {
                setDisabledAdd(false);
            }
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

    const styles = StyleSheet.create({
        main: {
            flex: 1, flexDirection: 'column'
        },
        scrollContainer: {
            flex: 1, maxWidth: '96%', alignSelf: 'center', width: '100%'
        },
        titleForm: {
            fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: colors.text
        },
        formGroup: {
            marginVertical: 10, paddingBottom: 15,
        },
        titleInput: {
            fontWeight: 'bold', fontSize: 12, marginBottom: 5, color: colors.text
        },
        contInput: {
            backgroundColor: '#fff', elevation: 2, color: colors.text
        },
        scrollCommands: {
            flex: 1, width: '100%', backgroundColor: colors.background_3
        },
        contButtons: {
            marginVertical: 10, flex: 1, flexDirection: 'row'
        },
        contButton:{
            flex: 1, marginRight: 5
        },
        contButtonR:{
            flex: 1, marginLeft: 5
        },
        bottomButton:{
            backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', borderRadius: 40, elevation: 4, width: 60, height: 60, alignSelf: 'flex-end'
        },
        textInput: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 0, color: colors.text, backgroundColor: colors.background },

    })

    return (
        <View style={styles.main} >
            <StatusBar backgroundColor={colors.headerAccent} barStyle="light-content" ></StatusBar>
            <ScrollView style={styles.scrollContainer}   >
                {cmds.map((item, indx) => <CardCmd isMacro={item.isMacro ? true : false} key={indx} item={item} position={indx} editCmd={editCmd} deleteCmd={deleteCmd} upPosition={_upPositionElement} downPosition={_downPositionElement} />)}

                <>
                    {showAddCmd && <View style={{ marginVertical: 10 }} >
                        <Text style={styles.titleForm} >{t('sendTempCmds:titles.addCmd')}</Text>
                        <View style={styles.formGroup} >
                            <Text style={styles.titleInput} >{t('sendTempCmds:inputs.name')}:</Text>
                            <View style={styles.contInput} >
                                <TextInput
                                    placeholder={t('sendTempCmds:inputs.name')}
                                    style={styles.textInput}
                                    placeholderTextColor={colors.textPlaceholder}                                    
                                    value={title}
                                    onChangeText={value => setTitle(value)}
                                />
                            </View>
                        </View>
                        <View style={styles.formGroup} >
                            <Text style={styles.titleInput} >{t('sendTempCmds:inputs.cmd')}:</Text>
                            <View style={styles.contInput} >
                                <TextInput
                                    placeholder={t('sendTempCmds:inputs.cmd')}
                                    style={styles.textInput}
                                    placeholderTextColor={colors.textPlaceholder}                                    
                                    value={cmd}
                                    onChangeText={value => setCmd(value)}
                                />
                            </View>
                        </View>
                        <View style={styles.formGroup} >
                            <Text style={styles.titleInput} >{t('sendTempCmds:inputs.timeOut')}:</Text>
                            <View style={styles.contInput} >
                                <Picker
                                    selectedValue={time}
                                    style={{ height: 50, width: '100%' }}
                                    onValueChange={(itemValue, itemIndex) => setTime(+itemValue)}>
                                    {times.map((item) => <Picker.Item key={'value-time-' + item} label={item + 'ms'} value={item} />)}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.contButtons} >
                            <View style={styles.contButton} >
                                <Button title={t('defaultData:buttons.cancel')} onPress={() => setShowAddCmd(false)} color="red" disabled={disabledAdd} ></Button>
                            </View>
                            <View style={styles.contButtonR} >
                                <Button title={t('defaultData:buttons.addCmd')} onPress={addCmd} color={colors.primary} disabled={disabledAdd} ></Button>
                            </View>
                        </View>
                    </View>}
                    {cmds.length < 1 && !showAddCmd && <View style={{ marginVertical: 10 }} >
                        <Text style={{ textAlign: 'center', color: colors.text }} >{t('sendTempCmds:titles.empty')}</Text>
                    </View>}

                </>

                {!showAddCmd && <View style={styles.contButtons} >

                    <View style={{ flex: 1, marginLeft: 5 }} >
                        <Button title={t('sendTempCmds:titles.addCmd')} onPress={() => showAddCmd ? addCmd() : setShowAddCmd(true)} color="#00BBD3" disabled={disabledAdd} ></Button>
                    </View>
                </View>}
            </ScrollView>
            <ScrollView style={styles.scrollCommands} contentContainerStyle={{}} >
                <Text style={styles.titleForm} >{t('sendTempCmds:titles.log')}:</Text>
                {logCMD.map((item: { isSend: boolean, cmd: CmdModelView }, indx: number) => <Text style={{ margin: 10 }} key={indx + 'log-cmd'} ><Text style={{ fontWeight: 'bold' }} >{item.isSend ? t('defaultData:description.send') : t('defaultData:description.received')}</Text>{item.cmd}</Text>)}
            </ScrollView>
            <View style={{ position: 'absolute', width: 60, height: 60, bottom: 16, right: 16, }} >
                <Pressable onPress={_runCmds} style={styles.bottomButton} ><IonicIcon name="play-outline" size={24} color="#fff" /></Pressable>
            </View>
        </View >
    );
}

export default TempCmdScreen;