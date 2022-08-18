import React, { FunctionComponent, useEffect, useState } from 'react';
import { Modal, Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { useTheme } from '../infrastructure/contexts/themeContexts';


interface Props {
    modalVisible: boolean;
    title: string;
    description: string;
    closeModal(): void;
    create(name: string): void;
};


const ModalAddGroupFC: FunctionComponent<Props> = (props: Props) => {


    const { colors } = useTheme();
    const [name, setName] = useState('')
    useEffect(() => {
        if (!props.modalVisible) {
            props.closeModal();
        }
    });




    const styles = StyleSheet.create({
        contBackModal: { marginTop: 0, backgroundColor: 'rgba(52, 52, 52, 0.8)', flex: 1, flexDirection: 'column', justifyContent: 'center' },
        contModal: { backgroundColor: colors.background, elevation: 3, borderRadius: 2, marginHorizontal: 10, paddingVertical: 20, paddingHorizontal: 15 },
        titleModal: { fontSize: 20, fontWeight: '600', color: colors.text },
        description: { fontSize: 14, fontWeight: '300', color: colors.text },
        textInput: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 0, color: colors.text },
        contButtons: { flexDirection: 'row', justifyContent: 'flex-end' }
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
                            <TextInput
                                placeholder="Nombre"
                                style={styles.textInput}
                                value={name}
                                autoFocus={true}
                                onChangeText={value => setName(value)}
                                onSubmitEditing={() => { props.create(name); }}
                            />
                            <View style={styles.contButtons} >
                                <View style={{ marginTop: 10, marginRight: 10 }} >
                                    <Button color="red" onPress={props.closeModal} title="CANCELAR" ></Button>
                                </View>
                                <View style={{ marginTop: 10, marginLeft: 10 }} >
                                    <Button color={colors.primary} onPress={() => { props.create(name); }} title="Crear" ></Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default ModalAddGroupFC;
