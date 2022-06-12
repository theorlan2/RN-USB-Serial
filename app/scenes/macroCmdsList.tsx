import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackNavigationProp } from '@react-navigation/stack';
//
import CardGroup from '../components/GroupsCmd/CardGroup';
import ModalInfoFC from '../components/ModalInfoFC';
import { GroupCmdModelView } from '../infrastructure/modelViews/GroupCmd';
import { RootStackParamList } from '../routes/routesNames';
import { getStoreData, setStoreData } from '../infrastructure/utils/utilsStore';
import { MacroCmdModelView } from '../infrastructure/modelViews/MacroCmd';
//
type MacroCmdsListScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'MacroCmdsList'
>;

interface Props {
    navigation: MacroCmdsListScreenNavigationProp;
}

const MacroCmdsListScreen: FunctionComponent<Props> = (props) => {

    const [macrosCmdsData, setGroupsCmdsData] = useState([] as GroupCmdModelView[]);
    const [showModalLoading, setShowModalLoading] = useState(true);

    useEffect(() => {
        getDataFromStorage();
        return () => { };
    }, [macrosCmdsData])

    function getDataFromStorage() {
        setShowModalLoading(true);
        getStoreData('macrosCmds').then(r => {
            if (r) {
                setGroupsCmdsData(r);
            }
        }).then(() => {
            setShowModalLoading(false);
        })
            .then(() => {
            })
            .catch(() => {
            });
    }

    function openMacro(id: number) {
        props.navigation.navigate('MacroCmds', { id: id });
    }
    function alertDelete(id: number) {
        Alert.alert("¿Desas eliminar este grupo?", "Si eliminas el grupo deberas crear uno de nuevo.",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Si, eliminar", onPress: () => deleteMacro(id) }
            ])
    }

    function deleteMacro(id: number) {
        let result = macrosCmdsData.filter((item: MacroCmdModelView) => item.id != id)
        setStoreData('macrosCmds', result);
    }

    const styles = StyleSheet.create({
        mainCont: {
            flex: 1, flexDirection: 'column', width: '96%', alignSelf: 'center'
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
        <View style={{ flex: 1, flexDirection: 'column' }} >
            <StatusBar backgroundColor={'#0096A6'} barStyle="light-content" ></StatusBar>
            <ScrollView style={styles.mainCont}   >
            {macrosCmdsData.length < 1 && <View style={{ marginVertical: 10, alignSelf: 'center', }} >
                    <Text style={{ textAlign: 'center' }} >No hay Macros creados</Text>
                </View>}
                {macrosCmdsData.map((item, key) => <CardGroup key={item.id + key} item={item} openGroup={openMacro} deleteGroup={alertDelete} />)}
            </ScrollView>
            <ModalInfoFC closeModal={() => setShowModalLoading(false)} modalVisible={showModalLoading} title={"Cargando datos"} description={"Obteniendo datos de macros guardados..."} loading={true} />
        </View>
    );
}

export default MacroCmdsListScreen;