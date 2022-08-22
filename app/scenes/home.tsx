import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { definitions } from 'react-native-serialport';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ButtonWithDescription from '../components/ButtonWithDescription';
//
import ModalAddGroupFC from '../components/ModalAddGroupFC';
import ModalInfoFC from '../components/ModalInfoFC';
import { useSerialStatus } from '../infrastructure/contexts/serialStatusContext';
import { useTheme } from '../infrastructure/contexts/themeContexts';
import ConfigurationModelView from '../infrastructure/modelViews/Configuration';
import { GroupCmdModelView } from '../infrastructure/modelViews/GroupCmd';
import { MacroCmdModelView } from '../infrastructure/modelViews/MacroCmd';
import { ConectionSerial, validateIsRun } from '../infrastructure/utils/serialConnection'
import { RootStackParamList } from '../routes/routesNames';
import { RootState } from '../store';
import { addGroup, deleteGroup } from '../store/features/groupSlice';
import { addMacro } from '../store/features/macroSlice';

type HomeScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Home'
>;

interface StateProps {
    configuration: ConfigurationModelView | undefined;
    groups: GroupCmdModelView[] | undefined;
    macros: MacroCmdModelView[] | undefined;
}

interface DispatchProps {
    addGroup: (data: GroupCmdModelView) => void;
    addMacro: (data: MacroCmdModelView) => void;
}
interface OwnProps {
    navigation: HomeScreenNavigationProp;
}

type Props = StateProps & DispatchProps & OwnProps;


const HomeScreen: FunctionComponent<Props> = (props) => {

    const { colors } = useTheme();
    const { t } = useTranslation(['home']);
    //
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [showModalAddGroup, setShowModalAddGroup] = useState(false);
    const [showModalAddMacro, setShowModalAddMacro] = useState(false);
    const { connectDevice } = useSerialStatus();

    useEffect(() => {
        validateIsRun().then((r) => {
            if (!r)
                getDataFromStorage();
        })
    }, [])


    function getDataFromStorage(this: any) {
        let result = null as unknown as ConectionSerial;
        let context = this;
        setShowModalLoading(true);
        if (props.configuration) {
            result = {
                interface: "-1",
                baudRate: props.configuration.baud_rate,
                parity: props.configuration.parity,
                dataBits: props.configuration.data_bits,
                stopBits: props.configuration.stop_bits,
                returnedDataType: definitions.RETURNED_DATA_TYPES.HEXSTRING as any
            };
        }
        setShowModalLoading(false);
        connectDevice(context, result);
    }

    function addGroup() {
        setShowModalAddGroup(true);
    }

    function addGMacro() {
        setShowModalAddMacro(true);
    }

    function createGroup(name: string) {
        setShowModalAddGroup(false);
        setShowModalLoading(true);
        let id = Date.now();

        props.addGroup({
            id: id,
            title: name,
            listCmds: []
        })
        setShowModalLoading(false);
        setTimeout(() => {
            props.navigation.navigate('GroupCmds', { id: id });
        }, 500);

    }

    function createMacro(name: string) {
        setShowModalAddMacro(false);
        setShowModalLoading(true);
        let id = Date.now();
        props.addMacro({
            id: id,
            title: name,
            listCmds: []
        })
        setShowModalLoading(false);
        setTimeout(() => {
            props.navigation.navigate('MacroCmds', { id: id });
        }, 500);

    }



    const styles = StyleSheet.create({
        mainCont: {
            flex: 1, flexDirection: 'column', width: '96%', alignSelf: 'center'
        },

    })
    return (
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={colors.headerAccent} barStyle="light-content" ></StatusBar>
            <ScrollView style={styles.mainCont} >
                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={() => props.navigation.navigate('TempCmds')} icon="list-outline" title={t('home:buttons.sendTemps.title')} description={t('home:buttons.sendTemps.description')} />

                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={addGroup} icon="add-outline" title={t('home:buttons.createGroup.title')} description={t('home:buttons.createGroup.description')} />

                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={() => props.navigation.navigate('GroupCmdsList')} icon="document-text-outline" title={t('home:buttons.loadGroup.title')} description={t('home:buttons.loadGroup.description')} />

                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={addGMacro} icon="add-outline" title={t('home:buttons.createMacro.title')} description={t('home:buttons.createMacro.description')} />

                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={() => props.navigation.navigate('MacroCmdsList')} icon="list-outline" title={t('home:buttons.loadMacro.title')} description={t('home:buttons.loadMacro.description')} />

                <ButtonWithDescription colorText={colors.text} bgColor={colors.background_3} onPress={() => props.navigation.navigate('CalCRCCmds')} icon="calculator-outline" title={t('home:buttons.calculateCrc.title')} description={t('home:buttons.calculateCrc.description')} />

            </ScrollView>

            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={"Cargando datos"} description={"Obteniendo datos de configuracion guardados..."} loading={true} />
            <ModalAddGroupFC title={t('home:dialogs.createGroup.title')} description={t('home:dialogs.createGroup.description')} modalVisible={showModalAddGroup} closeModal={() => setShowModalAddGroup(false)} create={createGroup} />
            <ModalAddGroupFC title={t('home:dialogs.createMacro.title')} description={t('home:dialogs.createMacro.description')} modalVisible={showModalAddMacro} closeModal={() => setShowModalAddMacro(false)} create={createMacro} />
        </View>
    );
}



const mapStateToProps = (state: RootState) => {

    return {
        configuration: state.configuration.configuration,
        groups: state.group.groups,
        macros: state.macro.macros
    }
}


const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        addGroup: (data: GroupCmdModelView) => dispatch(addGroup(data)),
        addMacro: (data: MacroCmdModelView) => dispatch(addMacro(data)),
        deleteGroup: (id: number) => dispatch(deleteGroup(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
