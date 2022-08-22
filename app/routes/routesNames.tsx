
export type RootStackParamList = {
    Home: undefined,
    TempCmds: undefined,
    GroupCmds: {
        id?: number,
    },
    MacroCmds: {
        id?: number,
    },
    GroupCmdsList: undefined,
    MacroCmdsList: undefined,
    CalCRCCmds: undefined,
    Configuration: undefined,
    RunCmds: {
        id?: number,
        run?: boolean,
    },
};

export default {
    Home: {
        name: 'Home'
    },
    GroupCmds: {
        name: 'GroupCmds'
    },
    MacroCmds: {
        name: 'MacroCmds'
    },
    GroupCmdsList: {
        name: 'GroupCmdsList'
    },
    MacroCmdsList: {
        name: 'MacroCmdsList'
    },
    CalCRCCmds: {
        name: 'CalCRCCmds'
    },
    Configuration: {
        name: 'Configuration'
    },
    TempCmds: {
        name: 'TempCmds'
    },
    RunCmds: {
        name: 'RunCmds'
    },
};