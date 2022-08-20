import React, { FunctionComponent, useState } from 'react'
import { Alert, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
//
import CardGroup from '../components/GroupsCmd/CardGroup';
import ModalInfoFC from '../components/ModalInfoFC';
//
import { GroupCmdModelView } from '../infrastructure/modelViews/GroupCmd';
import { RootStackParamList } from '../routes/routesNames';
import { useTheme } from '../infrastructure/contexts/themeContexts';
import { MacroCmdModelView } from '../infrastructure/modelViews/MacroCmd';
import { RootState } from '../store';
import { addGroup, deleteGroup } from '../store/features/groupSlice';
//
type GroupCmdListScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'GroupCmdsList'
>;

interface StateProps {
    groups: GroupCmdModelView[];
    macros: MacroCmdModelView[];
}

interface DispatchProps {
    addGroup: (data: GroupCmdModelView) => void;
    editGroup: (data: GroupCmdModelView) => void;
    editMacro: (data: MacroCmdModelView) => void;
    deleteGroup: (id: number) => void;
}
interface OwnProps {
    navigation: GroupCmdListScreenNavigationProp;
}

type Props = StateProps & DispatchProps & OwnProps;

const GroupCmdsListScreen: FunctionComponent<Props> = (props) => {

    const { colors } = useTheme();
    const { t } = useTranslation(['groups', 'defaultData']);
    const [showModalLoading, setShowModalLoading] = useState(false);

    function openGroup(id: number) {
        props.navigation.navigate('GroupCmds', { id: id });
    }

    function alertDelete(id: number) {
        Alert.alert(t('groups:loadGroup.deleteDialog.title'), t('groups:loadGroup.deleteDialog.description'),
            [
                {
                    text: t('defaultData:buttons.cancel'),
                    style: "cancel"
                },
                { text: t('defaultData:buttons.delete'), onPress: () => props.deleteGroup(id) }
            ])
    }

    const styles = StyleSheet.create({
        mainCont: {
            flex: 1, flexDirection: 'column', width: '100%', alignSelf: 'center', paddingHorizontal: 10
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

    return (
        <View style={{ flex: 1, }} >
            <StatusBar backgroundColor={colors.headerAccent} barStyle="light-content" ></StatusBar>
            <ScrollView style={styles.mainCont}   >
                {(props.groups == undefined || props.groups.length < 1) && <View style={{ marginVertical: 10, alignSelf: 'center' }} >
                    <Text style={{ textAlign: 'center', color: colors.text }} >{t('groups:loadGroup.titles.empty')}</Text>
                </View>}
                {props.groups && props.groups.map((item, key) => <CardGroup colorText={colors.text} bgColor={colors.background_3} btnColor={colors.background_1} key={item.id + key} item={item} openGroup={openGroup} deleteGroup={alertDelete} />)}
                
            </ScrollView>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={t('groups:loadGroup.dialogLoading.loading.title')} description={t('groups:loadGroup.dialogLoading.loading.description')} loading={true} />
        </View>
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
        deleteGroup: (id: number) => dispatch(deleteGroup(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupCmdsListScreen);
