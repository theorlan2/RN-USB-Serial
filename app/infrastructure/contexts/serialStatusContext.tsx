import React, { createContext, FunctionComponent, useContext, useState } from 'react';

export enum StatusConnectionEnum {
    DEVICE_CONNECT = 1,
    SERVICE_START = 2,
    SERVICE_STOP = 3,
}

export const SerialStatusContext = createContext({
    statusConnection: StatusConnectionEnum.SERVICE_STOP,
    setConnectStatus: (value: StatusConnectionEnum) => { },
});

interface Props { };

export const SerialStatusProvider: FunctionComponent<Props> = (props) => {
    /*
    * To enable changing the app theme dynamicly in the app (run-time)
    * we're gonna use useState so we can override the default device theme
    */
    const [statusConnection, setStatusConnection] = useState(StatusConnectionEnum.SERVICE_STOP);

    const defaultData = {
        statusConnection,
        setConnectStatus: (value: StatusConnectionEnum) => setStatusConnection(value),
    };

    return (
        <SerialStatusContext.Provider value={defaultData} >
            { props.children}
        </SerialStatusContext.Provider>
    );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useSerialStatus = () => useContext(SerialStatusContext);