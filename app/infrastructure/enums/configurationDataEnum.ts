export enum DataBitsEnum {
    DATA_BITS_5 = 5,
    DATA_BITS_6 = 6,
    DATA_BITS_7 = 7,
    DATA_BITS_8 = 8
};

export enum StopBitsEnum {
    STOP_BITS_1 = 1,
    STOP_BITS_15 = 3,
    STOP_BITS_2 = 2
}
export enum ParitiesEnum {
    PARITY_NONE = 0,
    PARITY_ODD = 1,
    PARITY_EVEN = 2,
    PARITY_MARK = 3,
    PARITY_SPACE = 4
}

export enum FlowControlsEnum {
    FLOW_CONTROL_OFF = 0,
    FLOW_CONTROL_RTS_CTS = 1,
    FLOW_CONTROL_DSR_DTR = 2,
    FLOW_CONTROL_XON_XOFF = 3
}

export enum ReturnedDataTypesEnum {
    INTARRAY = 1,
    HEXSTRING = 2
}