import React, { FunctionComponent } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import IonicIcon from 'react-native-vector-icons/Ionicons';

type Props = {
    title: string,
    description: string,
    icon: string,
    bgColor?: string,
    colorText?: string,
    onPress: () => void
}

const ButtonWithDescription: FunctionComponent<Props> = (props) => {


    const styles = StyleSheet.create({
        mainCont: {
            flex: 1, flexDirection: 'column', width: '96%', alignSelf: 'center'
        },
        contBtn: {
            marginVertical: 10, backgroundColor: props.bgColor, elevation: 2, padding: 10, borderRadius:2
        },
        contTitleBtn: {
            flexDirection: 'row', alignItems: 'center', marginVertical: 5
        },
        titleBtn: {
            fontWeight: 'bold', fontSize: 18, marginLeft: 10, color: props.colorText
        },
        contDescription: {
            flexDirection: 'row'
        },
        textDescription: {
            fontWeight: '400', fontSize: 16, color: props.colorText
        }
    })

    return (
        <Pressable onPress={props.onPress} style={styles.contBtn} >
            <View style={styles.contTitleBtn} >
                <IonicIcon name={props.icon} size={32} color={props.colorText} />
                <Text style={styles.titleBtn} >{props.title}</Text>
            </View>
            <View style={styles.contDescription} >
                <Text style={styles.textDescription} >{props.description}</Text>
            </View>
        </Pressable>
    )
}

export default ButtonWithDescription;

ButtonWithDescription.propTypes = {}