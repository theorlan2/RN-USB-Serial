import { DataBitsEnum, ParitiesEnum, StopBitsEnum } from "../enums/configurationDataEnum";

export default interface ConfigurationModelView {
    data_bits: DataBitsEnum,
    stop_bits: StopBitsEnum,
    parity: ParitiesEnum,
    break_time: string,
    baud_rate: string
}