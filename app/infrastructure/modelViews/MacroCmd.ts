import { CmdModelView } from "./CmdModelView";

export interface MacroCmdModelView {
    id: number;
    title: string;
    listCmds: CmdModelView[];
}
