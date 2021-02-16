import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, Button, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import { definitions, RNSerialport } from 'react-native-serialport';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import CardGroup from '../components/GroupsCmd/CardGroup';
import { GroupCmdModelView } from '../infrastructure/modelViews/GroupCmd';
//
import { ConectionSerial, } from '../infrastructure/utils/serialConnection'
import routesNames, { RootStackParamList } from '../routes/routesNames';
//
type GroupCmdListScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'GroupCmdsList'
>;

interface Props {
    navigation: GroupCmdListScreenNavigationProp;
}

const GroupCmdsListScreen: FunctionComponent<Props> = (props) => {

    const [groupsCmdsData, setGroupsCmdsData] = useState([] as GroupCmdModelView[]);
    const [showModalLoading, setShowModalLoading] = useState(true);

    useEffect(() => {
        getDataFromStorage();
        return () => { };
    }, [groupsCmdsData])

    function getDataFromStorage() {
        setShowModalLoading(true);
        getData('groupsCmds').then(r => {
            if (r) {
                setGroupsCmdsData(r);
            }
        }).then(() => {
            setShowModalLoading(false);
        })
            .catch(() => { });
    }

    function openGroup(id: number) {
        props.navigation.navigate(routesNames.GroupCmds.name, { id: id });
    }

    function deleteGroup(id: number) {
        Alert.alert("¿Desas eliminar este grupo?", "Si eliminas el grupo deberas crear uno de nuevo.",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Si, eliminar", onPress: () => console.log("OK Pressed") }
            ])
    }

    async function storeData(key: string, value: any) {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('@' + key, jsonValue)
        } catch (e) {
            // saving error
            Alert.alert('Error guardando', 'Ha ocurrido un error guardando.')
        }
    }

    async function getData(key: string): Promise<any> {
        let result = null;
        try {
            const jsonValue = await AsyncStorage.getItem('@' + key)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
            result = jsonValue;
        } catch (e) {
            // error reading value
        }
        return result;
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
                {groupsCmdsData.map((item, key) => <CardGroup key={item.id + key} item={item} openGroup={openGroup} deleteGroup={deleteGroup} />)}
            </ScrollView>
        </View>
    );
}

export default GroupCmdsListScreen;