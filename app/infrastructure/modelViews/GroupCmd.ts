export interface GroupCmdModelView {
    id: number;
    title: string;
    listCmds: CmdModelView[];
}

export interface CmdModelView {
    id: number;
    idGroup: number;
    title: string;
    cmd: string;
    timeOut: number;
}