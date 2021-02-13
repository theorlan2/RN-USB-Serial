import React, { FunctionComponent } from 'react';
import { View, Text, Pressable } from 'react-native';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { CmdModelView, GroupCmdModelView } from '../../infrastructure/modelViews/GroupCmd';

interface Props {
    item: CmdModelView;
    editCmd(value: number): void;
    deleteCmd(value: number): void;
}

const CardCmd: FunctionComponent<Props> = (props) => {

    return (
        <View style={{ marginVertical: 5, backgroundColor: '#fff', elevation: 2, padding: 10, }} >
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ flex: 1 }} >
                    <Text style={{ fontWeight: '500', fontSize: 18 }} >{props.item.cmd}</Text>
                </View>

                <View style={{ flex: 1 }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'right' }} >{props.item.timeOut + ' ms'}</Text>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ flex: 1, justifyContent: 'center' }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 16, }} >{props.item.title}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }} >
                    <Pressable style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', borderRadius: 50, width: 45, height: 45, marginHorizontal: 5 }} onPress={() => { props.editCmd(props.item.id); }} ><IonicIcon name="create-outline" size={24} color="#444" /></Pressable>
                    <Pressable style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', borderRadius: 50, width: 45, height: 45, marginHorizontal: 5 }} onPress={() => { props.deleteCmd(props.item.id); }} ><IonicIcon name="trash-outline" size={24} color="#444" /></Pressable>
                </View>
            </View>
        </View>
    );
}

export default CardCmd;