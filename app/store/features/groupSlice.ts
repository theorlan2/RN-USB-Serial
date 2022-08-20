import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
//
import { RootState } from '..';
import { GroupCmdModelView } from '../../infrastructure/modelViews/GroupCmd';

interface groupState {
    groups?: GroupCmdModelView[];
    serial: string;
}

const initialState = {
    groups: null as unknown as GroupCmdModelView[],
    serial: '',
} as groupState;

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setGroup: (state, action: PayloadAction<GroupCmdModelView[]>) => {
            state.groups = action.payload;
        },
        addGroup: (state, action: PayloadAction<GroupCmdModelView>) => {
            if (!state.groups) state.groups = [];
            state.groups?.push(action.payload);
        },
        editGroup: (state, action: PayloadAction<GroupCmdModelView>) => {
            const indexGroup = state.groups && state.groups?.findIndex(
                (item) => item.id == action.payload.id,
            );
            let listGroup = state.groups;
            if (indexGroup && listGroup) {
                listGroup[indexGroup] = action.payload;
                state.groups = listGroup;
            }
        },
        deleteGroup: (state, action: PayloadAction<number>) => {
            let result = state.groups?.find(element => element.id != action.payload);
            if (state.groups)
                state.groups = result as any;
        },
    },
});

export const {
    setGroup,
    addGroup,
    editGroup,
    deleteGroup
} = groupSlice.actions;

// selectors 


export default groupSlice.reducer;
