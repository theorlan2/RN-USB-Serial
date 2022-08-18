import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native' 
import { StackNavigationProp } from '@react-navigation/stack';
//
import CardGroup from '../components/GroupsCmd/CardGroup';
import ModalInfoFC from '../components/ModalInfoFC';
import { GroupCmdModelView } from '../infrastructure/modelViews/GroupCmd';
import { RootStackParamList } from '../routes/routesNames';
import { getStoreData, setStoreData } from '../infrastructure/utils/utilsStore';
import { MacroCmdModelView } from '../infrastructure/modelViews/MacroCmd'; 
import { useTranslation } from 'react-i18next';
import { useTheme } from '../infrastructure/contexts/themeContexts';
//
type MacroCmdsListScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'MacroCmdsList'
>;

interface Props {
    navigation: MacroCmdsListScreenNavigationProp;
}

const MacroCmdsListScreen: FunctionComponent<Props> = (props) => {

    const { t } = useTranslation(['defaultData', 'macros'])
    const { colors } = useTheme();
    const [macrosCmdsData, setGroupsCmdsData] = useState([] as GroupCmdModelView[]);
    const [showModalLoading, setShowModalLoading] = useState(true);

    useEffect(() => {
        getDataFromStorage();
        return () => { };
    }, [])

    function getDataFromStorage() {
        setShowModalLoading(true);
        getStoreData('macrosCmds').then(r => {
            setShowModalLoading(false);
            if (r) {
                setGroupsCmdsData(r);
            }
        }).catch(() => {
            setShowModalLoading(false);
        });
    }

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
        let result = macrosCmdsData.filter((item: MacroCmdModelView) => item.id != id)
        setStoreData('macrosCmds', result);
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
                {macrosCmdsData.length < 1 && <View style={styles.contEmpty} >
                    <Text style={styles.textEmpty} >{t('macros:loadMacros.titles.empty')}</Text>
                </View>}
                {macrosCmdsData.map((item, key) => <CardGroup key={item.id + key} item={item} openGroup={openMacro} deleteGroup={alertDelete} />)}
            </ScrollView>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={t('macros:loadMacros.loading.title')} description={t('macros:loadMacros.loading.description')} loading={true} />
        </View>
    );
}

export default MacroCmdsListScreen;