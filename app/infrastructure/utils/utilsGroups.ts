import { CmdModelView } from "../modelViews/CmdModelView";

let listTimeOuts = [] as any[];
let countTimeOut = 0;
function doSetTimeout(cmd: string, time: number, callBack: (cmd: string) => void) {
    if (countTimeOut > 0) {
        countTimeOut++;
    }
    listTimeOuts[countTimeOut] = setTimeout(() => {
        if (callBack)
            callBack(cmd);
    }, time);
    if (countTimeOut == 0) {
        countTimeOut++;
    }
}

export function stopTimeout(indx: number, listCmds?: CmdModelView[]) {
    if (listCmds) {
        for (let index = indx; index < listCmds.length; index++) {
            clearTimeout(listTimeOuts[index]);
        }
    } else {
        console.log('indx', indx, listTimeOuts[indx])
        clearTimeout(listTimeOuts[indx]);
        console.log('indx', indx, listTimeOuts[indx])
    }
}

export function runCmds(cmds: CmdModelView[], callBack: (cmd: string) => void) {
    let _time_count = 0;
    for (let i = 0; i < cmds.length; ++i) {
        _time_count += cmds[i].timeOut;
        if (cmds[i].isMacro) {
            for (let e = 0; e < cmds[i].listCmds.length; ++e) {
                doSetTimeout(cmds[i].listCmds[e].cmd, _time_count, callBack);
            }
        } else {
            doSetTimeout(cmds[i].cmd, _time_count, callBack);
        }
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
