import { Picker } from '@react-native-picker/picker'
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Button, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import IonicIcon from 'react-native-vector-icons/Ionicons';

//
import { downPositionElement, runCmds, upPositionElement } from '../infrastructure/utils/utilsGroups';
import { RootStackParamList } from '../routes/routesNames';
import { CmdModelView } from '../infrastructure/modelViews/CmdModelView';
import { GroupCmdModelView } from '../infrastructure/modelViews/GroupCmd';
import CardCmd from '../components/GroupsCmd/CardCmd';
import ModalInfoFC from '../components/ModalInfoFC';
import { MacroCmdModelView } from '../infrastructure/modelViews/MacroCmd';
import { useTheme } from '../infrastructure/contexts/themeContexts';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { addGroup, editGroup } from '../store/features/groupSlice';
import { editMacro } from '../store/features/macroSlice';

type GroupCmdScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'GroupCmds'
>;

interface StateProps {
    groups: GroupCmdModelView[] | undefined;
    macros: MacroCmdModelView[] | undefined;
}

interface DispatchProps {
    addGroup: (data: GroupCmdModelView) => void;
    editGroup: (data: GroupCmdModelView) => void;
    editMacro: (data: MacroCmdModelView) => void;
}
interface OwnProps {
    navigation: GroupCmdScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'GroupCmds'>,
}


type Props = StateProps & DispatchProps & OwnProps;


const GroupCmdScreen: FunctionComponent<Props> = (props) => {

    const { t } = useTranslation(['groups']);
    const { colors } = useTheme();
    const [times] = useState([25, 50, 100, 150, 200, 300, 400, 500, 1000, 2000]);
    const [cmds, setCmds] = useState([] as CmdModelView[]);
    const [macros, setMacros] = useState([] as MacroCmdModelView[]);
    const [eventChange, setEventChange] = useState('');
    // 
    const [time, setTime] = useState(25)
    const [idCmd, setIdCmd] = useState(0)
    const [idGroup, setIdGroup] = useState(0)
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
            setIdGroup(props.route.params.id);
        }
    }, [])

    function addMacro() {
        let r = props.macros && props.macros.find(item => item.id == macro);
        if (r) {
            setCmds((prevState) => ([
                ...prevState,
                {
                    id: Date.now(),
                    timeOut: time,
                    title: r.title,
                    isMacro: true,
                    listCmds: r.listCmds,
                    idGroup: idGroup,
                }
            ]));
        }
        setTimeout(() => {
            setMacro(props.macros[0].id);
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
        if (r) {
            setTitle(r.title);
            r.cmd && setCmd(r.cmd);
            setTime(r.timeOut);
            setIdCmd(id);
            setShowAddCmd(true);
            setHaveChanges(true);
        }
    }

    function saveEditCmd(id: number) {
        setCmds((prevState) => {
            let resultIndx = prevState.findIndex(item => item.id == id);
            prevState[resultIndx] = {
                id: id,
                title: title,
                cmd: cmd,
                timeOut: time,
                idGroup: idGroup
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

        let result = props.groups && props.groups.find(item => item.id == props.route.params.id);
        if (result) {
            setCmds(result.listCmds);
        } else {
            props.navigation.navigate('Home');
        }
        if (props.macros) {
            setMacros(props.macros);
            setMacro(props.macros[0].id);
        }
        setShowModalLoading(false);

    }

    function saveGroup() {
        setIsSave(true);
        setHaveChanges(false);
        setShowModalLoading(true);
        props.editGroup({
            id: idGroup,
            title,
            listCmds: cmds
        });
        setShowModalLoading(false);

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
        props.navigation.navigate('RunCmds', { id: idGroup, run: true });
    }


    const styles = StyleSheet.create({
        mainCont: {
            flex: 1, flexDirection: 'column'
        },
        container: {
            flex: 4, maxWidth: '96%', alignSelf: 'center', width: '100%'
        },
        title: {
            fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: colors.text
        },
        inputTitle: {
            fontWeight: 'bold', fontSize: 12, marginBottom: 5, color: colors.text
        },
        inputBack: {
            backgroundColor: '#fff', elevation: 2
        },
        contFloatButton: {
            position: 'absolute', right: 16,
        },
        floatButton: {
            justifyContent: 'center', alignItems: 'center', borderRadius: 40, elevation: 4, width: 45, height: 45, alignSelf: 'flex-end'
        },
        emptyText: {
            textAlign: 'center', color: colors.text
        }
    })

    return (
        <View style={styles.mainCont} >
            <StatusBar backgroundColor={colors.headerAccent} barStyle="light-content" ></StatusBar>
            <ScrollView style={styles.container}   >

                {cmds.map((item, indx) => <CardCmd isMacro={item.isMacro} key={indx} position={indx} item={item} upPosition={_upPositionElement}
                    downPosition={_downPositionElement} editCmd={editCmd} deleteCmd={deleteCmd} />)}
                <View>
                    {/*  */}
                    {showAddCmd && <View style={{ marginVertical: 10 }} >
                        <Text style={styles.title} >{t('groups:addGroup.titles.addCommand')}</Text>
                        <View style={{ marginVertical: 10, paddingBottom: 15, }} >
                            <Text style={styles.inputTitle} >{t('groups:addGroup.inputs.name')}:</Text>
                            <View style={styles.inputBack} >
                                <TextInput
                                    placeholder={t('groups:addGroup.inputs.name')}
                                    value={title}
                                    onChangeText={value => setTitle(value)}
                                />
                            </View>
                        </View>
                        <View style={{ marginVertical: 10, paddingBottom: 15, }} >
                            <Text style={styles.inputTitle} >{t('groups:addGoups.inputs.cammand')}</Text>
                            <View style={styles.inputBack} >
                                <TextInput
                                    placeholder={t('groups:addGoups.inputs.cammand')}
                                    value={cmd}
                                    onChangeText={value => setCmd(value)}
                                    autoCapitalize='characters'
                                />
                            </View>
                        </View>
                        <View style={{ marginVertical: 10 }} >
                            <Text style={styles.inputTitle} >{t('groups:addGroup.inputs.timeDelay')}</Text>
                            <View style={styles.inputBack} >
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
                                <Button title={t('defaultData:buttons.cancel')} onPress={() => setShowAddCmd(false)} color="red"   ></Button>
                            </View>
                            <View style={{ flex: 1, marginLeft: 5 }} >
                                <Button title={t('defaultData.buttons.save')} onPress={() => isEdit ? saveEditCmd(idCmd) : addCmd()} color="#00BBD3"  ></Button>
                            </View>
                        </View>
                    </View>}
                    {showAddMacro && <View style={{ marginVertical: 10 }} >
                        <Text style={styles.title} >{t('groups:addGroup.titles.addMacro')}</Text>
                        <Text style={styles.inputTitle} >{t('groups:addGroup.inputs.macro')}</Text>
                        <View style={styles.inputBack} >
                            <Picker
                                selectedValue={macro}
                                style={{ height: 50, width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => setMacro(+itemValue)}>
                                {macros.map((item) => <Picker.Item key={'value-macro-' + item.id} label={item.title} value={item.id} />)}
                            </Picker>
                        </View>
                        <View style={{ marginVertical: 10 }} >
                            <Text style={styles.inputTitle} >{t('groups:addGroup.inputs.timeDelay')}</Text>
                            <View style={styles.inputBack} >
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
                                <Button title={t('defaultData:buttons.cancel')} onPress={() => setShowAddMacro(false)} color="red"   ></Button>
                            </View>
                            <View style={{ flex: 1, marginLeft: 5 }} >
                                <Button title={t('defaultData.buttons.save')} onPress={() => addMacro()} color="#00BBD3"  ></Button>
                            </View>
                        </View>
                    </View>}
                    {cmds.length < 1 && !showAddCmd && <View style={{ marginVertical: 10 }} >
                        <Text style={styles.emptyText} >{t('groups:addGroup.titles.empty')}</Text>
                    </View>}
                    {/*  */}
                </View>

                {!showAddCmd && !showAddMacro && <View style={{ marginVertical: 10, flex: 1, flexDirection: 'row' }} >
                    <View style={{ flex: 1, marginRight: 5 }} >
                        <Button title={t('defaultData:buttons.addCommand')} onPress={() => showAddCmd ? addCmd() : setShowAddCmd(true)} color={colors.primary} ></Button>
                    </View>
                    <View style={{ flex: 1, marginLeft: 5 }} >
                        <Button title={t('defaultData:buttons.addMacro')} onPress={() => setShowAddMacro(true)} color={colors.primary} ></Button>
                    </View>
                </View>}
            </ScrollView>
            <View style={{ ...styles.contFloatButton, bottom: 86 }} >
                <Pressable onPress={saveGroup} style={{ ...styles.floatButton, backgroundColor: haveChanges ? '#FFCA28' : colors.primary }} ><IonicIcon name="save-outline" size={24} color="#fff" /></Pressable>
            </View>
            <View style={{ ...styles.contFloatButton, bottom: 26 }} >
                <Pressable onPress={_runCmds} style={{ ...styles.floatButton, backgroundColor: colors.primary, }} ><IonicIcon name="play-outline" size={24} color="#fff" /></Pressable>
            </View>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={isSaveCmd ? t('groups:addGroup.dialogLoading.loading.titles') : t('groups:addGroup.dialogLoading.loading.title')} description={isSaveCmd ? t('groups:addGroup.dialogLoading.save.description') : t('groups:addGroup.dialogLoading.loading.description')} loading={true} />
        </View >
    );
}


const mapStateToProps = (state: RootState) => {

    return {
        groups: state.group.groups,
        macros: state.macro.macros
    }
}


const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        addGroup: (data: GroupCmdModelView) => dispatch(addGroup(data)),
        editGroup: (data: GroupCmdModelView) => dispatch(editGroup(data)),
        editMacro: (data: MacroCmdModelView) => dispatch(editMacro(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupCmdScreen);
