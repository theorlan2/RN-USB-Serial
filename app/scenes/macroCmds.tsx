import { Picker } from '@react-native-picker/picker'
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Button, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import CardCmd from '../components/GroupsCmd/CardCmd';
import ModalInfoFC from '../components/ModalInfoFC';
import { useTheme } from '../infrastructure/contexts/themeContexts';
import { CmdModelView } from '../infrastructure/modelViews/CmdModelView';
import { MacroCmdModelView } from '../infrastructure/modelViews/MacroCmd';

// 
import { downPositionElement, upPositionElement } from '../infrastructure/utils/utilsGroups';
import { RootStackParamList } from '../routes/routesNames';
import { RootState } from '../store';
import { addMacro, editMacro } from '../store/features/macroSlice';

type MacroCmdScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'MacroCmds'
>;

interface StateProps {
    macros: MacroCmdModelView[] | undefined;
}

interface DispatchProps {
    addMacro: (data: MacroCmdModelView) => void;
    editMacro: (data: MacroCmdModelView) => void;
}
interface OwnProps {
    navigation: MacroCmdScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'MacroCmds'>,
}


type Props = StateProps & DispatchProps & OwnProps;

const MacroCmdScreen: FunctionComponent<Props> = (props) => {

    const { t } = useTranslation(['macros']);
    const { colors } = useTheme();
    const [times] = useState([25, 50, 100, 150, 200, 300, 400, 500, 1000, 2000]);
    const [cmds, setCmds] = useState([] as CmdModelView[]);
    const [time, setTime] = useState(25)
    const [idCmd, setIdCmd] = useState(0)
    const [idMacro, setIdMacro] = useState(0)
    const [title, setTitle] = useState('');
    const [cmd, setCmd] = useState('');
    const [disabledAdd, setDisabledAdd] = useState(false);
    const [showAddCmd, setShowAddCmd] = useState(false);
    const [haveChanges, setHaveChanges] = useState(false);
    const [isSaveCmd, setIsSaveCmd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [eventChange, setEventChange] = useState('');


    useEffect(() => {
        if (props.route.params && props.route.params.id) {
            setIdMacro(props.route.params.id);
            getDataFromStorage();
        }
    }, [])

    function addCmd() {
        setDisabledAdd(true);
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
            setDisabledAdd(false);
        }, 100);
        setHaveChanges(true);
    }


    function editCmd(id: number) {
        setIsEdit(true);
        let r = cmds.find(item => item.id == id);
        if (r && r.cmd) {
            setTitle(r?.title);
            setCmd(r?.cmd);
            setTime(r?.timeOut);
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
        setIsSaveCmd(false);
        setShowModalLoading(true);
        const macros = props.macros;
        if (macros) {
            let result = macros.find((item: MacroCmdModelView) => item.id == idMacro);
            if (result) {
                setCmds(result.listCmds);
            } else {
                props.navigation.navigate('Home');
            }
        }
        setShowModalLoading(false);
    }

    function saveMacro() {
        setIsSaveCmd(true);
        setHaveChanges(false);
        setShowModalLoading(true);
        props.editMacro({
            id: idMacro,
            title: title,
            listCmds: cmds
        })
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

    const styles = StyleSheet.create({
        mainCont: {
            flex: 1, flexDirection: 'column'
        },
        scrollCont: {
            flex: 4, maxWidth: '96%', alignSelf: 'center', width: '100%'
        },
        formCmd: {
            marginVertical: 10
        },
        titleForm: {
            fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: colors.text
        },
        inputCont: {
            marginVertical: 10, paddingBottom: 15,
        },
        titleInput: {
            fontWeight: 'bold', fontSize: 12, marginBottom: 5, color: colors.text
        },
        inputBackCont: {
            backgroundColor: '#fff', elevation: 2
        },
        buttonsCont: {
            marginVertical: 10, flex: 1, flexDirection: 'row'
        },
        buttonContLeft: {
            flex: 1, marginRight: 5
        },
        buttonContRight: {
            flex: 1, marginLeft: 5
        },
        buttonAddCont: {
            marginVertical: 10, flex: 1, flexDirection: 'row'
        }
    })

    return (
        <View style={styles.mainCont} >
            <StatusBar backgroundColor={colors.headerAccent} barStyle="light-content" ></StatusBar>
            <ScrollView style={styles.scrollCont}   >

                {cmds.map((item, indx) => <CardCmd key={indx} item={item} editCmd={editCmd} deleteCmd={deleteCmd} upPosition={_upPositionElement}
                    downPosition={_downPositionElement} position={indx} />)}
                <View>
                    {/*  */}
                    {showAddCmd && <View style={styles.formCmd} >
                        <Text style={styles.titleForm} >{t('macros:addMacros.titles.add')}</Text>
                        <View style={styles.inputCont} >
                            <Text style={styles.titleInput} >{t('macros:addMacros.inputs.name')}</Text>
                            <View style={styles.inputBackCont} >
                                <TextInput
                                    placeholder="Nombre"
                                    value={title}
                                    onChangeText={value => setTitle(value)}
                                />
                            </View>
                        </View>
                        <View style={styles.inputCont} >
                            <Text style={styles.titleInput} >{t('macros:addMacros.inputs.addHexCommand')}</Text>
                            <View style={styles.inputBackCont} >
                                <TextInput
                                    placeholder={t('macros:addMacros.inputs.addHexCommand')}
                                    value={cmd}
                                    onChangeText={value => setCmd(value)}
                                    autoCapitalize='characters'
                                />
                            </View>
                        </View>
                        <View style={styles.inputCont} >
                            <Text style={styles.titleInput} >{t('macros:addMacros.inputs.timeOut')}</Text>
                            <View style={styles.inputBackCont} >
                                <Picker
                                    selectedValue={time}
                                    style={{ height: 50, width: '100%' }}
                                    onValueChange={(itemValue, itemIndex) => setTime(+itemValue)}>
                                    {times.map((item) => <Picker.Item key={'value-time-' + item} label={item + 'ms'} value={item} />)}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.buttonsCont} >
                            <View style={styles.buttonContLeft} >
                                <Button title={t('defaultData:buttons.cancel')} onPress={() => setShowAddCmd(false)} color="red" disabled={disabledAdd} ></Button>
                            </View>
                            <View style={styles.buttonContRight} >
                                <Button title={t('defaultData:buttons.save')} onPress={() => isEdit ? saveEditCmd(idCmd) : addCmd()} color="#00BBD3" disabled={disabledAdd} ></Button>
                            </View>
                        </View>
                    </View>}
                    {cmds.length < 1 && !showAddCmd && <View style={{ marginVertical: 10 }} >
                        <Text style={{ textAlign: 'center', color: colors.text }} >{t('macros:loadMacros.titles.empty')}</Text>
                    </View>}
                    {/*  */}
                </View>

                {!showAddCmd && <View style={styles.buttonAddCont} >
                    <View style={{ flex: 1, marginLeft: 5 }} >
                        <Button title={t('macros:addMacros.titles.add')} onPress={() => showAddCmd ? addCmd() : setShowAddCmd(true)} color="#00BBD3" disabled={disabledAdd} ></Button>
                    </View>
                </View>}
            </ScrollView>
            <View style={{ position: 'absolute', bottom: 16, right: 16, }} >
                <Pressable onPress={saveMacro} style={{ backgroundColor: haveChanges ? '#FFCA28' : '#00BBD3', justifyContent: 'center', alignItems: 'center', borderRadius: 40, elevation: 4, width: 45, height: 45, alignSelf: 'flex-end' }} ><IonicIcon name="save-outline" size={24} color="#fff" /></Pressable>
            </View>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={isSaveCmd ? "Guardando datos" : "Cargando datos"} description={isSaveCmd ? "Guardando datos de configuracion..." : "Obteniendo datos de configuracion guardados..."} loading={true} />
        </View>
    );
}


const mapStateToProps = (state: RootState) => {

    return {
        macros: state.macro.macros
    }
}


const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        addMacro: (data: MacroCmdModelView) => dispatch(addMacro(data)),
        editMacro: (data: MacroCmdModelView) => dispatch(editMacro(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MacroCmdScreen);
