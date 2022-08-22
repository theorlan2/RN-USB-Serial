import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
//
import { RootState } from '..';
import Configuration from '../../infrastructure/modelViews/Configuration';

interface configurationState {
  configuration?: Configuration;
  serial: string;
}

const initialState = {
  configuration: null as unknown as Configuration,
  serial: '',
} as configurationState;

export const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    setConfiguration: (state, action: PayloadAction<Configuration>) => {
      state.configuration = action.payload;
    },
  },
});

export const {
  setConfiguration,
} = configurationSlice.actions;


// selectors
const configSelector = (state: RootState) => state.configuration;


export const selectConfig = createSelector(
  configSelector, state => state.configuration);


export default configurationSlice.reducer;
