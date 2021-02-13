import React, { FunctionComponent, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { StatusConnectionEnum, useSerialStatus } from '../../infrastructure/contexts/serialStatusContext';
import { navigation } from '../../routes/rootNavigation';

interface Props {
    statusConnection: StatusConnectionEnum;
}

const HeaderRight: FunctionComponent<Props> = (props) => {
    const [colorStatus, setColorStatus] = useState('red');

    useEffect(() => {
        ValidateColor();
    }, [props.statusConnection])

    function ValidateColor() {
        switch (props.statusConnection) {
            case StatusConnectionEnum.SERVICE_START:
                setColorStatus('#80DEEA');
                break;
            case StatusConnectionEnum.DEVICE_CONNECT:
                setColorStatus('#1565C0');
                break;
            default:
                setColorStatus('red');
                break;
        }
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row' }} >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }} >
                <Text style={{ color: '#fff', marginRight: 5 }} >Estatus:</Text>
                <View style={{ backgroundColor: colorStatus, width: 10, height: 10, alignSelf: 'center', borderRadius: 40 }} >
                </View>
            </View>
            <Pressable style={{ padding: 10, alignSelf: 'center' }} onPress={() => { navigation.navigate('Configuration') }} >
                <IonicIcon name="settings-outline" size={20} color="white" />
            </Pressable>
        </View>
    );
}

export default HeaderRight;