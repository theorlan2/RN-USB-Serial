import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { GroupCmdModelView } from '../../infrastructure/modelViews/GroupCmd';

interface Props {
    item: GroupCmdModelView;
    openGroup(id: number): void;
    deleteGroup(id: number): void;

}

const CardGroup: FunctionComponent<Props> = (props) => {

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
        <View style={styles.contBtn} >
            <View style={styles.contTitleBtn} >
                <IonicIcon name="list-outline" size={32} color="#444" />
                <Text style={styles.titleBtn} >{props.item.title}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }} >
                <Pressable style={{ marginHorizontal: 10, width: 60, height: 60, backgroundColor: '#ECEFF1', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }} onPress={() => { }}  >
                    <IonicIcon name="trash-outline" size={26} color="red" />
                </Pressable>
                <Pressable style={{ marginHorizontal: 10, width: 60, height: 60, backgroundColor: '#ECEFF1', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }} onPress={() => { }}  >
                    <IonicIcon name="eye-outline" size={26} color="#0096A6" />
                </Pressable>
            </View>
        </View>
    );
}

export default CardGroup;
