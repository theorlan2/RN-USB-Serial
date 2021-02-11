import { DeviceEventEmitter } from "react-native";
import { RNSerialport, definitions, actions, ReturnedDataTypes } from "react-native-serialport";
import { ParitiesEnum, DataBitsEnum, StopBitsEnum } from "../enums/configurationDataEnum";


const idDispensers = ['01'];

export const conectionSerialC = {
    baudRate: "9600",
    interface: "-1",
    parity: ParitiesEnum.PARITY_NONE,
    dataBits: DataBitsEnum.DATA_BITS_8,
    stopBits: StopBitsEnum.STOP_BITS_1,
    returnedDataType: definitions.RETURNED_DATA_TYPES.HEXSTRING
}

export interface ConectionSerial {
    baudRate: string, interface: string, returnedDataType: ReturnedDataTypes, parity: ParitiesEnum, dataBits: DataBitsEnum, stopBits: StopBitsEnum
}

export function startUsbListener(context: any, conectionSerial: ConectionSerial | null, onReadData: (data: any) => void, onConnected: (data: any) => void, onDisconnected: (data: any) => void, onError: (data: any) => void) {
    const _conectionSerial = conectionSerial || conectionSerialC;
    DeviceEventEmitter.addListener(actions.ON_ERROR, onError, context);
    DeviceEventEmitter.addListener(
        actions.ON_CONNECTED,
        onConnected,
        context
    );
    DeviceEventEmitter.addListener(
        actions.ON_DISCONNECTED,
        onDisconnected,
        context
    );
    DeviceEventEmitter.addListener(actions.ON_READ_DATA, onReadData, context);
    RNSerialport.setReturnedDataType(_conectionSerial.returnedDataType as ReturnedDataTypes);
    RNSerialport.setAutoConnectBaudRate(+_conectionSerial.baudRate);
    RNSerialport.setInterface(parseInt(_conectionSerial.interface, 10));
    RNSerialport.setParity(_conectionSerial.parity)
    RNSerialport.setDataBit(_conectionSerial.dataBits)
    RNSerialport.setStopBit(_conectionSerial.stopBits)
    RNSerialport.setAutoConnect(true);
    RNSerialport.startUsbService();
}

export async function stopUsbListener() {
    DeviceEventEmitter.removeAllListeners();
    const isOpen = await RNSerialport.isOpen();
    if (isOpen) {
        RNSerialport.disconnect();
    }
    RNSerialport.stopUsbService();
}


export function sendData(type: string, text: string) {

    switch (type) {
        case 'HEX':
            RNSerialport.writeHexString(text);
            break;
        default:
            RNSerialport.writeString(text);
            break;
    }

}