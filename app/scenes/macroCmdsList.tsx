import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { RouteProp } from '@react-navigation/native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
//
import CardGroup from '../components/GroupsCmd/CardGroup';
import ModalInfoFC from '../components/ModalInfoFC';
import { RootStackParamList } from '../routes/routesNames';
import { MacroCmdModelView } from '../infrastructure/modelViews/MacroCmd';
import { useTheme } from '../infrastructure/contexts/themeContexts';
import { addMacro, deleteMacro, editMacro } from '../store/features/macroSlice';
import { RootState } from '../store';
//
type MacroCmdsListScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'MacroCmdsList'
>;

interface StateProps {
    macros: MacroCmdModelView[] | undefined;
}

interface DispatchProps {
    addMacro: (data: MacroCmdModelView) => void;
    editMacro: (data: MacroCmdModelView) => void;
    deleteMacro: (id: number) => void;
}

interface OwnProps {
    navigation: MacroCmdsListScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'MacroCmds'>,
}

type Props = StateProps & DispatchProps & OwnProps;

const MacroCmdsListScreen: FunctionComponent<Props> = (props) => {

    const { t } = useTranslation(['defaultData', 'macros'])
    const { colors } = useTheme();
    const [showModalLoading, setShowModalLoading] = useState(false);

    function openMacro(id: number) {
        props.navigation.navigate('MacroCmds', { id: id });
    }

    function alertDelete(id: number) {
        Alert.alert(t('macros:loadMacros.delete.title'), t('macros:loadMacros.delete.description'),
            [
                {
                    text: t('defaultData:buttons.cancel'),
                    style: "cancel"
                },
                { text: t('defaultData:buttons.delete'), onPress: () => deleteMacro(id) }
            ])
    }

    function deleteMacro(id: number) {
        props.deleteMacro(id);
    }

    const styles = StyleSheet.create({
        mainCont: {
            flex: 1, flexDirection: 'column'
        },
        scrollViewCont: {
            flex: 1, flexDirection: 'column', width: '96%', alignSelf: 'center'
        },
        contEmpty: {
            marginVertical: 10, alignSelf: 'center'
        },
        textEmpty: {
            textAlign: 'center', color: colors.text
        }
    })

    return (
        <View style={styles.mainCont} >
            <StatusBar backgroundColor={colors.headerAccent} barStyle="light-content" ></StatusBar>
            <ScrollView style={styles.scrollViewCont}   >
                {(props.macros == undefined || props.macros.length < 1) && <View style={styles.contEmpty} >
                    <Text style={styles.textEmpty} >{t('macros:loadMacros.titles.empty')}</Text>
                </View>}
                {props.macros && props.macros.map((item, key) => <CardGroup key={item.id + key} item={item} openGroup={openMacro} deleteGroup={alertDelete} />)}
            </ScrollView>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={t('macros:loadMacros.loading.title')} description={t('macros:loadMacros.loading.description')} loading={true} />
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
        deleteMacro: (id: number) => dispatch(deleteMacro(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MacroCmdsListScreen);
