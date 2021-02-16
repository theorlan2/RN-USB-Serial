
export type RootStackParamList = {
    Home: undefined,
    TempCmd: undefined,
    GroupCmds: {
        id?: number,
    },
    MacroCmds: {
        id?: number,
    },
    GroupCmdsList: undefined,
    MacroCmdsList: undefined,
    CalCRCCmds: undefined,
    RunCmds: {
        id?: number,
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
    TempCmds: {
        name: 'TempCmds'
    },
    RunCmds: {
        name: 'RunCmds'
    },
};