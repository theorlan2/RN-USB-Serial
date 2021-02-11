import React, { FunctionComponent, useEffect, useState } from 'react';
import { Modal, Text, View, StyleSheet, Button } from 'react-native';
import { ProgressBar } from '@react-native-community/progress-bar-android';


interface Props {
    modalVisible: boolean;
    title: string;
    description: string;
    loading: boolean;
    closeModal(): void;
};


const ModalInfoFC: FunctionComponent<Props> = (props: Props) => {

    useEffect(() => {
        if (!props.modalVisible) {
            props.closeModal();
        }
    });


    const styles = StyleSheet.create({
        contBackModal: { marginTop: 0, backgroundColor: 'rgba(52, 52, 52, 0.8)', flex: 1, flexDirection: 'column', justifyContent: 'center' },
        contModal: { backgroundColor: 'white', elevation: 3, borderRadius: 2, marginHorizontal: 10, paddingVertical: 20, paddingHorizontal: 15 },
        titleModal: { fontSize: 20, fontWeight: '600' },
        description: { fontSize: 14, fontWeight: '300' },
        errorText: { color: 'red', marginBottom: 5 }

    });

    return (
        <View >
            <Modal
                animationType="fade"
                transparent={true}
                visible={props.modalVisible}
            >
                <View style={styles.contBackModal}>
                    <View style={styles.contModal} >
                        <View style={{}} >
                            <Text style={styles.titleModal} >{props.title}</Text>
                            <Text style={styles.description} >{props.description}</Text>
                            {props.loading && <ProgressBar style={{ marginVertical: 5 }} styleAttr="Horizontal" color={'#444'} />}

                            {!props.loading && <View style={{ marginTop: 15, marginBottom: 5, alignItems: 'flex-end' }} >
                                <Button color={'#444'} onPress={props.closeModal} title="CERRAR" ></Button>
                            </View>}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default ModalInfoFC;
