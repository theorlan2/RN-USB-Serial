import React, { createContext, FunctionComponent, useContext, useState } from 'react';
import { definitions } from 'react-native-serialport';
import { ConectionSerial, startUsbListener } from '../utils/serialConnection';

export enum StatusConnectionEnum {
    DEVICE_CONNECT = 1,
    SERVICE_START = 2,
    SERVICE_STOP = 3,
}

export const SerialStatusContext = createContext({
    statusConnection: StatusConnectionEnum.SERVICE_STOP,
    setConnectStatus: (value: StatusConnectionEnum) => { },
    connectDevice: (context: any, config: ConectionSerial) => { },
});

interface Props { };

export const SerialStatusProvider: FunctionComponent<Props> = (props) => {
    const [statusConnection, setStatusConnection] = useState(StatusConnectionEnum.SERVICE_STOP);


    function connectDevice(context: any, configuration: ConectionSerial) {
        if (statusConnection == StatusConnectionEnum.DEVICE_CONNECT) return;
        
        let dataConnection = configuration ? {
            baudRate: configuration.baudRate,
            interface: configuration.interface,
            dataBits: +configuration.dataBits,
            stopBits: +configuration.stopBits,
            parity: +configuration.parity,
            returnedDataType: definitions.RETURNED_DATA_TYPES.HEXSTRING as any
        } : null;

        startUsbListener(context, dataConnection,
            //OnRead
            (data) => {
            },
            // onConnect
            (data) => {
                setStatusConnection(StatusConnectionEnum.DEVICE_CONNECT);
            },
            // OnDisconnect
            (data) => {
                setStatusConnection(StatusConnectionEnum.SERVICE_START);
            },
            // onError
            (data) => {
                console.log('error', data);
            },
            // on StartService 
            (data) => {
                setStatusConnection(StatusConnectionEnum.SERVICE_START);
            })
    }


    const defaultData = {
        statusConnection,
        connectDevice: (context: any, configuration: ConectionSerial) => connectDevice(context, configuration),
        setConnectStatus: (value: StatusConnectionEnum) => setStatusConnection(value),
    };

    return (
        <SerialStatusContext.Provider value={defaultData} >
            {props.children}
        </SerialStatusContext.Provider>
    );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useSerialStatus = () => useContext(SerialStatusContext);