import React, { FunctionComponent } from 'react';
import { View, Text, Pressable, ToastAndroid, Alert } from 'react-native';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
//
import { CmdModelView } from '../../infrastructure/modelViews/CmdModelView';

interface Props {
    item: CmdModelView;
    position: number;
    isMacro?: boolean;
    editCmd?(value: number): void;
    deleteCmd?(value: number): void;
    upPosition(value: number): void;
    downPosition(value: number): void;
}

const CardCmd: FunctionComponent<Props> = (props) => {

    function copyCmd() {
        Clipboard.setString(props.item.cmd ? props.item.cmd : '');
        ToastAndroid.show("Comando copiado!", ToastAndroid.SHORT);
    }

    function deleteCMD() {
        Alert.alert("¿Desas eliminar este cmd?", "Si eliminas el comando deberas crearlo uno de nuevo.",
            [
                {
                    text: "Cancelar", 
                    style: "cancel"
                },
                { text: "Si, eliminar", onPress: () => props.deleteCmd(props.item.id) }
            ])
    }


    return (
        <View style={{ marginVertical: 5, backgroundColor: '#fff', elevation: 2, padding: 10, flexDirection: 'row' }} >
            <View style={{ flex: 1, flexDirection: 'column' }} >
                <View style={{ flex: 1 }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 16, }} >{props.item.title}</Text>
                </View>
                {!props.isMacro && <View style={{ flex: 1 }} >
                    <Text style={{ fontWeight: '500', fontSize: 18 }} >{props.item.cmd}</Text>
                </View>}
                <View style={{ flex: 1 }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }} >{props.item.timeOut + ' ms'}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 5 }} >
                    <Pressable style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffcdd2', borderRadius: 50, width: 45, height: 45, marginHorizontal: 8 }} onPress={deleteCMD} ><IonicIcon name="trash-outline" size={24} color="red" /></Pressable>
                    {!props.isMacro && <Pressable style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', borderRadius: 50, width: 45, height: 45, marginHorizontal: 8 }} onPress={() => { props.editCmd(props.item.id); }} ><IonicIcon name="create-outline" size={24} color="#444" /></Pressable>}
                    {!props.isMacro && <Pressable style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', borderRadius: 50, width: 45, height: 45, marginHorizontal: 8 }} onPress={copyCmd} ><IonicIcon name="clipboard-outline" size={24} color="#444" /></Pressable>}
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', maxWidth: 55 }} >
                <View style={{ flex: 1, justifyContent: 'center' }} >
                    <Pressable style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', borderRadius: 50, width: 45, height: 45, marginHorizontal: 5 }} onPress={() => { props.downPosition(props.item.id); }} ><IonicIcon name="arrow-up-outline" size={24} color="#444" /></Pressable>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }} >{props.position}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }} >
                    <Pressable style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', borderRadius: 50, width: 45, height: 45, marginHorizontal: 5 }} onPress={() => { props.upPosition(props.item.id); }} ><IonicIcon name="arrow-down-outline" size={24} color="#444" /></Pressable>
                </View>

            </View>
        </View>
    );
}

CardCmd.defaultProps = {
    isMacro: false
}

export default CardCmd;