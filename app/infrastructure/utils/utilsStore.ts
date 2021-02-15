import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export async function setStoreData(key: string, value: any) {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@' + key, jsonValue)
    } catch (e) {
        // saving error
        Alert.alert('Error guardando', 'Ha ocurrido un error guardando.')
    }
}

export async function getStoreData(key: string): Promise<any> {
    let result = null;
    try {
        const jsonValue = await AsyncStorage.getItem('@' + key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
        Alert.alert('Error de datos', 'Ha ocurrido un error obteniendo los datos.')
 
    }
    return result;
}
