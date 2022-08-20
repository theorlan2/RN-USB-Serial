import React, { FunctionComponent, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import { StatusConnectionEnum } from '../../infrastructure/contexts/serialStatusContext';
import { navigation } from '../../routes/rootNavigation';
import { useTheme } from '../../infrastructure/contexts/themeContexts';

interface Props {
    statusConnection: StatusConnectionEnum;
}

const HeaderRight: FunctionComponent<Props> = (props) => {
    const [colorStatus, setColorStatus] = useState('red');
    const { setScheme, colors, isDark } = useTheme();
    const { t } = useTranslation(['layout']);


    useEffect(() => {
        ValidateColor();
    }, [props.statusConnection])

    function ValidateColor() {
        switch (props.statusConnection) {
            case StatusConnectionEnum.SERVICE_START:
                setColorStatus(colors.statusStart);
                break;
            case StatusConnectionEnum.DEVICE_CONNECT:
                setColorStatus(colors.statusConnect);
                break;
            default:
                setColorStatus(colors.statusOffline);
                break;
        }
    }


    function setTheme() {
        setScheme(isDark ? 'light' : 'dark');
    }

    const styles = StyleSheet.create({
        contStatus: {
            flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 10
        },
        statusText: {
            width: 10, height: 10, alignSelf: 'center', borderRadius: 40
        },
        btnIcon: {
            color: '#fff', fontSize: 24, alignSelf: 'center'
        },
        btnContIcon: {
            flex: 1, paddingHorizontal: 10, flexDirection: 'row', alignContent: 'center', height: '100%', marginHorizontal: 10
        }
    })
    return (
        <View style={{ flex: 1, flexDirection: 'row' }} >
            <View style={styles.contStatus} >
                <Text style={{ color: 'white', marginRight: 5 }} >{t('layout:headerRight.status')}</Text>
                <View style={{ backgroundColor: colorStatus, ...styles.statusText }} >
                </View>
            </View>
            <Pressable onPress={setTheme} style={styles.btnContIcon} >
                {!isDark && <IonicIcon name="moon-outline" style={styles.btnIcon} />}
                {isDark && <IonicIcon name="sunny-outline" style={styles.btnIcon} />}
            </Pressable>
            <Pressable style={{ padding: 10, alignSelf: 'center' }} onPress={() => { navigation.navigate('Configuration') }} >
                <IonicIcon name="settings-outline" size={20} color="white" />
            </Pressable>
        </View>
    );
}

export default HeaderRight;