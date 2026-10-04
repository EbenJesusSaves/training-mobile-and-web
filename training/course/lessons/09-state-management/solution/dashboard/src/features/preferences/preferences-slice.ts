import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ColorSchemePreference = 'light' | 'dark' | 'auto';
export type TableDensity = 'comfortable' | 'compact';

export interface PreferencesState {
  colorScheme: ColorSchemePreference;
  tableDensity: TableDensity;
  savedBookingSearch: string;
}

export const initialPreferencesState: PreferencesState = {
  colorScheme: 'auto',
  tableDensity: 'comfortable',
  savedBookingSearch: '',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: initialPreferencesState,
  reducers: {
    setColorScheme(state, action: PayloadAction<ColorSchemePreference>) {
      state.colorScheme = action.payload;
    },
    setTableDensity(state, action: PayloadAction<TableDensity>) {
      state.tableDensity = action.payload;
    },
    setSavedBookingSearch(state, action: PayloadAction<string>) {
      state.savedBookingSearch = action.payload;
    },
  },
});

export const { setColorScheme, setSavedBookingSearch, setTableDensity } = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
