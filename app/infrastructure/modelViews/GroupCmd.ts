import { CmdModelView } from "./CmdModelView";

export interface GroupCmdModelView {
    id: number;
    title: string;
    listCmds: CmdModelView[];
}
