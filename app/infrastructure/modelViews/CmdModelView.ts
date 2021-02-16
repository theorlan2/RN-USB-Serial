export interface CmdModelView {
    id: number;
    idGroup?: number;
    title: string;
    cmd?: string;
    timeOut: number;
    isMacro?: boolean;
    listCmds?: CmdModelView[];
}