import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
//
import CardGroup from '../components/GroupsCmd/CardGroup';
import ModalInfoFC from '../components/ModalInfoFC';
import { GroupCmdModelView } from '../infrastructure/modelViews/GroupCmd';
import { getStoreData, setStoreData } from '../infrastructure/utils/utilsStore';
import { RootStackParamList } from '../routes/routesNames';
import { useTheme } from '../infrastructure/contexts/themeContexts';
import { useTranslation } from 'react-i18next';
//
type GroupCmdListScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'GroupCmdsList'
>;

interface Props {
    navigation: GroupCmdListScreenNavigationProp;
}

const GroupCmdsListScreen: FunctionComponent<Props> = (props) => {

    const { colors } = useTheme();
    const { t } = useTranslation(['groups', 'defaultData']);
    const [groupsCmdsData, setGroupsCmdsData] = useState([] as GroupCmdModelView[]);
    const [showModalLoading, setShowModalLoading] = useState(false);

    useEffect(() => {
        getDataFromStorage();
        return () => { };
    }, [groupsCmdsData])

    function getDataFromStorage() {
        setShowModalLoading(true);
        getStoreData('groupsCmds').then(r => {
            if (r) {
                setGroupsCmdsData(r);
                setShowModalLoading(false);
            }
        }).then(() => {
            setShowModalLoading(false);
        })
            .catch(() => { });
    }

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
                { text: t('defaultData:buttons.delete'), onPress: () => deleteGroup(id) }
            ])
    }

    function deleteGroup(id: number) {
        let result = groupsCmdsData.filter((item: GroupCmdModelView) => item.id != id)
        setStoreData('groupsCmds', result);
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
                {groupsCmdsData.length < 1 && <View style={{ marginVertical: 10, alignSelf: 'center', }} >
                    <Text style={{ textAlign: 'center', color: colors.text }} >{t('groups:loadGroup.titles.empty')}</Text>
                </View>}
                {groupsCmdsData.map((item, key) => <CardGroup colorText={colors.text} bgColor={colors.background_3} btnColor={colors.background_1} key={item.id + key} item={item} openGroup={openGroup} deleteGroup={alertDelete} />)}
            </ScrollView>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={ t('groups:loadGroup.dialogLoading.loading.title')} description={ t('groups:loadGroup.dialogLoading.loading.description')} loading={true} />
        </View>
    );
}

export default GroupCmdsListScreen;