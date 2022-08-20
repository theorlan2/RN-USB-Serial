import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
//
import { RootState } from '..';
import { MacroCmdModelView } from '../../infrastructure/modelViews/MacroCmd';

interface MacroState {
    macro?: MacroCmdModelView;
    macros?: MacroCmdModelView[];
    serial: string;
}

const initialState = {
    macro: null as unknown as MacroCmdModelView,
    macros: null as unknown as MacroCmdModelView[],
    serial: '',
} as MacroState;

export const macroSlice = createSlice({
    name: 'macro',
    initialState,
    reducers: {
        setmacros: (state, action: PayloadAction<MacroCmdModelView[]>) => {
            state.macros = action.payload;
        },
        addMacro: (state, action: PayloadAction<MacroCmdModelView>) => {
            state.macros && state.macros?.push(action.payload);
        },
        editMacro: (state, action: PayloadAction<MacroCmdModelView>) => {
            const indexmacro = state.macros && state.macros?.findIndex(
                (item) => item.id == action.payload.id,
            );
            let listmacro = state.macros;
            if (indexmacro && listmacro) {
                listmacro[indexmacro] = action.payload;
                state.macros = listmacro;
            }
        },
        deleteMacro: (state, action: PayloadAction<number>) => {
            let result = state.macros?.find(element => element.id != action.payload);
            if (state.macros)
                state.macros = result as any;
        },
    },
});

export const { 
    setmacros,
    addMacro,
    editMacro,
    deleteMacro
} = macroSlice.actions;

// selectors
export const selectmacro = (state: RootState) =>
    state.macro.macro; 


export default macroSlice.reducer;
