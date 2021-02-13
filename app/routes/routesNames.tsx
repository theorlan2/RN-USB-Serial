
export type RootStackParamList = {
    Home: undefined,
    TempCmd: undefined,
    GroupCmds: {
        id?: number,
    },
    GroupCmdsList: undefined
};

export default {
    Home: {
        name: 'Home'
    },
    GroupCmds: {
        name: 'GroupCmds'
    },
    GroupCmdsList: {
        name: 'GroupCmdsList'
    },
    TempCmds: {
        name: 'TempCmds'
    },
};