import { CmdModelView } from "../modelViews/GroupCmd";



function doSetTimeout(cmd: string, time: number, callBack: (cmd: string) => void) {
    setTimeout(() => {
        if (callBack)
            callBack(cmd);
    }
        , time);
}

export function runCmds(cmds: CmdModelView[], callBack: (cmd: string) => void) {
    let _time_count = 0;
    for (let i = 0; i < cmds.length; ++i) {
        _time_count += cmds[i].timeOut;
        doSetTimeout(cmds[i].cmd, _time_count, callBack);
    }
}

export function upPositionElement(id: number, cmds: CmdModelView[], callBack: (result: CmdModelView[]) => void) {
    let _cmds = cmds;
    let indx = cmds.findIndex(item => item.id == id);
    let result = moveArrayItemToNewIndex(_cmds, indx, (indx + 1))
    _cmds = result;
    if (callBack)
        callBack(_cmds);
}

export function downPositionElement(id: number, cmds: CmdModelView[], callBack: (result: CmdModelView[]) => void) {
    let _cmds = cmds;
    let indx = cmds.findIndex(item => item.id == id);
    let result = moveArrayItemToNewIndex(_cmds, indx, (indx - 1))
    _cmds = result;
    console.log(indx, (indx - 1));
    if (callBack)
        callBack(_cmds);
}

function moveArrayItemToNewIndex(arr: CmdModelView[], old_index: number, new_index: number): CmdModelView[] {
    if (new_index > -1 && new_index <= arr.length) {
        let tempArrayToBack = arr[new_index];
        let tempArrayToNext = arr[old_index];
        arr.splice(old_index, 1, tempArrayToBack);
        arr[new_index] = tempArrayToNext;
    }
    return arr;
};
